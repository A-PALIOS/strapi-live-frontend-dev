'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Stage } from './ImpactBanner';
import styles from './FeasibilityBanner.module.css';

/**
 * FeasibilityBanner — "Feasibility & Service Design Studies"
 * ----------------------------------------------------------
 * The sixth HeroSection3D variant. Like StrategicPlanningBanner and
 * HealthPolicyBanner it has no rotating stages: the cycle starts only once the
 * banner scrolls into view (IntersectionObserver), never on page load.
 *
 * Cycle: five dashed scenario lines with circles running along them, each
 * lighting the end of its line on arrival (~4s) -> the lines dim to a faint
 * backdrop while one dashed route draws itself across them to a goal ring
 * (~2.6s) -> the tagline reveals word by word -> holds -> plays back -> loops.
 * Dragging rotates the shape, draws a current along its edges, and pauses the
 * cycle until released.
 *
 * CMS copy: takes the same `stages` prop as the other variants but uses only
 * the FIRST entry — headline becomes the tagline's h2, sub becomes the
 * paragraph. `autoAdvanceMs` maps to how long the solved route holds.
 *
 * Responsive layout matches the other variants:
 *   - Desktop / wide landscape: the block of scenario lines sits left, the
 *     route ends beside a container-query-sized (cqw) text column on the right.
 *   - Tablet/phone portrait (<=1024px): the shape turns 90° to run up toward
 *     the text above it, fitted to the camera frustum by trigonometry rather
 *     than a width-based guess (see applyResponsiveShape).
 *   - Phone portrait (<=600px): full-viewport-height hero with a steeper type
 *     ramp.
 *   - Narrow landscape (<=900px): keeps the wide orientation.
 *
 * Touch: `touch-action: pan-y` on the canvas so a horizontal drag rotates the
 * shape while a vertical swipe still scrolls the page, plus pointercancel
 * handling — without it a cancelled touch leaves isDragging true, which stalls
 * the cycle for good.
 *
 * Requires `three` (already a dependency of this project). The "Agenda"
 * typeface is loaded site-wide in app/layout.tsx.
 */

type FeasibilityBannerProps = {
  /** Only the first entry is used: headline -> h2, sub -> paragraph. */
  stages?: Stage[];
  /** How long the solved route holds before playing back (default 4500ms). */
  autoAdvanceMs?: number;
  /** Optional extra classes on the outer wrapper (the component sizes itself). */
  className?: string;
};

const DEFAULT_TAGLINE = {
  headline: 'Finding the path that works.',
  sub: 'Scenarios, service models, and patient pathways, tested before you commit.',
};

const DEFAULT_CLEAR_HOLD_MS = 4500;

