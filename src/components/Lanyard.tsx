// /* eslint-disable react/no-unknown-property */
// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Canvas, extend, useFrame } from "@react-three/fiber";
// import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
// import {
//   BallCollider,
//   CuboidCollider,
//   Physics,
//   RigidBody,
//   useRopeJoint,
//   useSphericalJoint,
// } from "@react-three/rapier";
// import { MeshLineGeometry, MeshLineMaterial } from "meshline";
// import * as THREE from "three";

// extend({ MeshLineGeometry, MeshLineMaterial });

// type LanyardProps = {
//   position?: [number, number, number];
//   gravity?: [number, number, number];
//   fov?: number;
//   transparent?: boolean;
//   onRevealChange?: (revealed: boolean) => void;
// };

// export default function Lanyard({
//   position = [0, 0, 20],
//   gravity = [0, -40, 0],
//   fov = 20,
//   transparent = true,
//   onRevealChange,
// }: LanyardProps) {
//   return (
//     <div className="relative z-0 flex h-screen w-full items-center justify-center">
//       <Canvas
//         camera={{ position, fov }}
//         gl={{ alpha: transparent }}
//         onCreated={({ gl }) =>
//           gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
//         }
//       >
//         <ambientLight intensity={Math.PI} />
//         <Physics gravity={gravity} timeStep={1 / 60}>
//           <Band onRevealChange={onRevealChange} />
//         </Physics>

//         <Environment blur={0.75}>
//           <Lightformer
//             intensity={2}
//             color="white"
//             position={[0, -1, 5]}
//             rotation={[0, 0, Math.PI / 3]}
//             scale={[100, 0.1, 1]}
//           />
//           <Lightformer
//             intensity={3}
//             color="white"
//             position={[-1, -1, 1]}
//             rotation={[0, 0, Math.PI / 3]}
//             scale={[100, 0.1, 1]}
//           />
//           <Lightformer
//             intensity={3}
//             color="white"
//             position={[1, 1, 1]}
//             rotation={[0, 0, Math.PI / 3]}
//             scale={[100, 0.1, 1]}
//           />
//           <Lightformer
//             intensity={10}
//             color="white"
//             position={[-10, 0, 14]}
//             rotation={[0, Math.PI / 2, Math.PI / 3]}
//             scale={[100, 10, 1]}
//           />
//         </Environment>
//       </Canvas>
//     </div>
//   );
// }

// function Band({
//   maxSpeed = 50,
//   minSpeed = 0,
//   onRevealChange,
// }: {
//   maxSpeed?: number;
//   minSpeed?: number;
//   onRevealChange?: (revealed: boolean) => void;
// }) {
//   const band = useRef<any>(null);
//   const fixed = useRef<any>(null);
//   const j1 = useRef<any>(null);
//   const j2 = useRef<any>(null);
//   const j3 = useRef<any>(null);
//   const card = useRef<any>(null);

//   const vec = new THREE.Vector3();
//   const ang = new THREE.Vector3();
//   const rot = new THREE.Vector3();

//   const segmentProps = {
//     type: "dynamic" as const,
//     canSleep: true,
//     colliders: false as const,
//     angularDamping: 4,
//     linearDamping: 4,
//   };

//   const { nodes, materials } = useGLTF("/assets/lanyard/card.glb") as any;
//   const texture = useTexture("/assets/lanyard/lanyard.png");

//   const [curve] = useState(
//     () =>
//       new THREE.CatmullRomCurve3([
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//       ])
//   );

//   const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
//   const [hovered, setHovered] = useState(false);
//   const [isSmall, setIsSmall] = useState(
//     () => typeof window !== "undefined" && window.innerWidth < 1024
//   );

//   const revealedRef = useRef(false);

//   useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
//   useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
//   useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
//   useSphericalJoint(j3, card, [
//     [0, 0, 0],
//     [0, 1.5, 0],
//   ]);

//   useEffect(() => {
//     if (!hovered) return;
//     document.body.style.cursor = dragged ? "grabbing" : "grab";
//     return () => {
//       document.body.style.cursor = "auto";
//     };
//   }, [hovered, dragged]);

