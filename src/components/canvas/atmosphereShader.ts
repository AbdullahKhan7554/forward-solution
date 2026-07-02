/**
 * Atmosphere shader - Scene 01 "The Threshold".
 *
 * A luminous scientific field with a single ASYMMETRIC core of light in the
 * upper-right - the source the headline surfaces from, and the axis the depth
 * particles orbit. Soft flowing FBM light over a near-white base; a whisper of
 * primary-blue in the troughs and emerald in the peaks (the biotech soul,
 * suggested never literal).
 *
 * uScroll blooms the whole field back toward pure white on exit - the scene
 * dissolves into the same light it was born from (the bookend).
 *
 * Everything is slow. Nothing pulses or flashes. Motion is felt, not seen.
 */

export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uIntensity;
  uniform float uScroll;
  uniform float uProximity; // camera closeness to the brighter areas (0..1)

  const vec3 BASE = vec3(0.980, 0.984, 0.988); // neutral/50 luminous white
  const vec3 BLUE = vec3(0.055, 0.298, 0.420); // primary/600
  const vec3 EMER = vec3(0.118, 0.620, 0.463); // accent/500

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = uv;
    p.x *= aspect;

    float t = uTime * 0.032;

    // slow-drifting flow field - the breathing light
    vec2 q = vec2(fbm(p * 1.4 + vec2(t, -t * 0.6)),
                  fbm(p * 1.4 + vec2(4.2 - t * 0.5, 1.3)));
    float flow = fbm(p * 1.8 + q * 1.2 + vec2(t * 0.4, t * 0.2));
    flow = smoothstep(-0.6, 0.9, flow);

    // ASYMMETRIC core of light (upper-right), gently breathing position
    vec2 core = vec2(0.70 + sin(uTime * 0.05) * 0.015,
                     0.66 + cos(uTime * 0.04) * 0.015);
    vec2 cd = uv - core;
    cd.x *= aspect;
    float coreDist = length(cd);
    float coreGlow = smoothstep(0.62, 0.0, coreDist);

    // pointer warmth - a barely-there lean of light toward the cursor
    float pointer = 1.0 - smoothstep(0.0, 0.9, distance(uv, uPointer));

    vec3 col = BASE;
    col = mix(col, BLUE, (1.0 - flow) * 0.09 * uIntensity);
    col = mix(col, EMER, flow * 0.045 * uIntensity);
    col += coreGlow * 0.13 * uIntensity;
    col += pointer * 0.05 * uIntensity * BLUE;

    // ── VOLUMETRIC GOD RAYS ───────────────────────────────────────────────
    // Soft daylight entering from the upper-left as parallel shafts. The light
    // origin and the beam texture drift slowly, so the daylight visibly changes
    // over time without ever pulsing. Physically plausible — no fake bloom.
    vec2 L = vec2(0.12 + sin(uTime * 0.018) * 0.02, 0.92 + cos(uTime * 0.013) * 0.015);
    vec2 bdir = normalize(vec2(0.82, -1.0));               // beam travel: down-right
    vec2 rel = uv - L; rel.x *= aspect;
    float along = dot(rel, bdir);
    float across = dot(rel, vec2(-bdir.y, bdir.x));
    float beams = fbm(vec2(across * 6.5, along * 1.1 - uTime * 0.035));
    beams = smoothstep(0.12, 0.85, beams);
    float env = smoothstep(0.0, 0.18, along)
              * smoothstep(1.35, 0.05, along)
              * smoothstep(1.0, 0.0, abs(across));
    float dayCycle = 0.82 + 0.18 * sin(uTime * 0.028);
    float godray = beams * env * dayCycle;
    vec3 daylight = vec3(1.0, 0.992, 0.965);
    col += godray * 0.085 * uIntensity * daylight;

    // dust motes — visible ONLY where they cross the light shafts
    float motes = smoothstep(0.82, 0.985,
      noise(uv * vec2(aspect, 1.0) * 165.0 + vec2(uTime * 0.05, -uTime * 0.11)));
    col += motes * godray * 0.16 * uIntensity * daylight;

    // ── SOFT LENS DIFFRACTION ─────────────────────────────────────────────
    // A delicate halo + anamorphic streak near the bright source, revealed only
    // as the camera passes close (uProximity). Faint spectral split, no glow.
    float toLight = length((uv - L) * vec2(aspect, 1.0));
    float halo = smoothstep(0.45, 0.0, toLight);
    float streak = smoothstep(0.5, 0.0, abs(uv.y - L.y) * 7.0)
                 * smoothstep(0.65, 0.0, abs(uv.x - L.x));
    vec3 chroma = vec3(1.03, 1.0, 0.97);                   // subtle diffraction tint
    col += (halo * 0.05 + streak * 0.045) * uProximity * uIntensity * chroma;

    // delicate vignette to hold the frame
    float vig = smoothstep(1.2, 0.35, distance(uv, vec2(0.5)));
    col *= mix(0.93, 1.0, vig);

    // fine grain so the gradient never looks digitally flat
    float grain = hash(uv * uResolution + t).x * 0.012;
    col += grain;

    // BOOKEND: bloom back to pure light on scroll-exit
    float bloom = pow(clamp(uScroll, 0.0, 1.0), 1.25);
    col = mix(col, vec3(1.0), bloom * 0.92);

    gl_FragColor = vec4(col, 1.0);
  }
`;
