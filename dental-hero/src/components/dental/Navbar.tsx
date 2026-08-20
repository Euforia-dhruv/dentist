'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Treatments', href: '#treatments' },
  { label: 'About', href: '#about' },
  { label: 'Technology', href: '#technology' },
  { label: 'Results', href: '#results' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          backgroundColor: scrolled ? 'rgba(251,250,247,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(200,163,106,0.08)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-[72px] md:h-[80px]">
          <Link href="/" className="flex items-baseline gap-1 no-underline">
            <span className="text-[20px] font-light tracking-[0.06em] text-[#1a1a2e]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Lumière
            </span>
            <span className="text-[20px] font-light tracking-[0.06em] text-[#c9a87c]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Dental
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="link-underline text-[11px] font-medium tracking-[0.12em] uppercase text-[#6a6a7a] hover:text-[#1a1a2e] transition-colors duration-300 no-underline"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+1234567890"
              className="text-[11px] font-medium tracking-[0.08em] text-[#6a6a7a] hover:text-[#1a1a2e] transition-colors duration-300 no-underline"
            >
              +1 (234) 567-890
            </a>
            <Link href="/appointment" className="btn-primary !py-2.5 !px-5">
              Book Appointment
            </Link>
          </div>

          <button
            className="lg:hidden flex flex-col gap-[5px] p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span
              className="w-5 h-[1px] bg-[#1a1a2e] transition-all duration-400 origin-center"
              style={{ transform: mobileOpen ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none' }}
            />
            <span
              className="w-5 h-[1px] bg-[#1a1a2e] transition-all duration-400"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="w-5 h-[1px] bg-[#1a1a2e] transition-all duration-400 origin-center"
              style={{ transform: mobileOpen ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-500"
        style={{
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
      >
        <div className="absolute inset-0 bg-black/10" onClick={() => setMobileOpen(false)} />
        <div
          className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] flex flex-col pt-[88px] px-8"
          style={{
            backgroundColor: 'rgba(251,250,247,0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.08)',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="flex flex-col gap-0">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] font-light tracking-[0.04em] text-[#1a1a2e] py-4 border-b border-[#c9a87c]/8 no-underline hover:text-[#c9a87c] transition-colors"
                style={{
                  animation: mobileOpen ? `fadeInUp 0.4s ease-out ${i * 0.04}s both` : 'none',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <a href="tel:+1234567890" className="text-[13px] font-light text-[#6a6a7a] no-underline">
              +1 (234) 567-890
            </a>
            <Link
              href="/appointment"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2 text-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
