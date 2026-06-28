import React, { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "../../lib/motion";
import styles from "./Earth3D.module.css";

// ─────────────────────────────────────────────────────────────────────────
// 01C / "Amara" — a realistic Blue Marble that GENERATES itself from a single
// gold "prompt" point: stars ignite, a gold generation-frontier sweeps the
// textured planet into existence (continents assembling from dust), clouds
// condense, the blue atmosphere blooms, night-side cities flicker on, then it
// settles into a slow, majestic rotation. Raw three.js + R3F (no drei).
//
// Lighting is bespoke (single fixed WORLD-space sun). Because the sun is fixed
// in world space and the globe spins, the day/night terminator sweeps across
// the continents naturally. Custom ShaderMaterials throughout; every visible
// shader ends with <tonemapping_fragment> then <colorspace_fragment> because
// R3F v8 runs ACESFilmic tone mapping + sRGB output by default and a raw
// ShaderMaterial does NOT auto-inject the output transform.
// ─────────────────────────────────────────────────────────────────────────

const TEX_URLS = [
  "/textures/earth_day.jpg", // sRGB color (Blue Marble)
  "/textures/earth_clouds.png", // RGBA, alpha = cloud coverage
  "/textures/earth_specular.jpg", // linear data: ocean = white, land = black
  "/textures/earth_normal.jpg", // linear data: tangent-space normal
  "/textures/earth_lights.png", // sRGB color: night city lights
];

const GOLD_HEX = "#E7D99F"; // brand "heavenly gold"
const ATMO_HEX = "#6BA8E0"; // soft atmospheric blue
const SUN_DIR = new THREE.Vector3(0.7, 0.25, 0.6).normalize();
const AXIAL_TILT = 0.4101524; // 23.44° in radians

// ── timeline easing helpers (pure JS) ──────────────────────────────────────
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => {
  x = clamp01(x);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

// ── GLSL ────────────────────────────────────────────────────────────────────
const EARTH_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vObjNormal;
  varying float vBuildCoord;
  uniform float uBuild;
  uniform float uTime;
  uniform float uReduced;

  void main() {
    vUv = uv;
    vec3 n = normalize(normal);
    vObjNormal = n;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;

    // Generation sweep tied to the SURFACE (object space) so it never appears
    // to rotate while spin is frozen during the build. 0 (far side) -> 1 (prompt).
    vec3 sweepAxis = normalize(vec3(0.35, 0.55, 1.0));
    vBuildCoord = dot(n, sweepAxis) * 0.5 + 0.5;

    // Frontier travels from the prompt point across the globe as uBuild 0->1.
    float frontier = mix(1.12, -0.16, uBuild);
    float d = vBuildCoord - frontier;
    float forming = 1.0 - smoothstep(0.0, 0.12, d); // 1 just-forming -> 0 settled
    float jitter = (uReduced > 0.5)
      ? 0.0
      : forming * 0.045 * sin(position.x * 38.0 + uTime * 6.0)
                       * cos(position.y * 33.0 - uTime * 5.0);
    // Forming surface rises out from slightly inside as it resolves.
    vec3 displaced = position + n * (jitter - forming * 0.03);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const EARTH_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vObjNormal;
  varying float vBuildCoord;

  uniform sampler2D uDay;
  uniform sampler2D uSpec;
  uniform sampler2D uNormal;
  uniform sampler2D uLights;
  uniform vec3 uSunWorld;
  uniform vec3 uGold;
  uniform float uBuild;
  uniform float uTime;
  uniform float uReduced;

  // Derivative-based TBN (core in WebGL2 / #version 300 es — no extension).
  vec3 perturbNormal(vec3 N, vec3 wp, vec2 uv) {
    vec3 dp1 = dFdx(wp), dp2 = dFdy(wp);
    vec2 du1 = dFdx(uv), du2 = dFdy(uv);
    vec3 dp2p = cross(dp2, N), dp1p = cross(N, dp1);
    vec3 T = dp2p * du1.x + dp1p * du2.x;
    vec3 B = dp2p * du1.y + dp1p * du2.y;
    float invmax = inversesqrt(max(dot(T, T), dot(B, B)));
    mat3 TBN = mat3(T * invmax, B * invmax, N);
    vec3 mn = texture2D(uNormal, uv).xyz * 2.0 - 1.0;
    mn.xy *= 0.6; // soften relief / seam shimmer
    return normalize(TBN * mn);
  }
  float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

  void main() {
    // ── build reveal ──────────────────────────────────────────────────────
    float grain = (hash(floor(vUv * 256.0)) - 0.5) * 0.05;
    float frontier = mix(1.12, -0.16, uBuild);
    float d = vBuildCoord - frontier;
    float edge = 0.12;
    float built = smoothstep(0.0, edge, d + grain); // 0 unborn -> 1 born
    if (built <= 0.001) discard;

    // ── lighting (world-space, single fixed sun) ───────────────────────────
    vec3 Nworld = normalize(vWorldPos);
    vec3 Nbump = perturbNormal(Nworld, vWorldPos, vUv);
    vec3 L = normalize(uSunWorld);
    float NdL = dot(Nworld, L);
    float day = smoothstep(-0.12, 0.20, NdL);

    vec3 albedo = texture2D(uDay, vUv).rgb; // already linear (sRGB sampler)
    float ocean = texture2D(uSpec, vUv).r; // white = water

    // Sky fill: faint cool scatter, but only on the lit/twilight side so the
    // night hemisphere falls toward true black.
    vec3 ambient = albedo * 0.04 + vec3(0.0, 0.006, 0.018) * day;

    // Diffuse with real sun intensity so highlights reach the ACES roll-off and
    // the Blue Marble reads vivid (not muddy); plus a touch of ocean blue.
    float diff = max(dot(Nbump, L), 0.0);
    diff = mix(max(NdL, 0.0), diff, 0.6); // temper bump so it can't over-darken
    vec3 diffuse = albedo * diff * 1.75 + vec3(0.0, 0.02, 0.05) * ocean * diff;

    // Ocean sun glint (gated by spec map + lit side). A tight, point-like
    // highlight: high exponent + a mostly-smooth normal so relief doesn't
    // smear it into a broad hotspot.
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 Nspec = normalize(mix(Nworld, Nbump, 0.3));
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(Nspec, H), 0.0), 220.0)
               * ocean * smoothstep(0.0, 0.22, max(NdL, 0.0));
    vec3 specCol = mix(vec3(1.0), uGold, 0.6) * spec * 1.1;

    // Heavenly-gold sunrise band along the terminator.
    float term = clamp(1.0 - abs(NdL) * 4.0, 0.0, 1.0)
               * smoothstep(-0.3, 0.0, NdL + 0.15);
    vec3 termGlow = uGold * term * 0.10;

    // Night-side cities, confined to the true dark side by an independent steep
    // gate (so they never bleed into the gold terminator), booting up as their
    // region is generated.
    vec3 lightsTex = texture2D(uLights, vUv).rgb;
    float cnight = smoothstep(0.05, -0.25, NdL); // 1 only well past the terminator
    float bornAge = clamp((d + grain) / 0.6, 0.0, 1.0);
    float flick = (uReduced > 0.5)
      ? 1.0
      : mix(0.65 + 0.35 * sin(uTime * 9.0 + hash(floor(vUv * 180.0)) * 30.0),
            1.0, smoothstep(0.7, 1.0, uBuild));
    float boot = smoothstep(0.2, 0.95, bornAge) * flick;
    vec3 cityGlow = lightsTex * cnight * cnight * vec3(1.0, 0.82, 0.5) * 2.2 * boot;

    vec3 color = ambient + diffuse + specCol + termGlow + cityGlow;

    // Bright gold generation frontier riding the reveal edge.
    float band = smoothstep(edge, 0.0, abs(d + grain))
               * (1.0 - smoothstep(0.92, 1.0, uBuild));
    color += uGold * band * 2.4;

    // Dust shimmer just ahead of the frontier.
    float ahead = 1.0 - built;
    float dust = (uReduced > 0.5)
      ? 0.0
      : ahead * (0.5 + 0.5 * sin(vObjNormal.x * 60.0 + uTime * 8.0))
              * (0.5 + 0.5 * cos(vObjNormal.y * 55.0 - uTime * 7.0));
    color += uGold * dust * 0.22;

    float alpha = max(built, band * 0.6);
    if (uReduced > 0.5) alpha = 1.0;

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const CLOUD_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CLOUD_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform sampler2D uClouds;
  uniform vec3 uSunWorld;
  uniform float uReveal;
  uniform float uTime;
  uniform float uReduced;
  void main() {
    vec2 uv = vUv;
    uv.x += uTime * 0.004 * (1.0 - uReduced); // gentle east-west drift
    vec4 c = texture2D(uClouds, uv);
    float cover = c.a;
    if (cover < 0.01) discard;
    vec3 N = normalize(vWorldPos);
    float NdL = dot(N, normalize(uSunWorld));
    float day = smoothstep(-0.1, 0.25, NdL);
    vec3 col = mix(vec3(0.02, 0.03, 0.05), vec3(1.0), day);
    float alpha = cover * uReveal * (0.02 + 0.98 * day);
    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const ATMO_VERT = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMO_FRAG = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  uniform vec3 uAtmoColor;
  uniform vec3 uGold;
  uniform vec3 uSunWorld;
  uniform float uIntensity;
  void main() {
    vec3 N = normalize(-vWorldNormal); // BackSide -> flip to outward normal
    vec3 V = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float sun = clamp(dot(N, normalize(uSunWorld)), 0.0, 1.0);
    vec3 rim = mix(uAtmoColor, uGold, sun * 0.5);
    float a = fres * uIntensity;
    gl_FragColor = vec4(rim * fres * (0.8 + sun * 0.6), a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vTw;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uReduced;
  void main() {
    vColor = aColor;
    float tw = 0.6 + 0.4 * sin(uTime * 1.5 + position.x * 0.7 + position.y * 1.3);
    vTw = mix(tw, 0.9, uReduced);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (170.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vTw;
  uniform float uReveal;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r = length(d);
    float a = smoothstep(0.5, 0.0, r) * vTw * uReveal;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// ── scene ───────────────────────────────────────────────────────────────────
function Scene({ active, reduced }) {
  const gl = useThree((s) => s.gl);
  const [dayTex, cloudTex, specTex, normalTex, lightsTex] = useLoader(
    THREE.TextureLoader,
    TEX_URLS
  );

  // Configure textures (after commit, before paint — nothing is drawn until the
  // build latches, so there is no flash of unconfigured texture).
  useLayoutEffect(() => {
    const color = [dayTex, lightsTex, cloudTex];
    const data = [specTex, normalTex];
    color.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
    data.forEach((t) => (t.colorSpace = THREE.NoColorSpace));
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    [dayTex, cloudTex, specTex, normalTex, lightsTex].forEach((t) => {
      t.anisotropy = Math.min(8, maxAniso);
      t.wrapS = THREE.RepeatWrapping; // longitude is periodic
      t.wrapT = THREE.ClampToEdgeWrapping; // clamp at poles
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.needsUpdate = true;
    });
  }, [dayTex, cloudTex, specTex, normalTex, lightsTex, gl]);

  const earthMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uDay: { value: dayTex },
          uSpec: { value: specTex },
          uNormal: { value: normalTex },
          uLights: { value: lightsTex },
          uSunWorld: { value: SUN_DIR.clone() },
          uGold: { value: new THREE.Color(GOLD_HEX).convertSRGBToLinear() },
          uBuild: { value: 0 },
          uTime: { value: 0 },
          uReduced: { value: reduced ? 1 : 0 },
        },
        vertexShader: EARTH_VERT,
        fragmentShader: EARTH_FRAG,
        transparent: true,
        depthWrite: true,
      }),
    [dayTex, specTex, normalTex, lightsTex, reduced]
  );

  const cloudMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uClouds: { value: cloudTex },
          uSunWorld: { value: SUN_DIR.clone() },
          uReveal: { value: 0 },
          uTime: { value: 0 },
          uReduced: { value: reduced ? 1 : 0 },
        },
        vertexShader: CLOUD_VERT,
        fragmentShader: CLOUD_FRAG,
        transparent: true,
        depthWrite: false,
      }),
    [cloudTex, reduced]
  );

  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uAtmoColor: { value: new THREE.Color(ATMO_HEX).convertSRGBToLinear() },
          uGold: { value: new THREE.Color(GOLD_HEX).convertSRGBToLinear() },
          uSunWorld: { value: SUN_DIR.clone() },
          uIntensity: { value: 0 },
        },
        vertexShader: ATMO_VERT,
        fragmentShader: ATMO_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const stars = useMemo(() => {
    const isMobile =
      typeof window !== "undefined" && window.innerWidth < 768;
    const count = isMobile ? 700 : 1300;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = 34 + Math.random() * 30;
      positions[i * 3] = r * s * Math.cos(th);
      positions[i * 3 + 1] = r * u;
      positions[i * 3 + 2] = r * s * Math.sin(th);
      if (Math.random() < 0.16) c.set(GOLD_HEX);
      else c.setHSL(0.6, 0.12, 0.78 + Math.random() * 0.22);
      c.convertSRGBToLinear();
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = (Math.random() < 0.08 ? 2.3 : 1.0) * (0.6 + Math.random() * 0.9);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    const pr =
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 1.75)
        : 1;
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uPixelRatio: { value: pr },
        uReduced: { value: reduced ? 1 : 0 },
      },
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    return { geo, mat };
  }, [reduced]);

  const spinRef = useRef();
  const userRotRef = useRef(); // user drag: spin (y) + tilt (x)
  const parallaxRef = useRef(); // subtle cursor parallax when idle
  const drag = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    rotY: 0,
    rotX: 0,
    velY: 0,
    velX: 0,
  });
  const pointer = useRef({ x: 0, y: 0, has: false });
  const build = useRef({ latched: false, t: 0, done: false });

  // Snap every animated value to its finished state.
  const applyComplete = () => {
    earthMat.uniforms.uBuild.value = 1;
    cloudMat.uniforms.uReveal.value = 1;
    atmoMat.uniforms.uIntensity.value = 0.85;
    stars.mat.uniforms.uReveal.value = 1;
  };

  useEffect(() => {
    return () => {
      earthMat.dispose();
      cloudMat.dispose();
      atmoMat.dispose();
      stars.mat.dispose();
      stars.geo.dispose();
    };
  }, [earthMat, cloudMat, atmoMat, stars]);

  // ── grab-and-spin: pointer drag rotates the globe with inertia, and the
  // cursor gently parallaxes it when idle. Works for mouse + touch + pen via
  // Pointer Events; `touch-action: none` keeps a drag from scrolling the page.
  useEffect(() => {
    const el = gl.domElement;
    const SPEED = 0.005; // radians per pixel dragged
    const TILT = 0.6; // clamp on vertical tilt (radians)
    const onDown = (e) => {
      const d = drag.current;
      d.active = true;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.velY = 0;
      d.velX = 0;
      el.style.cursor = "grabbing";
      // Don't capture touch pointers — let the browser keep ownership so a
      // vertical swipe can still scroll the page (see touch-action: pan-y).
      if (e.pointerType !== "touch") {
        try {
          el.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointer.current.has = true;
      const d = drag.current;
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.lastY;
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.rotY += dx * SPEED;
      d.rotX = Math.max(-TILT, Math.min(TILT, d.rotX + dy * SPEED));
      // low-passed velocity so the inertial fling reads smooth
      d.velY = d.velY * 0.6 + dx * SPEED * 0.4;
      d.velX = d.velX * 0.6 + dy * SPEED * 0.4;
    };
    const onUp = (e) => {
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      el.style.cursor = "grab";
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };
    const onLeave = () => {
      pointer.current.has = false;
    };
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    earthMat.uniforms.uTime.value = t;
    cloudMat.uniforms.uTime.value = t;
    stars.mat.uniforms.uTime.value = t;

    const B = build.current;
    if (active && !B.latched) {
      B.latched = true;
      B.t = 0;
      if (reduced) {
        applyComplete();
        B.done = true;
      }
    }
    if (!B.latched) return; // nothing renders until the scene is first entered
    if (!active && B.done) return; // idle/paused off-screen once finished

    if (!reduced && !B.done) {
      B.t += dt;
      const T = B.t;
      earthMat.uniforms.uBuild.value = easeInOut(seg(T, 0.3, 3.0));
      cloudMat.uniforms.uReveal.value = easeOut(seg(T, 1.6, 3.4));
      atmoMat.uniforms.uIntensity.value = easeOut(seg(T, 2.0, 3.6)) * 0.85;
      stars.mat.uniforms.uReveal.value = easeOut(seg(T, 0.0, 0.6));
      if (T >= 4.4) {
        applyComplete();
        B.done = true;
      }
    }

    if (!reduced && spinRef.current) {
      // Spin frozen during the hero sweep, then eased into a slow rotation.
      const spinGain = B.done ? 1 : easeInOut(seg(B.t, 3.2, 4.4));
      spinRef.current.rotation.y += dt * 0.05 * spinGain;
    }

    // ── user orientation: inertial drag + idle cursor parallax ───────────
    const d = drag.current;
    if (userRotRef.current) {
      if (!d.active) {
        // glide to rest after a fling — both the step and the decay are
        // normalized to 60fps frames so the throw feels identical at any
        // display refresh rate (60Hz, 120Hz, …).
        const f = dt * 60;
        const decay = Math.pow(0.92, f);
        d.rotY += d.velY * f;
        d.rotX = Math.max(-0.6, Math.min(0.6, d.rotX + d.velX * f));
        d.velY *= decay;
        d.velX *= decay;
        if (reduced) {
          d.velY = 0;
          d.velX = 0;
        }
      }
      userRotRef.current.rotation.y = d.rotY;
      userRotRef.current.rotation.x = d.rotX;
    }
    if (parallaxRef.current) {
      const live = !reduced && !d.active && pointer.current.has;
      const tx = live ? pointer.current.y * 0.05 : 0;
      const ty = live ? pointer.current.x * 0.06 : 0;
      const k = 1 - Math.pow(0.0015, dt); // critically-damped-ish smoothing
      parallaxRef.current.rotation.x +=
        (tx - parallaxRef.current.rotation.x) * k;
      parallaxRef.current.rotation.y +=
        (ty - parallaxRef.current.rotation.y) * k;
    }
  });

  return (
    <>
      <points
        geometry={stars.geo}
        material={stars.mat}
        renderOrder={-1}
        frustumCulled={false}
      />
      <group ref={parallaxRef}>
        <group ref={userRotRef}>
          <group rotation={[AXIAL_TILT, 0, 0]}>
            <group ref={spinRef}>
              <mesh renderOrder={0}>
                <sphereGeometry args={[1, 96, 64]} />
                <primitive object={earthMat} attach="material" />
              </mesh>
              <mesh renderOrder={1}>
                <sphereGeometry args={[1.012, 96, 64]} />
                <primitive object={cloudMat} attach="material" />
              </mesh>
            </group>
            <mesh renderOrder={2}>
              <sphereGeometry args={[1.18, 64, 48]} />
              <primitive object={atmoMat} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}

export default function Earth3D({ active }) {
  const reduced = useMemo(() => prefersReducedMotion(), []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 5.6], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <React.Suspense fallback={null}>
          <Scene active={active} reduced={reduced} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
