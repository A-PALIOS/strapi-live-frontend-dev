'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import styles from './ImpactBanner.module.css';

/**
 * ImpactBanner
 * ------------
 * Responsive 3D wireframe icosahedron (Three.js) with real Phong shading.
 * Desktop: text sits left, shape sits right, sized via a CSS --scale
 * variable computed from the container's actual width (no image-style
 * blur — real font-size/spacing scaling). Below 760px wide, the layout
 * stacks: text on top, shape in its own square area below, and the shape
 * re-centers itself (no side text to dodge anymore).
 *
 * The three narrative stages (fragmented → structuring → integrated)
 * always advance strictly in order: automatically every ~4s, one step per
 * drag, or instantly via clicking a pagination dot. Dragging also draws a
 * traveling "electric current" that walks the shape's real edges,
 * following the direction and distance you drag.
 *
 * The component sizes itself: the banner keeps a 1728:715 aspect ratio on
 * desktop and stacks to an auto height on mobile, so the parent only needs
 * to provide the width.
 *
 * Requires `three` (already a dependency of this project).
 *
 * The "Agenda" typeface is loaded from Adobe Fonts, already present in
 * app/layout.tsx site-wide:
 *   <link rel="stylesheet" href="https://use.typekit.net/vfu6mno.css" />
 * If it's missing, text falls back to the browser's default sans-serif —
 * nothing will break, it just won't be Agenda.
 */

export type Stage = {
  /** Big faded number, e.g. "01". Generated from the stage order when omitted. */
  number?: string;
  eyebrow: string;
  headline: string;
  sub: string;
};

/** Internal shape after defaults are filled in. */
type ResolvedStage = Required<Stage>;

type ImpactBannerProps = {
  /**
   * Narrative stages to cycle through. Supplied by HeroSection3D from Strapi;
   * falls back to DEFAULT_STAGES when absent or empty, so the component still
   * renders standalone.
   */
  stages?: Stage[];
  /** Auto-advance interval in ms (default 4200). */
  autoAdvanceMs?: number;
  /** Optional extra classes on the outer wrapper (the component sizes itself). */
  className?: string;
};

const DEFAULT_STAGES: Stage[] = [
  {
    eyebrow: 'FRAGMENTED',
    headline: 'Isolated processes, closed loops.',
    sub: 'Processes run in a closed loop, disconnected from the rest of the system.',
  },
  {
    eyebrow: 'STRUCTURING',
    headline: 'A clear center of gravity.',
    sub: 'Evidence-based planning builds outward from a clear, strong core.',
  },
  {
    eyebrow: 'INTEGRATED',
    headline: 'A connected, responsive system.',
    sub: 'Every part connects to the whole — responsive under real pressure.',
  },
];

const DEFAULT_AUTO_ADVANCE_MS = 4200;

/** Drop blank entries, trim, and auto-number anything the editor left empty. */
function resolveStages(stages?: Stage[]): ResolvedStage[] {
  const usable = (stages ?? []).filter((s) => s && (s.headline || s.eyebrow || s.sub));
  const source = usable.length ? usable : DEFAULT_STAGES;
  return source.map((s, i) => ({
    number: s.number?.trim() || String(i + 1).padStart(2, '0'),
    eyebrow: s.eyebrow ?? '',
    headline: s.headline ?? '',
    sub: s.sub ?? '',
  }));
}

