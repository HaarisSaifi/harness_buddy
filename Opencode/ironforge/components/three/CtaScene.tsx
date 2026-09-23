"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import Env from "./Env";
import { useIsMobile } from "@/lib/useIsMobile";

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += delta * 0.18;
    m.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
    m.rotation.z = Math.cos(state.clock.elapsedTime * 0.22) * 0.1;
    m.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.18;
  });

  return (
    <group>
      <mesh ref={mesh} scale={2.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#151627"
          emissive="#22d3ee"
          emissiveIntensity={0.55}
          roughness={0.2}
          metalness={0.9}
          distort={0.44}
          speed={1.9}
          envMapIntensity={1.1}
        />
      </mesh>
      <Sparkles count={90} scale={[4.5, 4.5, 4.5]} size={3} speed={0.5} color="#8b5cf6" opacity={0.7} />
    </group>
  );
}

export default function CtaScene() {
  const isMobile = useIsMobile();
  if (isMobile === null || isMobile) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Env />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <pointLight position={[-5, -2, 3]} intensity={30} color="#e879f9" />
      <Blob />
    </Canvas>
  );
}