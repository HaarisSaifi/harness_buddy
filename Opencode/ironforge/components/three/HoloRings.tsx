"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HoloRings({ scrollRef }: { scrollRef: { current: number } }) {
  const rings = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = rings.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.z += delta * 0.18;
    g.rotation.x = Math.sin(t * 0.25) * 0.35 + scrollRef.current * 0.8;
    const lift = 0.4 + scrollRef.current * 0.7;
    g.position.y = THREE.MathUtils.damp(g.position.y, lift, 3, delta);
  });

  return (
    <group ref={rings}>
      <mesh rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[3.1, 0.018, 12, 160]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 1.9, Math.PI / 6, 0]}>
        <torusGeometry args={[3.75, 0.014, 12, 160]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 3, -Math.PI / 4, 0]}>
        <torusGeometry args={[4.35, 0.01, 12, 160]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}