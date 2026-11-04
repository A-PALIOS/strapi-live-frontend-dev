'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Stage } from './ImpactBanner';
import styles from './DigitalSolutionsBanner.module.css';

/**
 * DigitalSolutionsBanner — "Digital Solutions & Innovation"
 * ----------------------------------------------------------
 * The ninth HeroSection3D variant, and like strategy/policy/feasibility/
 * projects/capacity it has no rotating stages; the cycle starts only once the
 * banner scrolls into view (IntersectionObserver), never on page load.
 *
 * Cycle: a fixed field of tiny dashes covers the banner, unseen, and a soft
 * bubble following the pointer reveals the ones it passes over; with no
 * pointer it wanders by itself (~7s) -> the bubble collapses into a dot grid
 * on the left, which resolves into six dashed panels (the /digital page
 * layout), the dots of each forming that service's icon (~6s) -> the tagline
 * reveals word by word -> holds -> the panels turn on their axis and the dots
 * fly back into the bubble (~3.4s) -> loops.
 *
 * Dragging rotates the shape and pauses the cycle. The current drawn along a
 * panel edge is mouse-only (`touchDrag`): on a touch screen there is no hover,
 * so the line would appear from nowhere under the finger.
 *
 * CMS copy: takes the same `stages` prop as the other variants but uses only
 * the FIRST entry — headline becomes the tagline's h2, sub becomes the
 * paragraph. `autoAdvanceMs` maps to how long the finished panels hold.
 *
 * Responsive: on portrait screens up to 1024px the shape stays horizontal and
 * sits directly under the MEASURED bottom of the tagline, so it never collides
 * with copy of an unexpected length; the banner is 4/3 on tablets, 1/1 on
 * phones.
 *
 * Touch: `touch-action: pan-y` on the canvas so a horizontal drag rotates the
 * shape while a vertical swipe still scrolls the page, plus pointercancel
 * handling — without it a cancelled touch leaves isDragging true, which stalls
 * the cycle for good.
 *
 * Requires `three` (already a dependency of this project). The "Agenda"
 * typeface is loaded site-wide in app/layout.tsx.
 */

type DigitalSolutionsBannerProps = {
  /** Only the first entry is used: headline -> h2, sub -> paragraph. */
  stages?: Stage[];
  /** How long the finished panels hold before scattering (default 4500ms). */
  autoAdvanceMs?: number;
  /** Optional extra classes on the outer wrapper (the component sizes itself). */
  className?: string;
};

const DEFAULT_TAGLINE = {
  headline: 'From data to tools that work.',
  sub: 'Dashboards, platforms, and automations, built in-house around how you work.',
};

const DEFAULT_CLEAR_HOLD_MS = 4500;

