'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Stage } from './ImpactBanner';
import styles from './HealthPolicyBanner.module.css';

/**
 * HealthPolicyBanner — "Health Policy & Consulting"
 * -------------------------------------------------
 * The fifth HeroSection3D variant. Like StrategicPlanningBanner it has no
 * rotating stages: the cycle starts only once the banner scrolls into view
 * (IntersectionObserver), never on page load. A fan of 12 glowing nodes holds
 * ~4s, morphs smoothly into a cross outline (~2.2s, staggered per node for a
 * wave-like feel), the tagline reveals word by word, it holds, then morphs
 * back to the fan and loops. Dragging (rotate + draw a traveling current along
 * the edges) pauses the cycle until released, and the rotation always eases
 * back to front-facing during each morph regardless of how it was left.
 *
 * CMS copy: takes the same `stages` prop as the other variants but uses only
 * the FIRST entry — headline becomes the tagline's h2, sub becomes the
 * paragraph. `autoAdvanceMs` maps to how long the cross form holds.
 *
 * Responsive layout:
 *   - Desktop / wide landscape: fan sits left, beam points right, text sits
 *     right in a container-query-sized (cqw) column, so it scales with the
 *     banner's own width rather than the viewport.
 *   - Tablet/phone portrait (<=1024px): the shape rotates 90° to point up at
 *     the text above it, fitted to the camera frustum by actual trigonometry
 *     (see applyResponsiveShape) rather than a width-based guess.
 *   - Phone portrait (<=600px): full-viewport-height hero with a steeper type
 *     ramp.
 *   - Narrow landscape (<=900px): keeps the wide orientation, narrower column.
 *
 * Touch: `touch-action: pan-y` on the canvas so a horizontal drag rotates the
 * shape while a vertical swipe still scrolls the page, plus pointercancel
 * handling — without it a cancelled touch leaves isDragging true, which stalls
 * the morph cycle for good.
 *
 * Requires `three` (already a dependency of this project). The "Agenda"
 * typeface is loaded site-wide in app/layout.tsx.
 */

type HealthPolicyBannerProps = {
  /** Only the first entry is used: headline -> h2, sub -> paragraph. */
  stages?: Stage[];
  /** How long the cross form holds before morphing back (default 4500ms). */
  autoAdvanceMs?: number;
  /** Optional extra classes on the outer wrapper (the component sizes itself). */
  className?: string;
};

const DEFAULT_TAGLINE = {
  headline: 'From insight to action.',
  sub: 'Data, stakeholders, and system-level thinking — aligned toward one outcome.',
};

const DEFAULT_CROSS_HOLD_MS = 4500;

