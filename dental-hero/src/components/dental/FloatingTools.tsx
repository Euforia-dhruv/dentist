'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingToolsProps {
  scrollProgress: number;
  reducedMotion: boolean;
  isMobile: boolean;
}

interface ToolConfig {
  name: string;
  position: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  floatAmplitude: number;
  floatSpeed: number;
  rotationSpeed: [number, number, number];
  scale: number;
  appearAt: number;
  disappearAt: number;
}

const TOOL_CONFIGS: ToolConfig[] = [
  {
    name: 'mirror',
    position: [2.5, 1.2, 0.5],
    orbitRadius: 2.8,
    orbitSpeed: 0.15,
    orbitOffset: 0,
    floatAmplitude: 0.08,
    floatSpeed: 0.4,
    rotationSpeed: [0.1, 0.3, 0.05],
    scale: 0.12,
    appearAt: 0.15,
    disappearAt: 0.65,
  },
  {
    name: 'explorer',
    position: [-2.0, 0.8, 1.0],
    orbitRadius: 2.2,
    orbitSpeed: 0.12,
    orbitOffset: Math.PI * 0.6,
    floatAmplitude: 0.06,
    floatSpeed: 0.35,
    rotationSpeed: [0.15, 0.2, 0.1],
    scale: 0.1,
    appearAt: 0.25,
    disappearAt: 0.7,
  },
  {
    name: 'probe',
    position: [1.8, -0.5, 1.5],
    orbitRadius: 2.5,
    orbitSpeed: 0.1,
    orbitOffset: Math.PI * 1.2,
    floatAmplitude: 0.07,
    floatSpeed: 0.3,
    rotationSpeed: [0.08, 0.25, 0.12],
    scale: 0.09,
    appearAt: 0.35,
    disappearAt: 0.75,
  },
  {
    name: 'scaler',
    position: [-1.5, 1.5, -0.5],
    orbitRadius: 3.0,
    orbitSpeed: 0.08,
    orbitOffset: Math.PI * 1.8,
    floatAmplitude: 0.05,
    floatSpeed: 0.45,
    rotationSpeed: [0.12, 0.18, 0.08],
    scale: 0.11,
    appearAt: 0.4,
    disappearAt: 0.8,
  },
];

