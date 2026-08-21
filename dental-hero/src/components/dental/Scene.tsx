'use client';

import { ContactShadows } from '@react-three/drei';
import { DentalArch } from './DentalArch';
import { GumArch } from './GumArch';
import { FloatingTools } from './FloatingTools';
import { CameraRig } from './CameraRig';

interface SceneProps {
  scrollProgress: number;
  reducedMotion: boolean;
  isMobile: boolean;
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.7} color="#faf5ef" />

      <spotLight
        position={[1, 5, 8]}
        angle={0.65}
        penumbra={1.0}
        intensity={2.0}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
      />

      <directionalLight
        position={[-3, 4, 3]}
        intensity={0.55}
        color="#ede8f2"
      />

      <directionalLight
        position={[1, 3, -5]}
        intensity={0.6}
        color="#fff5e8"
      />

      <pointLight
        position={[0, 0, 5]}
        intensity={0.3}
        color="#fff0e0"
        distance={10}
        decay={2}
      />

      <pointLight
        position={[3, 2, 3]}
        intensity={0.15}
        color="#e8d0c0"
        distance={8}
        decay={2}
      />

      <pointLight
        position={[-2, 1, 4]}
        intensity={0.12}
        color="#d4c49a"
        distance={8}
        decay={2}
      />
    </>
  );
}

export function Scene({ scrollProgress, reducedMotion, isMobile }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#faf8f5']} />
      <fog attach="fog" args={['#faf8f5', 10, 25]} />

      <StudioLighting />

      <DentalArch
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />

      <GumArch
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />

      <FloatingTools
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.08}
        scale={8}
        blur={5}
        far={4}
        color="#3a3530"
      />

      <CameraRig
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />
    </>
  );
}
