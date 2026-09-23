"use client";

import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float, Grid, Sparkles } from "@react-three/drei";

import Env from "./Env";
import Dumbbell from "./Dumbbell";
import ParticleField from "./ParticleField";
import HoloRings from "./HoloRings";

function Rig({ scrollRef }: { scrollRef: { current: number } }) {
  const target = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = target.current;
    if (!g) return;
    const p = scrollRef.current;

    const rotY = t * 0.28 + pointer.x * 0.55;
    const rotX = -pointer.y * 0.32 + p * 0.45;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rotY, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rotX, 3, delta);

    const y = 0.15 + p * 1.5;
    g.position.y = THREE.MathUtils.damp(g.position.y, y, 3, delta);

    const s = 1 + p * 0.38;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 3, delta));
  });

  return (
    <group ref={target} position={[0, 0.15, 0]}>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={1.1}>
        <Dumbbell />
        <Sparkles count={70} scale={[4.4, 2.6, 4.4]} size={2.6} speed={0.4} color="#7dd3fc" opacity={0.6} />
        <Sparkles count={40} scale={[3.4, 1.9, 3.4]} size={3.4} speed={0.3} color="#d8b4fe" opacity={0.5} />
      </Float>
    </group>
  );
}

export default function HeroScene({ scrollRef }: { scrollRef: { current: number } }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 8.2], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <fog attach="fog" args={["#050508", 9.5, 26]} />
      <Env />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 4]} intensity={1.4} />
      <pointLight position={[-6, 2, -3]} intensity={26} color="#22d3ee" />
      <pointLight position={[6, -1, -2]} intensity={24} color="#8b5cf6" />
      <pointLight position={[0, 5, 6]} intensity={18} color="#e879f9" />

      <Rig scrollRef={scrollRef} />
      <HoloRings scrollRef={scrollRef} />
      <ParticleField scrollRef={scrollRef} />

      <ContactShadows position={[0, -2.75, 0]} opacity={0.6} scale={13} blur={2.6} far={4.4} color="#000000" />
      <Grid
        position={[0, -2.74, 0]}
        args={[10.5, 10.5]}
        cellSize={0.62}
        cellThickness={0.6}
        cellColor="#15202b"
        sectionSize={3.1}
        sectionThickness={1.1}
        sectionColor="#22d3ee"
        fadeDistance={30}
        fadeStrength={2.4}
        infiniteGrid
      />
    </Canvas>
  );
}