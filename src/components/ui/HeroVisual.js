import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import styles from "./HeroVisual.module.css";

function GenerativeShape() {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.18;
    ref.current.rotation.x += dt * 0.06;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 4]} />
      <meshStandardMaterial
        color="#8aa9ff"
        roughness={0.22}
        metalness={0.65}
        emissive="#1f3a8a"
        emissiveIntensity={0.18}
        flatShading
      />
    </mesh>
  );
}

export default function HeroVisual() {
  return (
    <div className={styles.wrap}>
      <div className={styles.glow} aria-hidden="true" />
      <Canvas
        className={styles.canvas}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 3, 5]} intensity={1.1} />
        <directionalLight
          position={[-2, -1, 2]}
          intensity={0.55}
          color="#c4b5fd"
        />
        <directionalLight
          position={[0, -3, 1]}
          intensity={0.4}
          color="#7dd3fc"
        />
        <GenerativeShape />
      </Canvas>
    </div>
  );
}
