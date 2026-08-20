'use client';

import { ContactShadows } from '@react-three/drei';
import { DentalArch } from './DentalArch';
import { CameraRig } from './CameraRig';

interface SceneProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.25} color="#f8f4ef" />

      <directionalLight
        position={[4, 6, 4]}
        intensity={1.4}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0003}
      />

      <directionalLight
        position={[-3, 4, -1]}
        intensity={0.35}
        color="#f0e8ff"
      />

      <directionalLight
        position={[0, 3, -4]}
        intensity={0.25}
        color="#fff5e6"
      />

      <spotLight
        position={[2, 5, 3]}
        angle={0.4}
        penumbra={0.9}
        intensity={0.3}
        color="#fff8f0"
      />

      <pointLight
        position={[0, -1, 2]}
        intensity={0.15}
        color="#ffe8d0"
        distance={6}
        decay={2}
      />
    </>
  );
}

export function Scene({ scrollProgress, reducedMotion }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#faf8f5']} />
      <fog attach="fog" args={['#faf8f5', 10, 25]} />

      <StudioLighting />

      <DentalArch
        scrollProgress={scrollProgress}
        reducedMotion={reducedMotion}
      />

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.15}
        scale={6}
        blur={3}
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
