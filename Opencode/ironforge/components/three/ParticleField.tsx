"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */ `
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScroll;
  uniform float uSpread;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec3 p = position;
    float grow = 1.0 + uScroll * 0.55;
    p *= grow;
    float amp = 0.22 + uScroll * 0.45;
    p.x += sin(uTime * 0.6 + aSeed * 6.2831) * amp;
    p.y += cos(uTime * 0.7 + aSeed * 3.1415) * amp * 0.5;
    p.z += sin(uTime * 0.5 + aSeed * 9.42) * amp * 0.4;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.2 + aSeed * 2.0) * uSpread * (24.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * 0.9);
  }
`;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGeometry(count: number) {
  const rng = mulberry32(20260830);
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const c1 = new THREE.Color("#22d3ee");
  const c2 = new THREE.Color("#8b5cf6");
  const c3 = new THREE.Color("#e879f9");
  const tmp = new THREE.Color();

  const radius = 5.2;
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(rng());
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = r * Math.cos(phi) * 0.8;

    seeds[i] = rng();

    const t = rng();
    if (t < 0.5) tmp.lerpColors(c1, c2, t * 2);
    else tmp.lerpColors(c2, c3, (t - 0.5) * 2);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

export default function ParticleField({
  scrollRef,
}: {
  scrollRef: { current: number };
}) {
  const geometry = useMemo(() => buildGeometry(1000), []);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uScroll.value = scrollRef.current;
    mat.uniforms.uSpread.value = state.viewport.width / 9;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
          uSpread: { value: 1 },
        }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}