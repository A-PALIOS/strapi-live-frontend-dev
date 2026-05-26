"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: "capsule" | "sphere" | "box" | "tetrahedron";
  fieldStrength?: number;
}

type Particle = {
  t: number;
  speed: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  offset: number;
};

function AntigravityInner({
  count = 1400,
  magnetRadius = 8,
  ringRadius = 10,
  waveSpeed = 1,
  waveAmplitude = 0.8,
  particleSize = 1,
  lerpSpeed = 0.045,
  color = "#4F6BFF",
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0.15,
  depthFactor = 2,
  pulseSpeed = 2,
  particleShape = "capsule",
}: AntigravityProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = [];

    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * width * 1.8;
      const y = (Math.random() - 0.5) * height * 1.8;
      const z = (Math.random() - 0.5) * 20;

      temp.push({
        t: Math.random() * 100,
        speed: 0.002 + Math.random() * 0.01,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        offset: Math.random() * Math.PI * 2,
      });
    }

    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { pointer, viewport: v, clock } = state;

    const mouseX = (pointer.x * v.width) / 2;
    const mouseY = (pointer.y * v.height) / 2;

    const moving =
      Math.abs(mouseX - virtualMouse.current.x) > 0.001 ||
      Math.abs(mouseY - virtualMouse.current.y) > 0.001;

    if (moving) {
      lastMouseMoveTime.current = Date.now();
    }

    let targetX = mouseX;
    let targetY = mouseY;

    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 1200) {
      const t = clock.getElapsedTime();

      targetX = Math.sin(t * 0.35) * (v.width / 4);
      targetY = Math.cos(t * 0.5) * (v.height / 4);
    }

    virtualMouse.current.x += (targetX - virtualMouse.current.x) * 0.08;
    virtualMouse.current.y += (targetY - virtualMouse.current.y) * 0.08;

    const px = virtualMouse.current.x;
    const py = virtualMouse.current.y;

    particles.forEach((particle, i) => {
      particle.t += particle.speed;

      const dx = particle.mx - px;
      const dy = particle.my - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let tx = particle.mx;
      let ty = particle.my;
      let tz = particle.mz;

      if (dist < magnetRadius * 5) {
        const angle =
          Math.atan2(dy, dx) + clock.getElapsedTime() * rotationSpeed;

        const ringWave =
          Math.sin(particle.t * waveSpeed + particle.offset) *
          waveAmplitude *
          particleVariance;

        const radius =
          ringRadius + ringWave + (dist / (magnetRadius * 5)) * 8;

        tx = px + Math.cos(angle) * radius;
        ty = py + Math.sin(angle) * radius;
        tz = Math.sin(particle.t * pulseSpeed) * depthFactor;
      }

      particle.cx += (tx - particle.cx) * lerpSpeed;
      particle.cy += (ty - particle.cy) * lerpSpeed;
      particle.cz += (tz - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);
      dummy.lookAt(px, py, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const scale =
        0.03 +
        (1 - Math.min(dist / (magnetRadius * 6), 1)) *
          particleSize *
          0.18;

      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === "capsule" && (
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
      )}

      {particleShape === "sphere" && <sphereGeometry args={[0.2, 16, 16]} />}

      {particleShape === "box" && <boxGeometry args={[0.3, 0.3, 0.3]} />}

      {particleShape === "tetrahedron" && <tetrahedronGeometry args={[0.3]} />}

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default function Antigravity(props: AntigravityProps) {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{
          position: [0, 0, 50],
          fov: 35,
        }}
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <AntigravityInner {...props} />
      </Canvas>
    </div>
  );
}