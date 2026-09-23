"use client";

import * as THREE from "three";

const CHROME: [string, number, number] = ["#e9edf5", 1, 0.16];
const IRON: [string, number, number] = ["#171820", 0.92, 0.32];

function MatFor(color: string, metalness: number, roughness: number) {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      envMapIntensity={1.4}
    />
  );
}

function Plate({
  x,
  r,
  h,
  ring = "#22d3ee",
}: {
  x: number;
  r: number;
  h: number;
  ring?: string;
}) {
  return (
    <group position={[x, 0, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[r, r, h, 48]} />
        {MatFor(...IRON)}
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} position={[h / 2 + 0.012, 0, 0]}>
        <torusGeometry args={[r * 0.88, r * 0.055, 10, 64]} />
        <meshBasicMaterial color={ring} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[-h / 2 - 0.012, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[r * 0.88, r * 0.045, 10, 64]} />
        <meshBasicMaterial color={ring} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Dumbbell() {
  return (
    <group>
      {/* Core chrome bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 4.7, 32]} />
        {MatFor(...CHROME)}
      </mesh>

      {/* End caps */}
      {[-1, 1].map((side) => (
        <group key={side} scale={[side, 1, 1]}>
          <Plate x={0.92} r={0.48} h={0.2} ring="#22d3ee" />
          <Plate x={1.16} r={0.58} h={0.16} ring="#8b5cf6" />
          <Plate x={1.42} r={0.7} h={0.2} ring="#e879f9" />

          {/* Collar */}
          <mesh position={[1.66, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.22, 0.16, 32]} />
            {MatFor(...CHROME)}
          </mesh>
          {/* Screw cap */}
          <mesh position={[1.88, 0, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            {MatFor(...CHROME)}
          </mesh>
        </group>
      ))}

      {/* Central holo band */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.52, 32, 1, true]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
