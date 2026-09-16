'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Stage } from './ImpactBanner';
import styles from './StrategicPlanningBanner.module.css';

/**
 * StrategicPlanningBanner — "Strategic Planning & Development"
 * ------------------------------------------------------------
 * The fourth HeroSection3D variant, and structurally the odd one out: instead
 * of three rotating stages with pagination dots, it plays a looping formation
 * sequence once scrolled into view — an ascending 4-step staircase draws in
 * step by step, a beam grows from the last step, a glowing "goal" pops in with
 * orbiting sparks, the tagline fades in, everything holds, then erases and
 * repeats. The shape resets to front-facing at the start of each cycle and
 * stays put while forming so it always reads clearly; ambient rotation only
 * runs once fully formed. Dragging (rotate + draw a traveling light along the
 * staircase) pauses the cycle until released.
 *
 * CMS copy: it takes the same `stages` prop as the other variants but uses
 * only the FIRST entry — headline becomes the tagline's h2, sub becomes the
 * paragraph — so one Strapi block shape drives every variant. `autoAdvanceMs`
 * maps to how long the formed state holds before erasing.
 *
 * Touch: `touch-action: pan-y` on the canvas so a horizontal drag rotates the
 * shape while a vertical swipe still scrolls the page, plus explicit
 * pointercancel handling — without it a cancelled touch leaves isDragging
 * true, which here freezes the formation loop permanently.
 *
 * Requires `three` (already a dependency of this project). The "Agenda"
 * typeface is loaded site-wide in app/layout.tsx.
 */

type StrategicPlanningBannerProps = {
  /** Only the first entry is used: headline -> h2, sub -> paragraph. */
  stages?: Stage[];
  /** How long the formed state holds before erasing (default 4500ms). */
  autoAdvanceMs?: number;
  /** Optional extra classes on the outer wrapper (the component sizes itself). */
  className?: string;
};

const DEFAULT_TAGLINE = {
  headline: 'Turning vision into delivery.',
  sub: 'Structured roadmaps that align resources, teams, and performance toward one outcome.',
};

const DEFAULT_HOLD_MS = 4500;

