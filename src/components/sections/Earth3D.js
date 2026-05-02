import React, { useRef, useLayoutEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./Earth3D.module.css";

// Place a child group on the sphere surface so its local +Y points outward.
function SurfaceItem({ theta, phi, r = 1, children }) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    ref.current.position.set(x, y, z);
    ref.current.lookAt(0, 0, 0);
    ref.current.rotateX(-Math.PI / 2);
  }, [theta, phi, r]);
  return <group ref={ref}>{children}</group>;
}

function House({ color = "#fef3c7", roof = "#dc2626" }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.085, 0.06, 4]} />
        <meshStandardMaterial color={roof} flatShading />
      </mesh>
    </group>
  );
}

function Tree() {
  return (
    <group>
      <mesh position={[0, 0.035, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.07, 6]} />
        <meshStandardMaterial color="#78350f" flatShading />
      </mesh>
      <mesh position={[0, 0.115, 0]}>
        <coneGeometry args={[0.065, 0.14, 6]} />
        <meshStandardMaterial color="#15803d" flatShading />
      </mesh>
    </group>
  );
}

// Continent centres + radii (in radians of great-circle distance) loosely
// inspired by Earth's real distribution: a big Eurasia-Africa landmass,
// the Americas, an Australia-like island, an Antarctica-like south cap,
// and some smaller bodies.
const CONTINENTS = [
  { theta: 0.7, phi: 0.95, radius: 0.78 }, // Eurasia / Africa
  { theta: 3.4, phi: 1.0, radius: 0.7 }, //  Americas
  { theta: 2.05, phi: 1.85, radius: 0.32 }, // Australia
  { theta: 0.0, phi: 2.75, radius: 0.55 }, //  Antarctica-ish south cap
  { theta: 4.4, phi: 0.45, radius: 0.28 }, //  Greenland-ish
  { theta: 5.55, phi: 1.55, radius: 0.22 }, // small island chain
];

