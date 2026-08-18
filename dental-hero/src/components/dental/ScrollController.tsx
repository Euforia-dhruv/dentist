'use client';

import { useEffect, useRef, useCallback } from 'react';

interface ScrollControllerProps {
  onScrollProgress: (progress: number) => void;
  children: React.ReactNode;
}

export function ScrollController({ onScrollProgress, children }: ScrollControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = containerRef.current.scrollHeight - windowHeight;

    if (totalHeight <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalHeight));

    onScrollProgress(progress);
  }, [onScrollProgress]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}
    </div>
  );
}
