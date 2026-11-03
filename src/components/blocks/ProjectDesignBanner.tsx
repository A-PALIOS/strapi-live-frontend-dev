'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Stage } from './ImpactBanner';
import styles from './ProjectDesignBanner.module.css';

/**
 * ProjectDesignBanner — "Project Design & Management (EU & National)"
 * -------------------------------------------------------------------
 * The seventh HeroSection3D variant. Like strategy/policy/feasibility it has
 * no rotating stages, and the cycle starts only once the banner scrolls into
 * view (IntersectionObserver), never on page load.
 *
 * Cycle: a Gantt schedule of overlapping tasks over a faint time grid. A
 * dashed "today" line sweeps across (~5.6s), filling each task and lighting
 * its milestone as it passes -> the line fades out where it ends -> the
 * tagline reveals word by word -> holds -> the schedule empties in place
 * (~1.8s) and the line fades back in at the start -> loops. Unlike the other
 * variants nothing runs backwards; a schedule replays forwards.
 *
 * CMS copy: takes the same `stages` prop as the other variants but uses only
 * the FIRST entry — headline becomes the tagline's h2, sub becomes the
 * paragraph. `autoAdvanceMs` maps to how long the finished schedule holds.
 *
 * Responsive: on portrait screens up to 1024px the shape stays horizontal and
 * scales to fit under the text — it never turns on its side, because a Gantt
 * chart rotated 90° stops reading as a timeline. The banner is 1/1 on tablets
 * and 4/5 on phones.
 *
 * Touch: `touch-action: pan-y` on the canvas so a horizontal drag rotates the
 * shape while a vertical swipe still scrolls the page, plus pointercancel
 * handling — without it a cancelled touch leaves isDragging true, which stalls
 * the cycle for good.
 *
 * Requires `three` (already a dependency of this project). The "Agenda"
 * typeface is loaded site-wide in app/layout.tsx.
 */

type ProjectDesignBannerProps = {
  /** Only the first entry is used: headline -> h2, sub -> paragraph. */
  stages?: Stage[];
  /** How long the finished schedule holds before emptying (default 4500ms). */
  autoAdvanceMs?: number;
  /** Optional extra classes on the outer wrapper (the component sizes itself). */
  className?: string;
};

const DEFAULT_TAGLINE = {
  headline: 'Turning ideas into projects.',
  sub: 'Funding, proposals, and project management, from first concept to final report.',
};

const DEFAULT_CLEAR_HOLD_MS = 4500;

