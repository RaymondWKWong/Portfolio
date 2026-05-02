import React, { useRef, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, 0.155, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.105, 0.07, 4]} />
        <meshStandardMaterial color={roof} flatShading />
      </mesh>
    </group>
  );
}

function Tree() {
  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.012, 0.018, 0.08, 6]} />
        <meshStandardMaterial color="#78350f" flatShading />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <coneGeometry args={[0.075, 0.16, 6]} />
        <meshStandardMaterial color="#15803d" flatShading />
      </mesh>
    </group>
  );
}

function Continent({ scale = 1 }) {
  return (
    <mesh position={[0, 0.012, 0]} scale={[scale, 0.32, scale]}>
      <sphereGeometry args={[0.22, 14, 14]} />
      <meshStandardMaterial color="#16a34a" flatShading />
    </mesh>
  );
}

function Cloud({ position }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[0.08, 0.02, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
      <mesh position={[-0.07, 0.01, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#ffffff" flatShading />
      </mesh>
    </group>
  );
}

function World() {
  const worldRef = useRef();
  const cloudsRef = useRef();
  useFrame((_, dt) => {
    if (worldRef.current) worldRef.current.rotation.y += dt * 0.18;
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.06;
  });

  return (
    <>
      <group ref={worldRef}>
        {/* Ocean sphere */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#2563eb" flatShading roughness={0.6} />
        </mesh>

        {/* Continents (slightly raised green patches) */}
        <SurfaceItem theta={0.4} phi={1.0}>
          <Continent scale={1.25} />
        </SurfaceItem>
        <SurfaceItem theta={1.6} phi={1.25}>
          <Continent scale={0.95} />
        </SurfaceItem>
        <SurfaceItem theta={2.9} phi={0.7}>
          <Continent scale={1.1} />
        </SurfaceItem>
        <SurfaceItem theta={4.5} phi={1.45}>
          <Continent scale={0.85} />
        </SurfaceItem>
        <SurfaceItem theta={5.6} phi={0.9}>
          <Continent scale={1.0} />
        </SurfaceItem>

        {/* Houses */}
        <SurfaceItem theta={0.3} phi={0.9}>
          <House color="#fef3c7" roof="#dc2626" />
        </SurfaceItem>
        <SurfaceItem theta={0.55} phi={1.1}>
          <House color="#fed7aa" roof="#b45309" />
        </SurfaceItem>
        <SurfaceItem theta={1.5} phi={1.18}>
          <House color="#fbcfe8" roof="#9d174d" />
        </SurfaceItem>
        <SurfaceItem theta={1.7} phi={1.32}>
          <House color="#bfdbfe" roof="#1e40af" />
        </SurfaceItem>
        <SurfaceItem theta={2.85} phi={0.65}>
          <House color="#fef3c7" roof="#dc2626" />
        </SurfaceItem>
        <SurfaceItem theta={3.0} phi={0.8}>
          <House color="#e9d5ff" roof="#7c3aed" />
        </SurfaceItem>
        <SurfaceItem theta={4.55} phi={1.4}>
          <House color="#fed7aa" roof="#b45309" />
        </SurfaceItem>

        {/* Trees */}
        <SurfaceItem theta={0.18} phi={0.82}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={0.45} phi={1.05}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={0.7} phi={1.15}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={1.45} phi={1.25}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={1.8} phi={1.18}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={2.95} phi={0.6}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={3.15} phi={0.78}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={4.65} phi={1.45}>
          <Tree />
        </SurfaceItem>
        <SurfaceItem theta={5.7} phi={0.95}>
          <Tree />
        </SurfaceItem>
      </group>

      {/* Cloud layer drifts independently */}
      <group ref={cloudsRef}>
        <SurfaceItem theta={1.2} phi={0.55} r={1.18}>
          <Cloud position={[0, 0, 0]} />
        </SurfaceItem>
        <SurfaceItem theta={3.2} phi={1.6} r={1.18}>
          <Cloud position={[0, 0, 0]} />
        </SurfaceItem>
        <SurfaceItem theta={5.0} phi={0.4} r={1.18}>
          <Cloud position={[0, 0, 0]} />
        </SurfaceItem>
      </group>
    </>
  );
}

export default function Earth3D() {
  return (
    <div className={styles.wrap}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.6, 3.2], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
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
