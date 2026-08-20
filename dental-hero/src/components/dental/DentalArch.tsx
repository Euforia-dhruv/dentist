'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLB_MODEL_PATH = '/models/dental/dental-arch.glb';

interface DentalArchProps {
  scrollProgress: number;
  reducedMotion: boolean;
  isMobile: boolean;
}

function createToothMaterial(baseColor: string, isEnamel: boolean) {
  const color = new THREE.Color(baseColor);
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: isEnamel ? 0.25 : 0.5,
    metalness: 0.0,
    clearcoat: isEnamel ? 0.4 : 0.05,
    clearcoatRoughness: isEnamel ? 0.25 : 0.5,
    ior: 1.52,
    opacity: 1.0,
    side: THREE.FrontSide,
    emissive: color.clone().multiplyScalar(isEnamel ? 0.18 : 0.1),
    emissiveIntensity: 1.0,
  });
}

function buildToothScene(scene: THREE.Object3D) {
  const toothMeshes: THREE.Mesh[] = [];

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const name = child.name.toLowerCase();
      const isTooth = /(?:^|_)(?:ll|ul|lr|ur)\d/.test(child.name);
      if (isTooth) {
        child.updateMatrixWorld(true);
        const clone = child.clone();
        clone.name = child.name;
        toothMeshes.push(clone);
      }
    }
  });

  const group = new THREE.Group();
  group.name = 'toothArch';

  for (const mesh of toothMeshes) {
    group.add(mesh);
  }

  const box = new THREE.Box3();
  for (const mesh of toothMeshes) {
    mesh.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(mesh);
    box.union(b);
  }

  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  return { group, center, size, toothMeshes };
}

export function DentalArch({ scrollProgress, reducedMotion, isMobile }: DentalArchProps) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const toothGroupRef = useRef<THREE.Group>(null);
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const originalScales = useRef<Map<string, THREE.Vector3>>(new Map());

  const { toothGroup, coreCenter, coreSize, toothMeshes } = useMemo(() => {
    const { group, center, size, toothMeshes } = buildToothScene(scene);
    return { toothGroup: group, coreCenter: center, coreSize: size, toothMeshes };
  }, [scene]);

  const modelScale = useMemo(() => {
    const maxDim = Math.max(coreSize.x, coreSize.y, coreSize.z);
    return (isMobile ? 1.8 : 2.6) / maxDim;
  }, [coreSize, isMobile]);

  useEffect(() => {
    const enamelColors = [
      '#ede4d4', '#ebe1d0', '#e9dfd0', '#ebe2d2', '#ede3d4',
      '#efe5d6', '#ebe1cf', '#e9dfd0', '#ede3d3', '#ebe2d2'
    ];
    const rootColors = ['#d8cab8', '#d6c8b6', '#d4c6b4', '#d6c9b8', '#d8cbba'];
    let enamelIdx = 0;
    let rootIdx = 0;

    for (const mesh of toothMeshes) {
      originalPositions.current.set(mesh.uuid, mesh.position.clone());
      originalScales.current.set(mesh.uuid, mesh.scale.clone());

      const isEnamel = !mesh.name.toLowerCase().includes('root') && !mesh.name.toLowerCase().includes('gum');
      const isRoot = mesh.name.toLowerCase().includes('root');
      const isGum = mesh.name.toLowerCase().includes('gum');
      
      let color: string;
      if (isRoot) {
        color = rootColors[rootIdx % rootColors.length];
        rootIdx++;
      } else if (isGum) {
        color = '#dcc8b6';
      } else {
        color = enamelColors[enamelIdx % enamelColors.length];
        enamelIdx++;
      }

      mesh.material = createToothMaterial(color, isEnamel);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  }, [toothMeshes]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();

    const baseRotY = 0.3 + time * 0.04;
    const floatY = Math.sin(time * 0.3) * 0.025;
    const floatRotX = Math.sin(time * 0.2) * 0.008;

    const ease = (t: number) => t * t * (3 - 2 * t);

    const slidePhase = ease(Math.min(1, scrollProgress / 0.35));
    const approachPhase = ease(Math.min(1, Math.max(0, (scrollProgress - 0.1) / 0.35)));
    const revealPhase = ease(Math.min(1, Math.max(0, (scrollProgress - 0.25) / 0.25)));
    const selectPhase = ease(Math.min(1, Math.max(0, (scrollProgress - 0.4) / 0.2)));
    const separatePhase = ease(Math.min(1, Math.max(0, (scrollProgress - 0.5) / 0.15)));
    const exitPhase = ease(Math.min(1, Math.max(0, (scrollProgress - 0.7) / 0.15)));

    const posX = THREE.MathUtils.lerp(isMobile ? 0.3 : 1.1, 0, slidePhase);
    const scale = THREE.MathUtils.lerp(1.0, 1.15, approachPhase);

    const scrollRotX = scrollProgress * -0.2;
    const targetRotX = scrollRotX + floatRotX;

    groupRef.current.position.x = posX;
    groupRef.current.position.y = floatY;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x || 1, scale, 0.06));
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotY,
      0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.05
    );

    for (const mesh of toothMeshes) {
      const originalPos = originalPositions.current.get(mesh.uuid);
      const originalScale = originalScales.current.get(mesh.uuid);
      if (!originalPos || !originalScale) continue;

      const nameLower = mesh.name.toLowerCase();
      const isHighlight = nameLower.includes('ul1') || nameLower.includes('polysurface1_ul1');

      if (isHighlight) {
        const sepZ = separatePhase * 0.9;
        const sepX = separatePhase * 0.2;
        const scaleFactor = 1 + separatePhase * 0.15;

        mesh.position.z = THREE.MathUtils.lerp(
          mesh.position.z,
          originalPos.z + sepZ,
          0.06
        );
        mesh.position.x = THREE.MathUtils.lerp(
          mesh.position.x,
          originalPos.x + sepX,
          0.06
        );

        const targetScale = new THREE.Vector3(
          originalScale.x * scaleFactor,
          originalScale.y * scaleFactor,
          originalScale.z * scaleFactor
        );
        mesh.scale.lerp(targetScale, 0.06);

        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (mat) {
          const highlightOpacity = selectPhase > 0.01 ? 0.9 + selectPhase * 0.1 : 1.0;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, highlightOpacity, 0.06);
        }
      } else {
        const openSpread = revealPhase * 0.08;
        const dirX = originalPos.x > 0 ? 1 : originalPos.x < 0 ? -1 : 0;
        const dirZ = originalPos.z > 0 ? 1 : originalPos.z < 0 ? -1 : 0;

        mesh.position.x = THREE.MathUtils.lerp(
          mesh.position.x,
          originalPos.x + dirX * openSpread,
          0.05
        );
        mesh.position.z = THREE.MathUtils.lerp(
          mesh.position.z,
          originalPos.z + dirZ * openSpread * 0.5,
          0.05
        );
        mesh.scale.lerp(originalScale, 0.05);

        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if (mat) {
          const subdued = selectPhase > 0.3 ? 0.55 + (1 - selectPhase) * 0.15 : 1.0;
          mat.opacity = THREE.MathUtils.lerp(mat.opacity, subdued, 0.05);
        }
      }
    }

    groupRef.current.visible = exitPhase < 0.95;
  });

  return (
    <group ref={groupRef}>
      <primitive object={toothGroup} position={[-coreCenter.x, -coreCenter.y, -coreCenter.z]} scale={[modelScale, modelScale, modelScale]} rotation={[0.1, 0, 0]} />
    </group>
  );
}

useGLTF.preload(GLB_MODEL_PATH);