export default function ImpactBanner({
  stages,
  autoAdvanceMs,
  className,
}: ImpactBannerProps) {
  const resolvedStages = useMemo(() => resolveStages(stages), [stages]);
  // the three.js effect reads the stages through a ref, so a parent re-render
  // handing over an equal-but-new array never tears down the WebGL scene
  const stagesRef = useRef<ResolvedStage[]>(resolvedStages);
  stagesRef.current = resolvedStages;
  // only an actual copy change should rebuild the scene
  const stagesKey = resolvedStages
    .map((s) => `${s.number}|${s.eyebrow}|${s.headline}|${s.sub}`)
    .join('~');
  const advanceMs =
    typeof autoAdvanceMs === 'number' && autoAdvanceMs >= 800
      ? autoAdvanceMs
      : DEFAULT_AUTO_ADVANCE_MS;

  const bannerWrapRef = useRef<HTMLDivElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const shapeStageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageNumberRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (
      !canvasRef.current ||
      !bannerWrapRef.current ||
      !bannerRef.current ||
      !shapeStageRef.current ||
      !stageNumberRef.current ||
      !eyebrowRef.current ||
      !headlineRef.current ||
      !subRef.current
    ) {
      return;
    }

    // non-nullable locals so the closures below don't need null checks
    const canvas: HTMLCanvasElement = canvasRef.current;
    const bannerWrapEl: HTMLDivElement = bannerWrapRef.current;
    const bannerEl: HTMLDivElement = bannerRef.current;
    const shapeStageEl: HTMLDivElement = shapeStageRef.current;
    const stageNumberEl: HTMLDivElement = stageNumberRef.current;
    const eyebrowEl: HTMLDivElement = eyebrowRef.current;
    const headlineEl: HTMLHeadingElement = headlineRef.current;
    const subEl: HTMLParagraphElement = subRef.current;

    const dotEls = dotRefs.current
      .slice(0, stagesRef.current.length)
      .filter((d): d is HTMLSpanElement => Boolean(d));

    // ---------- narrative stages (from Strapi, or the built-in defaults) ----------
    const stages: ResolvedStage[] = stagesRef.current;

    let currentStage = 0;
    let switching = false;
    let flashUntil = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    function trackTimeout(fn: () => void, ms: number) {
      const id = setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    }

    function updateDots(index: number) {
      dotEls.forEach((d, i) => d.classList.toggle(styles.active, i === index));
    }

    function resetDelays(el: HTMLElement) {
      el.querySelectorAll<HTMLElement>(`.${styles.word} > span`).forEach((w) => {
        w.style.transitionDelay = '0s';
      });
    }

    function splitWords(el: HTMLElement) {
      const text = el.textContent ?? '';
      el.innerHTML = '';
      text.split(' ').forEach((w, i, arr) => {
        const wrap = document.createElement('span');
        wrap.className = styles.word;
        const inner = document.createElement('span');
        inner.textContent = w;
        wrap.appendChild(inner);
        el.appendChild(wrap);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      });
    }

    function staggerReveal(el: HTMLElement, baseDelay: number, step: number) {
      const words = el.querySelectorAll<HTMLElement>(`.${styles.word} > span`);
      words.forEach((w, i) => {
        w.style.transitionDelay = baseDelay + i * step + 's';
      });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.add(styles.revealed))
      );
    }

    function enterStage(index: number) {
      stageNumberEl.textContent = stages[index].number;
      eyebrowEl.textContent = stages[index].eyebrow;
      headlineEl.textContent = stages[index].headline;
      subEl.textContent = stages[index].sub;
      splitWords(eyebrowEl);
      splitWords(headlineEl);
      splitWords(subEl);
      staggerReveal(eyebrowEl, 0.03, 0.025);
      staggerReveal(headlineEl, 0.1, 0.035);
      staggerReveal(subEl, 0.3, 0.018);
      trackTimeout(() => {
        switching = false;
      }, 500);
    }

    // Auto-advance and drag always move exactly one step forward or back
    // (never jump). A direct dot click is an explicit choice — it jumps
    // straight to that stage.
    function switchStage(direction: number) {
      goToStage((currentStage + direction + stages.length) % stages.length);
    }

    function goToStage(targetIndex: number) {
      if (switching || targetIndex === currentStage) return;
      switching = true;
      currentStage = targetIndex;
      updateDots(currentStage);
      flashUntil = performance.now() + 550;
      [eyebrowEl, headlineEl, subEl].forEach((el) => {
        resetDelays(el);
        el.classList.remove(styles.revealed);
      });
      trackTimeout(() => enterStage(currentStage), 460);
    }

    function handleDotClick(i: number) {
      goToStage(i);
      lastAdvance = performance.now();
    }
    function handleDotKeydown(i: number, e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToStage(i);
        lastAdvance = performance.now();
      }
    }
    const dotClickHandlers: ((e: MouseEvent) => void)[] = [];
    const dotKeydownHandlers: ((e: KeyboardEvent) => void)[] = [];
    dotEls.forEach((dot, i) => {
      const onClick = () => handleDotClick(i);
      const onKeydown = (e: KeyboardEvent) => handleDotKeydown(i, e);
      dot.addEventListener('click', onClick);
      dot.addEventListener('keydown', onKeydown);
      dotClickHandlers.push(onClick);
      dotKeydownHandlers.push(onKeydown);
    });

    splitWords(eyebrowEl);
    splitWords(headlineEl);
    splitWords(subEl);
    staggerReveal(eyebrowEl, 0.1, 0.025);
    staggerReveal(headlineEl, 0.3, 0.035);
    staggerReveal(subEl, 0.7, 0.018);

    // ---------- responsive 2D scale (drives the calc(px * var(--scale)) rules) ----------
    const DESIGN_WIDTH = 1728;
    function updateScaleVar() {
      const w = bannerWrapEl.clientWidth;
      if (!w) return;
      const scale = Math.min(1, w / DESIGN_WIDTH);
      bannerEl.style.setProperty('--scale', scale.toFixed(4));
    }
    updateScaleVar();
    // observing the element (not just window resize) also catches sidebar/layout
    // changes that resize the banner without resizing the window
    const wrapResizeObserver = new ResizeObserver(updateScaleVar);
    wrapResizeObserver.observe(bannerWrapEl);
    window.addEventListener('resize', updateScaleVar);

    // ---------- three.js scene ----------
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1728 / 715, 0.1, 100);
    camera.position.set(0, 0, 9);

    const keyLight = new THREE.DirectionalLight(0x9fdcff, 1.4);
    keyLight.position.set(4, 3, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x3a6ea8, 0.8);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);
    const ambientLight = new THREE.AmbientLight(0x102040, 0.9);
    scene.add(ambientLight);

    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    const radius = 2.1;
    const geo = new THREE.IcosahedronGeometry(radius, 0);
    const edges = new THREE.EdgesGeometry(geo);

    const faceMat = new THREE.MeshPhongMaterial({
      color: 0x1f5c8c,
      emissive: 0x0a1d38,
      shininess: 60,
      specular: 0x9fdcff,
      flatShading: true,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    const faces = new THREE.Mesh(geo, faceMat);
    shapeGroup.add(faces);

    const lineMat = new THREE.LineBasicMaterial({ color: 0x9fdcff, transparent: true, opacity: 0.9 });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    shapeGroup.add(wireframe);

    const glowMat = new THREE.LineBasicMaterial({ color: 0x6cc3f0, transparent: true, opacity: 0.25 });
    const glowWire = new THREE.LineSegments(edges, glowMat);
    glowWire.scale.setScalar(1.035);
    shapeGroup.add(glowWire);

    function makeGlowTexture() {
      const size = 128;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(159,220,255,0.9)');
      g.addColorStop(1, 'rgba(159,220,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }
    const glowTex = makeGlowTexture();
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const posAttr = geo.attributes.position;
    const uniqueVerts: THREE.Vector3[] = [];
    const nodeSprites: THREE.Sprite[] = [];
    const keyToIndex = new Map<string, number>();
    const seen = new Set<string>();
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const key = [x.toFixed(3), y.toFixed(3), z.toFixed(3)].join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      keyToIndex.set(key, uniqueVerts.length);
      uniqueVerts.push(new THREE.Vector3(x, y, z));
      const sprite = new THREE.Sprite(spriteMat.clone());
      sprite.position.set(x, y, z);
      sprite.scale.setScalar(0.45);
      shapeGroup.add(sprite);
      nodeSprites.push(sprite);
    }

    const adjacency: Set<number>[] = uniqueVerts.map(() => new Set<number>());
    const edgePos = edges.attributes.position;
    for (let i = 0; i < edgePos.count; i += 2) {
      const k1 = [edgePos.getX(i).toFixed(3), edgePos.getY(i).toFixed(3), edgePos.getZ(i).toFixed(3)].join(',');
      const k2 = [edgePos.getX(i + 1).toFixed(3), edgePos.getY(i + 1).toFixed(3), edgePos.getZ(i + 1).toFixed(3)].join(',');
      const a = keyToIndex.get(k1);
      const b = keyToIndex.get(k2);
      if (a === undefined || b === undefined || a === b) continue;
      adjacency[a].add(b);
      adjacency[b].add(a);
    }

    const coreGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x4fa8e0,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    shapeGroup.add(core);

    // ---------- responsive sizing for the 3D scene ----------
    // Desktop keeps a fixed 1728:715 aspect (CSS aspect-ratio locks it, so
    // this stays true at any pixel size) — the shape sits centered between
    // the text's right edge and the banner's right edge. Mobile switches to
    // a roughly square shape area with no side text to dodge, so the shape
    // just centers.
    const MOBILE_QUERY = window.matchMedia('(max-width: 760px)');
    function applyShapePosition() {
      shapeGroup.position.x = MOBILE_QUERY.matches ? 0 : 5.0;
    }
    applyShapePosition();
    MOBILE_QUERY.addEventListener('change', applyShapePosition);

    function resizeRendererToStage() {
      const w = shapeStageEl.clientWidth;
      const h = shapeStageEl.clientHeight;
      if (w < 1 || h < 1) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    const stageResizeObserver = new ResizeObserver(resizeRendererToStage);
    stageResizeObserver.observe(shapeStageEl);
    resizeRendererToStage();

    // ---------- traveling electric current: driven by where the user actually drags ----------
    type CurrentMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;

    function makeCurrentLayerSegments(
      baseRadius: number,
      opacity: number,
      color: number,
      count: number
    ): CurrentMesh[] {
      const meshes: CurrentMesh[] = [];
      for (let s = 0; s < count; s++) {
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat) as CurrentMesh;
        mesh.userData.baseRadius = baseRadius;
        mesh.userData.baseOpacity = opacity;
        shapeGroup.add(mesh);
        meshes.push(mesh);
      }
      return meshes;
    }
    const CURRENT_SEGMENTS = 7;
    const currentCoreSegs = makeCurrentLayerSegments(0.012, 0.8, 0xffffff, CURRENT_SEGMENTS);
    const currentHaloSegs = makeCurrentLayerSegments(0.055, 0.7, 0x9fdcff, CURRENT_SEGMENTS);

    function pulseNode(idx: number, amount: number) {
      nodeSprites[idx].scale.setScalar(0.45 + 0.6 * amount);
    }
    function resetNodePulses() {
      nodeSprites.forEach((s) => s.scale.setScalar(0.45));
    }

    const _v = new THREE.Vector3();
    function vertexNDC(idx: number) {
      _v.copy(uniqueVerts[idx]).applyMatrix4(shapeGroup.matrixWorld).project(camera);
      return { x: _v.x, y: _v.y };
    }
    function visibleVertexIndices() {
      const centerWorld = shapeGroup.position;
      const camDir = camera.position.clone().sub(centerWorld).normalize();
      const out: number[] = [];
      for (let i = 0; i < uniqueVerts.length; i++) {
        const worldPos = uniqueVerts[i].clone().applyMatrix4(shapeGroup.matrixWorld);
        const dir = worldPos.sub(centerWorld).normalize();
        if (dir.dot(camDir) > 0.1) out.push(i);
      }
      return out;
    }
    function nearestVertexToPointer(ndcX: number, ndcY: number, candidates: number[]) {
      let best = candidates[0];
      let bestD = Infinity;
      candidates.forEach((idx) => {
        const p = vertexNDC(idx);
        const d = (p.x - ndcX) ** 2 + (p.y - ndcY) ** 2;
        if (d < bestD) {
          bestD = d;
          best = idx;
        }
      });
      return best;
    }
    function pointerToNDC(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((clientY - rect.top) / rect.height) * 2 - 1),
      };
    }

    let path: number[] = [0];
    let dragStartVertex: number | null = null;
    let dragDistTotal = 0;
    let dragDirTotal = { x: 0, y: 0 };
    let displayT = 0;
    let trailIntensity = 0;
    let finishing = false;
    let lastMoveTime = performance.now();
    let lastDistSample = 0;
    const PIXELS_PER_EDGE = 65;
    const MAX_EDGES = 6;

    function pointOnPath(t: number) {
      if (path.length < 2) return uniqueVerts[path[0] || 0];
      const clamped = Math.max(0, Math.min(path.length - 1, t));
      const seg = Math.min(path.length - 2, Math.floor(clamped));
      const localT = clamped - seg;
      return new THREE.Vector3().lerpVectors(uniqueVerts[path[seg]], uniqueVerts[path[seg + 1]], localT);
    }

    function growPathTowardDragDirection() {
      const last = path[path.length - 1];
      const options = Array.from(adjacency[last]).filter((n) => n !== path[path.length - 2]);
      const candidates = options.length ? options : Array.from(adjacency[last]);
      const lastNDC = vertexNDC(last);
      const dragLen = Math.hypot(dragDirTotal.x, dragDirTotal.y) || 1;
      const dragDirX = dragDirTotal.x / dragLen;
      const dragDirY = -dragDirTotal.y / dragLen;
      let best = candidates[0];
      let bestScore = -Infinity;
      candidates.forEach((idx) => {
        const p = vertexNDC(idx);
        const vx = p.x - lastNDC.x;
        const vy = p.y - lastNDC.y;
        const len = Math.hypot(vx, vy) || 1;
        const score = (vx / len) * dragDirX + (vy / len) * dragDirY;
        if (score > bestScore) {
          bestScore = score;
          best = idx;
        }
      });
      path.push(best);
    }

    function updateCurrent() {
      if (dragDistTotal - lastDistSample > 0.4) lastMoveTime = performance.now();
      lastDistSample = dragDistTotal;

      const idleTime = performance.now() - lastMoveTime;
      const stillHeldButIdle = isDragging && idleTime > 2000;
      const active = (isDragging && !stillHeldButIdle) || finishing;
      trailIntensity += ((active ? 1 : 0) - trailIntensity) * (active ? 0.35 : 0.08);

      if (trailIntensity < 0.01 && !active) {
        currentCoreSegs.forEach((m) => (m.visible = false));
        currentHaloSegs.forEach((m) => (m.visible = false));
        resetNodePulses();
        return;
      }

      if (isDragging) {
        const desiredEdges = Math.min(MAX_EDGES, Math.floor(dragDistTotal / PIXELS_PER_EDGE));
        while (path.length - 1 < desiredEdges) growPathTowardDragDirection();
      }

      const targetT = Math.max(0, path.length - 1);
      displayT += (targetT - displayT) * 0.3;

      if (finishing && Math.abs(targetT - displayT) < 0.02) {
        displayT = targetT;
        pulseNode(path[path.length - 1], 1);
        finishing = false;
      }

      resetNodePulses();
      const headIdx = Math.min(path.length - 1, Math.round(displayT));
      const frac = 1 - Math.min(1, Math.abs(displayT - headIdx));
      pulseNode(path[headIdx], Math.max(frac, path.length === 1 ? 1 : 0));

      currentCoreSegs.forEach((m) => (m.visible = true));
      currentHaloSegs.forEach((m) => (m.visible = true));

      const TAIL = 0.9;
      const samples = 18;
      const segPts: THREE.Vector3[] = [];
      for (let i = samples; i >= 0; i--) {
        const t = displayT - (i / samples) * TAIL;
        segPts.push(pointOnPath(t));
      }
      const pulse = 0.9 + Math.sin(performance.now() * 0.004) * 0.1;

      function buildTapered(meshes: CurrentMesh[]) {
        const n = meshes.length;
        for (let s = 0; s < n; s++) {
          const startIdx = Math.floor((s * (segPts.length - 1)) / n);
          const endIdx = Math.max(startIdx + 1, Math.floor(((s + 1) * (segPts.length - 1)) / n));
          const chunk = segPts.slice(startIdx, endIdx + 1);
          if (chunk.length < 2) continue;
          const mesh = meshes[s];
          const bell = Math.sin(Math.PI * ((s + 0.5) / n));
          const segRadius = (mesh.userData.baseRadius as number) * (0.3 + 0.7 * bell);
          const curve = new THREE.CatmullRomCurve3(chunk);
          const newGeo = new THREE.TubeGeometry(curve, Math.max(2, chunk.length - 1), segRadius, 6, false);
          mesh.geometry.dispose();
          mesh.geometry = newGeo;
          mesh.material.opacity = (mesh.userData.baseOpacity as number) * trailIntensity * pulse;
        }
      }
      buildTapered(currentCoreSegs);
      buildTapered(currentHaloSegs);
    }

    // ---------- interaction ----------
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let dragTotalX = 0;
    let velX = 0.004;
    let velY = 0.0015;
    const DRAG_THRESHOLD = 45;
    const AUTO_ADVANCE_MS = advanceMs;
    let lastAdvance = performance.now();

    function handlePointerDown(e: PointerEvent) {
      isDragging = true;
      finishing = false;
      prevX = e.clientX;
      prevY = e.clientY;
      dragTotalX = 0;
      dragDistTotal = 0;
      dragDirTotal = { x: 0, y: 0 };
      lastMoveTime = performance.now();
      lastDistSample = 0;
      canvas.setPointerCapture(e.pointerId);

      const ndc = pointerToNDC(e.clientX, e.clientY);
      const visible = visibleVertexIndices();
      if (visible.length) {
        dragStartVertex = nearestVertexToPointer(ndc.x, ndc.y, visible);
        path = [dragStartVertex];
        displayT = 0;
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      dragTotalX += dx;
      velY = dx * 0.00035;
      velX = dy * 0.00035;
      shapeGroup.rotation.y += dx * 0.006;
      shapeGroup.rotation.x += dy * 0.006;

      dragDistTotal += Math.hypot(dx, dy);
      dragDirTotal.x += dx;
      dragDirTotal.y += dy;
    }

    function handlePointerUp() {
      if (!isDragging) return;
      isDragging = false;
      finishing = true;
      if (Math.abs(dragTotalX) > DRAG_THRESHOLD) {
        switchStage(dragTotalX < 0 ? 1 : -1);
      }
      lastAdvance = performance.now();
    }

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    let rafId: number | null = null;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();

      if (!isDragging) {
        shapeGroup.rotation.y += 0.0026;
        shapeGroup.rotation.x += 0.0007;
        velY *= 0.96;
        velX *= 0.96;
      }

      updateCurrent();

      if (!isDragging && !switching && now - lastAdvance > AUTO_ADVANCE_MS) {
        lastAdvance = now;
        switchStage(1);
      }

      if (now < flashUntil) {
        const p = 1 - (flashUntil - now) / 550;
        core.material.opacity = 0.5 + Math.sin(p * Math.PI) * 0.6;
        core.scale.setScalar(1 + Math.sin(p * Math.PI) * 0.5);
      } else {
        core.material.opacity = 0.4 + Math.sin(now * 0.0015) * 0.15;
        core.scale.setScalar(1);
      }

      renderer.render(scene, camera);
    }
    animate();

    // ---------- cleanup on unmount ----------
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', updateScaleVar);
      wrapResizeObserver.disconnect();
      MOBILE_QUERY.removeEventListener('change', applyShapePosition);
      stageResizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dotEls.forEach((dot, i) => {
        dot.removeEventListener('click', dotClickHandlers[i]);
        dot.removeEventListener('keydown', dotKeydownHandlers[i]);
      });

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh & { material?: THREE.Material | THREE.Material[] };
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const withMap = m as THREE.Material & { map?: THREE.Texture | null };
            if (withMap.map) withMap.map.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
    };
  }, [stagesKey, advanceMs]);

  return (
    <div className={`${styles.bannerWrap} ${className ?? ''}`.trim()} ref={bannerWrapRef}>
      <div className={styles.banner} ref={bannerRef}>
        <div className={styles.textPanel}>
          {/* first stage is rendered server-side; the effect swaps the copy from here on */}
          <div ref={stageNumberRef} className={styles.stageNumber}>
            {resolvedStages[0].number}
          </div>
          <div ref={eyebrowRef} className={styles.eyebrow}>
            {resolvedStages[0].eyebrow}
          </div>
          <h1 ref={headlineRef} className={styles.headline}>
            {resolvedStages[0].headline}
          </h1>
          <p ref={subRef} className={styles.sub}>
            {resolvedStages[0].sub}
          </p>
          {resolvedStages.length > 1 && (
            <div className={styles.stageDots}>
              {resolvedStages.map((stage, i) => (
                <span
                  key={`${stage.number}-${i}`}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to stage ${i + 1}: ${stage.eyebrow || stage.headline}`}
                  className={`${styles.stageDot} ${i === 0 ? styles.active : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.shapeStage} ref={shapeStageRef}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.divider} />
        </div>
      </div>
    </div>
  );
}
