'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Stage } from './ImpactBanner';
import styles from './CapacityBuildingBanner.module.css';

/**
 * CapacityBuildingBanner — "Capacity Building & Methodology Support"
 * -------------------------------------------------------------------
 * The eighth HeroSection3D variant. Like strategy/policy/feasibility/projects
 * it has no rotating stages, and the cycle starts only once the banner scrolls
 * into view (IntersectionObserver), never on page load.
 *
 * Cycle: nothing on screen -> one by one a circle leaves the centre, reaches
 * the top of its radius and draws a dashed ring around, then keeps moving on
 * it (~6.4s for all four) -> the tagline reveals word by word -> holds ->
 * every ring turns once on its axis and fades out (~3.2s) -> loops. Capacity
 * growing outward, like the rings of a tree. Dragging rotates the shape and
 * pauses the cycle until released.
 *
 * CMS copy: takes the same `stages` prop as the other variants but uses only
 * the FIRST entry — headline becomes the tagline's h2, sub becomes the
 * paragraph. `autoAdvanceMs` maps to how long the finished rings hold.
 *
 * Responsive: on portrait screens up to 1024px the shape stays horizontal and
 * scales to fit under the text; the banner is 1/1 on tablets, 4/5 on phones.
 *
 * Touch: `touch-action: pan-y` on the canvas so a horizontal drag rotates the
 * shape while a vertical swipe still scrolls the page, plus pointercancel
 * handling — without it a cancelled touch leaves isDragging true, which stalls
 * the cycle for good.
 *
 * Requires `three` (already a dependency of this project). The "Agenda"
 * typeface is loaded site-wide in app/layout.tsx.
 */

type CapacityBuildingBannerProps = {
  /** Only the first entry is used: headline -> h2, sub -> paragraph. */
  stages?: Stage[];
  /** How long the finished rings hold before fading out (default 4500ms). */
  autoAdvanceMs?: number;
  /** Optional extra classes on the outer wrapper (the component sizes itself). */
  className?: string;
};

const DEFAULT_TAGLINE = {
  headline: 'Building skills that last.',
  sub: 'Learning programmes and methods that turn knowledge into measurable outcomes.',
};

const DEFAULT_CLEAR_HOLD_MS = 4500;

