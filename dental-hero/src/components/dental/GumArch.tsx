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

function buildGumGeometry(scene: THREE.Object3D) {
  const toothBoxes: THREE.Box3[] = [];

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const isTooth = /(?:^|_)(?:ll|ul|lr|ur)\d/.test(child.name);
      if (isTooth) {
        child.updateMatrixWorld(true);
        toothBoxes.push(new THREE.Box3().setFromObject(child));
      }
    }
  });

  if (toothBoxes.length === 0) return null;

  const archBox = new THREE.Box3();
  toothBoxes.forEach((b) => archBox.union(b));
  const archCenter = archBox.getCenter(new THREE.Vector3());
  const archSize = archBox.getSize(new THREE.Vector3());

  const avgBottom = toothBoxes.reduce((sum, b) => sum + b.min.y, 0) / toothBoxes.length;

  const teethCenters: { x: number; z: number; y: number }[] = [];
  toothBoxes.forEach((b) => {
    const c = b.getCenter(new THREE.Vector3());
    teethCenters.push({ x: c.x, z: c.z, y: b.min.y });
  });

  teethCenters.sort((a, b) => {
    const angA = Math.atan2(a.z - archCenter.z, a.x - archCenter.x);
    const angB = Math.atan2(b.z - archCenter.z, b.x - archCenter.x);
    return angA - angB;
  });

  const radiusX = archSize.x * 0.52;
  const radiusZ = archSize.z * 0.42;
  const archPoints: THREE.Vector3[] = [];
  const numPoints = 64;

  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;
    const x = Math.cos(t) * radiusX;
    const z = Math.sin(t) * radiusZ;

    let closestDist = Infinity;
    let closestY = avgBottom;
    for (const tc of teethCenters) {
      const dx = tc.x - (archCenter.x + x);
      const dz = tc.z - (archCenter.z + z);
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closestY = tc.y;
      }
    }

    const gumY = closestY - archSize.y * 0.06;
    archPoints.push(new THREE.Vector3(x, gumY, z));
  }

  const outerPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;
    const x = Math.cos(t) * (radiusX + archSize.x * 0.08);
    const z = Math.sin(t) * (radiusZ + archSize.z * 0.08);
    const y = avgBottom - archSize.y * 0.12;
    outerPoints.push(new THREE.Vector3(x, y, z));
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const inner = archPoints[i];
    const outer = outerPoints[i];

    positions.push(inner.x, inner.y, inner.z);
    normals.push(0, 1, 0);

    positions.push(outer.x, outer.y, outer.z);
    normals.push(0, 0.3, 1);
  }

  for (let i = 0; i < numPoints; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;
    indices.push(a, c, b);
    indices.push(b, c, d);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return { geometry: geo, archCenter, archSize };
}

export function GumArch({ scrollProgress, reducedMotion, isMobile }: GumArchProps) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const { geometry, material, archCenter, modelScale } = useMemo(() => {
    const result = buildGumGeometry(scene);
    if (!result) {
      return {
        geometry: new THREE.BufferGeometry(),
        material: new THREE.MeshPhysicalMaterial({ visible: false }),
        archCenter: new THREE.Vector3(),
        modelScale: 1,
      };
    }

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e8b0b0'),
      roughness: 0.55,
      metalness: 0.0,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4,
      ior: 1.4,
      opacity: 0.88,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: new THREE.Color('#d08888'),
      emissiveIntensity: 0.06,
      sheen: 0.5,
      sheenRoughness: 0.3,
      sheenColor: new THREE.Color('#f0b8b8'),
    });

    const maxDim = Math.max(result.archSize.x, result.archSize.y, result.archSize.z);
    const scale = (isMobile ? 1.8 : 2.6) / (maxDim || 1);

    return {
      geometry: result.geometry,
      material: mat,
      archCenter: result.archCenter,
      modelScale: scale,
    };
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