//   useEffect(() => {
//     const onResize = () => setIsSmall(window.innerWidth < 1024);
//     window.addEventListener("resize", onResize);
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   useFrame((state, delta) => {
//     if (dragged && card.current) {
//       const dir = new THREE.Vector3();
//       vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
//       dir.copy(vec).sub(state.camera.position).normalize();
//       vec.add(dir.multiplyScalar(state.camera.position.length()));

//       [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
//       card.current.setNextKinematicTranslation({
//         x: vec.x - dragged.x,
//         y: vec.y - dragged.y,
//         z: vec.z - dragged.z,
//       });
//     }

//     if (!fixed.current || !card.current || !j1.current || !j2.current || !j3.current) return;

//     [j1, j2].forEach((ref) => {
//       if (!ref.current.lerped) {
//         ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
//       }
//       const clamped = Math.max(
//         0.1,
//         Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
//       );
//       ref.current.lerped.lerp(
//         ref.current.translation(),
//         delta * (minSpeed + clamped * (maxSpeed - minSpeed))
//       );
//     });

//     curve.points[0].copy(j3.current.translation());
//     curve.points[1].copy(j2.current.lerped);
//     curve.points[2].copy(j1.current.lerped);
//     curve.points[3].copy(fixed.current.translation());
//     band.current.geometry.setPoints(curve.getPoints(32));

//     ang.copy(card.current.angvel());
//     rot.copy(card.current.rotation());
//     card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });

//     // Reveal logic
//     const cardPos = card.current.translation();
//     const shouldReveal = cardPos.y < -2.2;

//     if (shouldReveal !== revealedRef.current) {
//       revealedRef.current = shouldReveal;
//       onRevealChange?.(shouldReveal);
//     }
//   });

//   curve.curveType = "chordal";
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

//   return (
//     <>
//       <group position={[0, 4, 0]}>
//         <RigidBody ref={fixed} {...segmentProps} type="fixed" />

//         <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>

//         <RigidBody
//           position={[2, 0, 0]}
//           ref={card}
//           {...segmentProps}
//           type={dragged ? "kinematicPosition" : "dynamic"}
//         >
//           <CuboidCollider args={[0.8, 1.125, 0.01]} />
//           <group
//             scale={2.25}
//             position={[0, -1.2, -0.05]}
//             onPointerOver={() => setHovered(true)}
//             onPointerOut={() => setHovered(false)}
//             onPointerDown={(e) => {
//               (e.target as unknown as Element)?.setPointerCapture?.(e.pointerId);
//               const bodyPos = card.current!.translation();
//               setDragged(
//                 new THREE.Vector3().copy(e.point).sub(
//                   vec.set(bodyPos.x, bodyPos.y, bodyPos.z)
//                 )
//               );
//             }}
//             onPointerUp={(e) => {
//               (e.target as unknown as Element)?.releasePointerCapture?.(e.pointerId);
//               setDragged(false);
//             }}
//             onPointerLeave={() => setDragged(false)}
//           >
//             <mesh geometry={nodes.card.geometry}>
//               <meshPhysicalMaterial
//                 map={materials.base?.map}
//                 // @ts-ignore
//                 map-anisotropy={16}
//                 clearcoat={1}
//                 clearcoatRoughness={0.15}
//                 roughness={0.9}
//                 metalness={0.8}
//               />
//             </mesh>
//             <mesh
//               geometry={nodes.clip.geometry}
//               material={materials.metal}
//               material-roughness={0.3}
//             />
//             <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
//           </group>
//         </RigidBody>
//       </group>

//       <mesh ref={band}>
//         {/* @ts-expect-error extended by meshline */}
//         <meshLineGeometry />
//         {/* @ts-expect-error extended by meshline */}
//         <meshLineMaterial
//           color="white"
//           depthTest={false}
//           resolution={isSmall ? [1000, 2000] : [1000, 1000]}
//           useMap
//           map={texture}
//           repeat={[-4, 1]}
//           lineWidth={1}
//         />
//       </mesh>
//     </>
//   );
// }


/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unknown-property */

/* eslint-disable react/no-unknown-property */

"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  onRevealChange?: (revealed: boolean) => void;
};

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  onRevealChange,
}: LanyardProps) {
  const [visible, setVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1400);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const topZone = 180;

    const handleScroll = () => {
      setVisible(window.scrollY <= topZone);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isDesktop) return null;

  return (
    <div
      className={`fixed inset-0 z-0 flex items-start justify-end transition-all duration-500 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-8 hidden"
      }`}
    >
      <div className="mt-4 mr-4 h-[720px] w-[720px] xl:mt-8 xl:mr-8 xl:h-[720px] xl:w-[720px]">
        <Canvas
          camera={{ position, fov }}
          gl={{ alpha: transparent }}
          onCreated={({ gl }) =>
            gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
          }
        >
          <ambientLight intensity={Math.PI} />

          <Physics gravity={gravity} timeStep={1 / 60}>
            <Band onRevealChange={onRevealChange} />
          </Physics>

          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      </div>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  onRevealChange,
}: {
  maxSpeed?: number;
  minSpeed?: number;
  onRevealChange?: (revealed: boolean) => void;
}) {
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = useRef(new THREE.Vector3()).current;
  const ang = useRef(new THREE.Vector3()).current;
  const rot = useRef(new THREE.Vector3()).current;

  const lineGeometry = useRef<any>(null);
  const lineMaterial = useRef<any>(null);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF("/assets/lanyard/card.glb") as any;
  const texture = useTexture("/assets/lanyard/lanyard.png");

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );

  const [dragged, setDragged] = useState<false | THREE.Vector3>(false);
  const [hovered, setHovered] = useState(false);
  const [resolution, setResolution] = useState(() =>
    typeof window !== "undefined"
      ? new THREE.Vector2(window.innerWidth, window.innerHeight)
      : new THREE.Vector2(1000, 1000)
  );

  const revealedRef = useRef(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    if (!hovered) return;

    document.body.style.cursor = dragged ? "grabbing" : "grab";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useEffect(() => {
    const onResize = () => {
      setResolution(new THREE.Vector2(window.innerWidth, window.innerHeight));
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
  }, [texture]);

  useEffect(() => {
    lineGeometry.current = new MeshLineGeometry();
    lineMaterial.current = new MeshLineMaterial({
      color: "white",
      depthTest: false,
      map: texture,
      useMap: 1,
      repeat: new THREE.Vector2(-4, 1),
      lineWidth: 1,
      resolution,
    });

    return () => {
      lineGeometry.current?.dispose?.();
      lineMaterial.current?.dispose?.();
      lineGeometry.current = null;
      lineMaterial.current = null;
    };
  }, [texture]);

  useEffect(() => {
    if (lineMaterial.current) {
      lineMaterial.current.resolution = resolution;
      lineMaterial.current.needsUpdate = true;
    }
  }, [resolution]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      const dir = new THREE.Vector3();

      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp?.());

      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (
      !fixed.current ||
      !card.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !lineGeometry.current
    ) {
      return;
    }

    [j1, j2].forEach((ref) => {
      if (!ref.current.lerped) {
        ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
      }

      const clamped = Math.max(
        0.1,
        Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
      );

      ref.current.lerped.lerp(
        ref.current.translation(),
        delta * (minSpeed + clamped * (maxSpeed - minSpeed))
      );
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(j2.current.lerped);
    curve.points[2].copy(j1.current.lerped);
    curve.points[3].copy(fixed.current.translation());

    lineGeometry.current.setPoints(curve.getPoints(32));

    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());

    card.current.setAngvel({
      x: ang.x,
      y: ang.y - rot.y * 0.25,
      z: ang.z,
    });

    const cardPos = card.current.translation();
    const shouldReveal = cardPos.y < -2.2;

    if (shouldReveal !== revealedRef.current) {
      revealedRef.current = shouldReveal;
      onRevealChange?.(shouldReveal);
    }
  });

  curve.curveType = "chordal";

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody ref={j1} position={[0.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody ref={j2} position={[1, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody ref={j3} position={[1.5, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[2, 0, 0]}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) => {
              (e.target as Element)?.setPointerCapture?.(e.pointerId);

              const bodyPos = card.current.translation();

              setDragged(
                new THREE.Vector3().copy(e.point).sub(
                  vec.set(bodyPos.x, bodyPos.y, bodyPos.z)
                )
              );
            }}
            onPointerUp={(e) => {
              (e.target as Element)?.releasePointerCapture?.(e.pointerId);
              setDragged(false);
            }}
            onPointerLeave={() => setDragged(false)}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base?.map}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>

            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />

            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      {lineGeometry.current && (
        <mesh frustumCulled={false}>
          <primitive object={lineGeometry.current} attach="geometry" />
          {lineMaterial.current && (
            <primitive object={lineMaterial.current} attach="material" />
          )}
        </mesh>
      )}
    </>
  );
}

useGLTF.preload("/assets/lanyard/card.glb");
