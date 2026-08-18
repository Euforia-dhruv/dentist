'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLB_MODEL_PATH = '/models/dental/dental-arch.glb';

interface DentalArchProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

export function DentalArch({ scrollProgress, reducedMotion }: DentalArchProps) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const originalScales = useRef<Map<string, THREE.Vector3>>(new Map());
  const initialized = useRef(false);

  const initialTransform = useMemo(() => {
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
    if (!hasArch) {
      archBox.setFromObject(scene);
    }
    const center = archBox.getCenter(new THREE.Vector3());
    const size = archBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.6 / maxDim;
    return { center, size, scale };
  }, [scene]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        originalPositions.current.set(child.uuid, child.position.clone());
        originalScales.current.set(child.uuid, child.scale.clone());

        const mat = child.material as THREE.MeshStandardMaterial;
        const name = child.name.toLowerCase();
        const isTarget = name.includes('ul1') || name.includes('polysurface1_ul1');

        if (mat) {
          mat.transparent = true;
          mat.opacity = isTarget ? 0 : 1;
          mat.roughness = 0.55;
          mat.metalness = 0.02;
          mat.color.set('#f5efe6');
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.position.y = Math.sin(time * 0.3) * 0.02;
    groupRef.current.rotation.y += 0.0004;

    const targetRotX = scrollProgress * -0.4;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.04
    );

    const selectProgress = Math.max(0, Math.min(1, (scrollProgress - 0.3) / 0.25));
    const returnProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) / 0.15));
    const effectiveSelect = selectProgress * (1 - returnProgress);

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase();
        const isTargetTooth = name.includes('ul1') || name.includes('polysurface1_ul1');

        if (isTargetTooth) {
          const originalPos = originalPositions.current.get(child.uuid);
          if (originalPos) {
            const separationDistance = 1.0;
            const targetZ = originalPos.z + effectiveSelect * separationDistance;
            child.position.z = THREE.MathUtils.lerp(child.position.z, targetZ, 0.06);

            const targetX = originalPos.x + effectiveSelect * 0.25;
            child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, 0.06);

            const targetScale = 1 + effectiveSelect * 0.15;
            child.scale.setScalar(THREE.MathUtils.lerp(child.scale.x, targetScale, 0.06));

            const targetRotY = effectiveSelect * 0.12;
            child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, targetRotY, 0.04);

            const mat = child.material as THREE.MeshStandardMaterial;
            if (mat) {
              const targetOpacity = effectiveSelect > 0.01 ? 0.4 + effectiveSelect * 0.6 : 0;
              mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.06);
              mat.transparent = true;
            }
          }
        } else {
          const originalPos = originalPositions.current.get(child.uuid);
          const originalScale = originalScales.current.get(child.uuid);
          if (originalPos && originalScale) {
            child.position.x = THREE.MathUtils.lerp(child.position.x, originalPos.x, 0.04);
            child.position.z = THREE.MathUtils.lerp(child.position.z, originalPos.z, 0.04);
            child.scale.lerp(originalScale, 0.04);
            child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, 0, 0.04);
          }

          const material = child.material as THREE.MeshStandardMaterial;
          if (material && material.opacity !== undefined) {
            const targetOpacity = effectiveSelect > 0.3 ? 0.35 : 1.0;
            material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.04);
            material.transparent = true;
          }
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      <group
        position={[
          -initialTransform.center.x,
          -initialTransform.center.y,
          -initialTransform.center.z,
        ]}
        scale={[
          initialTransform.scale,
          initialTransform.scale,
          initialTransform.scale,
        ]}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(GLB_MODEL_PATH);
