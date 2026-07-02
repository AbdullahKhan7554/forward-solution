/**
 * Particle depth layer - soft motes of light drifting in the scientific field.
 *
 * These give the hero genuine 3D depth so the camera can push *through* space
 * rather than merely scale a flat image. On the luminous background they read
 * as the faintest cool specks - dust in a sunbeam, not a starfield.
 *
 * Round, soft-edged points via gl_PointCoord falloff; size attenuates with
 * distance so nearer motes are larger. One draw call for the whole layer.
 */

export const particlesVertexShader = /* glsl */ `
  precision highp float;

  attribute float aScale;
  attribute float aSpeed;

  uniform float uTime;
  uniform float uScroll;
  uniform float uSize;
  uniform float uPixelRatio;

  varying float vFade;

  void main() {
    vec3 pos = position;

    // slow organic drift - each mote on its own gentle current
    pos.x += cos(uTime * 0.12 * aSpeed + position.y * 1.8) * 0.06;
    pos.y += sin(uTime * 0.15 * aSpeed + position.x * 1.6) * 0.06;

    // scroll pushes the field gently toward the lens (parallax with camera)
    pos.z += uScroll * 0.9;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // perspective size attenuation
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / max(-mv.z, 0.1));

    // fade motes that drift behind the camera plane
    vFade = smoothstep(-2.5, 0.5, mv.z) * aScale;
  }
`;

export const particlesFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColor;
  uniform float uReveal;
  uniform float uScroll;

  varying float vFade;

  void main() {
    // soft round falloff
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float alpha = smoothstep(0.5, 0.0, d);

    // fade in on intro, dissolve into the light on exit (bookend)
    alpha *= 0.30 * vFade * uReveal * (1.0 - uScroll * 0.85);
    if (alpha < 0.002) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`;
