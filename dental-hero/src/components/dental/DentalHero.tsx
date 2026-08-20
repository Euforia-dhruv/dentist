'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollController } from './ScrollController';
import { LoadingScreen } from './LoadingScreen';
import { Scene } from './Scene';

interface Chapter {
  eyebrow: string;
  title: string[];
  body: string;
  align: 'left' | 'center' | 'right';
}

const chapters: Chapter[] = [
  {
    eyebrow: 'Modern Dentistry',
    title: ['YOUR SMILE,', 'REIMAGINED.'],
    body: 'Advanced dentistry. Personal care. Exceptional results.',
    align: 'left',
  },
  {
    eyebrow: 'Every Smile Is Unique',
    title: ['Every smile is', 'different.'],
    body: 'We study the unique geometry of your dental anatomy to craft treatments that feel naturally yours.',
    align: 'center',
  },
  {
    eyebrow: 'Digital Precision',
    title: ['Precision,', 'down to the detail.'],
    body: 'Modern digital technology allows us to plan every treatment with exceptional accuracy.',
    align: 'right',
  },
  {
    eyebrow: 'Tooth Selection',
    title: ['One tooth', 'at a time.'],
    body: 'Each tooth is individually analyzed and treated with the precision it deserves.',
    align: 'left',
  },
  {
    eyebrow: 'Thoughtful Treatment',
    title: ['Transformed', 'with care.'],
    body: 'A conceptual visualization of how modern digital workflows guide every step of your treatment journey.',
    align: 'right',
  },
  {
    eyebrow: '',
    title: ['Dentistry, designed', 'around you.'],
    body: '',
    align: 'center',
  },
];

const chapterRanges: [number, number][] = [
  [0, 0.1],
  [0.1, 0.28],
  [0.28, 0.46],
  [0.46, 0.64],
  [0.64, 0.82],
  [0.82, 1.0],
];

function getChapterOpacity(progress: number, idx: number): number {
  const [start, end] = chapterRanges[idx];
  const range = end - start;

  if (idx === 0) {
    return Math.max(0.01, 1 - (progress - start - range * 0.5) / (range * 0.4));
  }
  if (idx === chapters.length - 1) {
    return Math.min(1, (progress - start) / (range * 0.4));
  }
  const fadeIn = Math.max(0, Math.min(1, (progress - start) / (range * 0.25)));
  const fadeOut = Math.max(0, Math.min(1, (end - progress) / (range * 0.25)));
  return fadeIn * fadeOut;
}

function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMotion);
    check();
    window.addEventListener('resize', check);
    return () => {
      mq.removeEventListener('change', onMotion);
      window.removeEventListener('resize', check);
    };
  }, []);

  return { isMobile, reducedMotion };
}

