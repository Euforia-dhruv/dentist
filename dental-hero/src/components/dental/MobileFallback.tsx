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
      const name = child.name.toLowerCase();
      const isTarget = name.includes('ul1') || name.includes('polysurface1_ul1');
      if (!isTarget) {
        const childBox = new THREE.Box3().setFromObject(child);
        if (!hasArch) {
          archBox.copy(childBox);
          hasArch = true;
        } else {
          archBox.union(childBox);
        }
      }
    }
  });
  if (!hasArch) archBox.setFromObject(scene);
  const center = archBox.getCenter(new THREE.Vector3());
  const size = archBox.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2.2 / maxDim;

  return (
    <group
      position={[-center.x, -center.y, -center.z]}
      scale={[scale, scale, scale]}
      rotation={[0.15, 0.3, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

export function MobileFallback() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(180deg, #faf8f5 0%, #f0ebe3 100%)' }}>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#c9a87c]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        <div className="flex-1 relative">
          {loaded && (
            <Canvas
              camera={{ position: [3.0, 1.8, 4.5], fov: 32 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} color="#faf5ef" />
                <directionalLight position={[5, 8, 5]} intensity={1.6} color="#fffaf5" />
                <directionalLight position={[-4, 3, -2]} intensity={0.3} color="#f0e8ff" />
                <directionalLight position={[0, 2, -5]} intensity={0.5} color="#fff8f0" />
                <pointLight position={[0, -2, 2]} intensity={0.2} color="#ffe8d0" distance={8} decay={2} />
                <MobileDentalModel />
              </Suspense>
            </Canvas>
          )}
        </div>

        <div className="relative z-20 text-center px-6 pb-24 -mt-16">
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#c9a87c] mb-4">
            Modern Dentistry
          </p>
          <h1 className="text-[34px] font-extralight tracking-[-0.025em] text-[#1a1a2e] leading-[1.08] mb-5">
            YOUR SMILE,
            <br />
            <span className="text-[#c9a87c]">REIMAGINED.</span>
          </h1>
          <p className="text-[14px] text-[#4a4a5a] font-light leading-[1.7] mb-8 max-w-[300px] mx-auto">
            Advanced dentistry. Personal care. Exceptional results.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <a
              href="/appointment"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#1a1a2e] text-white text-[11px] font-medium tracking-[0.14em] uppercase no-underline hover:bg-[#2a2a3e] transition-colors"
            >
              Book Appointment
            </a>
            <a
              href="#treatments"
              className="inline-flex items-center justify-center px-8 py-3 text-[#1a1a2e] text-[11px] font-medium tracking-[0.14em] uppercase no-underline hover:text-[#c9a87c] transition-colors"
            >
              Explore Treatments
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
