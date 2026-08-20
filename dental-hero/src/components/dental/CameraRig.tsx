'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

export function CameraRig({ scrollProgress, reducedMotion }: CameraRigProps) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3(3.5, 1.8, 10.0));
  const targetLookAt = useRef(new THREE.Vector3(0.5, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0.5, 0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (reducedMotion) return;

    const p = scrollProgress;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const px = mx * 0.12;
    const py = my * 0.06;

    if (p < 0.1) {
      const t = p / 0.1;
      const e = t * t * (3 - 2 * t);
      targetPosition.current.set(
        THREE.MathUtils.lerp(3.5, 3.2, e) + px,
        THREE.MathUtils.lerp(1.8, 1.5, e) + py,
        THREE.MathUtils.lerp(10.0, 8.5, e)
      );
      targetLookAt.current.set(0.5, THREE.MathUtils.lerp(0, 0.2, e), 0);
    } else if (p < 0.3) {
      const t = (p - 0.1) / 0.2;
      const e = t * t * (3 - 2 * t);
      targetPosition.current.set(
        THREE.MathUtils.lerp(3.2, 2.5, e) + px,
        THREE.MathUtils.lerp(1.5, 1.2, e) + py,
        THREE.MathUtils.lerp(8.5, 6.5, e)
      );
      targetLookAt.current.set(
        THREE.MathUtils.lerp(0.5, 0.3, e),
        THREE.MathUtils.lerp(0.2, 0.3, e),
        THREE.MathUtils.lerp(0, 0.1, e)
      );
    } else if (p < 0.5) {
      const t = (p - 0.3) / 0.2;
      const e = t * t * (3 - 2 * t);
      targetPosition.current.set(
        THREE.MathUtils.lerp(2.5, 2.0, e) + px,
        THREE.MathUtils.lerp(1.2, 0.8, e) + py,
        THREE.MathUtils.lerp(6.5, 5.0, e)
      );
      targetLookAt.current.set(
        THREE.MathUtils.lerp(0.3, 0.2, e),
        THREE.MathUtils.lerp(0.3, 0.2, e),
        THREE.MathUtils.lerp(0.1, 0.2, e)
      );
    } else if (p < 0.75) {
      const t = (p - 0.5) / 0.25;
      const e = t * t * (3 - 2 * t);
      targetPosition.current.set(
        THREE.MathUtils.lerp(2.0, 3.0, e) + px * 0.6,
        THREE.MathUtils.lerp(0.8, 1.4, e) + py * 0.6,
        THREE.MathUtils.lerp(5.0, 7.0, e)
      );
      targetLookAt.current.set(
        THREE.MathUtils.lerp(0.2, 0.5, e),
        THREE.MathUtils.lerp(0.2, 0, e),
        THREE.MathUtils.lerp(0.2, 0, e)
      );
    } else {
      const t = (p - 0.75) / 0.25;
      const e = t * t * (3 - 2 * t);
      targetPosition.current.set(
        THREE.MathUtils.lerp(3.0, 3.5, e) + px * 0.4,
        THREE.MathUtils.lerp(1.4, 1.8, e) + py * 0.4,
        THREE.MathUtils.lerp(7.0, 10.0, e)
      );
      targetLookAt.current.set(0.5, 0, 0);
    }

    const lerpFactor = 0.04;
    camera.position.lerp(targetPosition.current, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
