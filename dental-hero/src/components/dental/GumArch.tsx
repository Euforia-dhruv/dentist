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

function computeArchFrame(scene: THREE.Object3D) {
  const toothCenters: THREE.Vector3[] = [];
  const toothBounds: { minY: number; maxY: number }[] = [];

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const isTooth = /(?:^|_)(?:ll|ul|lr|ur)\d/.test(child.name);
      if (isTooth) {
        child.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(child);
        const center = box.getCenter(new THREE.Vector3());
        toothCenters.push(center);
        toothBounds.push({ minY: box.min.y, maxY: box.max.y });
      }
    }
  });

  const archCenter = new THREE.Vector3();
  toothCenters.forEach((c) => archCenter.add(c));
  archCenter.divideScalar(toothCenters.length);

  const sortedIndices = toothCenters
    .map((c, i) => {
      const angle = Math.atan2(c.z - archCenter.z, c.x - archCenter.x);
      return { i, angle };
    })
    .sort((a, b) => a.angle - b.angle);

  const sortedCenters = sortedIndices.map((s) => toothCenters[s.i]);
  const sortedBounds = sortedIndices.map((s) => toothBounds[s.i]);

  const archBox = new THREE.Box3();
  toothCenters.forEach((c) => archBox.expandByPoint(c));
  const archSize = archBox.getSize(new THREE.Vector3());

  return { sortedCenters, sortedBounds, archCenter, archSize };
}

function buildGumHorseshoe(
  sortedCenters: THREE.Vector3[],
  sortedBounds: { minY: number; maxY: number }[],
  archCenter: THREE.Vector3,
  archSize: THREE.Vector3
) {
  const avgTop = sortedBounds.reduce((s, b) => s + b.maxY, 0) / sortedBounds.length;
  const avgBottom = sortedBounds.reduce((s, b) => s + b.minY, 0) / sortedBounds.length;
  const toothHeight = avgTop - avgBottom;

  const points2D: { x: number; z: number; y: number }[] = [];
  for (const c of sortedCenters) {
    const dx = c.x - archCenter.x;
    const dz = c.z - archCenter.z;
    const angle = Math.atan2(dz, dx);
    points2D.push({ x: Math.cos(angle), z: Math.sin(angle), y: (c.y - archCenter.y) });
  }

  const smoothPoints: THREE.Vector3[] = [];
  const numSmooth = 120;
  for (let i = 0; i <= numSmooth; i++) {
    const t = (i / numSmooth) * Math.PI * 2;
    const frac = (i / numSmooth) * points2D.length;
    const idx = Math.floor(frac) % points2D.length;
    const nextIdx = (idx + 1) % points2D.length;
    const localFrac = frac - Math.floor(frac);

    const px = points2D[idx].x + (points2D[nextIdx].x - points2D[idx].x) * localFrac;
    const pz = points2D[idx].z + (points2D[nextIdx].z - points2D[idx].z) * localFrac;
    const py = points2D[idx].y + (points2D[nextIdx].y - points2D[idx].y) * localFrac;

    const x = archCenter.x + px * archSize.x * 0.48;
    const z = archCenter.z + pz * archSize.z * 0.52;
    const y = archCenter.y + py;

    smoothPoints.push(new THREE.Vector3(x, y, z));
  }

  const archCurve = new THREE.CatmullRomCurve3(smoothPoints, true, 'catmullrom', 0.5);

  const innerRadii: number[] = [];
  for (let i = 0; i < numSmooth; i++) {
    const t = (i / numSmooth) * Math.PI * 2;
    const baseRadius = archSize.x * 0.14;
    const variation = Math.sin(t * 8) * archSize.x * 0.015;
    innerRadii.push(baseRadius + variation);
  }

  const gumThickness = archSize.y * 0.25;
  const gumDrop = archSize.y * 0.12;
  const outerExtra = archSize.x * 0.06;

  const positions: number[] = [];
  const indices: number[] = [];

  const numRadial = 12;
  const centerlinePoints = archCurve.getSpacedPoints(numSmooth);

  for (let i = 0; i <= numSmooth; i++) {
    const t = (i / numSmooth) * Math.PI * 2;
    const idx = i % numSmooth;
    const nextIdx = (i + 1) % numSmooth;

    const centerPt = centerlinePoints[i % numSmooth];
    const nextPt = centerlinePoints[(i + 1) % numSmooth];

    const tangent = new THREE.Vector3().subVectors(nextPt, centerPt).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    if (right.length() < 0.001) right.set(1, 0, 0);

    const innerR = innerRadii[idx];
    const outerR = innerR + outerExtra;

    for (let j = 0; j <= numRadial; j++) {
      const frac = j / numRadial;

      let rx: number, rz: number, ry: number;

      if (frac <= 0.5) {
        const localFrac = frac / 0.5;
        const r = innerR * (1 - localFrac);
        rx = centerPt.x + right.x * r;
        rz = centerPt.z + right.z * r;
        const curveUp = Math.sin(localFrac * Math.PI) * gumThickness * 0.3;
        ry = centerPt.y + gumThickness * 0.5 - curveUp;
      } else {
        const localFrac = (frac - 0.5) / 0.5;
        const r = outerExtra * localFrac;
        rx = centerPt.x + right.x * (innerR + r);
        rz = centerPt.z + right.z * (innerR + r);
        const drop = localFrac * localFrac * gumDrop;
        const curveUp = Math.sin(localFrac * Math.PI * 0.5) * gumThickness * 0.2;
        ry = centerPt.y + gumThickness * 0.5 - drop - curveUp;
      }

      positions.push(rx, ry, rz);
    }
  }

  for (let i = 0; i < numSmooth; i++) {
    for (let j = 0; j < numRadial; j++) {
      const a = i * (numRadial + 1) + j;
      const b = a + 1;
      const c = (i + 1) * (numRadial + 1) + j;
      const d = c + 1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return { geometry: geo, centerline: archCurve, archCenter };
}

export function GumArch({ scrollProgress, reducedMotion, isMobile }: GumArchProps) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const { geometry, material, archCenter, modelScale } = useMemo(() => {
    const { sortedCenters, sortedBounds, archCenter, archSize } = computeArchFrame(scene);
    const { geometry, archCenter: gumCenter } = buildGumHorseshoe(
      sortedCenters, sortedBounds, archCenter, archSize
    );

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dba0a0'),
      roughness: 0.58,
      metalness: 0.0,
      clearcoat: 0.15,
      clearcoatRoughness: 0.45,
      ior: 1.38,
      opacity: 0.92,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: new THREE.Color('#c08080'),
      emissiveIntensity: 0.05,
      sheen: 0.4,
      sheenRoughness: 0.35,
      sheenColor: new THREE.Color('#e8b0b0'),
    });

    const maxDim = Math.max(archSize.x, archSize.y, archSize.z);
    const scale = (isMobile ? 1.8 : 2.6) / (maxDim || 1);

    return { geometry, material: mat, archCenter: gumCenter, modelScale: scale };
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
      material.emissiveIntensity = 0.05 + breathe;
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
