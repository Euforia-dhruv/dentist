'use client';

import { useState, useEffect } from 'react';

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progressBar, setProgressBar] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1500;

    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgressBar(Math.floor(pct));
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setVisible(false), 300);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const done = progressBar >= 100;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: '#faf8f5',
        opacity: done ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        pointerEvents: done ? 'none' : 'auto',
      }}
    >
      <div className="text-center">
        <div className="flex items-baseline gap-1.5 mb-10">
          <span className="text-[28px] font-light tracking-[0.06em] text-[#1a1a2e]">
            Lumière
          </span>
          <span className="text-[28px] font-extralight tracking-[0.06em] text-[#c9a87c]">
            Dental
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-[1px] bg-[#e8e0d4] relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#c9a87c] to-[#d4b896]"
              style={{
                width: `${Math.min(progressBar, 100)}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-[#aaa]">
            {done ? 'Welcome' : 'Preparing your experience'}
          </p>
        </div>
      </div>
    </div>
  );
}