function HeroCanvas({ scrollProgress, reducedMotion, isMobile }: { scrollProgress: number; reducedMotion: boolean; isMobile: boolean }) {
  return (
    <Canvas
      camera={{ position: isMobile ? [0.0, 0.5, 5.5] : [-0.5, 0.8, 6.2], fov: isMobile ? 38 : 32, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene scrollProgress={scrollProgress} reducedMotion={reducedMotion} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}

export function DentalHero() {
  const { isMobile, reducedMotion } = useDeviceDetection();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  const handleScrollProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  const chapter = Math.max(
    0,
    chapterRanges.findIndex(([s, e]) => scrollProgress >= s && scrollProgress < e)
  );

  if (isMobile) {
    return (
      <ScrollController onScrollProgress={handleScrollProgress}>
        <div className="relative h-[600vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  chapter < 2
                    ? 'linear-gradient(160deg, #faf8f5 0%, #f5f0e8 50%, #f0ebe3 100%)'
                    : chapter < 4
                    ? 'linear-gradient(160deg, #f5f0e8 0%, #f0ebe3 50%, #ebe4d8 100%)'
                    : 'linear-gradient(160deg, #f0ebe3 0%, #f5f0e8 50%, #faf8f5 100%)',
              }}
            />

            <LoadingScreen />

            {isLoaded && <HeroCanvas scrollProgress={scrollProgress} reducedMotion={reducedMotion} isMobile />}

            <div className="absolute inset-0" style={{ zIndex: 20, pointerEvents: 'none' }}>
              {chapters.map((ch, i) => {
                const opacity = getChapterOpacity(scrollProgress, i);
                if (opacity < 0.01) return null;
                const isLast = i === chapters.length - 1;

                return (
                  <div key={i} className="absolute inset-0 flex items-end sm:items-center pb-32 sm:pb-0" style={{ opacity }}>
                    <div className="w-full px-6 flex justify-center">
                      <div className="text-center max-w-[340px]">
                        {ch.eyebrow && (
                          <p className="eyebrow mb-4 text-center">{ch.eyebrow}</p>
                        )}
                        <h2
                          className={`display-heading mb-4 ${
                            isLast ? 'text-[28px]' : 'text-[24px]'
                          }`}
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
                            className={`text-[12px] text-[#6a6a78] font-light leading-[1.9] tracking-[0.01em] mx-auto ${isLast ? 'mb-8' : ''} max-w-[300px]`}
                          >
                            {ch.body}
                          </p>
                        )}
                        {isLast && (
                          <div className="flex flex-col gap-3 justify-center pointer-events-auto">
                            <a href="/appointment" className="btn-primary">
                              Book an Appointment
                            </a>
                            <a href="#treatments" className="btn-secondary">
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

            {scrollProgress < 0.12 && (
              <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                style={{ zIndex: 20 }}
              >
                <p className="text-[9px] font-medium tracking-[0.35em] uppercase text-[#b0b0b8]">
                  Scroll to explore
                </p>
                <div className="w-[1px] h-7 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 w-full bg-[#c4a265]/30"
                    style={{ height: '100%', animation: 'scrollPulse 3s ease-in-out infinite' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollController>
    );
  }

  return (
    <ScrollController onScrollProgress={handleScrollProgress}>
      <div className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                chapter < 2
                  ? 'linear-gradient(160deg, #faf8f5 0%, #f5f0e8 50%, #f0ebe3 100%)'
                  : chapter < 4
                  ? 'linear-gradient(160deg, #f5f0e8 0%, #f0ebe3 50%, #ebe4d8 100%)'
                  : 'linear-gradient(160deg, #f0ebe3 0%, #f5f0e8 50%, #faf8f5 100%)',
            }}
          />

          <LoadingScreen />

            {isLoaded && <HeroCanvas scrollProgress={scrollProgress} reducedMotion={reducedMotion} isMobile={false} />}

          <div className="absolute inset-0" style={{ zIndex: 20, pointerEvents: 'none' }}>
            {chapters.map((ch, i) => {
              const opacity = getChapterOpacity(scrollProgress, i);
              if (opacity < 0.01) return null;
              const isLast = i === chapters.length - 1;

              return (
                <div key={i} className="absolute inset-0 flex items-center" style={{ opacity }}>
                  <div
                    className={`w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 ${
                      ch.align === 'center'
                        ? 'flex justify-center'
                        : ch.align === 'right'
                        ? 'flex justify-end'
                        : ''
                    }`}
                  >
                    <div
                      className={`${
                        isLast
                          ? 'text-center max-w-[700px]'
                          : ch.align === 'center'
                          ? 'text-center max-w-[550px]'
                          : 'max-w-[420px]'
                      }`}
                      style={
                        ch.align === 'left'
                          ? { marginLeft: '6%' }
                          : ch.align === 'right'
                          ? { marginRight: '6%' }
                          : {}
                      }
                    >
                      {ch.eyebrow && (
                        <p
                          className={`eyebrow mb-6 ${ch.align === 'center' ? 'text-center' : ''}`}
                        >
                          {ch.eyebrow}
                        </p>
                      )}
                      <h2
                        className={`display-heading mb-6 ${
                          isLast ? 'text-[36px] sm:text-[44px] md:text-[56px]' : 'text-[30px] sm:text-[38px] md:text-[46px]'
                        }`}
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
                          className={`text-[13px] md:text-[14px] text-[#6a6a78] font-light leading-[1.9] tracking-[0.01em] ${
                            ch.align === 'center' ? 'mx-auto' : ''
                          } ${isLast ? 'mb-10' : ''} max-w-[380px]`}
                        >
                          {ch.body}
                        </p>
                      )}
                      {isLast && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pointer-events-auto">
                          <a href="/appointment" className="btn-primary">
                            Book an Appointment
                          </a>
                          <a href="#treatments" className="btn-secondary">
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

          {scrollProgress < 0.12 && (
            <div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
              style={{ zIndex: 20 }}
            >
              <p className="text-[9px] font-medium tracking-[0.35em] uppercase text-[#b0b0b8]">
                Scroll to explore
              </p>
              <div className="w-[1px] h-7 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full bg-[#c4a265]/30"
                  style={{ height: '100%', animation: 'scrollPulse 3s ease-in-out infinite' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollController>
  );
}