export default function CapacityBuildingBanner({
  stages,
  autoAdvanceMs,
  className,
}: CapacityBuildingBannerProps) {
  const tagline = useMemo(() => {
    const first = (stages ?? []).find((s) => s && (s.headline || s.sub));
    return {
      headline: first?.headline?.trim() || DEFAULT_TAGLINE.headline,
      sub: first?.sub?.trim() || DEFAULT_TAGLINE.sub,
    };
  }, [stages]);

  const clearHoldMs =
    typeof autoAdvanceMs === 'number' && autoAdvanceMs >= 800
      ? autoAdvanceMs
      : DEFAULT_CLEAR_HOLD_MS;

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const taglineHeadRef = useRef<HTMLHeadingElement | null>(null);
  const taglineSubRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (
      !bannerRef.current ||
      !canvasRef.current ||
      !taglineHeadRef.current ||
      !taglineSubRef.current
    ) {
      return;
    }

    // non-nullable locals so the closures below don't need null checks
    const bannerEl: HTMLDivElement = bannerRef.current;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const taglineHead: HTMLHeadingElement = taglineHeadRef.current;
    const taglineSub: HTMLParagraphElement = taglineSubRef.current;

    type BasicMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;

    // ---------- tagline word-reveal ----------
    function splitWords(el: HTMLElement) {
      // collapse the newlines/indentation JSX introduces — splitting on a
      // single " " would otherwise emit empty words for every character of
      // source indentation
      const words = (el.textContent ?? '').trim().split(/\s+/);
      el.innerHTML = '';
      words.forEach((w, i, arr) => {
        const wrap = document.createElement('span');
        wrap.className = styles.word;
        const inner = document.createElement('span');
        inner.textContent = w;
        wrap.appendChild(inner);
        el.appendChild(wrap);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      });
    }
    splitWords(taglineHead);
    splitWords(taglineSub);

    const WORD_STAGGER = 0.05;
    const WORD_REVEAL = 0.55;
    const LINE_GAP = 0.15;
    function showTagline() {
      let base = 0;
      [taglineHead, taglineSub].forEach((el) => {
        const words = el.querySelectorAll<HTMLElement>(`.${styles.word} > span`);
        words.forEach((w, wi) => {
          w.style.transitionDelay = (base + wi * WORD_STAGGER).toFixed(3) + 's';
        });
        base += Math.max(0, words.length - 1) * WORD_STAGGER + WORD_REVEAL + LINE_GAP;
        el.classList.add(styles.revealed);
      });
    }
    function hideTagline() {
      [taglineHead, taglineSub].forEach((el) => {
        el.querySelectorAll<HTMLElement>(`.${styles.word} > span`).forEach((w) => {
          w.style.transitionDelay = '0s';
        });
        el.classList.remove(styles.revealed);
      });
    }

    // ---------- three.js scene ----------
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1728 / 600, 0.1, 100);
    camera.position.set(0, 0, 9);

    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    // ---- shared helpers ----
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    function easeInOut(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // ---- geometry ----
    // Capacity growing outward, like the rings of a tree. Nothing is on
    // screen at first. One by one, a circle leaves the centre, reaches the
    // same point at the top and draws its ring around; it then keeps
    // moving on that ring. To loop, all the rings turn on their axis, the
    // way they do when dragged, and fade out for the next build.
    const RADII = [0.62, 1.25, 1.92, 2.6];
    const RING_COUNT = RADII.length;
    const DASH = 0.24;
    const GAP = 0.17;
    const SPEEDS = [-0.95, -0.7, -0.52, -0.4]; // rad/s, all clockwise

    const uniqueVerts: THREE.Vector3[] = [];
    const ADJ_NODES = 8;
    RADII.forEach((r) => {
      for (let i = 0; i < ADJ_NODES; i++) {
        const a = Math.PI / 2 - (i / ADJ_NODES) * Math.PI * 2;
        uniqueVerts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
      }
    });
    const NODE_COUNT = uniqueVerts.length;
    const nodeAt = (ring: number, i: number) => ring * ADJ_NODES + i;
    const nodeBase = new Array<number>(NODE_COUNT).fill(0.34);
    const flashBoost = new Array<number>(NODE_COUNT).fill(0);

    const PORTRAIT_QUERY = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
    function applyResponsiveShape() {
      if (PORTRAIT_QUERY.matches) {
        // narrow screens keep the shape horizontal and simply scale it to
        // fit under the text, it never turns on its side
        const NODE_GLOW = 0.3;
        const left = 2.6 + NODE_GLOW;
        const right = 2.6 + NODE_GLOW;
        const halfShape = 2.6 + NODE_GLOW;
        const halfH = Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z;
        const halfW = halfH * camera.aspect;
        const bottom = -halfH * 0.94;
        const top = halfH * 0.08; // the tagline owns the band above this
        const scale = Math.min(
          0.8,
          (halfW * 1.84) / (left + right),
          (top - bottom) / (halfShape * 2),
        );
        shapeGroup.position.x = ((left - right) / 2) * scale;
        shapeGroup.position.y = (bottom + top) / 2;
        shapeGroup.rotation.z = 0;
        shapeGroup.scale.setScalar(scale);
      } else {
        shapeGroup.position.x = -4.7;
        shapeGroup.position.y = 0;
        shapeGroup.rotation.z = 0;
        shapeGroup.scale.setScalar(1);
      }
    }
    applyResponsiveShape();
    PORTRAIT_QUERY.addEventListener('change', applyResponsiveShape);
    const handleOrientationChange = () => setTimeout(applyResponsiveShape, 50);
    window.addEventListener('orientationchange', handleOrientationChange);

    function makeGlowTexture() {
      const size = 128;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.25, 'rgba(169,216,255,0.9)');
      g.addColorStop(1, 'rgba(169,216,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }
    const spriteMat = new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    // sprites exist only as anchors for the drag current, none are drawn
    const nodeSprites = uniqueVerts.map((v) => {
      const sprite = new THREE.Sprite(spriteMat.clone());
      sprite.position.copy(v);
      sprite.visible = false;
      shapeGroup.add(sprite);
      return sprite;
    });

    // ---- rings of dashes ----
    const UP = new THREE.Vector3(0, 1, 0);
    const _dir = new THREE.Vector3();
    const dashGeo = new THREE.CylinderGeometry(0.014, 0.014, 1, 6);
    function addDash(
      a: THREE.Vector3,
      b: THREE.Vector3,
      opacity: number,
      parent: THREE.Object3D,
    ): BasicMesh {
      const mesh: BasicMesh = new THREE.Mesh(
        dashGeo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity }),
      );
      _dir.subVectors(b, a);
      const len = _dir.length();
      mesh.position.addVectors(a, b).multiplyScalar(0.5);
      mesh.scale.set(1, len, 1);
      mesh.quaternion.setFromUnitVectors(UP, _dir.normalize());
      parent.add(mesh);
      return mesh;
    }
    // each dash records its place around the ring, 0..1 from the top
    const ringGroups = RADII.map(() => {
      const g = new THREE.Group();
      shapeGroup.add(g);
      return g;
    });
    type RingDash = { parts: BasicMesh[]; at: number };
    const rings = RADII.map((r, ring) => {
      const dir = 1;
      const len = 2 * Math.PI * r;
      const count = Math.max(6, Math.round(len / (DASH + GAP)));
      const span = (Math.PI * 2) / count;
      const dashes: RingDash[] = [];
      for (let k = 0; k < count; k++) {
        const a0 = Math.PI / 2 - dir * k * span;
        const a1 = a0 - dir * span * (DASH / (DASH + GAP));
        // short chords hold the curve on the larger rings
        const parts: BasicMesh[] = [];
        for (let s = 0; s < 2; s++) {
          const t0 = a0 + ((a1 - a0) * s) / 2;
          const t1 = a0 + ((a1 - a0) * (s + 1)) / 2;
          parts.push(
            addDash(
              new THREE.Vector3(Math.cos(t0) * r, Math.sin(t0) * r, 0),
              new THREE.Vector3(Math.cos(t1) * r, Math.sin(t1) * r, 0),
              0,
              ringGroups[ring],
            ),
          );
        }
        dashes.push({ parts, at: k / count });
      }
      return { r, dir, dashes };
    });

    // ---- moving circles ----
    const movers = RADII.map((_r, ring) => {
      const s = new THREE.Sprite(spriteMat.clone());
      s.scale.setScalar(0.5);
      ringGroups[ring].add(s);
      return s;
    });
    const moverAngle = RADII.map(() => Math.PI / 2);
    const moverR = RADII.map(() => 0);
    const formed = RADII.map(() => false);

    // ---- single source of truth for the shape ----
    const moverA = new Array<number>(RING_COUNT).fill(0);
    function setRing(ring: number, t: number) {
      const count = rings[ring].dashes.length;
      rings[ring].dashes.forEach((d) => {
        const f = clamp01((t - d.at) * count);
        d.parts.forEach((m) => {
          m.material.opacity = f;
          m.visible = f > 0.001;
        });
      });
    }
    function applyProgress(p: number) {
      for (let ring = 0; ring < RING_COUNT; ring++) {
        const w = clamp01(p * RING_COUNT - ring); // this ring's share of the build
        const out = clamp01(w / 0.2); // centre to the start point
        const t = clamp01((w - 0.2) / 0.8); // once around
        moverA[ring] = w > 0 ? 1 : 0;
        moverR[ring] = RADII[ring] * out;
        formed[ring] = t >= 1;
        setRing(ring, t);
        if (t < 1) moverAngle[ring] = Math.PI / 2 - t * Math.PI * 2;
        ringGroups[ring].rotation.set(0, 0, 0);
      }
    }
    // the loop: each ring turns once around on its axis, just behind the
    // one before it, as when dragged, fading out on the last part of the turn
    function applyFade(rawT: number) {
      const gone = clamp01((rawT - 0.68) / 0.32);
      for (let ring = 0; ring < RING_COUNT; ring++) {
        const t = easeInOut(clamp01((rawT - ring * 0.06) / 0.82));
        ringGroups[ring].rotation.y = t * Math.PI * 2;
        ringGroups[ring].rotation.x = Math.sin(t * Math.PI) * 0.5;
        moverA[ring] = 1 - gone;
        rings[ring].dashes.forEach((d) =>
          d.parts.forEach((m) => (m.material.opacity = 1 - gone)),
        );
      }
      if (rawT >= 1) applyProgress(0);
    }
    applyProgress(0);

    let lastPulseTime = performance.now();
    function updatePulses(now: number) {
      const dt = Math.min((now - lastPulseTime) / 1000, 0.05);
      lastPulseTime = now;
      movers.forEach((s, ring) => {
        if (formed[ring]) moverAngle[ring] += SPEEDS[ring] * dt;
        const a = moverAngle[ring];
        s.position.set(Math.cos(a) * moverR[ring], Math.sin(a) * moverR[ring], 0);
        s.material.opacity = moverA[ring];
        s.visible = moverA[ring] > 0.01;
      });
    }

    // current for drag: around each ring
    const ADJACENCY = Array.from({ length: NODE_COUNT }, () => new Set<number>());
    function link(a: number, b: number) {
      ADJACENCY[a].add(b);
      ADJACENCY[b].add(a);
    }
    for (let ring = 0; ring < RING_COUNT; ring++) {
      for (let i = 0; i < ADJ_NODES; i++) link(nodeAt(ring, i), nodeAt(ring, (i + 1) % ADJ_NODES));
    }
    // every node and edge is always reachable here — unlike the earlier
    // variants there is no form in which parts of the shape are absent
    const nodeUsable = (_i: number) => true;
    const edgeUsable = (_a: number, _b: number) => true;
    const ROUTE = [nodeAt(RING_COUNT - 1, 0)];

    function resizeRendererToBanner() {
      const w = bannerEl.clientWidth;
      const h = bannerEl.clientHeight;
      if (w < 1 || h < 1) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      applyResponsiveShape();
    }
    const bannerResizeObserver = new ResizeObserver(resizeRendererToBanner);
    bannerResizeObserver.observe(bannerEl);
    resizeRendererToBanner();

    // ---------- state machine ----------
    let sequenceStarted = false;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3 && !sequenceStarted) {
            sequenceStarted = true;
            phaseStart = performance.now();
          }
        });
      },
      { threshold: [0.3] },
    );
    intersectionObserver.observe(bannerEl);

    let phase: 'idea' | 'building' | 'clear' | 'restoring' = 'idea';
    let phaseStart = performance.now();
    const IDEA_HOLD = 300;
    const MORPH_DUR = 6400;
    const BACK_DUR = 3200;
    const CLEAR_HOLD = clearHoldMs;
    let lastFrameTimeForMorph = performance.now();
    let rotFromX = 0;
    let rotFromY = 0;

    function beginMorph(next: 'building' | 'restoring', now: number) {
      phase = next;
      phaseStart = now;
      rotFromX = shapeGroup.rotation.x;
      rotFromY = shapeGroup.rotation.y;
    }
    function easeRotation(rawT: number) {
      const t = easeInOut(rawT);
      shapeGroup.rotation.x = rotFromX * (1 - t);
      shapeGroup.rotation.y = rotFromY * (1 - t);
    }

    function updateMorph(now: number) {
      if (!sequenceStarted) return;
      if (isDragging) {
        phaseStart += now - lastFrameTimeForMorph;
        lastFrameTimeForMorph = now;
        return;
      }
      lastFrameTimeForMorph = now;
      const elapsed = now - phaseStart;

      if (phase === 'idea' && elapsed > IDEA_HOLD) {
        beginMorph('building', now);
      } else if (phase === 'building') {
        const rawT = Math.min(1, elapsed / MORPH_DUR);
        applyProgress(rawT);
        easeRotation(rawT);
        if (rawT >= 1) {
          phase = 'clear';
          phaseStart = now;
          showTagline();
        }
      } else if (phase === 'clear' && elapsed > CLEAR_HOLD) {
        hideTagline();
        beginMorph('restoring', now);
      } else if (phase === 'restoring') {
        const rawT = Math.min(1, elapsed / BACK_DUR);
        applyFade(rawT);
        easeRotation(rawT);
        if (rawT >= 1) {
          phase = 'idea';
          phaseStart = now;
        }
      }
    }

    // ---------- traveling electric current (same as the other banners) ----------
    function makeCurrentLayerSegments(
      baseRadius: number,
      opacity: number,
      color: number,
      count: number,
    ): BasicMesh[] {
      const meshes: BasicMesh[] = [];
      for (let s = 0; s < count; s++) {
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const mesh: BasicMesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
        mesh.userData.baseRadius = baseRadius;
        mesh.userData.baseOpacity = opacity;
        shapeGroup.add(mesh);
        meshes.push(mesh);
      }
      return meshes;
    }
    const CURRENT_SEGMENTS = 7;
    const currentCoreSegs = makeCurrentLayerSegments(0.014, 0.8, 0xffffff, CURRENT_SEGMENTS);
    const currentHaloSegs = makeCurrentLayerSegments(0.06, 0.7, 0xa9d8ff, CURRENT_SEGMENTS);

    function pulseNode(idx: number, amount: number) {
      nodeSprites[idx].scale.setScalar(nodeBase[idx] + flashBoost[idx] + 0.6 * amount);
    }
    function resetNodePulses() {
      nodeSprites.forEach((s, i) => s.scale.setScalar(nodeBase[i] + flashBoost[i]));
    }

    const _v = new THREE.Vector3();
    function vertexNDC(idx: number) {
      _v.copy(uniqueVerts[idx]).applyMatrix4(shapeGroup.matrixWorld).project(camera);
      return { x: _v.x, y: _v.y };
    }
    function nearestVertexToPointer(ndcX: number, ndcY: number) {
      let best = ROUTE[0];
      let bestD = Infinity;
      for (let idx = 0; idx < NODE_COUNT; idx++) {
        if (!nodeUsable(idx)) continue;
        const p = vertexNDC(idx);
        const d = (p.x - ndcX) ** 2 + (p.y - ndcY) ** 2;
        if (d < bestD) {
          bestD = d;
          best = idx;
        }
      }
      return best;
    }
    function pointerToNDC(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((clientY - rect.top) / rect.height) * 2 - 1),
      };
    }

    let path: number[] = [ROUTE[0]];
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
      if (path.length < 2) return uniqueVerts[path[0]].clone();
      const clamped = Math.max(0, Math.min(path.length - 1, t));
      const seg = Math.min(path.length - 2, Math.floor(clamped));
      return new THREE.Vector3().lerpVectors(
        uniqueVerts[path[seg]],
        uniqueVerts[path[seg + 1]],
        clamped - seg,
      );
    }

    function growPathTowardDragDirection() {
      const last = path[path.length - 1];
      const all = Array.from(ADJACENCY[last]).filter((n) => nodeUsable(n) && edgeUsable(last, n));
      if (!all.length) return false;
      const options = all.filter((n) => n !== path[path.length - 2]);
      const candidates = options.length ? options : all;
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
      return true;
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
        while (path.length - 1 < desiredEdges) {
          if (!growPathTowardDragDirection()) break;
        }
      }
      const targetT = Math.max(0, path.length - 1);
      displayT += (targetT - displayT) * 0.3;
      if (finishing && Math.abs(targetT - displayT) < 0.02) {
        displayT = targetT;
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
      for (let i = samples; i >= 0; i--) segPts.push(pointOnPath(displayT - (i / samples) * TAIL));
      const pulse = 0.9 + Math.sin(performance.now() * 0.004) * 0.1;

      function buildTapered(meshes: BasicMesh[]) {
        const n = meshes.length;
        for (let s = 0; s < n; s++) {
          const a = Math.floor((s * (segPts.length - 1)) / n);
          const b = Math.max(a + 1, Math.floor(((s + 1) * (segPts.length - 1)) / n));
          const chunk = segPts.slice(a, b + 1);
          if (chunk.length < 2 || chunk[0].distanceTo(chunk[chunk.length - 1]) < 1e-4) {
            meshes[s].visible = false;
            continue;
          }
          const mesh = meshes[s];
          const bell = Math.sin(Math.PI * ((s + 0.5) / n));
          const segRadius = (mesh.userData.baseRadius as number) * (0.3 + 0.7 * bell);
          const curve = new THREE.LineCurve3(chunk[0], chunk[chunk.length - 1]);
          const newGeo = new THREE.TubeGeometry(curve, 2, segRadius, 6, false);
          mesh.geometry.dispose();
          mesh.geometry = newGeo;
          mesh.material.opacity =
            (mesh.userData.baseOpacity as number) * trailIntensity * pulse;
        }
      }
      buildTapered(currentCoreSegs);
      buildTapered(currentHaloSegs);
    }

    // ---------- interaction ----------
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    /** A held pointer that stops reporting movement for this long is abandoned. */
    const STUCK_DRAG_MS = 6000;

    function handlePointerDown(e: PointerEvent) {
      isDragging = true;
      finishing = false;
      prevX = e.clientX;
      prevY = e.clientY;
      dragDistTotal = 0;
      dragDirTotal = { x: 0, y: 0 };
      lastMoveTime = performance.now();
      lastDistSample = 0;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // some mobile browsers refuse capture for an already-released pointer
      }
      const ndc = pointerToNDC(e.clientX, e.clientY);
      path = [nearestVertexToPointer(ndc.x, ndc.y)];
      displayT = 0;
    }
    function handlePointerMove(e: PointerEvent) {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      shapeGroup.rotation.y += dx * 0.006;
      shapeGroup.rotation.x += dy * 0.006;
      dragDistTotal += Math.hypot(dx, dy);
      dragDirTotal.x += dx;
      dragDirTotal.y += dy;
    }

    // updateMorph() returns early while dragging, so failing to clear this
    // would stall the ring-building cycle permanently, not just the sway.
    function releaseDrag() {
      if (!isDragging) return;
      isDragging = false;
      finishing = true;
      lastFrameTimeForMorph = performance.now();
    }
    function handlePointerUp() {
      releaseDrag();
    }
    function handlePointerCancel() {
      releaseDrag();
    }

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    canvas.addEventListener('pointercancel', handlePointerCancel);

    let rafId: number | null = null;
    function animate() {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();

      // safety net for mobile browsers that drop a pointer without firing
      // pointerup OR pointercancel — the cycle always resumes
      if (isDragging && now - lastMoveTime > STUCK_DRAG_MS) {
        releaseDrag();
      }

      // a flat block goes edge-on under a continuous spin, so it sways
      // instead; the sway narrows while the text is showing
      if (!isDragging && phase !== 'building' && phase !== 'restoring') {
        const amp = phase === 'clear' ? 0.3 : 1;
        const targetY = Math.sin(now * 0.00055) * 0.2 * amp;
        const targetX = Math.sin(now * 0.00037) * 0.12 * amp;
        shapeGroup.rotation.y += (targetY - shapeGroup.rotation.y) * 0.02;
        shapeGroup.rotation.x += (targetX - shapeGroup.rotation.x) * 0.02;
      }
      updateMorph(now);
      updatePulses(now);
      updateCurrent();
      renderer.render(scene, camera);
    }
    animate();

    // ---------- cleanup on unmount ----------
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      bannerResizeObserver.disconnect();
      intersectionObserver.disconnect();
      PORTRAIT_QUERY.removeEventListener('change', applyResponsiveShape);
      window.removeEventListener('orientationchange', handleOrientationChange);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      canvas.removeEventListener('pointercancel', handlePointerCancel);

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
  }, [tagline.headline, tagline.sub, clearHoldMs]);

  return (
    <div className={`${styles.bannerWrap} ${className ?? ''}`.trim()}>
      <div className={styles.banner} ref={bannerRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.tagline}>
          <h2 ref={taglineHeadRef}>{tagline.headline}</h2>
          <p ref={taglineSubRef}>{tagline.sub}</p>
        </div>
      </div>
    </div>
  );
}