export default function FeasibilityBanner({
  stages,
  autoAdvanceMs,
  className,
}: FeasibilityBannerProps) {
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
    // Five parallel scenarios run left to right into one shared test
    // line. They then dim to a faint backdrop and one route lights up,
    // crossing between them through the nodes that held up, to a goal.
    // Every state is derived from one progress value, so the reverse
    // transition is the same animation played backwards.
    const LANE_COUNT = 5;
    const LANE_Y = [2.3, 1.15, 0, -1.15, -2.3];
    const LANE_Z = [0.3, -0.25, 0, 0.25, -0.3];
    const START_X = [-4.8, -5.4, -5.7, -5.4, -4.8];
    const TEST_X = 3.0;
    const TIP_X = 4.5;
    const COL_X: number[][] = [
      [0, -2.5, 0.5, 0],
      [0, -1.9, 0.9, 0],
      [0, -2.2, 0.3, 0],
      [0, -1.7, 0.8, 0],
      [0, -2.4, 0.4, 0],
    ];

    const COLS = 4;
    const NODE_COUNT = LANE_COUNT * COLS + 1;
    const GOAL = NODE_COUNT - 1;
    const nodeAt = (l: number, c: number) => l * COLS + c;
    const startIdx = (l: number) => nodeAt(l, 0);
    const endIdx = (l: number) => nodeAt(l, COLS - 1);
    // the lit route: lane 3 -> up across to lane 1 -> down to lane 2 -> goal
    const ROUTE = [nodeAt(3, 0), nodeAt(3, 1), nodeAt(1, 2), nodeAt(2, 3), GOAL];
    const SMALL_NODE = 0.36;
    const END_NODE = 0.46;

    const uniqueVerts = Array.from({ length: NODE_COUNT }, () => new THREE.Vector3());
    const nodeAlpha = new Array<number>(NODE_COUNT).fill(1);
    // annotated: without it TS infers (0.36 | 0.46)[] from the literal
    // ternary below, and the goal node's animated size cannot be assigned
    const nodeBase: number[] = uniqueVerts.map((_, i) => {
      const c = i % COLS;
      return i !== GOAL && (c === 1 || c === 2) ? SMALL_NODE : END_NODE;
    });
    for (let l = 0; l < LANE_COUNT; l++) {
      uniqueVerts[nodeAt(l, 0)].set(START_X[l], LANE_Y[l], LANE_Z[l]);
      uniqueVerts[nodeAt(l, 1)].set(COL_X[l][1], LANE_Y[l], LANE_Z[l]);
      uniqueVerts[nodeAt(l, 2)].set(COL_X[l][2], LANE_Y[l], LANE_Z[l]);
      uniqueVerts[nodeAt(l, 3)].set(TEST_X, LANE_Y[l], LANE_Z[l]);
    }
    uniqueVerts[GOAL].set(TIP_X, 0, 0);

    // desktop: block sits left, the route ends beside the text.
    // portrait: rotated 90 degrees to run up toward the text, fitted to the
    // frustum the same way the Health Policy banner is.
    const PORTRAIT_QUERY = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
    function applyResponsiveShape() {
      if (PORTRAIT_QUERY.matches) {
        const NODE_GLOW = 0.4;
        const back = 5.7 + NODE_GLOW;
        const forward = TIP_X + NODE_GLOW;
        const sideways = 2.3 + NODE_GLOW;
        const tanHalfFov = Math.tan(((camera.fov / 2) * Math.PI) / 180);
        let scale = 0.5;
        let halfH = 0;
        let bottom = 0;
        let top = 0;
        for (let pass = 0; pass < 4; pass++) {
          const nearest = camera.position.z - sideways * scale;
          halfH = tanHalfFov * nearest;
          bottom = -halfH * 0.95;
          top = halfH * 0.5;
          scale = Math.min(
            0.7,
            (top - bottom) / (back + forward),
            (halfH * camera.aspect * 0.92) / sideways,
          );
        }
        shapeGroup.position.x = 0;
        shapeGroup.position.y = (bottom + top) / 2 - ((forward - back) / 2) * scale;
        shapeGroup.rotation.z = Math.PI / 2;
        shapeGroup.scale.setScalar(scale);
      } else {
        shapeGroup.position.x = -4.2;
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
      g.addColorStop(0.25, 'rgba(255,226,194,0.9)');
      g.addColorStop(1, 'rgba(255,226,194,0)');
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
    const nodeSprites = uniqueVerts.map(() => {
      const sprite = new THREE.Sprite(spriteMat.clone());
      shapeGroup.add(sprite);
      return sprite;
    });

    // ---- lines: thin cylinders, because a 1px GL line disappears on
    // the bright end of the orange gradient ----
    const UP = new THREE.Vector3(0, 1, 0);
    const _dir = new THREE.Vector3();
    function makeSegment(material: THREE.MeshBasicMaterial, radius: number): BasicMesh {
      const geo = new THREE.CylinderGeometry(radius, radius, 1, 6);
      const mesh = new THREE.Mesh(geo, material);
      shapeGroup.add(mesh);
      return mesh;
    }
    function setSegment(mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) {
      _dir.subVectors(b, a);
      const len = _dir.length();
      mesh.position.addVectors(a, b).multiplyScalar(0.5);
      mesh.scale.set(1, Math.max(len, 0.0001), 1);
      if (len > 1e-5) mesh.quaternion.setFromUnitVectors(UP, _dir.normalize());
    }

    type Dash = {
      from: THREE.Vector3;
      to: THREE.Vector3;
      startAt: number;
      length: number;
      mesh: BasicMesh;
    };

    // every line in the shape is dashed. Each one is cut into whole dashes
    // so a dash always lands on both of its ends.
    const DASH = 0.24;
    const GAP = 0.17;
    function makeDashes(
      from: THREE.Vector3,
      to: THREE.Vector3,
      material: THREE.MeshBasicMaterial,
      radius: number,
      startAt?: number,
    ): Dash[] {
      const len = from.distanceTo(to);
      const count = Math.max(1, Math.round((len + GAP) / (DASH + GAP)));
      const step = (len + GAP) / count;
      const dash = step - GAP;
      const out: Dash[] = [];
      for (let k = 0; k < count; k++) {
        const s0 = k * step;
        const d: Dash = {
          from: from.clone().lerp(to, s0 / len),
          to: from.clone().lerp(to, (s0 + dash) / len),
          startAt: (startAt || 0) + s0,
          length: dash,
          mesh: makeSegment(material, radius),
        };
        setSegment(d.mesh, d.from, d.to);
        out.push(d);
      }
      return out;
    }
    const laneMats = LANE_Y.map(
      () => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 }),
    );
    // the stretch of lane the route later runs along: it fades out so the
    // backdrop's dashes never fill the gaps in the route's own dashes
    const underRouteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
    });
    const railMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
    });
    for (let l = 0; l < LANE_COUNT; l++) {
      if (l === 3) {
        makeDashes(uniqueVerts[nodeAt(l, 0)], uniqueVerts[nodeAt(l, 1)], underRouteMat, 0.014);
        makeDashes(uniqueVerts[nodeAt(l, 1)], uniqueVerts[endIdx(l)], laneMats[l], 0.014);
      } else {
        makeDashes(uniqueVerts[startIdx(l)], uniqueVerts[endIdx(l)], laneMats[l], 0.014);
      }
      if (l < LANE_COUNT - 1) {
        makeDashes(uniqueVerts[endIdx(l)], uniqueVerts[endIdx(l + 1)], railMat, 0.011);
      }
    }

    // ---- the lit route and its goal ring ----
    const routeLengths = ROUTE.slice(1).map((n, i) => uniqueVerts[ROUTE[i]].distanceTo(uniqueVerts[n]));
    const routeTotal = routeLengths.reduce((a, b) => a + b, 0);
    const routeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const routeDashes: Dash[] = [];
    (function buildRoute() {
      let at = 0;
      routeLengths.forEach((len, i) => {
        routeDashes.push(
          ...makeDashes(uniqueVerts[ROUTE[i]], uniqueVerts[ROUTE[i + 1]], routeMat, 0.016, at),
        );
        at += len;
      });
    })();
    function pointOnRoute(t: number, out: THREE.Vector3) {
      let d = clamp01(t) * routeTotal;
      for (let i = 0; i < routeLengths.length; i++) {
        if (d <= routeLengths[i] || i === routeLengths.length - 1) {
          return out.lerpVectors(
            uniqueVerts[ROUTE[i]],
            uniqueVerts[ROUTE[i + 1]],
            clamp01(d / routeLengths[i]),
          );
        }
        d -= routeLengths[i];
      }
      return out;
    }
    const goalRing: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial> = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.018, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }),
    );
    goalRing.position.copy(uniqueVerts[GOAL]);
    shapeGroup.add(goalRing);

    // ---- test pulses ----
    const pulseSprites = LANE_Y.map(() => {
      const s = new THREE.Sprite(spriteMat.clone());
      s.scale.setScalar(0.5);
      shapeGroup.add(s);
      return s;
    });
    const PULSE_SPEED = [0.34, 0.27, 0.38, 0.3, 0.25];
    const PULSE_OFFSET = [0.1, 0.55, 0.3, 0.8, 0.45];
    const lastU = new Array<number>(LANE_COUNT).fill(0);
    const flash = new Array<number>(LANE_COUNT).fill(0);
    const flashBoost = new Array<number>(NODE_COUNT).fill(0);

    // ---- single source of truth for the shape ----
    // progress 0 = five scenarios under test, 1 = one route found.
    const GHOST = 0.2; // what is left of a lane once it stops being a candidate
    const DIM_ORDER = [0, 4, 2, 1, 3];
    let routeT = 0;
    let goalT = 0;
    let railA = 1;
    const laneA = new Array<number>(LANE_COUNT).fill(1);
    const _a = new THREE.Vector3();

    function sumTo(i: number) {
      let d = 0;
      for (let k = 0; k < i; k++) d += routeLengths[k];
      return d;
    }

    function applyProgress(p: number) {
      for (let l = 0; l < LANE_COUNT; l++) {
        const t = easeInOut(clamp01((p - DIM_ORDER.indexOf(l) * 0.06) / 0.3));
        laneA[l] = 1 - (1 - GHOST) * t;
        for (let c = 0; c < COLS; c++) nodeAlpha[nodeAt(l, c)] = 0;
        nodeAlpha[endIdx(l)] = laneA[l]; // the block keeps its circles at the line ends
      }
      railA = laneA[0];
      routeT = easeInOut(clamp01((p - 0.3) / 0.58));
      goalT = easeInOut(clamp01((p - 0.86) / 0.14));

      laneMats.forEach((m, l) => (m.opacity = 0.75 * laneA[l]));
      underRouteMat.opacity = 0.75 * laneA[3] * (1 - clamp01(routeT * 8));
      railMat.opacity = 0.55 * railA;

      // draw the route up to routeT, one dash at a time
      const drawn = routeT * routeTotal;
      routeDashes.forEach((d) => {
        const f = clamp01((drawn - d.startAt) / d.length);
        d.mesh.visible = f > 0.001;
        if (d.mesh.visible) setSegment(d.mesh, d.from, _a.lerpVectors(d.from, d.to, f));
      });
      ROUTE.forEach((n, i) => {
        if (n === GOAL) return;
        const reached = i === 0 ? clamp01(routeT * 8) : clamp01((drawn - sumTo(i)) / 0.3 + 1);
        nodeAlpha[n] = n === endIdx(2) ? Math.max(laneA[2], reached) : reached;
        nodeBase[n] = i === 0 || i === ROUTE.length - 2 ? END_NODE : SMALL_NODE;
      });
      nodeAlpha[GOAL] = goalT;
      nodeBase[GOAL] = 0.9 + 0.5 * goalT;

      nodeSprites.forEach((s, i) => {
        s.position.copy(uniqueVerts[i]);
        s.material.opacity = nodeAlpha[i];
        s.visible = nodeAlpha[i] > 0.005;
      });
      goalRing.visible = goalT > 0.001;
      goalRing.material.opacity = goalT;
      goalRing.scale.setScalar(0.5 + 0.5 * goalT);
    }
    applyProgress(0);

    const routePulse = new THREE.Sprite(spriteMat.clone());
    routePulse.scale.setScalar(0.62);
    shapeGroup.add(routePulse);

    function updatePulses(now: number) {
      const sec = now / 1000;
      // the only moving circles: each one runs its lane, and on arrival
      // lights the end of it, which then fades back out
      pulseSprites.forEach((s, l) => {
        const a = clamp01((laneA[l] - GHOST) / (1 - GHOST));
        const u = (sec * PULSE_SPEED[l] + PULSE_OFFSET[l]) % 1;
        if (u < lastU[l]) flash[l] = 1;
        lastU[l] = u;
        flash[l] *= 0.965;
        s.position.lerpVectors(uniqueVerts[startIdx(l)], uniqueVerts[endIdx(l)], u);
        const fade = clamp01(u / 0.08);
        s.material.opacity = a * fade;
        s.visible = a * fade > 0.01;

        const n = endIdx(l);
        const lit = flash[l] * a;
        const o = Math.max(nodeAlpha[n], lit);
        nodeSprites[n].material.opacity = o;
        nodeSprites[n].visible = o > 0.005;
        flashBoost[n] = 0.6 * lit;
      });
      const u = (sec * 0.3) % 1;
      pointOnRoute(u, routePulse.position);
      routePulse.material.opacity = goalT * Math.sin(Math.PI * u);
      routePulse.visible = goalT > 0.01;
    }

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

    let phase: 'scenarios' | 'filtering' | 'clear' | 'restoring' = 'scenarios';
    let phaseStart = performance.now();
    const SCENARIO_HOLD = 4000;
    const MORPH_DUR = 2600;
    const CLEAR_HOLD = clearHoldMs;
    let lastFrameTimeForMorph = performance.now();
    let rotFromX = 0;
    let rotFromY = 0;

    function beginMorph(next: 'filtering' | 'restoring', now: number) {
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

      if (phase === 'scenarios' && elapsed > SCENARIO_HOLD) {
        beginMorph('filtering', now);
      } else if (phase === 'filtering') {
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
        const rawT = Math.min(1, elapsed / MORPH_DUR);
        applyProgress(1 - rawT);
        easeRotation(rawT);
        if (rawT >= 1) {
          phase = 'scenarios';
          phaseStart = now;
        }
      }
    }

    // ---------- traveling electric current (same as the other banners) ----------
    const ADJACENCY = Array.from({ length: NODE_COUNT }, () => new Set<number>());
    function link(a: number, b: number) {
      ADJACENCY[a].add(b);
      ADJACENCY[b].add(a);
    }
    for (let l = 0; l < LANE_COUNT; l++) {
      for (let c = 0; c < COLS - 1; c++) link(nodeAt(l, c), nodeAt(l, c + 1));
      if (l < LANE_COUNT - 1) link(endIdx(l), endIdx(l + 1));
    }
    const routeEdge = new Set<string>();
    for (let i = 0; i < ROUTE.length - 1; i++) {
      link(ROUTE[i], ROUTE[i + 1]);
      routeEdge.add(ROUTE[i] + ':' + ROUTE[i + 1]);
      routeEdge.add(ROUTE[i + 1] + ':' + ROUTE[i]);
    }
    const laneEdge = (a: number, b: number) => Math.floor(a / COLS) === Math.floor(b / COLS);
    const onRoute = (i: number) => ROUTE.includes(i);

    function nodeUsable(i: number) {
      if (i === GOAL) return goalT > 0.5;
      return goalT > 0.5 ? onRoute(i) : true;
    }
    // before the route exists its diagonals are not drawn, and after it
    // exists only its own edges are, so the current follows what is seen
    function edgeUsable(a: number, b: number) {
      if (goalT > 0.5) return routeEdge.has(a + ':' + b);
      return laneEdge(a, b) || (!routeEdge.has(a + ':' + b) && a !== GOAL && b !== GOAL);
    }

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
    const currentHaloSegs = makeCurrentLayerSegments(0.06, 0.7, 0xffe2c2, CURRENT_SEGMENTS);

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
    // would stall the scenario/route cycle permanently, not just the sway.
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
      if (!isDragging && phase !== 'filtering' && phase !== 'restoring') {
        const amp = phase === 'clear' ? 0.3 : 1;
        const targetY = Math.sin(now * 0.00055) * 0.34 * amp;
        const targetX = Math.sin(now * 0.00037) * 0.16 * amp;
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