export default function DigitalSolutionsBanner({
  stages,
  autoAdvanceMs,
  className,
}: DigitalSolutionsBannerProps) {
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
    // Raw data becoming tools people use. A fixed field of tiny dashes
    // covers the whole banner, unseen. A soft bubble follows the pointer and
    // reveals the dashes it passes over: the dashes never move, only the
    // bubble does, wobbling as it goes. Then the bubble collapses into a
    // grid of dots on the left, which resolves into six dashed panels, the
    // same layout as the /digital page. To loop, the panels turn on their
    // axis and the dots fly back into the bubble.
    const W = 9.2;
    const H = 5.0;
    const GAP_T = 0.24;
    const COLS = 4;
    const ROWS = 3;
    const CW = (W - GAP_T * (COLS - 1)) / COLS;
    const CH = (H - GAP_T * (ROWS - 1)) / ROWS;
    const TILES = (
      [
        [0, 0, 1, 1], // Data Management
        [1, 0, 1, 1], // Dashboards
        [2, 0, 2, 2], // AI Solutions
        [0, 1, 2, 2], // Website Development
        [2, 2, 1, 1], // UI/UX Design
        [3, 2, 1, 1], // Automations
      ] as const
    ).map(([c, r, cs, rs]) => {
      const x0 = -W / 2 + c * (CW + GAP_T);
      const y1 = H / 2 - r * (CH + GAP_T);
      const w = cs * CW + (cs - 1) * GAP_T;
      const h = rs * CH + (rs - 1) * GAP_T;
      return { x0, x1: x0 + w, y0: y1 - h, y1 };
    });
    const TILE_COUNT = TILES.length;
    const TILE_ORDER = [0, 1, 3, 2, 4, 5];
    const DASH = 0.24;
    const GAP = 0.17;
    const v3 = (x: number, y: number) => new THREE.Vector3(x, y, 0);

    const net = new THREE.Group();
    shapeGroup.add(net);

    // anchors for the drag current, one per panel corner
    const uniqueVerts: THREE.Vector3[] = [];
    TILES.forEach((t) =>
      uniqueVerts.push(v3(t.x0, t.y1), v3(t.x1, t.y1), v3(t.x1, t.y0), v3(t.x0, t.y0)),
    );
    const NODE_COUNT = uniqueVerts.length;
    const nodeBase = new Array<number>(NODE_COUNT).fill(0.34);
    const flashBoost = new Array<number>(NODE_COUNT).fill(0);

    const PORTRAIT_QUERY = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
    function applyResponsiveShape() {
      if (PORTRAIT_QUERY.matches) {
        // narrow screens keep the shape horizontal and simply scale it to
        // fit under the text, it never turns on its side
        const NODE_GLOW = 0.3;
        const left = 4.6 + NODE_GLOW;
        const right = 4.6 + NODE_GLOW;
        const halfShape = 2.5 + NODE_GLOW;
        const halfH = Math.tan(((camera.fov / 2) * Math.PI) / 180) * camera.position.z;
        const halfW = halfH * camera.aspect;
        const bottom = -halfH * 0.9;
        // measured, so the shape always sits right under the text
        const bannerRect = bannerEl.getBoundingClientRect();
        const textBottom =
          (taglineSub.getBoundingClientRect().bottom - bannerRect.top) / (bannerRect.height || 1);
        const top = halfH * (1 - 2 * textBottom) - 0.3;
        const scale = Math.min(
          0.8,
          (halfW * 1.84) / (left + right),
          (top - bottom) / (halfShape * 2),
        );
        shapeGroup.position.x = ((left - right) / 2) * scale;
        shapeGroup.position.y = top - halfShape * scale;
        shapeGroup.rotation.z = 0;
        shapeGroup.scale.setScalar(scale);
      } else {
        shapeGroup.position.x = -4.7;
        shapeGroup.position.y = 0;
        shapeGroup.rotation.z = 0;
        shapeGroup.scale.setScalar(0.85);
      }
    }
    applyResponsiveShape();
    PORTRAIT_QUERY.addEventListener('change', applyResponsiveShape);
    const handleOrientationChange = () => setTimeout(applyResponsiveShape, 50);
    window.addEventListener('orientationchange', handleOrientationChange);
    // the portrait fit is measured from the rendered tagline, so it has to be
    // taken again once the webfont swaps in and the text reflows
    if (document.fonts?.ready) void document.fonts.ready.then(applyResponsiveShape);

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
    function makeDashTexture() {
      const size = 32;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(c);
      const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        size * 0.28,
        size / 2,
        size / 2,
        size / 2,
      );
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(c);
    }
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodeSprites = uniqueVerts.map((v) => {
      const sprite = new THREE.Sprite(spriteMat.clone());
      sprite.position.copy(v);
      sprite.visible = false;
      shapeGroup.add(sprite);
      return sprite;
    });

    // ---- the dots ----
    type Dot = {
      gx: number;
      gy: number;
      ang: number;
      rad: number;
      cz: number;
      seed: number;
      bright: number;
      tile: number;
      /** where this dot goes once its panel's icon forms; unset = stays put */
      ix?: number;
      iy?: number;
    };
    const STEP = 0.14;
    const dots: Dot[] = [];
    function tileAt(x: number, y: number) {
      for (let i = 0; i < TILE_COUNT; i++) {
        const t = TILES[i];
        if (x > t.x0 + 0.08 && x < t.x1 - 0.08 && y > t.y0 + 0.08 && y < t.y1 - 0.08) return i;
      }
      return -1;
    }
    // seeded so every visit gets the same cloud
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let gy = H / 2; gy >= -H / 2 - 0.001; gy -= STEP) {
      for (let gx = -W / 2; gx <= W / 2 + 0.001; gx += STEP) {
        // most dots stay hidden in the cloud and only appear for the grid
        dots.push({
          gx,
          gy,
          ang: rand() * Math.PI * 2,
          rad: 3.4 + rand() * 0.6,
          cz: (rand() - 0.5) * 1.6,
          seed: rand() * 6.28,
          bright: 0.45 + rand() * 0.55,
          tile: tileAt(gx, gy),
        });
      }
    }
    // ---- an icon for each service, drawn by the dots of its panel ----
    type Pt = [number, number];
    function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): Pt[] {
      const n = 28;
      const pts: Pt[] = [];
      for (let i = 0; i <= n; i++) {
        const a = a0 + ((a1 - a0) * i) / n;
        pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
      }
      return pts;
    }
    const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
      [x0, y0],
    ];
    const PI = Math.PI;
    const gear: Pt[] = (() => {
      const pts: Pt[] = [];
      const teeth = 8;
      for (let i = 0; i < teeth; i++) {
        const a = (i / teeth) * PI * 2;
        const w = (PI / teeth) * 0.5;
        (
          [
            [0.74, -w * 1.5],
            [1, -w * 0.8],
            [1, w * 0.8],
            [0.74, w * 1.5],
          ] as Pt[]
        ).forEach(([r, o]) => pts.push([Math.cos(a + o) * r, Math.sin(a + o) * r]));
      }
      pts.push(pts[0]);
      return pts;
    })();
    const ICONS: Pt[][][] = [
      // Data Management: a database
      [
        arc(0, 0.68, 0.74, 0.27, 0, PI * 2),
        arc(0, 0, 0.74, 0.27, PI, PI * 2),
        arc(0, -0.68, 0.74, 0.27, PI, PI * 2),
        [
          [-0.74, 0.68],
          [-0.74, -0.68],
        ],
        [
          [0.74, 0.68],
          [0.74, -0.68],
        ],
      ],
      // Dashboards: a bar chart
      [rect(-0.82, -0.86, -0.36, 0.05), rect(-0.23, -0.86, 0.23, 0.82), rect(0.36, -0.86, 0.82, -0.28)],
      // AI Solutions: sparkles
      [
        [
          [0, 0.95],
          [0.2, 0.2],
          [0.95, 0],
          [0.2, -0.2],
          [0, -0.95],
          [-0.2, -0.2],
          [-0.95, 0],
          [-0.2, 0.2],
          [0, 0.95],
        ],
        [
          [0.72, 0.98],
          [0.79, 0.77],
          [1, 0.7],
          [0.79, 0.63],
          [0.72, 0.42],
          [0.65, 0.63],
          [0.44, 0.7],
          [0.65, 0.77],
          [0.72, 0.98],
        ],
      ],
      // Website Development: a browser window
      [
        rect(-1.15, -0.8, 1.15, 0.8),
        [
          [-1.15, 0.42],
          [1.15, 0.42],
        ],
        arc(-0.92, 0.61, 0.07, 0.07, 0, PI * 2),
        arc(-0.68, 0.61, 0.07, 0.07, 0, PI * 2),
        arc(-0.44, 0.61, 0.07, 0.07, 0, PI * 2),
      ],
      // UI/UX Design: a cursor
      [
        [
          [-0.62, 1.05],
          [-0.62, -0.55],
          [-0.22, -0.2],
          [0.1, -0.98],
          [0.4, -0.85],
          [0.08, -0.08],
          [0.62, -0.08],
          [-0.62, 1.05],
        ],
      ],
      // Automations: a gear
      [gear, arc(0, 0, 0.34, 0.34, 0, PI * 2)],
    ];
    ICONS.forEach((strokes, t) => {
      const tile = TILES[t];
      const cx = (tile.x0 + tile.x1) / 2;
      const cy = (tile.y0 + tile.y1) / 2;
      const scale = Math.min(tile.x1 - tile.x0, tile.y1 - tile.y0) * 0.33;
      const SPACING_I = 0.085;
      const targets: Pt[] = [];
      strokes.forEach((pts) => {
        let carry = 0;
        for (let i = 0; i < pts.length - 1; i++) {
          const ax = cx + pts[i][0] * scale;
          const ay = cy + pts[i][1] * scale;
          const bx = cx + pts[i + 1][0] * scale;
          const by = cy + pts[i + 1][1] * scale;
          const len = Math.hypot(bx - ax, by - ay);
          let d = carry;
          while (d < len) {
            targets.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]);
            d += SPACING_I;
          }
          carry = d - len;
        }
      });
      const pool = dots.filter((d) => d.tile === t);
      targets.forEach(([x, y]) => {
        let best: Dot | null = null;
        let bestD = Infinity;
        pool.forEach((d) => {
          if (d.ix !== undefined) return;
          const dd = (d.gx - x) ** 2 + (d.gy - y) ** 2;
          if (dd < bestD) {
            bestD = dd;
            best = d;
          }
        });
        if (best) {
          // narrowed through a local: TS loses `best`'s type across the
          // forEach closure above and widens it back to never otherwise
          const chosen: Dot = best;
          chosen.ix = x;
          chosen.iy = y;
        }
      });
    });

    const DOT_COUNT = dots.length;
    const TOTAL = DOT_COUNT;
    const dotPlane = new THREE.PlaneGeometry(1, 1);
    const dotMat = new THREE.MeshBasicMaterial({
      map: makeDashTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    // brightness goes into alpha: the canvas is transparent, so a dim dot
    // drawn with a dark colour would show as a dark speck on the page
    dotMat.onBeforeCompile = (shader: { fragmentShader: string }) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
    float colourLevel = max(max(vColor.r, vColor.g), max(vColor.b, 0.0001));
    diffuseColor.a *= colourLevel;
    diffuseColor.rgb = vColor.rgb / colourLevel;`,
      );
    };
    const dotMesh = new THREE.InstancedMesh(dotPlane, dotMat, TOTAL);
    dotMesh.frustumCulled = false;
    dotMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const _white = new THREE.Color(1, 1, 1);
    for (let i = 0; i < TOTAL; i++) dotMesh.setColorAt(i, _white);
    // setColorAt() above is what allocates instanceColor, so it is non-null
    // from here on — three types it as nullable because it is empty until then
    const dotColorAttr = dotMesh.instanceColor as THREE.InstancedBufferAttribute;
    dotColorAttr.setUsage(THREE.DynamicDrawUsage);
    net.add(dotMesh);

    // the field: fixed in the world, independent of the shape's tilt
    const SPACING = 0.42;
    const fieldDots: { x: number; y: number }[] = [];
    for (let fy = -3.9; fy <= 3.9; fy += SPACING) {
      for (let fx = -11; fx <= 11; fx += SPACING) {
        fieldDots.push({
          x: fx + (Math.round(fy / SPACING) % 2) * (SPACING / 2) + (rand() - 0.5) * 0.08,
          y: fy + (rand() - 0.5) * 0.08,
        });
      }
    }
    const fieldMesh = new THREE.InstancedMesh(dotPlane, dotMat, fieldDots.length);
    fieldMesh.frustumCulled = false;
    fieldMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < fieldDots.length; i++) fieldMesh.setColorAt(i, _white);
    const fieldColorAttr = fieldMesh.instanceColor as THREE.InstancedBufferAttribute;
    fieldColorAttr.setUsage(THREE.DynamicDrawUsage);
    scene.add(fieldMesh);
    const fmArr = fieldMesh.instanceMatrix.array as Float32Array;
    const fcArr = fieldColorAttr.array as Float32Array;
    const mArr = dotMesh.instanceMatrix.array as Float32Array;
    const cArr = dotColorAttr.array as Float32Array;
    function writeDot(
      i: number,
      x: number,
      y: number,
      z: number,
      angle: number,
      sx: number,
      sy: number,
      b: number,
    ) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const o = i * 16;
      mArr[o] = c * sx; mArr[o + 1] = s * sx; mArr[o + 2] = 0; mArr[o + 3] = 0;
      mArr[o + 4] = -s * sy; mArr[o + 5] = c * sy; mArr[o + 6] = 0; mArr[o + 7] = 0;
      mArr[o + 8] = 0; mArr[o + 9] = 0; mArr[o + 10] = 1; mArr[o + 11] = 0;
      mArr[o + 12] = x; mArr[o + 13] = y; mArr[o + 14] = z; mArr[o + 15] = 1;
      cArr[i * 3] = cArr[i * 3 + 1] = cArr[i * 3 + 2] = b;
    }

    // ---- panels: dashed outlines, drawn by a moving circle ----
    const UP = new THREE.Vector3(0, 1, 0);
    const _dir = new THREE.Vector3();
    const dashGeo = new THREE.CylinderGeometry(0.0055, 0.0055, 1, 6);
    function addDash(a: THREE.Vector3, b: THREE.Vector3, material: THREE.MeshBasicMaterial) {
      const mesh: BasicMesh = new THREE.Mesh(dashGeo, material);
      _dir.subVectors(b, a);
      const len = _dir.length();
      mesh.position.addVectors(a, b).multiplyScalar(0.5);
      mesh.scale.set(1, len, 1);
      mesh.quaternion.setFromUnitVectors(UP, _dir.normalize());
      mesh.visible = false;
      net.add(mesh);
      return mesh;
    }
    // Held in an array parallel to TILES rather than attached onto each tile
    // object: assigning these afterwards would make every property optional
    // for the rest of the file, forcing a null check at each use.
    type Panel = {
      corners: THREE.Vector3[];
      mat: THREE.MeshBasicMaterial;
      dashes: { mesh: BasicMesh; at: number }[];
      per: number;
      legs: { from: THREE.Vector3; to: THREE.Vector3; len: number; at: number }[];
    };
    const panels: Panel[] = TILES.map((t) => {
      const c = [v3(t.x0, t.y1), v3(t.x1, t.y1), v3(t.x1, t.y0), v3(t.x0, t.y0)];
      const panel: Panel = {
        corners: c,
        mat: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 }),
        dashes: [],
        per: 0,
        legs: [],
      };
      c.forEach((from, i) => {
        const to = c[(i + 1) % 4];
        const len = from.distanceTo(to);
        const count = Math.max(1, Math.round((len + GAP) / (DASH + GAP)));
        const step = (len + GAP) / count;
        for (let k = 0; k < count; k++) {
          const a = from.clone().lerp(to, (k * step) / len);
          const b = from.clone().lerp(to, (k * step + step - GAP) / len);
          panel.dashes.push({ mesh: addDash(a, b, panel.mat), at: panel.per + k * step });
        }
        panel.legs.push({ from, to, len, at: panel.per });
        panel.per += len;
      });
      return panel;
    });
    // what draws the panels: only a faint glint of light at the line's tip
    const pen = new THREE.Sprite(spriteMat.clone());
    pen.material.opacity = 0.32;
    pen.scale.setScalar(0.26);
    pen.visible = false;
    net.add(pen);

    // ---- single source of truth for the shape ----
    let gridP = 0; // 0 cloud, 1 grid
    let scatter = 0; // loop: 1 = back in the cloud
    let doneA = 0;
    const tileT = new Array<number>(TILE_COUNT).fill(0);

    function applyProgress(p: number) {
      gridP = clamp01(p / 0.4);
      scatter = 0;
      doneA = p >= 1 ? 1 : 0;
      const span = 0.58 / TILE_COUNT;
      pen.visible = false;
      TILE_ORDER.forEach((id, order) => {
        const t = clamp01((p - 0.42 - order * span) / span);
        const panel = panels[id];
        tileT[id] = t;
        panel.mat.opacity = 1;
        const drawn = t * panel.per;
        panel.dashes.forEach((d) => (d.mesh.visible = t > 0 && drawn >= d.at));
        if (t > 0 && t < 1) {
          pen.visible = true;
          for (let i = 3; i >= 0; i--) {
            const leg = panel.legs[i];
            if (drawn >= leg.at) {
              pen.position.lerpVectors(leg.from, leg.to, clamp01((drawn - leg.at) / leg.len));
              break;
            }
          }
        }
      });
      net.rotation.set(0, 0, 0);
    }
    function applyFade(rawT: number) {
      const t = easeInOut(clamp01(rawT / 0.92));
      net.rotation.y = t * Math.PI * 2;
      net.rotation.x = Math.sin(t * Math.PI) * 0.4;
      const gone = clamp01((rawT - 0.25) / 0.45);
      panels.forEach((panel) => (panel.mat.opacity = 1 - gone));
      doneA = 1 - gone;
      scatter = easeInOut(clamp01((rawT - 0.3) / 0.7));
      if (rawT >= 1) applyProgress(0);
    }
    applyProgress(0);

    // ---- the pointer ring ----
    const pointer = { active: false, x: 0, y: 0, sx: -4.7, sy: 0, seen: false };
    const _bubble = new THREE.Vector3();
    const _ray = new THREE.Raycaster();
    const _plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const _ndc = new THREE.Vector2();
    const _hit = new THREE.Vector3();
    function handleHover(e: PointerEvent) {
      const r = canvas.getBoundingClientRect();
      _ndc.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -(((e.clientY - r.top) / r.height) * 2 - 1),
      );
      _ray.setFromCamera(_ndc, camera);
      if (_ray.ray.intersectPlane(_plane, _hit)) {
        pointer.x = _hit.x;
        pointer.y = _hit.y;
        pointer.active = true;
      }
    }
    function handleLeave() {
      pointer.active = false;
    }
    canvas.addEventListener('pointermove', handleHover);
    canvas.addEventListener('pointerleave', handleLeave);

    const COL_A = [1, 1, 1];
    const COL_B = [0.62, 0.87, 1];
    const COL_C = [0.12, 0.6, 0.98];
    function updateField(sec: number, strength: number) {
      const BUBBLE_R = 3.0;
      const EDGE = 1.15;
      fieldMesh.visible = strength > 0.002;
      if (!fieldMesh.visible) return;
      for (let i = 0; i < fieldDots.length; i++) {
        const p = fieldDots[i];
        const ox = p.x - pointer.sx;
        const oy = p.y - pointer.sy;
        const dist = Math.hypot(ox, oy) || 1e-4;
        const th = Math.atan2(oy, ox);
        // the wobble that makes it a bubble and not a hoop
        const rim = BUBBLE_R + 0.5 * Math.sin(3 * th + sec * 1.1) + 0.3 * Math.sin(5 * th - sec * 1.6);
        const q = (dist - rim) / EDGE;
        const ripple = 0.5 + 0.5 * Math.sin(dist * 2.2 - sec * 1.8);
        const f = Math.exp(-q * q) * (0.35 + 0.65 * ripple) * strength;
        const roll = 0.5 + 0.5 * Math.sin(2 * th - sec * 0.9);
        const sx = 0.05 * (0.55 + 0.45 * f);
        const sy = f < 0.01 ? 0 : 0.05 + 0.2 * f;
        const a = th - Math.PI / 2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        const o = i * 16;
        fmArr[o] = c * sx; fmArr[o + 1] = s * sx; fmArr[o + 2] = 0; fmArr[o + 3] = 0;
        fmArr[o + 4] = -s * sy; fmArr[o + 5] = c * sy; fmArr[o + 6] = 0; fmArr[o + 7] = 0;
        fmArr[o + 8] = 0; fmArr[o + 9] = 0; fmArr[o + 10] = 1; fmArr[o + 11] = 0;
        fmArr[o + 12] = p.x; fmArr[o + 13] = p.y; fmArr[o + 14] = 0; fmArr[o + 15] = 1;
        const from = roll < 0.5 ? COL_A : COL_B;
        const to = roll < 0.5 ? COL_B : COL_C;
        const m = roll < 0.5 ? roll * 2 : (roll - 0.5) * 2;
        const al = Math.min(1, f * 0.6);
        for (let k = 0; k < 3; k++) fcArr[i * 3 + k] = (from[k] + (to[k] - from[k]) * m) * al;
      }
      fieldMesh.instanceMatrix.needsUpdate = true;
      fieldColorAttr.needsUpdate = true;
    }

    function updatePulses(now: number) {
      const sec = now / 1000;
      // the bubble trails the pointer; left alone, it wanders by itself
      const home = shapeGroup.position.x;
      const homeY = shapeGroup.position.y;
      const tx = pointer.active ? pointer.x : home + Math.sin(sec * 0.4) * 2.4;
      const ty = pointer.active ? pointer.y : homeY + Math.cos(sec * 0.31) * 0.9;
      pointer.sx += (tx - pointer.sx) * 0.06;
      pointer.sy += (ty - pointer.sy) * 0.06;
      _bubble.set(pointer.sx, pointer.sy, 0);
      net.worldToLocal(_bubble);
      const fieldA = Math.max(1 - gridP, scatter);
      updateField(sec, fieldA);
      const wavePos = ((sec * 0.28) % 1) * (W + 3) - W / 2 - 1.5;
      for (let i = 0; i < DOT_COUNT; i++) {
        const d = dots[i];
        // left to right as the dots settle
        const stagger = ((d.gx + W / 2) / W) * 0.45;
        const g = easeInOut(clamp01((gridP - stagger) / 0.55)) * (1 - scatter);
        const cx = _bubble.x + Math.cos(d.ang) * d.rad;
        const cy = _bubble.y + Math.sin(d.ang) * d.rad;
        // once its panel is drawn, a dot leaves the grid for its place in the icon
        const toIcon = d.ix !== undefined ? easeInOut(tileT[d.tile]) : 0;
        const tx0 = toIcon && d.ix !== undefined ? d.gx + (d.ix - d.gx) * toIcon : d.gx;
        const ty0 = toIcon && d.iy !== undefined ? d.gy + (d.iy - d.gy) * toIcon : d.gy;
        const x = cx + (tx0 - cx) * g;
        const y = cy + (ty0 - cy) * g;
        const z = d.cz * (1 - g);

        const flight = Math.sin(Math.PI * g); // the dots show while they fly in
        let b = 0.5 * flight + 0.22 * g;
        if (d.tile >= 0) {
          const lit = tileT[d.tile];
          const wave = Math.exp(-Math.pow((d.gx + d.gy * 0.4 - wavePos) / 0.55, 2));
          const rest = d.ix !== undefined ? 1 : 0.03 + 0.2 * wave * doneA;
          b = b + (rest - b) * lit * (1 - scatter);
        } else {
          const allGone = Math.min(
            tileT[0], tileT[1], tileT[2], tileT[3], tileT[4], tileT[5],
          );
          b *= 1 - allGone * (1 - scatter);
        }
        writeDot(i, x, y, z, d.ang - Math.PI / 2, 0.05, 0.05 * (1 + 2.4 * flight), b);
      }
      dotMesh.instanceMatrix.needsUpdate = true;
      dotColorAttr.needsUpdate = true;
    }

    // current for drag: around each panel, once it exists
    const ADJACENCY = Array.from({ length: NODE_COUNT }, () => new Set<number>());
    function link(a: number, b: number) {
      ADJACENCY[a].add(b);
      ADJACENCY[b].add(a);
    }
    for (let t = 0; t < TILE_COUNT; t++) {
      for (let i = 0; i < 4; i++) link(t * 4 + i, t * 4 + ((i + 1) % 4));
    }
    // unlike the other variants this one really does gate: a panel's corners
    // are only reachable once that panel has been drawn
    const nodeUsable = (i: number) => tileT[Math.floor(i / 4)] > 0.5;
    const edgeUsable = (_a: number, _b: number) => true;
    const ROUTE = [0];

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
    const IDEA_HOLD = 7000;
    const MORPH_DUR = 6000;
    const BACK_DUR = 3400;
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
      const r = canvas.getBoundingClientRect();
      return {
        x: ((clientX - r.left) / r.width) * 2 - 1,
        y: -(((clientY - r.top) / r.height) * 2 - 1),
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
      if (touchDrag) {
        currentCoreSegs.forEach((m) => (m.visible = false));
        currentHaloSegs.forEach((m) => (m.visible = false));
        return;
      }
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
    let touchDrag = false; // the drawn line is for mouse users only
    let prevX = 0;
    let prevY = 0;
    /** A held pointer that stops reporting movement for this long is abandoned. */
    const STUCK_DRAG_MS = 6000;

    function handlePointerDown(e: PointerEvent) {
      isDragging = true;
      touchDrag = e.pointerType !== 'mouse';
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
    // would stall the whole cycle permanently, not just the sway.
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
      // a cancelled touch never fires pointerleave, so the bubble would
      // otherwise stay pinned where the finger left it
      pointer.active = false;
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
        const amp = phase === 'idea' ? 0 : 0.3;
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
      canvas.removeEventListener('pointermove', handleHover);
      canvas.removeEventListener('pointerleave', handleLeave);

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