function createToolMesh(name: string): THREE.Group {
  const group = new THREE.Group();
  group.name = name;

  const metalMat = new THREE.MeshPhysicalMaterial({
    color: '#c8c8d0',
    roughness: 0.18,
    metalness: 0.88,
    clearcoat: 0.7,
    clearcoatRoughness: 0.08,
    ior: 2.0,
    reflectivity: 0.9,
  });

  const gripMat = new THREE.MeshPhysicalMaterial({
    color: '#2a2a35',
    roughness: 0.7,
    metalness: 0.1,
  });

  switch (name) {
    case 'mirror': {
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.01, 0.5, 10),
        metalMat
      );
      handle.position.y = -0.25;
      group.add(handle);

      const grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.014, 0.15, 10),
        gripMat
      );
      grip.position.y = -0.15;
      group.add(grip);

      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.012, 0.12, 8),
        metalMat
      );
      neck.position.set(0.02, 0.06, 0);
      neck.rotation.z = 0.25;
      group.add(neck);

      const mirrorHead = new THREE.Mesh(
        new THREE.CircleGeometry(0.055, 32),
        new THREE.MeshPhysicalMaterial({
          color: '#dde0e8',
          roughness: 0.02,
          metalness: 0.98,
          clearcoat: 1.0,
          clearcoatRoughness: 0.01,
          ior: 3.0,
          reflectivity: 1.0,
          envMapIntensity: 2.5,
        })
      );
      mirrorHead.position.set(0.04, 0.12, 0);
      mirrorHead.rotation.y = Math.PI * 0.5;
      mirrorHead.rotation.z = 0.25;
      group.add(mirrorHead);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.004, 8, 32),
        metalMat
      );
      rim.position.set(0.04, 0.12, 0);
      rim.rotation.y = Math.PI * 0.5;
      rim.rotation.z = 0.25;
      group.add(rim);
      break;
    }

    case 'explorer': {
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.01, 0.45, 10),
        metalMat
      );
      handle.position.y = -0.22;
      group.add(handle);

      const grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.013, 0.12, 10),
        gripMat
      );
      grip.position.y = -0.12;
      group.add(grip);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.006, 0.2, 8),
        metalMat
      );
      shaft.position.y = 0.15;
      group.add(shaft);

      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.003, 0.06, 8),
        metalMat
      );
      tip.position.y = 0.28;
      tip.rotation.x = Math.PI;
      group.add(tip);
      break;
    }

    case 'probe': {
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.009, 0.4, 10),
        metalMat
      );
      handle.position.y = -0.2;
      group.add(handle);

      const grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.012, 0.1, 10),
        gripMat
      );
      grip.position.y = -0.1;
      group.add(grip);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.003, 0.005, 0.18, 8),
        metalMat
      );
      shaft.position.y = 0.14;
      group.add(shaft);

      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.008, 16, 16),
        metalMat
      );
      ball.position.y = 0.24;
      group.add(ball);
      break;
    }

    case 'scaler': {
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.01, 0.42, 10),
        metalMat
      );
      handle.position.y = -0.21;
      group.add(handle);

      const grip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.013, 0.12, 10),
        gripMat
      );
      grip.position.y = -0.12;
      group.add(grip);

      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.006, 0.15, 8),
        metalMat
      );
      shaft.position.y = 0.13;
      group.add(shaft);

      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(0.008, 0.04);
      bladeShape.lineTo(0, 0.06);
      bladeShape.lineTo(-0.008, 0.04);
      bladeShape.closePath();

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
        depth: 0.002,
        bevelEnabled: false,
      });
      const blade = new THREE.Mesh(bladeGeo, metalMat);
      blade.position.set(0, 0.2, -0.001);
      blade.rotation.x = -0.2;
      group.add(blade);
      break;
    }
  }

  return group;
}

function FloatingTool({ config, scrollProgress }: {
  config: ToolConfig;
  scrollProgress: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const mesh = useMemo(() => createToolMesh(config.name), [config.name]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    const appearProgress = Math.min(1, Math.max(0, (scrollProgress - config.appearAt) / 0.1));
    const disappearProgress = Math.min(1, Math.max(0, (scrollProgress - config.disappearAt) / 0.1));
    const visibility = appearProgress * (1 - disappearProgress);

    if (visibility < 0.01) {
      meshRef.current.visible = false;
      return;
    }
    meshRef.current.visible = true;

    const angle = time * config.orbitSpeed + config.orbitOffset;
    const orbitX = Math.cos(angle) * config.orbitRadius;
    const orbitZ = Math.sin(angle) * config.orbitRadius * 0.4;
    const floatY = Math.sin(time * config.floatSpeed + config.orbitOffset) * config.floatAmplitude;

    meshRef.current.position.set(
      config.position[0] + orbitX * 0.3,
      config.position[1] + floatY,
      config.position[2] + orbitZ * 0.3
    );

    meshRef.current.rotation.x += config.rotationSpeed[0] * 0.01;
    meshRef.current.rotation.y += config.rotationSpeed[1] * 0.01;
    meshRef.current.rotation.z += config.rotationSpeed[2] * 0.01;

    const targetScale = config.scale * visibility;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.05
    );
  });

  return (
    <group ref={meshRef} scale={[0, 0, 0]}>
      <primitive object={mesh} />
    </group>
  );
}

export function FloatingTools({ scrollProgress, reducedMotion, isMobile }: FloatingToolsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.05) * 0.1;
  });

  if (isMobile) return null;

  return (
    <group ref={groupRef}>
      {TOOL_CONFIGS.map((config) => (
        <FloatingTool
          key={config.name}
          config={config}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  );
}