export default function HealthPolicyBanner({
  stages,
  autoAdvanceMs,
  className,
}: HealthPolicyBannerProps) {
  const tagline = useMemo(() => {
    const first = (stages ?? []).find((s) => s && (s.headline || s.sub));
    return {
      headline: first?.headline?.trim() || DEFAULT_TAGLINE.headline,
      sub: first?.sub?.trim() || DEFAULT_TAGLINE.sub,
    };
  }, [stages]);

  const crossHoldMs =
    typeof autoAdvanceMs === 'number' && autoAdvanceMs >= 800
      ? autoAdvanceMs
      : DEFAULT_CROSS_HOLD_MS;

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

    type GlowMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;

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

    // reveal timing — keep WORD_REVEAL in sync with the .word > span transform
    // transition in the CSS module, since the hand-off to the next line is
    // measured from when the previous line's last word has actually landed
    const WORD_STAGGER = 0.05; // between words of the same line
    const WORD_REVEAL = 0.55; // duration of one word's rise
    const LINE_GAP = 0.15; // beat between heading and subtitle
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

    // desktop: fan sits left, points right, full size. tablet/mobile: shape
    // rotates 90° so it points UP instead (toward the text above it), sits
    // lower in the frame. portrait + narrow: fitted to the frustum via real
    // trigonometry (see below) since the aspect-ratio genuinely changes there.
    // landscape + narrow: keeps the wide orientation — every landscape width
    // shares one aspect-ratio and therefore one scale. Declared here, not
    // beside the beam mesh below, because the portrait fit in
    // applyResponsiveShape() needs it and runs first.
    const beamLength = 8.6;
    const PORTRAIT_QUERY = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
    function applyResponsiveShape() {
      if (PORTRAIT_QUERY.matches) {
        // rotated 90°, so the group's local +x (fan tip -3.9 .. arrow tip
        // +beamLength) runs vertically. Fit that span to the frustum rather
        // than to a pixel width: the visible half-height is fixed by the FOV.
        // Every node is a glow sprite of scale 0.92, so it reaches NODE_GLOW
        // past its own centre — measuring to centres alone would let the
        // fan/cross clip. The cross form is the widest the shape ever gets
        // sideways, and on a full-height phone the frustum is only ~1.5 units
        // wide, so the fit is bound by width too.
        const NODE_GLOW = 0.46;
        const back = 3.9 + NODE_GLOW; // fan tip, behind the origin
        const forward = beamLength + NODE_GLOW; // arrow tip, ahead of it
        const sideways = 3.7 + NODE_GLOW; // cross arm
        const tanHalfFov = Math.tan(((camera.fov / 2) * Math.PI) / 180);

        // animate() spins the group continuously, so the shape's sideways
        // extent swings through depth: a node rotated toward the camera sits
        // nearer than z=0 and projects LARGER than a z=0 fit predicts. Size
        // against the nearest plane the shape can reach. That plane depends on
        // the scale we are solving for, so settle it in passes.
        let scale = 0.5;
        let halfH = 0;
        let bottom = 0;
        let top = 0;
        for (let pass = 0; pass < 4; pass++) {
          const nearest = camera.position.z - sideways * scale;
          halfH = tanHalfFov * nearest;
          bottom = -halfH * 0.95;
          top = halfH * 0.5; // the tagline owns the band above this
          scale = Math.min(
            0.7,
            (top - bottom) / (back + forward),
            (halfH * camera.aspect * 0.92) / sideways
          );
        }

        shapeGroup.position.x = 0;
        // centred in the band rather than pinned to its floor, so the margin
        // that absorbs the spin is split between both ends
        shapeGroup.position.y = (bottom + top) / 2 - ((forward - back) / 2) * scale;
        shapeGroup.rotation.z = Math.PI / 2;
        shapeGroup.scale.setScalar(scale);
      } else {
        shapeGroup.position.x = -4.6;
        shapeGroup.position.y = 0;
        shapeGroup.rotation.z = 0;
        // no width-based shrink here: the banner's aspect-ratio is fixed, so
        // the camera frustum covers the same world extent at every pixel width
        // and the shape is already proportional. The constant below is the one
        // knob for the shape's size.
        shapeGroup.scale.setScalar(0.8);
      }
    }
    applyResponsiveShape();
    PORTRAIT_QUERY.addEventListener('change', applyResponsiveShape);
    const handleOrientationChange = () => window.setTimeout(applyResponsiveShape, 50);
    window.addEventListener('orientationchange', handleOrientationChange);

    // ---- two node layouts the same 12 nodes morph between ----
    // FAN: 6 rays, each an [outer, inner] pair, inner ends loosely clustered
    // (converging), matching the reference graphic.
    const FAN_POSITIONS: THREE.Vector3[] = [];
    (function buildFan() {
      const rayCount = 6;
      for (let i = 0; i < rayCount; i++) {
        const angle = (i / (rayCount - 1) - 0.5) * 1.15; // spread ~66°
        const dirX = -Math.cos(angle) * 0.9;
        const dirY = Math.sin(angle);
        const z = (i % 2 === 0 ? 1 : -1) * 0.25;
        const dir = new THREE.Vector3(dirX, dirY, z).normalize();
        FAN_POSITIONS.push(dir.clone().multiplyScalar(3.9)); // outer
        FAN_POSITIONS.push(dir.clone().multiplyScalar(1.75)); // inner
      }
    })();
    const FAN_ADJACENCY: Set<number>[] = Array.from({ length: 12 }, () => new Set<number>());
    for (let i = 0; i < 6; i++) {
      const outer = i * 2;
      const inner = i * 2 + 1;
      FAN_ADJACENCY[outer].add(inner);
      FAN_ADJACENCY[inner].add(outer);
    }
    // loosely connect the 6 inner (convergence) nodes to their neighbors
    for (let i = 0; i < 6; i++) {
      const a = i * 2 + 1;
      const b = ((i + 1) % 6) * 2 + 1;
      FAN_ADJACENCY[a].add(b);
      FAN_ADJACENCY[b].add(a);
    }

    // CROSS: standard 12-corner plus-sign outline
    const CROSS_POSITIONS: THREE.Vector3[] = (function buildCross() {
      const w = 1.15;
      const L = 3.7;
      return (
        [
          [w, L],
          [w, w],
          [L, w],
          [L, -w],
          [w, -w],
          [w, -L],
          [-w, -L],
          [-w, -w],
          [-L, -w],
          [-L, w],
          [-w, w],
          [-w, L],
        ] as [number, number][]
      ).map(([x, y]) => new THREE.Vector3(x, y, 0));
    })();
    const CROSS_ADJACENCY: Set<number>[] = Array.from({ length: 12 }, (_, i) => {
      const s = new Set<number>();
      s.add((i + 1) % 12);
      s.add((i + 11) % 12);
      return s;
    });

    const NODE_COUNT = 12;
    const uniqueVerts = FAN_POSITIONS.map((v) => v.clone());
    let adjacency: Set<number>[] = FAN_ADJACENCY;
    const nodeSprites: THREE.Sprite[] = [];

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

    uniqueVerts.forEach((v) => {
      const sprite = new THREE.Sprite(spriteMat.clone());
      sprite.position.copy(v);
      sprite.scale.setScalar(0.92);
      shapeGroup.add(sprite);
      nodeSprites.push(sprite);
    });

    // static connecting lines — rebuilt every frame from the CURRENT adjacency
    // and live (possibly mid-morph) positions, so they always match what's on
    // screen without extra bookkeeping
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x9fdcff,
      transparent: true,
      opacity: 0.5,
    });
    let staticLines: THREE.Line[] = [];
    function rebuildStaticLines() {
      staticLines.forEach((l) => {
        shapeGroup.remove(l);
        l.geometry.dispose();
      });
      staticLines = [];
      adjacency.forEach((set, a) => {
        set.forEach((b) => {
          if (b < a) return;
          const g = new THREE.BufferGeometry().setFromPoints([uniqueVerts[a], uniqueVerts[b]]);
          const line = new THREE.Line(g, lineMat);
          shapeGroup.add(line);
          staticLines.push(line);
        });
      });
    }
    function updateStaticLinePositions() {
      let i = 0;
      adjacency.forEach((set, a) => {
        set.forEach((b) => {
          if (b < a) return;
          const line = staticLines[i++];
          if (!line) return;
          line.geometry.setFromPoints([uniqueVerts[a], uniqueVerts[b]]);
        });
      });
    }
    rebuildStaticLines();

    // persistent output beam + arrowhead, always visible, continuing right
    const beamGeo = new THREE.CylinderGeometry(0.052, 0.052, beamLength, 8);
    beamGeo.rotateZ(Math.PI / 2);
    beamGeo.translate(beamLength / 2, 0, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x9fdcff,
      transparent: true,
      opacity: 0.7,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    shapeGroup.add(beam);

    const arrowGeo = new THREE.ConeGeometry(0.32, 0.8, 12);
    arrowGeo.rotateZ(-Math.PI / 2);
    arrowGeo.translate(beamLength, 0, 0);
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0x9fdcff,
      transparent: true,
      opacity: 0.85,
    });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    shapeGroup.add(arrow);

    const coreGeo = new THREE.SphereGeometry(0.63, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x4fa8e0,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    shapeGroup.add(core);

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

    // ---------- morph state machine (fan -> cross -> fan -> ... loop) ----------
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
      { threshold: [0.3] }
    );
    intersectionObserver.observe(bannerEl);

    type Phase = 'fan' | 'toCross' | 'cross' | 'toFan';
    let phase: Phase = 'fan';
    let phaseStart = performance.now();
    let morphFrom = FAN_POSITIONS.map((v) => v.clone());
    let morphTo = FAN_POSITIONS.map((v) => v.clone());
    const FAN_HOLD = 4000;
    const MORPH_DUR = 2200;
    const CROSS_HOLD = crossHoldMs;
    const NODE_STAGGER = 0.28; // fraction of MORPH_DUR spread across nodes, for a wave-like feel
    let lastFrameTimeForMorph = performance.now();
    let rotFromX = 0;
    let rotFromY = 0;

    function easeInOut(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function perNodeT(globalT: number, i: number) {
      const delay = (i / NODE_COUNT) * NODE_STAGGER;
      const span = 1 - NODE_STAGGER;
      return easeInOut(Math.max(0, Math.min(1, (globalT - delay) / span)));
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

      if (phase === 'fan' && elapsed > FAN_HOLD) {
        phase = 'toCross';
        phaseStart = now;
        morphFrom = uniqueVerts.map((v) => v.clone());
        morphTo = CROSS_POSITIONS;
        adjacency = CROSS_ADJACENCY;
        rebuildStaticLines();
        rotFromX = shapeGroup.rotation.x;
        rotFromY = shapeGroup.rotation.y;
      } else if (phase === 'toCross') {
        const rawT = Math.min(1, elapsed / MORPH_DUR);
        const t = easeInOut(rawT);
        for (let i = 0; i < NODE_COUNT; i++) {
          uniqueVerts[i].lerpVectors(morphFrom[i], morphTo[i], perNodeT(rawT, i));
        }
        updateStaticLinePositions();
        shapeGroup.rotation.x = rotFromX * (1 - t);
        shapeGroup.rotation.y = rotFromY * (1 - t);
        if (rawT >= 1) {
          phase = 'cross';
          phaseStart = now;
          showTagline();
        }
      } else if (phase === 'cross' && elapsed > CROSS_HOLD) {
        hideTagline();
        phase = 'toFan';
        phaseStart = now;
        morphFrom = uniqueVerts.map((v) => v.clone());
        morphTo = FAN_POSITIONS;
        adjacency = FAN_ADJACENCY;
        rebuildStaticLines();
        rotFromX = shapeGroup.rotation.x;
        rotFromY = shapeGroup.rotation.y;
      } else if (phase === 'toFan') {
        const rawT = Math.min(1, elapsed / MORPH_DUR);
        const t = easeInOut(rawT);
        for (let i = 0; i < NODE_COUNT; i++) {
          uniqueVerts[i].lerpVectors(morphFrom[i], morphTo[i], perNodeT(rawT, i));
        }
        updateStaticLinePositions();
        shapeGroup.rotation.x = rotFromX * (1 - t);
        shapeGroup.rotation.y = rotFromY * (1 - t);
        if (rawT >= 1) {
          phase = 'fan';
          phaseStart = now;
        }
      }
      nodeSprites.forEach((s, i) => s.position.copy(uniqueVerts[i]));
    }

    // ---------- traveling electric current ----------
    function makeCurrentLayerSegments(
      baseRadius: number,
      opacity: number,
      color: number,
      count: number
    ): GlowMesh[] {
      const meshes: GlowMesh[] = [];
      for (let s = 0; s < count; s++) {
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat) as GlowMesh;
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
      nodeSprites[idx].scale.setScalar(0.92 + 0.6 * amount);
    }
    function resetNodePulses() {
      nodeSprites.forEach((s) => s.scale.setScalar(0.92));
    }

    const _v = new THREE.Vector3();
    function vertexNDC(idx: number) {
      _v.copy(uniqueVerts[idx]).applyMatrix4(shapeGroup.matrixWorld).project(camera);
      return { x: _v.x, y: _v.y };
    }
    function visibleVertexIndices(): number[] {
      return uniqueVerts.map((_, i) => i);
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
      return new THREE.Vector3().lerpVectors(
        uniqueVerts[path[seg]],
        uniqueVerts[path[seg + 1]],
        localT
      );
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
      for (let i = samples; i >= 0; i--) segPts.push(pointOnPath(displayT - (i / samples) * TAIL));
      const pulse = 0.9 + Math.sin(performance.now() * 0.004) * 0.1;

      function buildTapered(meshes: GlowMesh[]) {
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
          const newGeo = new THREE.TubeGeometry(
            curve,
            Math.max(2, chunk.length - 1),
            segRadius,
            6,
            false
          );
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
    let velX = 0.004;
    let velY = 0.0015;
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
      const visible = visibleVertexIndices();
      if (visible.length) {
        path = [nearestVertexToPointer(ndc.x, ndc.y, visible)];
        displayT = 0;
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      velY = dx * 0.00035;
      velX = dy * 0.00035;
      shapeGroup.rotation.y += dx * 0.006;
      shapeGroup.rotation.x += dy * 0.006;
      dragDistTotal += Math.hypot(dx, dy);
      dragDirTotal.x += dx;
      dragDirTotal.y += dy;
    }

    // updateMorph() returns early while dragging, so failing to clear this
    // would stall the fan/cross cycle permanently, not just the ambient spin.
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

      if (!isDragging) {
        shapeGroup.rotation.y += 0.0026;
        shapeGroup.rotation.x += 0.0007;
        velY *= 0.96;
        velX *= 0.96;
      }
      updateMorph(now);
      updateCurrent();
      core.material.opacity = 0.4 + Math.sin(now * 0.0015) * 0.15;
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
  }, [tagline.headline, tagline.sub, crossHoldMs]);

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
