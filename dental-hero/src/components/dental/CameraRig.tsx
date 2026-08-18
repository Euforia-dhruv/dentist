'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress: number;
  reducedMotion: boolean;
}

export function CameraRig({ scrollProgress, reducedMotion }: CameraRigProps) {
  const { camera, size } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3(4.0, 2.0, 6.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isMobile = size.width < 768;

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

    const pointerOffsetX = mx * 0.15;
    const pointerOffsetY = my * 0.08;

    if (isMobile) {
      if (p < 0.1) {
        targetPosition.current.set(3.5, 2.0, 7.0);
        targetLookAt.current.set(0, 0, 0);
      } else if (p < 0.3) {
        const t = (p - 0.1) / 0.2;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(3.5, 2.5, e),
          THREE.MathUtils.lerp(2.0, 1.5, e),
          THREE.MathUtils.lerp(7.0, 5.0, e)
        );
        targetLookAt.current.set(0, 0.05, 0.1);
      } else if (p < 0.6) {
        const t = (p - 0.3) / 0.3;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(2.5, 1.8, e),
          THREE.MathUtils.lerp(1.5, 1.0, e),
          THREE.MathUtils.lerp(5.0, 3.5, e)
        );
        targetLookAt.current.set(0, 0.1, 0.2);
      } else {
        const t = (p - 0.6) / 0.4;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(1.8, 3.5, e),
          THREE.MathUtils.lerp(1.0, 2.0, e),
          THREE.MathUtils.lerp(3.5, 7.0, e)
        );
        targetLookAt.current.set(0, 0, 0);
      }
    } else {
      if (p < 0.08) {
        const t = p / 0.08;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(4.0, 3.5, e) + pointerOffsetX,
          THREE.MathUtils.lerp(2.0, 1.8, e) + pointerOffsetY,
          THREE.MathUtils.lerp(6.5, 5.5, e)
        );
        targetLookAt.current.set(0, 0, 0);
      } else if (p < 0.25) {
        const t = (p - 0.08) / 0.17;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(3.5, 2.8, e) + pointerOffsetX,
          THREE.MathUtils.lerp(1.8, 1.5, e) + pointerOffsetY,
          THREE.MathUtils.lerp(5.5, 4.5, e)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0, 0.05, e),
          THREE.MathUtils.lerp(0, 0.08, e),
          THREE.MathUtils.lerp(0, 0.15, e)
        );
      } else if (p < 0.45) {
        const t = (p - 0.25) / 0.2;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(2.8, 2.0, e) + pointerOffsetX,
          THREE.MathUtils.lerp(1.5, 1.2, e) + pointerOffsetY,
          THREE.MathUtils.lerp(4.5, 3.5, e)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.05, 0.1, e),
          THREE.MathUtils.lerp(0.08, 0.12, e),
          THREE.MathUtils.lerp(0.15, 0.3, e)
        );
      } else if (p < 0.65) {
        const t = (p - 0.45) / 0.2;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(2.0, 1.5, e) + pointerOffsetX,
          THREE.MathUtils.lerp(1.2, 0.9, e) + pointerOffsetY,
          THREE.MathUtils.lerp(3.5, 2.8, e)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.1, 0.15, e),
          THREE.MathUtils.lerp(0.12, 0.15, e),
          THREE.MathUtils.lerp(0.3, 0.4, e)
        );
      } else if (p < 0.82) {
        const t = (p - 0.65) / 0.17;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(1.5, 2.5, e) + pointerOffsetX * 0.5,
          THREE.MathUtils.lerp(0.9, 1.5, e) + pointerOffsetY * 0.5,
          THREE.MathUtils.lerp(2.8, 4.5, e)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.15, 0.05, e),
          THREE.MathUtils.lerp(0.15, 0.05, e),
          THREE.MathUtils.lerp(0.4, 0.1, e)
        );
      } else {
        const t = (p - 0.82) / 0.18;
        const e = t * t * (3 - 2 * t);
        targetPosition.current.set(
          THREE.MathUtils.lerp(2.5, 4.0, e) + pointerOffsetX * 0.3,
          THREE.MathUtils.lerp(1.5, 2.0, e) + pointerOffsetY * 0.3,
          THREE.MathUtils.lerp(4.5, 6.5, e)
        );
        targetLookAt.current.set(0, 0, 0);
      }
    }

    const lerpFactor = 0.035;
    camera.position.lerp(targetPosition.current, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
