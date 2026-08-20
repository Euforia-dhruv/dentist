'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GLB_MODEL_PATH = '/models/dental/dental-arch.glb';

interface GumArchProps {
  scrollProgress: number;
  reducedMotion: boolean;
  isMobile: boolean;
}

function buildGumCurve(scene: THREE.Object3D) {
  const toothBoxes: { center: THREE.Vector3; bottom: number }[] = [];

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const isTooth = /(?:^|_)(?:ll|ul|lr|ur)\d/.test(child.name);
      if (isTooth) {
        child.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(child);
        const center = box.getCenter(new THREE.Vector3());
        const min = box.min.clone();
        toothBoxes.push({ center, bottom: min.y });
      }
    }
  });

  if (toothBoxes.length === 0) return null;

  const archCenter = new THREE.Vector3();
  toothBoxes.forEach((t) => archCenter.add(t.center));
  archCenter.divideScalar(toothBoxes.length);

  const sorted = toothBoxes
    .map((t) => {
      const angle = Math.atan2(t.center.z - archCenter.z, t.center.x - archCenter.x);
      return { ...t, angle };
    })
    .sort((a, b) => a.angle - b.angle);

  const avgBottom = sorted.reduce((sum, t) => sum + t.bottom, 0) / sorted.length;

  const archPoints = sorted.map((t) => {
    const dir = new THREE.Vector3().subVectors(t.center, archCenter).normalize();
    const gumPos = t.center.clone().addScaledVector(dir, 0.06);
    gumPos.y = avgBottom - 0.04;
    return gumPos;
  });

  if (archPoints.length > 2) {
    archPoints.push(archPoints[0].clone());
  }

  return new THREE.CatmullRomCurve3(archPoints, false, 'catmullrom', 0.3);
}

export function GumArch({ scrollProgress, reducedMotion, isMobile }: GumArchProps) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const { geometry, material, archCenter, modelScale } = useMemo(() => {
    const curve = buildGumCurve(scene);
    if (!curve) {
      return {
        geometry: new THREE.BufferGeometry(),
        material: new THREE.MeshPhysicalMaterial({ visible: false }),
        archCenter: new THREE.Vector3(),
        modelScale: 1,
      };
    }

    const tubeRadius = 0.035;
    const tubeSegments = 128;
    const radialSegments = 12;
    const geo = new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, radialSegments, true);

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e8b4b4'),
      roughness: 0.6,
      metalness: 0.0,
      clearcoat: 0.15,
      clearcoatRoughness: 0.5,
      ior: 1.4,
      opacity: 0.9,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: new THREE.Color('#d49090'),
      emissiveIntensity: 0.06,
      sheen: 0.4,
      sheenRoughness: 0.3,
      sheenColor: new THREE.Color('#f0c0c0'),
    });

    geo.computeBoundingBox();
    const center = new THREE.Vector3();
    if (geo.boundingBox) {
      geo.boundingBox.getCenter(center);
    }

    const toothBox = new THREE.Box3();
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const isTooth = /(?:^|_)(?:ll|ul|lr|ur)\d/.test(child.name);
        if (isTooth) {
          child.updateMatrixWorld(true);
          const b = new THREE.Box3().setFromObject(child);
          toothBox.union(b);
        }
      }
    });
    const toothSize = toothBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(toothSize.x, toothSize.y, toothSize.z);
    const scale = (isMobile ? 1.8 : 2.6) / (maxDim || 1);

    return { geometry: geo, material: mat, archCenter: center, modelScale: scale };
  }, [scene, isMobile]);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();

    const ease = (t: number) => t * t * (3 - 2 * t);
    const slidePhase = ease(Math.min(1, scrollProgress / 0.35));
    const approachPhase = ease(Math.min(1, Math.max(0, (scrollProgress - 0.1) / 0.35)));
    const exitPhase = ease(Math.min(1, Math.max(0, (scrollProgress - 0.7) / 0.15)));

    const posX = THREE.MathUtils.lerp(isMobile ? 0.3 : 1.1, 0, slidePhase);
    const scale = THREE.MathUtils.lerp(1.0, 1.15, approachPhase);
    const baseRotY = 0.3 + time * 0.04;
    const floatY = Math.sin(time * 0.3) * 0.025;
    const scrollRotX = scrollProgress * -0.2;

    groupRef.current.position.x = posX;
    groupRef.current.position.y = floatY;
    groupRef.current.scale.setScalar(scale);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRotY, 0.06);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, scrollRotX, 0.05);

    if (material) {
      const breathe = Math.sin(time * 0.5) * 0.02;
      material.emissiveIntensity = 0.06 + breathe;
    }

    groupRef.current.visible = exitPhase < 0.95;
  });

  return (
    <group ref={groupRef}>
      <mesh
        geometry={geometry}
        material={material}
        position={[-archCenter.x, -archCenter.y, -archCenter.z]}
        scale={[modelScale, modelScale, modelScale]}
        rotation={[0.1, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload(GLB_MODEL_PATH);
