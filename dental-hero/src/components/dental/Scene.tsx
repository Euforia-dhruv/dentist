'use client';

import { Suspense } from 'react';
import * as THREE from 'three';
import { ContactShadows } from '@react-three/drei';
import { DentalArch } from './DentalArch';
import { CameraRig } from './CameraRig';

interface SceneProps {
  scrollProgress: number;
  reducedMotion: boolean;
  showTechViz: boolean;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#faf5ef" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.8}
        color="#fffaf5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.3} color="#f0e8ff" />
      <directionalLight position={[0, 2, -5]} intensity={0.4} color="#fff8f0" />
      <pointLight position={[0, -2, 2]} intensity={0.2} color="#ffe8d0" distance={8} decay={2} />
      <spotLight
        position={[2, 6, 3]}
        angle={0.35}
        penumbra={0.8}
        intensity={0.4}
        color="#fff5e6"
      />
    </>
  );
}

export function Scene({ scrollProgress, reducedMotion, showTechViz }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#faf8f5']} />
      <Lighting />
      <DentalArch
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.2}
        scale={5}
        blur={2.5}
        far={4}
        color="#1a1a2e"
      />
      <CameraRig
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
