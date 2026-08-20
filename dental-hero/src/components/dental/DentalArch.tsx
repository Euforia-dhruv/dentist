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

function createToothMaterial(baseColor: string, isEnamel: boolean) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(baseColor),
    roughness: isEnamel ? 0.28 : 0.55,
    metalness: 0.0,
    clearcoat: isEnamel ? 0.3 : 0.0,
    clearcoatRoughness: isEnamel ? 0.2 : 0.0,
    transmission: isEnamel ? 0.05 : 0.0,
    thickness: 0.5,
    ior: 1.5,
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide,
  });
  return mat;
}

export function DentalArch({ scrollProgress, reducedMotion }: DentalArchProps) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const originalRotations = useRef<Map<string, THREE.Euler>>(new Map());
  const originalScales = useRef<Map<string, THREE.Vector3>>(new Map());
  const initialized = useRef(false);

  const initialTransform = useMemo(() => {
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
    const center = archBox.getCenter(new THREE.Vector3());
    const size = archBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.8 / maxDim;
    return { center, size, scale };
  }, [scene]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const enamelColors = ['#f5efe6', '#f2ece3', '#efe8df', '#f0e9e0', '#f4eee5'];
    let colorIdx = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        originalPositions.current.set(child.uuid, child.position.clone());
        originalRotations.current.set(child.uuid, child.rotation.clone());
        originalScales.current.set(child.uuid, child.scale.clone());

        const name = child.name.toLowerCase();
        const isEnamel = !name.includes('root') && !name.includes('gum');
        const color = enamelColors[colorIdx % enamelColors.length];
        colorIdx++;

        const mat = createToothMaterial(color, isEnamel);
        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.position.y = Math.sin(time * 0.4) * 0.015;

    const targetRotX = scrollProgress * -0.3;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.03
    );

    const selectProgress = Math.max(0, Math.min(1, (scrollProgress - 0.35) / 0.2));
    const returnProgress = Math.max(0, Math.min(1, (scrollProgress - 0.7) / 0.15));
    const effectiveSelect = selectProgress * (1 - returnProgress);

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const originalPos = originalPositions.current.get(child.uuid);
        const originalScale = originalScales.current.get(child.uuid);
        if (!originalPos || !originalScale) return;

        const name = child.name.toLowerCase();
        const isHighlight = name.includes('ul1') || name.includes('polysurface1_ul1');

        if (isHighlight) {
          const separationDistance = 0.6;
          child.position.z = THREE.MathUtils.lerp(
            child.position.z,
            originalPos.z + effectiveSelect * separationDistance,
            0.04
          );
          child.position.x = THREE.MathUtils.lerp(
            child.position.x,
            originalPos.x + effectiveSelect * 0.15,
            0.04
          );
          const s = 1 + effectiveSelect * 0.1;
          child.scale.setScalar(THREE.MathUtils.lerp(child.scale.x, s, 0.04));
        } else {
          child.position.x = THREE.MathUtils.lerp(child.position.x, originalPos.x, 0.03);
          child.position.z = THREE.MathUtils.lerp(child.position.z, originalPos.z, 0.03);
          child.scale.lerp(originalScale, 0.03);
        }

        const mat = child.material as THREE.MeshPhysicalMaterial;
        if (mat) {
          const baseOpacity = isHighlight
            ? (effectiveSelect > 0.01 ? 0.5 + effectiveSelect * 0.5 : 1.0)
            : (effectiveSelect > 0.3 ? 0.4 : 1.0);
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, baseOpacity, 0.04);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      <group
        position={[
          -initialTransform.center.x + 1.2,
          -initialTransform.center.y + 0.2,
          -initialTransform.center.z - 1.0,
        ]}
        scale={[
          initialTransform.scale,
          initialTransform.scale,
          initialTransform.scale,
        ]}
        rotation={[0.1, 0.3, 0]}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(GLB_MODEL_PATH);