export default function ProjectDesignBanner({
  stages,
  autoAdvanceMs,
  className,
}: ProjectDesignBannerProps) {
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
    type FillMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

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
    // A schedule read the way a real one is: tasks that overlap in time, a
    // time grid, and a "today" line sweeping across. Whatever the line passes
    // fills in and milestones light as it reaches them. At the end the line
    // fades out where it is and the schedule empties in place.
    const BAR_H = 0.5;
    const ROW_TOP = 2.3;
    const ROW_STEP = 0.92;
    const BARS = (
      [
        [-6.2, -3.8],
        [-5.0, -2.9],
        [-2.6, -0.2],
        [-1.6, 0.5],
        [0.8, 3.0],
        [1.9, 4.5],
      ] as const
    ).map(([x0, x1], i) => ({ x0, x1, y: ROW_TOP - i * ROW_STEP, w: x1 - x0 }));
    const BAR_COUNT = BARS.length;
    const LAST_Y = BARS[BAR_COUNT - 1].y;
    const SWEEP_FROM = BARS[0].x0;
    const SWEEP_TO = BARS[BAR_COUNT - 1].x1 + 0.1;
    const GRID_TOP = ROW_TOP + 0.5;
    const GRID_BOTTOM = LAST_Y - 0.5;
    const DASH = 0.24;
    const GAP = 0.17;
    const v3 = (x: number, y: number) => new THREE.Vector3(x, y, 0);

    const NODE_COUNT = BAR_COUNT * 2;
    const startIdx = (b: number) => b * 2;
    const endIdx = (b: number) => b * 2 + 1;
    const uniqueVerts: THREE.Vector3[] = [];
    BARS.forEach((b) => uniqueVerts.push(v3(b.x0, b.y), v3(b.x1, b.y)));
    const nodeBase = new Array<number>(NODE_COUNT).fill(0.46);
    const flashBoost = new Array<number>(NODE_COUNT).fill(0);

    // desktop: the schedule sits left of the text.
    const PORTRAIT_QUERY = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
    function applyResponsiveShape() {
      if (PORTRAIT_QUERY.matches) {
        // narrow screens keep the shape horizontal and simply scale it to
        // fit under the text, it never turns on its side
        const NODE_GLOW = 0.3;
        const left = 6.2 + NODE_GLOW;
        const right = 4.6 + NODE_GLOW;
        const halfShape = 2.75 + NODE_GLOW;
        const halfH = Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z;
        const halfW = halfH * camera.aspect;
        const bottom = -halfH * 0.9;
        const top = halfH * 0.3; // the tagline owns the band above this
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
        shapeGroup.position.x = -4.0;
        shapeGroup.position.y = 0;
        shapeGroup.rotation.z = 0;
        shapeGroup.scale.setScalar(0.8);
      }
    }
    applyResponsiveShape();
    PORTRAIT_QUERY.addEventListener('change', applyResponsiveShape);
    const handleOrientationChange = () => setTimeout(applyResponsiveShape, 50);
    window.addEventListener('orientationchange', handleOrientationChange);

    // ---- nodes ----
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
    const spriteMat = new THREE.SpriteMaterial({
      map: makeGlowTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodeSprites = uniqueVerts.map((v) => {
      const sprite = new THREE.Sprite(spriteMat.clone());
      sprite.position.copy(v);
      shapeGroup.add(sprite);
      return sprite;
    });

    // ---- dashes ----
    const UP = new THREE.Vector3(0, 1, 0);
    const _dir = new THREE.Vector3();
    function placeSegment(mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) {
      _dir.subVectors(b, a);
      const len = _dir.length();
      mesh.position.addVectors(a, b).multiplyScalar(0.5);
      mesh.scale.set(1, Math.max(len, 0.0001), 1);
      if (len > 1e-5) mesh.quaternion.setFromUnitVectors(UP, _dir.normalize());
    }
    function makeDashes(
      from: THREE.Vector3,
      to: THREE.Vector3,
      material: THREE.MeshBasicMaterial,
      radius: number,
      parent?: THREE.Object3D,
    ) {
      const len = from.distanceTo(to);
      const count = Math.max(1, Math.round((len + GAP) / (DASH + GAP)));
      const step = (len + GAP) / count;
      const geo = new THREE.CylinderGeometry(radius, radius, 1, 6);
      for (let k = 0; k < count; k++) {
        const mesh = new THREE.Mesh(geo, material);
        placeSegment(
          mesh,
          from.clone().lerp(to, (k * step) / len),
          from.clone().lerp(to, (k * step + step - GAP) / len),
        );
        (parent || shapeGroup).add(mesh);
      }
    }
    const lineMat = (opacity: number) =>
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity });

    // time grid
    const gridMat = lineMat(0.1);
    for (let i = 0; i <= 8; i++) {
      const x = SWEEP_FROM + (i / 8) * (SWEEP_TO - SWEEP_FROM);
      makeDashes(v3(x, GRID_TOP), v3(x, GRID_BOTTOM), gridMat, 0.009);
    }

    // task bars. The outline material and the fill mesh are kept in arrays
    // parallel to BARS rather than attached to each bar object: assigning
    // them onto the mapped literal afterwards would make both properties
    // optional for the rest of the file, forcing a null check at every use.
    const barMats: THREE.MeshBasicMaterial[] = [];
    const barFills: FillMesh[] = [];
    BARS.forEach((b) => {
      const mat = lineMat(0.55);
      barMats.push(mat);
      const hh = BAR_H / 2;
      const c = [
        v3(b.x0, b.y + hh),
        v3(b.x1, b.y + hh),
        v3(b.x1, b.y - hh),
        v3(b.x0, b.y - hh),
      ];
      c.forEach((p, i) => makeDashes(p, c[(i + 1) % 4], mat, 0.013));
      const geo = new THREE.PlaneGeometry(b.w, BAR_H);
      geo.translate(b.w / 2, 0, 0);
      const fill: FillMesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({
          color: 0x9fdcff,
          transparent: true,
          opacity: 0.26,
          depthWrite: false,
        }),
      );
      fill.position.set(b.x0, b.y, 0);
      fill.visible = false;
      shapeGroup.add(fill);
      barFills.push(fill);
    });

    // the today line, with the moving circle riding along its top
    const todayMat = lineMat(0.7);
    const today = new THREE.Group();
    makeDashes(v3(0, GRID_TOP), v3(0, GRID_BOTTOM), todayMat, 0.014, today);
    shapeGroup.add(today);
    const todayDot = new THREE.Sprite(spriteMat.clone());
    todayDot.scale.setScalar(0.62);
    todayDot.position.set(0, GRID_TOP, 0);
    today.add(todayDot);

    // ---- single source of truth for the shape ----
    let lineA = 1;
    function applyProgress(p: number) {
      const x = SWEEP_FROM + (SWEEP_TO - SWEEP_FROM) * p;
      today.position.x = x;
      lineA = 1 - clamp01((p - 0.95) / 0.05);
      todayMat.opacity = 0.7 * lineA;
      todayDot.material.opacity = lineA;
      today.visible = lineA > 0.01;

      BARS.forEach((b, i) => {
        const t = clamp01((x - b.x0) / b.w);
        const fill = barFills[i];
        fill.visible = t > 0.001;
        fill.scale.x = Math.max(0.0001, t);
        fill.material.opacity = 0.26;
        barMats[i].opacity = 0.55 + 0.35 * t;
        const reached = x >= b.x1 ? 1 : 0;
        const n = endIdx(i);
        nodeSprites[n].material.opacity = 0.22 + 0.78 * reached;
        nodeBase[n] = 0.34 + 0.12 * reached;
        nodeSprites[n].scale.setScalar(nodeBase[n]);
        nodeSprites[startIdx(i)].visible = false;
      });
    }
    // the finished schedule empties where it stands, then the line fades
    // back in at the start for the next pass
    function applyFade(rawT: number) {
      const t = easeInOut(rawT);
      BARS.forEach((_b, i) => {
        barFills[i].material.opacity = 0.26 * (1 - t);
        barMats[i].opacity = 0.9 - 0.35 * t;
        nodeSprites[endIdx(i)].material.opacity = 1 - 0.78 * t;
      });
      const lineIn = clamp01((rawT - 0.5) * 2);
      today.position.x = SWEEP_FROM;
      today.visible = lineIn > 0.01;
      todayMat.opacity = 0.7 * lineIn;
      todayDot.material.opacity = lineIn;
      if (rawT >= 1) applyProgress(0);
    }
    applyProgress(0);

    // current for drag: along each task
    const ADJACENCY = Array.from({ length: NODE_COUNT }, () => new Set<number>());
    function link(a: number, b: number) {
      ADJACENCY[a].add(b);
      ADJACENCY[b].add(a);
    }
    for (let b = 0; b < BAR_COUNT; b++) {
      link(startIdx(b), endIdx(b));
    }
    // every node and edge is always reachable here — unlike the other
    // variants there is no form in which parts of the shape are absent
    const nodeUsable = (_i: number) => true;
    const edgeUsable = (_a: number, _b: number) => true;
    const ROUTE = [startIdx(0)];

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
    const IDEA_HOLD = 1600;
    const MORPH_DUR = 5600;
    const BACK_DUR = 1800;
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
    const currentHaloSegs = makeCurrentLayerSegments(0.06, 0.7, 0x9fdcff, CURRENT_SEGMENTS);

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
    // would stall the schedule cycle permanently, not just the sway.
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
