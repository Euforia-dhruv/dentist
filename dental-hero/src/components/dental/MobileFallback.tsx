'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function MobileDentalModel() {
  const { scene } = useGLTF('/models/dental/dental-arch.glb');

  const archBox = new THREE.Box3();
  let hasArch = false;
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const childBox = new THREE.Box3().setFromObject(child);
      if (!hasArch) {
        archBox.copy(childBox);
        hasArch = true;
      } else {
        archBox.union(childBox);
      }
    }
  });
  if (!hasArch) archBox.setFromObject(scene);
  const center = archBox.getCenter(new THREE.Vector3());
  const size = archBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.0 / maxDim;

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mat = child.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.color = new THREE.Color('#f5efe6');
        mat.roughness = 0.3;
        mat.metalness = 0.0;
        mat.clearcoat = 0.2;
        mat.clearcoatRoughness = 0.3;
        mat.transparent = true;
        mat.opacity = 1.0;
        mat.needsUpdate = true;
      }
      child.castShadow = true;
    }
  });

  return (
    <group
      position={[-center.x, -center.y - 0.2, -center.z]}
      scale={[scale, scale, scale]}
      rotation={[0.1, 0.3, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

export function MobileFallback() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #f0ebe3 100%)' }}
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#c9a87c]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="flex-1 relative">
          {loaded && (
            <Canvas
              camera={{ position: [3.0, 1.5, 5.0], fov: 32 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.15,
              }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.25} color="#f8f4ef" />
                <directionalLight position={[4, 6, 4]} intensity={1.2} color="#fff8f0" />
                <directionalLight position={[-3, 4, -1]} intensity={0.3} color="#f0e8ff" />
                <spotLight position={[2, 5, 3]} angle={0.4} penumbra={0.9} intensity={0.25} color="#fff8f0" />
                <MobileDentalModel />
              </Suspense>
            </Canvas>
          )}
        </div>

        <div className="relative z-20 text-center px-6 pb-24 -mt-12">
          <p className="eyebrow mb-4">Modern Dentistry</p>
          <h1 className="display-heading text-[36px] leading-[1.05] mb-5">
            YOUR SMILE,
            <br />
            <span className="text-[#c9a87c]">REIMAGINED.</span>
          </h1>
          <p className="text-[14px] text-[#4a4a5a] font-light leading-[1.8] mb-8 max-w-[300px] mx-auto">
            Advanced dentistry. Personal care. Exceptional results.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <a href="/appointment" className="btn-primary w-full max-w-[280px]">
              Book Appointment
            </a>
            <a href="#treatments" className="btn-secondary w-full max-w-[280px]">
              Explore Treatments
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