export default function StrategicPlanningBanner({
  stages,
  autoAdvanceMs,
  className,
}: StrategicPlanningBannerProps) {
  const tagline = useMemo(() => {
    const first = (stages ?? []).find((s) => s && (s.headline || s.sub));
    return {
      headline: first?.headline?.trim() || DEFAULT_TAGLINE.headline,
      sub: first?.sub?.trim() || DEFAULT_TAGLINE.sub,
    };
  }, [stages]);

  const holdMs =
    typeof autoAdvanceMs === 'number' && autoAdvanceMs >= 800
      ? autoAdvanceMs
      : DEFAULT_HOLD_MS;

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const taglineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bannerRef.current || !canvasRef.current || !taglineRef.current) return;

    // non-nullable locals so the closures below don't need null checks
    const bannerEl: HTMLDivElement = bannerRef.current;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const taglineEl: HTMLDivElement = taglineRef.current;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1728 / 600, 0.1, 100);
    camera.position.set(0, 0, 9);

    const keyLight = new THREE.DirectionalLight(0xa9d8ff, 1.4);
    keyLight.position.set(4, 3, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x1f6ba0, 0.8);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);
    const ambientLight = new THREE.AmbientLight(0x0a2c46, 0.9);
    scene.add(ambientLight);

    const shapeGroup = new THREE.Group();
    scene.add(shapeGroup);

    type GlowMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;

    // ---- ascending staircase: each step's outer top corner is a node,
    // nodes chain together, then a beam+arrow continues to a glowing goal ----
    const STEP_COUNT = 4;
    const STEP_W = 0.85;
    const STEP_H = 0.95;
    const uniqueVerts: THREE.Vector3[] = [];
    const nodeSprites: THREE.Sprite[] = [];
    const originX = -(STEP_COUNT * STEP_W) / 2;
    const originY = -(STEP_COUNT * STEP_H) / 2;
    for (let i = 0; i < STEP_COUNT; i++) {
      uniqueVerts.push(
        new THREE.Vector3(originX + (i + 1) * STEP_W, originY + (i + 1) * STEP_H, 0)
      );
    }
    const adjacency: Set<number>[] = uniqueVerts.map(() => new Set<number>());
    for (let i = 0; i < STEP_COUNT - 1; i++) {
      adjacency[i].add(i + 1);
      adjacency[i + 1].add(i);
    }

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
      sprite.scale.setScalar(0);
      shapeGroup.add(sprite);
      nodeSprites.push(sprite);
    });

    // dashed vertical guide-lines dropping from each step's corner down to the
    // baseline, like the bar-chart extension lines in the reference
    const vertGuideMats: THREE.MeshBasicMaterial[] = [];
    uniqueVerts.forEach((node) => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xa9d8ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      vertGuideMats.push(mat);
      const totalLen = node.y - originY;
      const dashLen = 0.09;
      const gapLen = 0.06;
      const unit = dashLen + gapLen;
      const count = Math.max(1, Math.floor(totalLen / unit));
      for (let d = 0; d < count; d++) {
        const yStart = node.y - d * unit;
        const yEnd = Math.max(originY, yStart - dashLen);
        if (yEnd >= yStart) continue;
        const curve = new THREE.LineCurve3(
          new THREE.Vector3(node.x, yStart, node.z),
          new THREE.Vector3(node.x, yEnd, node.z)
        );
        const geo = new THREE.TubeGeometry(curve, 1, 0.012, 6, false);
        shapeGroup.add(new THREE.Mesh(geo, mat));
      }
    });

    // full staircase silhouette as a path of points (tread, then riser,
    // repeated) — nodes above sit exactly on the corner after each riser
    const stairPts: THREE.Vector3[] = [];
    let cx = originX;
    let cy = originY;
    stairPts.push(new THREE.Vector3(cx, cy, 0));
    for (let i = 0; i < STEP_COUNT; i++) {
      cx += STEP_W;
      stairPts.push(new THREE.Vector3(cx, cy, 0));
      cy += STEP_H;
      stairPts.push(new THREE.Vector3(cx, cy, 0));
    }

    // drawn as real straight 3D tube segments (with a wider glow duplicate)
    // instead of a smooth spline — a spline through right-angle corners
    // curves/overshoots between them, reading as a wavy line rather than a
    // crisp staircase. Each tread/riser is its own straight segment.
    const STAIR_SEGMENTS = stairPts.length - 1;
    function makeStairSegmentMeshes(radius: number, opacity: number, color: number): GlowMesh[] {
      const meshes: GlowMesh[] = [];
      for (let s = 0; s < STAIR_SEGMENTS; s++) {
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat) as GlowMesh;
        mesh.userData.baseRadius = radius;
        mesh.userData.baseOpacity = opacity;
        mesh.visible = false;
        shapeGroup.add(mesh);
        meshes.push(mesh);
      }
      return meshes;
    }
    const stairCoreSegs = makeStairSegmentMeshes(0.018, 0.9, 0xffffff);
    const stairGlowSegs = makeStairSegmentMeshes(0.05, 0.35, 0xa9d8ff);

    function updateStairDraw(t: number) {
      const clamped = Math.max(0, Math.min(STAIR_SEGMENTS, t));
      for (let s = 0; s < STAIR_SEGMENTS; s++) {
        const segT = Math.max(0, Math.min(1, clamped - s));
        [stairCoreSegs[s], stairGlowSegs[s]].forEach((mesh) => {
          if (segT <= 0) {
            mesh.visible = false;
            return;
          }
          mesh.visible = true;
          const p2 = new THREE.Vector3().lerpVectors(stairPts[s], stairPts[s + 1], segT);
          const curve = new THREE.LineCurve3(stairPts[s], p2);
          const newGeo = new THREE.TubeGeometry(
            curve,
            1,
            mesh.userData.baseRadius as number,
            6,
            false
          );
          mesh.geometry.dispose();
          mesh.geometry = newGeo;
          mesh.material.opacity = mesh.userData.baseOpacity as number;
        });
      }
    }

    // persistent output beam + arrowhead, continuing from the last node toward
    // the glowing goal — grows in once the stairs finish
    const lastNode = uniqueVerts[STEP_COUNT - 1];
    const climbDir = new THREE.Vector3(STEP_W, STEP_H, 0).normalize();
    const beamLength = 2.4;
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xa9d8ff,
      transparent: true,
      opacity: 0,
    });
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, beamLength, 8),
      beamMat
    );
    beam.geometry.rotateZ(Math.PI / 2);
    beam.geometry.translate(beamLength / 2, 0, 0);
    beam.position.copy(lastNode);
    beam.rotation.z = Math.atan2(climbDir.y, climbDir.x);
    beam.scale.x = 0;
    shapeGroup.add(beam);

    const goalPos = lastNode.clone().add(climbDir.clone().multiplyScalar(beamLength));
    const arrowGeo = new THREE.ConeGeometry(0.16, 0.4, 12);
    arrowGeo.rotateZ(-Math.PI / 2);
    const arrowMat = new THREE.MeshBasicMaterial({
      color: 0xa9d8ff,
      transparent: true,
      opacity: 0,
    });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    arrow.position.copy(goalPos);
    arrow.rotation.z = Math.atan2(climbDir.y, climbDir.x);
    arrow.scale.setScalar(0);
    shapeGroup.add(arrow);

    const goalGlow = new THREE.Sprite(spriteMat.clone());
    goalGlow.position.copy(goalPos);
    goalGlow.scale.setScalar(0);
    shapeGroup.add(goalGlow);
    const sparkDots: THREE.Sprite[] = [];
    for (let i = 0; i < 4; i++) {
      const dot = new THREE.Sprite(spriteMat.clone());
      dot.scale.setScalar(0);
      shapeGroup.add(dot);
      sparkDots.push(dot);
    }

    const coreGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.copy(goalPos);
    shapeGroup.add(core);

    // ---------- sequential formation, looping forever ----------
    const STAIR_DRAW_MS = 2200;
    const BEAM_GROW_MS = 700;
    const GOAL_POP_MS = 450;
    const HOLD_MS = holdMs;
    const ERASE_MS = 1000;
    type FormationStage = 'waiting' | 'stairs' | 'beam' | 'goal' | 'hold' | 'erasing';
    let formationStage: FormationStage = 'waiting';
    let formationStart = 0;
    let lastFormationFrameTime = performance.now();
    const nodePopped = new Array<boolean>(STEP_COUNT).fill(false);
    const nodePopStart = new Array<number | null>(STEP_COUNT).fill(null);

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }
    function easeInCubic(t: number) {
      return t * t * t;
    }
    function easeOutBack(t: number) {
      const c1 = 1.7;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function startFormation() {
      formationStage = 'stairs';
      formationStart = performance.now();
      lastFormationFrameTime = formationStart;
      shapeGroup.rotation.x = 0;
      shapeGroup.rotation.y = 0;
    }

    function updateFormation(now: number) {
      if (formationStage === 'waiting') return;
      if (isDragging) {
        formationStart += now - lastFormationFrameTime;
        lastFormationFrameTime = now;
        return;
      }
      lastFormationFrameTime = now;
      const elapsed = now - formationStart;

      if (formationStage === 'stairs') {
        const t = Math.min(1, elapsed / STAIR_DRAW_MS);
        const pathPos = easeOutCubic(t) * (stairPts.length - 1);
        updateStairDraw(pathPos);
        for (let i = 0; i < STEP_COUNT; i++) {
          const cornerIndex = 2 * (i + 1);
          if (!nodePopped[i] && pathPos >= cornerIndex) {
            nodePopped[i] = true;
            nodePopStart[i] = now;
          }
        }
        if (t >= 1) {
          formationStage = 'beam';
          formationStart = now;
        }
      } else if (formationStage === 'beam') {
        const t = easeOutCubic(Math.min(1, elapsed / BEAM_GROW_MS));
        beam.scale.x = t;
        beamMat.opacity = 0.7 * t;
        if (elapsed >= BEAM_GROW_MS) {
          formationStage = 'goal';
          formationStart = now;
        }
      } else if (formationStage === 'goal') {
        const t = Math.min(1, elapsed / GOAL_POP_MS);
        const pop = easeOutBack(t);
        arrow.scale.setScalar(pop);
        arrowMat.opacity = 0.85 * Math.min(1, t * 1.5);
        goalGlow.scale.setScalar(1.3 * pop);
        coreMat.opacity = 0.9 * Math.min(1, t * 1.5);
        sparkDots.forEach((d) => d.scale.setScalar(0.16 * pop));
        if (t >= 1) {
          formationStage = 'hold';
          formationStart = now;
          taglineEl.classList.add(styles.revealed);
        }
      } else if (formationStage === 'hold') {
        if (elapsed > HOLD_MS) {
          formationStage = 'erasing';
          formationStart = now;
          taglineEl.classList.remove(styles.revealed);
        }
      } else if (formationStage === 'erasing') {
        const t = Math.min(1, elapsed / ERASE_MS);
        const shrink = 1 - easeInCubic(t);
        arrow.scale.setScalar(shrink);
        arrowMat.opacity = 0.85 * shrink;
        goalGlow.scale.setScalar(1.3 * shrink);
        coreMat.opacity = 0.9 * shrink;
        sparkDots.forEach((d) => d.scale.setScalar(0.16 * shrink));
        beam.scale.x = shrink;
        beamMat.opacity = 0.7 * shrink;
        nodeSprites.forEach((s) => s.scale.setScalar(0.5 * shrink));
        vertGuideMats.forEach((m) => (m.opacity = 0.5 * shrink));
        updateStairDraw((1 - t) * STAIR_SEGMENTS);
        if (t >= 1) {
          nodePopped.fill(false);
          nodePopStart.fill(null);
          nodeSprites.forEach((s) => s.scale.setScalar(0));
          formationStage = 'stairs';
          formationStart = now;
          shapeGroup.rotation.x = 0;
          shapeGroup.rotation.y = 0;
        }
      }

      // 'waiting' already returned at the top of this function
      if (formationStage !== 'erasing') {
        nodeSprites.forEach((s, i) => {
          const popStart = nodePopStart[i];
          if (popStart == null) return;
          const pt = Math.min(1, (now - popStart) / 300);
          s.scale.setScalar(0.5 * easeOutBack(pt));
          vertGuideMats[i].opacity = 0.5 * Math.min(1, pt * 1.4);
        });
      }
    }

    // ---------- responsive ----------
    const PORTRAIT_QUERY = window.matchMedia('(max-width: 1024px) and (orientation: portrait)');
    function computeCenteredDesktopX() {
      const bannerRect = bannerEl.getBoundingClientRect();
      const taglineRect = taglineEl.getBoundingClientRect();
      if (bannerRect.width < 1) return -4.2;
      const textLeftPx = taglineRect.left - bannerRect.left;
      const midPx = textLeftPx / 2;
      const ndcX = (midPx / bannerRect.width) * 2 - 1;
      const tanHalfFov = Math.tan(((camera.fov / 2) * Math.PI) / 180);
      const halfH = tanHalfFov * camera.position.z;
      const halfW = halfH * camera.aspect;
      return ndcX * halfW;
    }
    function applyResponsiveShape() {
      if (PORTRAIT_QUERY.matches) {
        shapeGroup.position.set(0, -1.0, 0);
        shapeGroup.rotation.z = 0;
        shapeGroup.scale.setScalar(0.85);
      } else {
        shapeGroup.position.set(computeCenteredDesktopX(), -0.9, 0);
        shapeGroup.rotation.z = 0;
        shapeGroup.scale.setScalar(0.85);
      }
    }
    applyResponsiveShape();
    PORTRAIT_QUERY.addEventListener('change', applyResponsiveShape);
    const handleOrientationChange = () => window.setTimeout(applyResponsiveShape, 50);
    window.addEventListener('orientationchange', handleOrientationChange);

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

    let sequenceTriggered = false;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3 && !sequenceTriggered) {
            sequenceTriggered = true;
            startFormation();
          }
        });
      },
      { threshold: [0.3] }
    );
    intersectionObserver.observe(bannerEl);

    // ---------- traveling light: walks the staircase chain toward the goal ----------
    function pulseNode(idx: number, amount: number) {
      nodeSprites[idx].scale.setScalar(0.5 + 0.5 * amount);
    }
    function resetNodePulses() {
      nodeSprites.forEach((s) => s.scale.setScalar(0.5));
    }

    const _v = new THREE.Vector3();
    function vertexNDC(idx: number) {
      _v.copy(uniqueVerts[idx]).applyMatrix4(shapeGroup.matrixWorld).project(camera);
      return { x: _v.x, y: _v.y };
    }
    function nearestVertexToPointer(ndcX: number, ndcY: number) {
      let best = 0;
      let bestD = Infinity;
      uniqueVerts.forEach((_, idx) => {
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
    const MAX_EDGES = STEP_COUNT - 1;

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
      if (!candidates.length) return;
      path.push(candidates[0]);
    }

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
    const CURRENT_SEGMENTS = 5;
    const currentCoreSegs = makeCurrentLayerSegments(0.012, 0.8, 0xffffff, CURRENT_SEGMENTS);
    const currentHaloSegs = makeCurrentLayerSegments(0.05, 0.7, 0xa9d8ff, CURRENT_SEGMENTS);

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
      const samples = 14;
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
      path = [nearestVertexToPointer(ndc.x, ndc.y)];
      displayT = 0;
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
    // Clearing isDragging matters more here than in the other variants:
    // updateFormation() returns early while dragging, so a stuck drag would
    // freeze the whole formation loop, not just the ambient spin.
    function releaseDrag() {
      if (!isDragging) return;
      isDragging = false;
      finishing = true;
      lastFormationFrameTime = performance.now();
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
      // pointerup OR pointercancel — the loop always resumes
      if (isDragging && now - lastMoveTime > STUCK_DRAG_MS) {
        releaseDrag();
      }

      if (!isDragging && (formationStage === 'hold' || formationStage === 'waiting')) {
        shapeGroup.rotation.y += 0.0022;
        shapeGroup.rotation.x += 0.0006;
      }
      if (!isDragging) {
        velY *= 0.96;
        velX *= 0.96;
      }
      updateFormation(now);
      updateCurrent();

      if (formationStage === 'hold') {
        const pulse = 0.5 + Math.sin(now * 0.0025) * 0.5;
        core.material.opacity = 0.6 + pulse * 0.4;
        goalGlow.scale.setScalar(1.1 + pulse * 0.3);
        sparkDots.forEach((dot, i) => {
          const a = now * 0.0012 + (i / sparkDots.length) * Math.PI * 2;
          dot.position.set(
            goalPos.x + Math.cos(a) * 0.4,
            goalPos.y + Math.sin(a) * 0.4,
            goalPos.z
          );
          dot.material.opacity = 0.5 + 0.5 * Math.sin(now * 0.003 + i);
        });
      }

      renderer.render(scene, camera);
    }
    animate();

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
  }, [tagline.headline, tagline.sub, holdMs]);

  return (
    <div className={`${styles.bannerWrap} ${className ?? ''}`.trim()}>
      <div className={styles.banner} ref={bannerRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.tagline} ref={taglineRef}>
          <h2>{tagline.headline}</h2>
          <p>{tagline.sub}</p>
        </div>
      </div>
    </div>
  );
}
