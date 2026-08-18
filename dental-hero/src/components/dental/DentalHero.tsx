'use client';

import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollController } from './ScrollController';
import { LoadingScreen } from './LoadingScreen';
import { MobileFallback } from './MobileFallback';
import { Scene } from './Scene';

const chapters = [
  {
    eyebrow: 'Modern Dentistry',
    title: ['YOUR SMILE,', 'REIMAGINED.'],
    body: 'Advanced dentistry. Personal care. Exceptional results.',
    align: 'left' as const,
  },
  {
    eyebrow: 'Every Smile Is Unique',
    title: ['Every smile is', 'different.'],
    body: 'We study the unique geometry of your dental anatomy to craft treatments that feel naturally yours.',
    align: 'center' as const,
  },
  {
    eyebrow: 'Digital Precision',
    title: ['Precision,', 'down to the detail.'],
    body: 'Modern digital technology allows us to plan every treatment with exceptional accuracy.',
    align: 'right' as const,
  },
  {
    eyebrow: 'Tooth Selection',
    title: ['One tooth', 'at a time.'],
    body: 'Each tooth is individually analyzed and treated with the precision it deserves.',
    align: 'left' as const,
  },
  {
    eyebrow: 'Thoughtful Treatment',
    title: ['Transformed', 'with care.'],
    body: 'A conceptual visualization of how modern digital workflows guide every step of your treatment journey.',
    align: 'right' as const,
  },
  {
    eyebrow: '',
    title: ['Dentistry, designed', 'around you.'],
    body: '',
    align: 'center' as const,
  },
];

const chapterRanges = [
  [0, 0.1],
  [0.1, 0.28],
  [0.28, 0.46],
  [0.46, 0.64],
  [0.64, 0.82],
  [0.82, 1.0],
];

function getChapterOpacity(scrollProgress: number, chapterIndex: number): number {
  const [start, end] = chapterRanges[chapterIndex];
  const range = end - start;

  if (chapterIndex === 0) {
    const fadeOut = Math.max(0, 1 - (scrollProgress - start - range * 0.5) / (range * 0.4));
    return Math.max(0.01, fadeOut);
  }

  if (chapterIndex === chapters.length - 1) {
    return Math.min(1, (scrollProgress - start) / (range * 0.4));
  }

  const fadeIn = Math.max(0, Math.min(1, (scrollProgress - start) / (range * 0.25)));
  const fadeOut = Math.max(0, Math.min(1, (end - scrollProgress) / (range * 0.25)));
  return fadeIn * fadeOut;
}

function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent;
      setIsMobile(width < 768 || /Android|iPhone|iPad|iPod/i.test(userAgent));
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return { isMobile, reducedMotion };
}

function HeroCanvas({ scrollProgress, reducedMotion }: { scrollProgress: number; reducedMotion: boolean }) {
  const [showTechViz] = useState(false);

  return (
    <Canvas
      camera={{ position: [4.0, 2.0, 6.5], fov: 28 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
          showTechViz={showTechViz}
        />
      </Suspense>
    </Canvas>
  );
}

export function DentalHero() {
  const { isMobile, reducedMotion } = useDeviceDetection();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  const chapter = Math.max(0, chapterRanges.findIndex(
    ([start, end]) => scrollProgress >= start && scrollProgress < end
  ));

  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <ScrollController onScrollProgress={handleScrollProgress}>
      <div className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              background: chapter < 2
                ? 'linear-gradient(160deg, #faf8f5 0%, #f5f0e8 50%, #f0ebe3 100%)'
                : chapter < 4
                ? 'linear-gradient(160deg, #f5f0e8 0%, #f0ebe3 50%, #ebe4d8 100%)'
                : 'linear-gradient(160deg, #f0ebe3 0%, #f5f0e8 50%, #faf8f5 100%)',
            }}
          />

          <LoadingScreen />

          {isLoaded && (
            <HeroCanvas
              scrollProgress={scrollProgress}
              reducedMotion={reducedMotion}
            />
          )}

          <div
            className="absolute inset-0"
            style={{ zIndex: 20, pointerEvents: 'none' }}
          >
            {chapters.map((ch, i) => {
              const opacity = getChapterOpacity(scrollProgress, i);
              if (opacity < 0.01) return null;

              const isLast = i === chapters.length - 1;

              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center"
                  style={{ opacity }}
                >
                  <div className={`w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 ${
                    ch.align === 'center' ? 'flex justify-center' :
                    ch.align === 'right' ? 'flex justify-end' : ''
                  }`}>
                    <div
                      className={`${
                        isLast ? 'text-center max-w-[700px]' :
                        ch.align === 'center' ? 'text-center max-w-[600px]' :
                        'max-w-[420px]'
                      }`}
                      style={ch.align === 'left' ? { marginLeft: '8%' } : ch.align === 'right' ? { marginRight: '8%' } : {}}
                    >
                      {ch.eyebrow && (
                        <p
                          className={`eyebrow mb-6 ${ch.align === 'center' ? 'text-center' : ''}`}
                          style={{ textShadow: '0 0 15px rgba(250,248,245,0.8)' }}
                        >
                          {ch.eyebrow}
                        </p>
                      )}
                      <h2
                        className={`font-extralight text-[#1a1a2e] tracking-[-0.025em] leading-[1.08] mb-5 ${
                          isLast
                            ? 'text-[32px] sm:text-[42px] md:text-[56px]'
                            : 'text-[28px] sm:text-[36px] md:text-[46px]'
                        }`}
                        style={{ textShadow: '0 1px 8px rgba(250,248,245,0.9), 0 0 30px rgba(250,248,245,0.6)' }}
                      >
                        {ch.title.map((line, j) => (
                          <span key={j}>
                            {j === 1 && ch.title[0].includes(',') ? (
                              <span className="text-[#c9a87c]">{line}</span>
                            ) : (
                              line
                            )}
                            {j === 0 && <br />}
                          </span>
                        ))}
                      </h2>
                      {ch.body && (
                        <p
                          className={`text-[14px] md:text-[15px] text-[#4a4a5a] font-light leading-[1.75] ${
                            ch.align === 'center' ? 'mx-auto' : ''
                          } ${isLast ? 'mb-8' : ''} max-w-[400px]`}
                          style={{ textShadow: '0 0 20px rgba(250,248,245,0.8)' }}
                        >
                          {ch.body}
                        </p>
                      )}
                      {isLast && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
                          <a
                            href="/appointment"
                            className="inline-flex items-center justify-center px-8 py-4 bg-[#1a1a2e] text-white text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-[#2a2a3e] transition-all duration-300 no-underline"
                          >
                            Book an Appointment
                          </a>
                          <a
                            href="#treatments"
                            className="inline-flex items-center justify-center px-8 py-4 text-[#1a1a2e] text-[11px] font-medium tracking-[0.14em] uppercase hover:text-[#c9a87c] transition-colors duration-300 no-underline"
                          >
                            Explore Treatments
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {scrollProgress < 0.15 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ zIndex: 20 }}>
              <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#999]">
                Scroll to explore
              </p>
              <div className="w-[1px] h-8 bg-gradient-to-b from-[#c9a87c]/40 to-transparent relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full bg-[#c9a87c]"
                  style={{
                    height: '40%',
                    animation: 'scrollPulse 2s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollController>
  );
}
