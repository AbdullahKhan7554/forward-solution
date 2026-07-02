"use client";

import { Suspense, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { fragmentShader, vertexShader } from "./atmosphereShader";
import { particlesFragmentShader, particlesVertexShader } from "./particlesShader";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { lerp } from "@/lib/utils";

/**
 * HeroAtmosphere - the layered WebGL world behind Scene 01.
 *
 *   Field    : one fullscreen shader quad (luminous flowing light) - camera-
 *              independent (writes clip space directly), renderOrder -1.
 *   Particles: ~1800 soft motes in 3D space - give real depth for the camera
 *              to push through.
 *   CameraRig: dollies in on intro (z 3.5 -> 2.5) and deeper on scroll, with a
 *              weighted pointer parallax.
 *   IntroDriver: computes one eased intro value (0..1) shared by every layer.
 *
 * Reads scroll from a plain ref (no React re-render per frame). Fully replaced
 * by a static gradient under reduced motion.
 */

const CAMERA_START_Z = 3.5;
const CAMERA_REST_Z = 2.5;
const INTRO_DURATION = 2.2; // seconds
const PARTICLE_COUNT = 1800;

type AtmosphereProps = {
  active: boolean;
  scrollProgressRef: MutableRefObject<number>;
};

// easeOutExpo
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const REVEAL_SPAN = 3.6; // images stagger in over this many seconds AFTER the intro
const SAFE_PX = 140; // reserved top zone — no image planes may rest behind the navbar
const _ndc = new THREE.Vector3(); // reused per-frame projection scratch (no alloc)

/**
 * IntroDriver — one shared clock. `introRef` (0..1) plays over INTRO_DURATION for
 * the shader/camera/typography. `revealRef` (0..1) stays at 0 for the whole intro
 * (the visitor sees only light) and only begins AFTER it, easing over REVEAL_SPAN
 * so the floating images can surface one at a time.
 */
function IntroDriver({
  active,
  introRef,
  revealRef,
}: {
  active: boolean;
  introRef: MutableRefObject<number>;
  revealRef: MutableRefObject<number>;
}) {
  const startRef = useRef<number | null>(null);

  useFrame((state) => {
    if (!active) return;
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startRef.current;
    introRef.current = easeOutExpo(Math.min(elapsed / INTRO_DURATION, 1));
    const post = elapsed - INTRO_DURATION;
    revealRef.current = post > 0 ? easeOutCubic(Math.min(post / REVEAL_SPAN, 1)) : 0;
  });

  return null;
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/* ── Floating memory layers ───────────────────────────────────────────────
 * Five photographic textures suspended as volumetric planes at real depths.
 * A soft radial mask dissolves the rectangle edges (never a card), a delicate
 * rim catches the light, and far layers haze toward the atmosphere. All motion
 * runs inside useFrame — no React re-render per frame. */

const layerVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const layerFragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform float uOpacity;
  uniform float uDepthFade;
  uniform float uRim;
  uniform vec3 uAtmos;
  uniform vec3 uRimColor;
  uniform float uLight;      // how much this layer sits in the daylight (0..1)
  uniform vec3 uLightColor;
  varying vec2 vUv;
  void main() {
    vec4 tex = texture2D(uTex, vUv);
    vec3 col = tex.rgb;
    // soft oval mask kills the hard rectangle — the image reads as a memory
    vec2 c = (vUv - 0.5) * 2.0;
    float r = length(c * vec2(0.94, 1.0));
    float mask = smoothstep(1.04, 0.28, r);
    // delicate rim light along the falloff band
    float rim = smoothstep(0.68, 0.99, r) * (1.0 - smoothstep(0.99, 1.12, r));
    col += uRimColor * rim * uRim;
    // daylight from the upper-left softly grazes the surface — brighter toward
    // the light, and the lit edge catches a touch more rim.
    float lightGrad = smoothstep(0.1, 1.0, (1.0 - vUv.x) * 0.6 + vUv.y * 0.4);
    col += uLightColor * lightGrad * uLight * 0.14;
    col += uRimColor * rim * uLight * 0.18;
    // atmospheric haze — far layers dissolve toward the ambient light
    col = mix(col, uAtmos, uDepthFade);
    float alpha = tex.a * mask * uOpacity;
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

type LayerConfig = {
  src: string;
  z: number; // resting depth
  scale: number;
  pos: [number, number];
  rot: number;
  opacity: number;
  parallax: number; // pointer-parallax weight (near = more)
  depthFade: number; // atmospheric haze / softness (far = more)
  revealDelay: number; // staggered emergence 0..1 (against the post-intro clock)
  zScroll: number; // travel toward camera on scroll (near = more → passes by)
  yScroll: number; // rise upward into the atmosphere on scroll (near = more)
  ampX: number;
  ampY: number;
  orb: number; // orbital radius
};

// 1 closest · 2 middle · 3 far · 4 very far · 5 medium — nothing aligned. Resting
// Y sits below the top safe zone; scroll lifts them up into the upper hero.
const LAYERS: LayerConfig[] = [
  { src: "/images/herohome/1.png", z: 1.05, scale: 1.35, pos: [0.95, -0.42], rot: -0.06, opacity: 0.92, parallax: 1.0, depthFade: 0.0, revealDelay: 0.0, zScroll: 2.3, yScroll: 0.7, ampX: 0.10, ampY: 0.13, orb: 0.05 },
  { src: "/images/herohome/2.png", z: -0.15, scale: 1.7, pos: [-1.45, 0.24], rot: 0.05, opacity: 0.82, parallax: 0.68, depthFade: 0.12, revealDelay: 0.16, zScroll: 1.5, yScroll: 0.5, ampX: 0.09, ampY: 0.11, orb: 0.045 },
  { src: "/images/herohome/3.png", z: -1.7, scale: 2.25, pos: [1.7, 0.38], rot: -0.04, opacity: 0.6, parallax: 0.36, depthFade: 0.32, revealDelay: 0.32, zScroll: 0.9, yScroll: 0.34, ampX: 0.07, ampY: 0.09, orb: 0.038 },
  { src: "/images/herohome/4.png", z: -3.1, scale: 3.1, pos: [-2.0, -0.95], rot: 0.03, opacity: 0.5, parallax: 0.22, depthFade: 0.46, revealDelay: 0.46, zScroll: 0.55, yScroll: 0.22, ampX: 0.06, ampY: 0.07, orb: 0.03 },
  { src: "/images/herohome/5.png", z: -0.8, scale: 1.95, pos: [-0.15, 0.58], rot: 0.02, opacity: 0.72, parallax: 0.52, depthFade: 0.2, revealDelay: 0.24, zScroll: 1.2, yScroll: 0.45, ampX: 0.08, ampY: 0.10, orb: 0.042 },
];

const ATMOS_COLOR = new THREE.Color(0.93, 0.95, 0.965);
const RIM_COLOR = new THREE.Color(0.86, 0.95, 0.93);
const DAYLIGHT_COLOR = new THREE.Color(1.0, 0.99, 0.95);

function Layer({
  config,
  introRef,
  revealRef,
  scrollProgressRef,
}: {
  config: LayerConfig;
  introRef: MutableRefObject<number>;
  revealRef: MutableRefObject<number>;
  scrollProgressRef: MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const tex = useTexture(config.src);
  const { gl } = useThree();

  // one-time texture grade: sRGB, mipmapped (cheap far-softness), anisotropic.
  const aspect = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = gl.capabilities.getMaxAnisotropy();
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
    const img = tex.image as { width: number; height: number } | undefined;
    return img && img.height ? img.width / img.height : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uOpacity: { value: 0 },
      uDepthFade: { value: config.depthFade },
      uRim: { value: 0.28 },
      uAtmos: { value: ATMOS_COLOR },
      uRimColor: { value: RIM_COLOR },
      uLight: { value: 0 },
      uLightColor: { value: DAYLIGHT_COLOR },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // per-layer organic phase — irrational-ish frequencies so nothing repeats.
  const ph = useMemo(
    () => ({
      fx: 0.11 + Math.random() * 0.07,
      fy: 0.09 + Math.random() * 0.06,
      fo: 0.05 + Math.random() * 0.04,
      fr: 0.07 + Math.random() * 0.05,
      fs: 0.08 + Math.random() * 0.05,
      px: Math.random() * 6.28,
      py: Math.random() * 6.28,
      po: Math.random() * 6.28,
      pr: Math.random() * 6.28,
      ps: Math.random() * 6.28,
    }),
    []
  );

  useFrame((state) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    const t = state.clock.elapsedTime;
    const intro = introRef.current;
    const reveal = revealRef.current;
    const scroll = scrollProgressRef.current;

    // eased, staggered emergence — gated to AFTER the intro (0..1 reveal clock),
    // so 0–2s the visitor sees only light, then images surface one at a time.
    const rev = smoothstep(config.revealDelay, config.revealDelay + 0.42, reveal);

    // slow organic drift + small orbital motion (extremely small amplitudes)
    const driftX = Math.sin(t * ph.fx + ph.px) * config.ampX + Math.cos(t * ph.fo + ph.po) * config.orb;
    const driftY = Math.sin(t * ph.fy + ph.py) * config.ampY + Math.sin(t * ph.fo + ph.po) * config.orb;

    // pointer parallax — near layers respond more
    const parX = state.pointer.x * config.parallax * 0.22 * intro;
    const parY = state.pointer.y * config.parallax * 0.14 * intro;

    mesh.position.x = config.pos[0] + driftX + parX;
    // rise upward into the atmosphere on scroll (tied to scroll progress)
    mesh.position.y = config.pos[1] + driftY + parY + scroll * config.yScroll;
    // emerge from a touch deeper, then travel toward camera on scroll
    mesh.position.z = config.z - (1 - rev) * 0.7 + scroll * config.zScroll;

    // whisper of rotation + breathing scale (0.98 → 1 on reveal)
    mesh.rotation.z = config.rot + Math.sin(t * ph.fr + ph.pr) * 0.02;
    const breathe = 1 + Math.sin(t * ph.fs + ph.ps) * 0.02;
    const s = config.scale * breathe * (0.98 + 0.02 * rev);
    mesh.scale.set(s * aspect, s, 1);

    // dissolve into atmosphere as it passes the camera (foreground travels by)
    const dz = state.camera.position.z - mesh.position.z;
    const passFade = smoothstep(0.12, 1.0, dz);

    // HERO SAFE ZONE — reserve ~140px at the top for shader/particles/light only.
    // Strong at rest (scroll≈0) so no plane rests behind the transparent navbar;
    // it relaxes once the visitor scrolls, letting layers rise into the upper hero.
    _ndc.set(mesh.position.x, mesh.position.y, mesh.position.z).project(state.camera);
    const reserveNdc = 1 - (2 * SAFE_PX) / state.size.height;
    const inZone = smoothstep(reserveNdc - 0.22, reserveNdc + 0.05, _ndc.y);
    const initialGuard = 1 - smoothstep(0.0, 0.1, scroll);
    const safeFade = 1 - inZone * initialGuard;

    mat.uniforms.uOpacity.value = config.opacity * rev * passFade * safeFade;

    // daylight enters from the upper-left — layers seated toward it catch more.
    const lit = smoothstep(-1.6, 1.6, -mesh.position.x + mesh.position.y);
    mat.uniforms.uLight.value = lit * rev;
  });

  return (
    <mesh ref={meshRef} position={[config.pos[0], config.pos[1], config.z]} renderOrder={0}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={layerVertexShader}
        fragmentShader={layerFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest
        toneMapped={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

function FloatingImages({
  introRef,
  revealRef,
  scrollProgressRef,
}: {
  introRef: MutableRefObject<number>;
  revealRef: MutableRefObject<number>;
  scrollProgressRef: MutableRefObject<number>;
}) {
  return (
    <group>
      {LAYERS.map((config) => (
        <Layer
          key={config.src}
          config={config}
          introRef={introRef}
          revealRef={revealRef}
          scrollProgressRef={scrollProgressRef}
        />
      ))}
    </group>
  );
}

function Field({
  introRef,
  scrollProgressRef,
}: {
  introRef: MutableRefObject<number>;
  scrollProgressRef: MutableRefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointerEased = useRef(new THREE.Vector2(0.5, 0.62));
  const pointerTarget = useRef(new THREE.Vector2(0.5, 0.62));
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uPointer: { value: new THREE.Vector2(0.5, 0.62) },
      uIntensity: { value: 0 },
      uScroll: { value: 0 },
      uProximity: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uResolution.value.set(size.width, size.height);
    mat.uniforms.uIntensity.value = introRef.current;
    mat.uniforms.uScroll.value = scrollProgressRef.current;
    // camera closeness to the bright field — grows as the dolly pushes in
    // (z decreases from 3.5 → ~1.9, so invert the ascending smoothstep).
    mat.uniforms.uProximity.value =
      1 - THREE.MathUtils.smoothstep(state.camera.position.z, 1.9, 3.5);

    pointerTarget.current.set((state.pointer.x + 1) / 2, (state.pointer.y + 1) / 2);
    pointerEased.current.lerp(pointerTarget.current, 0.04);
    mat.uniforms.uPointer.value.copy(pointerEased.current);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function Particles({
  scrollProgressRef,
  introRef,
}: {
  scrollProgressRef: MutableRefObject<number>;
  introRef: MutableRefObject<number>;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, scales, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 8; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5; // y
      positions[i * 3 + 2] = Math.random() * 3 - 2.2; // z (-2.2 .. 0.8)
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
      uSize: { value: 46 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(0.16, 0.36, 0.46) },
    }),
    []
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uScroll.value = scrollProgressRef.current;
    mat.uniforms.uReveal.value = introRef.current;
    mat.uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 1.5);

    // Coherent orbit - the depth reads as one organism of light circling the
    // core, not scattered dust. Slow z-swirl + a whisper of y for shimmer, plus
    // a barely-there flow so the motes drift around the floating image layers
    // like microscopic energy (never random).
    if (pointsRef.current) {
      const t = state.clock.elapsedTime;
      pointsRef.current.rotation.z += delta * 0.018;
      pointsRef.current.rotation.y = Math.sin(t * 0.05) * 0.12;
      pointsRef.current.position.x = Math.cos(t * 0.06) * 0.06;
      pointsRef.current.position.y = Math.sin(t * 0.08) * 0.05;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={1}>
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

function CameraRig({
  introRef,
  scrollProgressRef,
}: {
  introRef: MutableRefObject<number>;
  scrollProgressRef: MutableRefObject<number>;
}) {
  const { camera } = useThree();

  useFrame((state) => {
    const intro = introRef.current;
    const scroll = scrollProgressRef.current;

    // dolly: push in on intro, deeper on scroll
    const targetZ = lerp(CAMERA_START_Z, CAMERA_REST_Z, intro) - scroll * 0.7;
    camera.position.z = lerp(camera.position.z, targetZ, 0.1);

    // weighted pointer parallax - a barely-there lean into the space
    const targetX = state.pointer.x * 0.2 * intro;
    const targetY = state.pointer.y * 0.12 * intro;
    camera.position.x = lerp(camera.position.x, targetX, 0.04);
    camera.position.y = lerp(camera.position.y, targetY, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function HeroAtmosphere({ active, scrollProgressRef }: AtmosphereProps) {
  const reducedMotion = usePrefersReducedMotion();
  const introRef = useRef(0);
  const revealRef = useRef(0);

  if (reducedMotion) {
    return <HeroBackdropStatic />;
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, CAMERA_START_Z], fov: 50 }}
        onCreated={({ gl }) => gl.setClearColor("#FAFBFC", 1)}
        style={{ width: "100%", height: "100%" }}
      >
        <IntroDriver active={active} introRef={introRef} revealRef={revealRef} />
        <Field introRef={introRef} scrollProgressRef={scrollProgressRef} />
        <Suspense fallback={null}>
          <FloatingImages
            introRef={introRef}
            revealRef={revealRef}
            scrollProgressRef={scrollProgressRef}
          />
        </Suspense>
        <Particles scrollProgressRef={scrollProgressRef} introRef={introRef} />
        <CameraRig introRef={introRef} scrollProgressRef={scrollProgressRef} />
      </Canvas>
    </div>
  );
}

/** Static fallback that matches the shader's resting palette. */
export function HeroBackdropStatic() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 62%, #FFFFFF 0%, #FAFBFC 45%, #EEF3F6 100%)",
      }}
    />
  );
}
