"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

import Env from "./Env";
import Dumbbell from "./Dumbbell";

function Throttle() {
  const invalidate = useThree((s) => s.invalidate);
  const dom = useThree((s) => s.gl.domElement);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id === null) id = setInterval(() => invalidate(), 34);
    };
    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };

    start();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0 }
    );
    io.observe(dom);

    return () => {
      stop();
      io.disconnect();
    };
  }, [invalidate, dom]);

  return null;
}

function MobileRig({ scrollRef }: { scrollRef: { current: number } }) {
  const g = useRef<THREE.Group>(null);

  useFrame((state) => {
    const group = g.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const p = scrollRef.current;

    group.rotation.y = t * 0.2 + p * 0.6;
    group.rotation.x = Math.sin(t * 0.4) * 0.1 + p * 0.5;
    group.position.y = p * 1.1;
    const s = 1 + p * 0.25;
    group.scale.setScalar(s);
  });

  return (
    <group ref={g}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.7}>
        <Dumbbell />
      </Float>
    </group>
  );
}

function Ring({ scrollRef }: { scrollRef: { current: number } }) {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const r = ring.current;
    if (!r) return;
    const t = state.clock.elapsedTime;
    const p = scrollRef.current;
    r.rotation.y = t * 0.18 + p * 0.4;
    r.rotation.x = Math.sin(t * 0.35) * 0.35 + p * 0.6;
  });

  return (
    <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[3.1, 0.016, 10, 120]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

export default function HeroSceneLite({ scrollRef }: { scrollRef: { current: number } }) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0.4, 7.6], fov: 42 }}
      dpr={[1, 1]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#050508"]} />
      <Env />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 7, 4]} intensity={1.5} />
      <pointLight position={[-5, 2, -3]} intensity={24} color="#22d3ee" />
      <pointLight position={[5, -1, -2]} intensity={22} color="#8b5cf6" />
      <MobileRig scrollRef={scrollRef} />
      <Ring scrollRef={scrollRef} />
      <Throttle />
    </Canvas>
  );
}