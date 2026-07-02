"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  particlesVertexShader,
  particlesFragmentShader,
} from "@/components/canvas/particlesShader";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * ParticleField - the microscopic atmosphere for Scene 03.
 *
 * Reuses the shared particle shader. Fades in on mount (uReveal), drifts as one
 * slow body, and dissolves into light on scroll-exit (uScroll from the scene's
 * progress ref). Mounts ONLY when near the viewport (IntersectionObserver) so
 * the GPU is idle everywhere else. Renders nothing under reduced motion.
 */

const COUNT = 1400;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Rgb = [number, number, number];

function Motes({
  scrollProgressRef,
  color,
}: {
  scrollProgressRef: MutableRefObject<number>;
  color: Rgb;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const startRef = useRef<number | null>(null);
  const { gl } = useThree();

  const { positions, scales, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = Math.random() * 3 - 2;
      scales[i] = 0.3 + Math.random() * 0.9;
      speeds[i] = 0.5 + Math.random() * 1.2;
    }
    return { positions, scales, speeds };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uReveal: { value: 0 },
      uSize: { value: 40 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(color[0], color[1], color[2]) },
    }),
    // color is fixed per mount; intentionally not reactive
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;

    const since = state.clock.elapsedTime - startRef.current;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uReveal.value = easeOutCubic(Math.min(since / 2.0, 1));
    mat.uniforms.uScroll.value = scrollProgressRef.current;
    mat.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 1.5);

    if (pointsRef.current) {
      pointsRef.current.rotation.z += delta * 0.012;
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.04) * 0.1;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

export default function ParticleField({
  scrollProgressRef,
  color = [0.18, 0.4, 0.5],
}: {
  scrollProgressRef: MutableRefObject<number>;
  /** particle tint in linear RGB (0..1). Default reads on light fields;
   *  pass a luminous value for dark fields. */
  color?: Rgb;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setMounted(entry.isIntersecting),
      { rootMargin: "20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reducedMotion) return null;

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      {mounted && (
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 3], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Motes scrollProgressRef={scrollProgressRef} color={color} />
        </Canvas>
      )}
    </div>
  );
}
