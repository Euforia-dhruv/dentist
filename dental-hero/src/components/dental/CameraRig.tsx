'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress: number;
  reducedMotion: boolean;
  isMobile: boolean;
}

export function CameraRig({ scrollProgress, reducedMotion, isMobile }: CameraRigProps) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetPosition = useRef(new THREE.Vector3(isMobile ? 0.0 : -0.5, isMobile ? 0.5 : 0.8, isMobile ? 5.5 : 6.2));
  const targetLookAt = useRef(new THREE.Vector3(isMobile ? 0.0 : 0.6, 0.0, 0));
  const currentLookAt = useRef(new THREE.Vector3(isMobile ? 0.0 : 0.6, 0.0, 0));

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
    const px = isMobile ? 0 : mx * 0.06;
    const py = isMobile ? 0 : my * 0.03;

    const ease = (t: number) => t * t * (3 - 2 * t);

    if (isMobile) {
      if (p < 0.35) {
        const t = ease(p / 0.35);
        targetPosition.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.5, 0.3, t),
          THREE.MathUtils.lerp(5.5, 4.0, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.0, 0.05, t),
          0
        );
      } else if (p < 0.55) {
        const t = ease((p - 0.35) / 0.2);
        targetPosition.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.3, 0.2, t),
          THREE.MathUtils.lerp(4.0, 2.8, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.05, 0.1, t),
          0
        );
      } else if (p < 0.7) {
        const t = ease((p - 0.55) / 0.15);
        targetPosition.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.2, 0.15, t),
          THREE.MathUtils.lerp(2.8, 2.2, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.1, 0.1, t),
          0
        );
      } else {
        const t = ease((p - 0.7) / 0.3);
        targetPosition.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.15, 0.5, t),
          THREE.MathUtils.lerp(2.2, 5.5, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.0, 0.0, t),
          THREE.MathUtils.lerp(0.1, -0.1, t),
          0
        );
      }
    } else {
      if (p < 0.35) {
        const t = ease(p / 0.35);
        targetPosition.current.set(
          THREE.MathUtils.lerp(-0.5, -0.1, t) + px,
          THREE.MathUtils.lerp(0.8, 0.5, t) + py,
          THREE.MathUtils.lerp(6.2, 4.0, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.6, 0.3, t),
          THREE.MathUtils.lerp(0.0, 0.05, t),
          0
        );
      } else if (p < 0.55) {
        const t = ease((p - 0.35) / 0.2);
        targetPosition.current.set(
          THREE.MathUtils.lerp(-0.1, 0.0, t) + px,
          THREE.MathUtils.lerp(0.5, 0.35, t) + py,
          THREE.MathUtils.lerp(4.0, 2.8, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.3, 0.2, t),
          THREE.MathUtils.lerp(0.05, 0.1, t),
          0
        );
      } else if (p < 0.7) {
        const t = ease((p - 0.55) / 0.15);
        targetPosition.current.set(
          THREE.MathUtils.lerp(0.0, -0.2, t) + px * 0.5,
          THREE.MathUtils.lerp(0.35, 0.3, t) + py * 0.5,
          THREE.MathUtils.lerp(2.8, 2.2, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.2, 0.15, t),
          THREE.MathUtils.lerp(0.1, 0.15, t),
          0
        );
      } else {
        const t = ease((p - 0.7) / 0.3);
        targetPosition.current.set(
          THREE.MathUtils.lerp(-0.2, -0.5, t) + px * 0.3,
          THREE.MathUtils.lerp(0.3, 0.8, t) + py * 0.3,
          THREE.MathUtils.lerp(2.2, 6.2, t)
        );
        targetLookAt.current.set(
          THREE.MathUtils.lerp(0.15, 0.6, t),
          THREE.MathUtils.lerp(0.15, -0.1, t),
          0
        );
      }
    }

    const lerpFactor = 0.055;
    camera.position.lerp(targetPosition.current, lerpFactor);
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
