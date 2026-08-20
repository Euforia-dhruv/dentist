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

function buildGumFromTeeth(scene: THREE.Object3D) {
  const toothMeshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const isTooth = /(?:^|_)(?:ll|ul|lr|ur)\d/.test(child.name);
      if (isTooth) {
        child.updateMatrixWorld(true);
        toothMeshes.push(child);
      }
    }
  });

  const box = new THREE.Box3();
  for (const mesh of toothMeshes) {
    mesh.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(mesh);
    box.union(b);
  }
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const sorted = toothMeshes
    .map((mesh) => {
      const pos = new THREE.Vector3();
      new THREE.Box3().setFromObject(mesh).getCenter(pos);
      const angle = Math.atan2(pos.z - center.z, pos.x - center.x);
      return { mesh, pos, angle };
    })
    .sort((a, b) => a.angle - b.angle);

  const gumWidth = size.x * 0.04;
  const gumHeight = size.y * 0.18;
  const points: THREE.Vector3[] = [];

  for (const { pos } of sorted) {
    const dir = new THREE.Vector3().subVectors(pos, center).normalize();
    const gumPos = pos.clone().addScaledVector(dir, gumWidth * 2);
    gumPos.y = pos.y - size.y * 0.12;
    points.push(gumPos);
  }

  if (points.length > 2) {
    points.push(points[0].clone());
  }

  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);

  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(gumWidth, gumHeight * 0.4, gumWidth * 1.2, gumHeight * 0.8, gumWidth, gumHeight);
  shape.bezierCurveTo(gumWidth * 0.6, gumHeight * 1.3, -gumWidth * 0.6, gumHeight * 1.3, -gumWidth, gumHeight);
  shape.bezierCurveTo(-gumWidth * 1.2, gumHeight * 0.8, -gumWidth, gumHeight * 0.4, 0, 0);

  const extrudeSettings = {
    steps: 100,
    extrudePath: curve,
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  const gumCenter = new THREE.Vector3();
  geometry.computeBoundingBox();
  if (geometry.boundingBox) {
    geometry.boundingBox.getCenter(gumCenter);
  }
  geometry.translate(-gumCenter.x, -gumCenter.y, -gumCenter.z);

  return { geometry, center, size };
}

function createGumMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#e8b4b4'),
    roughness: 0.65,
    metalness: 0.0,
    clearcoat: 0.1,
    clearcoatRoughness: 0.6,
    ior: 1.4,
    opacity: 0.92,
    transparent: true,
    side: THREE.DoubleSide,
    emissive: new THREE.Color('#d49090'),
    emissiveIntensity: 0.08,
    sheen: 0.3,
    sheenRoughness: 0.4,
    sheenColor: new THREE.Color('#f0c0c0'),
  });
}

export function GumArch({ scrollProgress, reducedMotion, isMobile }: GumArchProps) {
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);

  const modelScale = useMemo(() => {
    const { geometry } = buildGumFromTeeth(scene);
    const bbox = geometry.boundingBox;
    if (!bbox) return 1;
    const s = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(s.x, s.y, s.z);
    return (isMobile ? 1.8 : 2.6) / (maxDim || 1);
  }, [scene, isMobile]);

  const { geometry, material, gumCenter } = useMemo(() => {
    const { geometry, center } = buildGumFromTeeth(scene);
    const mat = createGumMaterial();
    return { geometry, material: mat, gumCenter: center };
  }, [scene]);

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
      material.emissiveIntensity = 0.08 + breathe;
    }

    groupRef.current.visible = exitPhase < 0.95;
  });

  return (
    <group ref={groupRef}>
      <mesh
        geometry={geometry}
        material={material}
        position={[-gumCenter.x, -gumCenter.y, -gumCenter.z]}
        scale={[modelScale, modelScale, modelScale]}
        rotation={[0.1, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload(GLB_MODEL_PATH);