function dirVec(theta, phi) {
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

const CONTINENT_DIRS = CONTINENTS.map((c) => ({
  ...c,
  dir: dirVec(c.theta, c.phi),
}));

// Smooth multi-octave 3D noise from layered sines. Range roughly [-0.18, 0.18].
function bumpNoise(x, y, z) {
  return (
    0.09 * Math.sin(x * 5.2 + 1.7) +
    0.07 * Math.sin(y * 6.4 + 0.4) +
    0.06 * Math.sin(z * 4.9 - 2.1) +
    0.04 * Math.sin((x + z) * 9.1 + 3.2) +
    0.04 * Math.sin((y - z) * 8.3 - 1.5)
  );
}

// True if the point on the unit sphere falls inside any continent's
// noisy great-circle disc.
function isLandPoint(v) {
  const noise = bumpNoise(v.x, v.y, v.z);
  for (const c of CONTINENT_DIRS) {
    const dot = Math.max(-1, Math.min(1, v.dot(c.dir)));
    const arc = Math.acos(dot); // 0 at centre, π at antipode
    if (arc + noise < c.radius) return true;
  }
  return false;
}

function buildEarthGeometry() {
  const geo = new THREE.SphereGeometry(1, 128, 96);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  const ocean = new THREE.Color("#1d4ed8");
  const land = new THREE.Color("#16a34a");
  const landDark = new THREE.Color("#15803d");
  const sand = new THREE.Color("#fde68a");

  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize();

    // Distance to nearest continent boundary (with noise) — used both
    // for colouring and elevation.
    const noise = bumpNoise(v.x, v.y, v.z);
    let minSigned = Infinity;
    for (const c of CONTINENT_DIRS) {
      const dot = Math.max(-1, Math.min(1, v.dot(c.dir)));
      const arc = Math.acos(dot);
      const signed = arc + noise - c.radius; // <0 inside, >0 outside
      if (signed < minSigned) minSigned = signed;
    }

    let r = 1;
    let color;
    if (minSigned < -0.025) {
      // Inland: green, slight bump.
      color = noise > 0 ? land : landDark;
      r = 1.012;
    } else if (minSigned < 0) {
      // Coast strip: sandy edge, very slight bump.
      color = sand;
      r = 1.005;
    } else {
      color = ocean;
    }

    pos.setXYZ(i, v.x * r, v.y * r, v.z * r);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function Cloud({ scale = 1 }) {
  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0.09, 0.02, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[-0.08, 0.015, 0.02]}>
        <sphereGeometry args={[0.065, 10, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0.04, 0.05, 0.04]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading roughness={0.9} />
      </mesh>
    </group>
  );
}

function pickLandPlacements(candidates) {
  // Filter the candidate (theta, phi) list to the ones that land on land
  // so houses/trees aren't planted in the middle of the ocean.
  return candidates.filter(({ theta, phi }) => isLandPoint(dirVec(theta, phi)));
}

const HOUSE_CANDIDATES = [
  { theta: 0.5, phi: 0.85, color: "#fef3c7", roof: "#dc2626" },
  { theta: 0.85, phi: 1.0, color: "#fed7aa", roof: "#b45309" },
  { theta: 1.1, phi: 1.15, color: "#fbcfe8", roof: "#9d174d" },
  { theta: 0.65, phi: 1.25, color: "#bfdbfe", roof: "#1e40af" },
  { theta: 3.3, phi: 0.9, color: "#fef3c7", roof: "#dc2626" },
  { theta: 3.6, phi: 1.1, color: "#e9d5ff", roof: "#7c3aed" },
  { theta: 3.1, phi: 1.25, color: "#fed7aa", roof: "#b45309" },
  { theta: 3.45, phi: 1.45, color: "#fef3c7", roof: "#dc2626" },
  { theta: 2.05, phi: 1.85, color: "#bbf7d0", roof: "#15803d" },
  { theta: 2.2, phi: 1.95, color: "#fbcfe8", roof: "#9d174d" },
  { theta: 4.4, phi: 0.45, color: "#bfdbfe", roof: "#1e40af" },
  { theta: 0.2, phi: 2.7, color: "#fef3c7", roof: "#dc2626" },
];

const TREE_CANDIDATES = [
  { theta: 0.4, phi: 0.78 },
  { theta: 0.7, phi: 0.92 },
  { theta: 0.95, phi: 1.05 },
  { theta: 1.2, phi: 1.2 },
  { theta: 0.55, phi: 1.32 },
  { theta: 0.3, phi: 1.05 },
  { theta: 3.2, phi: 0.85 },
  { theta: 3.5, phi: 1.0 },
  { theta: 3.7, phi: 1.18 },
  { theta: 3.0, phi: 1.18 },
  { theta: 3.4, phi: 1.35 },
  { theta: 2.0, phi: 1.78 },
  { theta: 2.15, phi: 1.92 },
  { theta: 1.95, phi: 1.95 },
  { theta: 4.35, phi: 0.42 },
  { theta: 4.5, phi: 0.5 },
  { theta: 0.6, phi: 2.65 },
  { theta: 5.1, phi: 2.78 },
  { theta: 5.55, phi: 1.55 },
];

function World() {
  const worldRef = useRef();
  const cloudsRef = useRef();
  const earthGeo = useMemo(() => buildEarthGeometry(), []);
  const houses = useMemo(() => pickLandPlacements(HOUSE_CANDIDATES), []);
  const trees = useMemo(() => pickLandPlacements(TREE_CANDIDATES), []);

  useFrame((_, dt) => {
    if (worldRef.current) worldRef.current.rotation.y += dt * 0.16;
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.05;
  });

  return (
    <>
      <group ref={worldRef}>
        {/* Earth: ocean + continents painted into a single sphere via
            vertex colours, with subtle outward displacement on land
            for relief. */}
        <mesh geometry={earthGeo}>
          <meshStandardMaterial vertexColors roughness={0.85} flatShading />
        </mesh>

        {houses.map((h, i) => (
          <SurfaceItem key={`h-${i}`} theta={h.theta} phi={h.phi} r={1.014}>
            <House color={h.color} roof={h.roof} />
          </SurfaceItem>
        ))}

        {trees.map((t, i) => (
          <SurfaceItem key={`t-${i}`} theta={t.theta} phi={t.phi} r={1.014}>
            <Tree />
          </SurfaceItem>
        ))}
      </group>

      {/* Cloud layer drifts independently above the surface */}
      <group ref={cloudsRef}>
        <SurfaceItem theta={0.8} phi={0.4} r={1.32}>
          <Cloud scale={1.1} />
        </SurfaceItem>
        <SurfaceItem theta={1.9} phi={0.65} r={1.32}>
          <Cloud scale={0.9} />
        </SurfaceItem>
        <SurfaceItem theta={3.2} phi={1.55} r={1.32}>
          <Cloud scale={1.15} />
        </SurfaceItem>
        <SurfaceItem theta={4.4} phi={0.5} r={1.32}>
          <Cloud scale={1.0} />
        </SurfaceItem>
        <SurfaceItem theta={5.6} phi={1.35} r={1.32}>
          <Cloud scale={0.85} />
        </SurfaceItem>
        <SurfaceItem theta={2.4} phi={0.95} r={1.32}>
          <Cloud scale={1.05} />
        </SurfaceItem>
        <SurfaceItem theta={1.4} phi={2.1} r={1.32}>
          <Cloud scale={1.05} />
        </SurfaceItem>
        <SurfaceItem theta={2.8} phi={1.85} r={1.32}>
          <Cloud scale={0.95} />
        </SurfaceItem>
        <SurfaceItem theta={4.2} phi={2.25} r={1.32}>
          <Cloud scale={1.1} />
        </SurfaceItem>
        <SurfaceItem theta={5.4} phi={2.0} r={1.32}>
          <Cloud scale={0.9} />
        </SurfaceItem>
      </group>
    </>
  );
}

export default function Earth3D() {
  return (
    <div className={styles.wrap}>
      <Canvas
        dpr={[1.25, 2]}
        camera={{ position: [0, 0.4, 5.6], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 4]} intensity={1.05} />
        <directionalLight
          position={[-3, -2, 2]}
          intensity={0.4}
          color="#7dd3fc"
        />
        <World />
      </Canvas>
    </div>
  );
}
