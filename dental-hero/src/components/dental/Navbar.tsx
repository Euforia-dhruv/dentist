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
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          backgroundColor: scrolled ? 'rgba(250,248,245,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,124,0.1)' : '1px solid transparent',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-[72px] md:h-[80px]">
          <Link href="/" className="flex items-baseline gap-1 no-underline" aria-label="Lumière Dental Home">
            <span className="text-[20px] font-light tracking-[0.06em] text-[#1a1a2e]">
              Lumière
            </span>
            <span className="text-[20px] font-extralight tracking-[0.06em] text-[#c9a87c]">
              Dental
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#6a6a7a] hover:text-[#1a1a2e] transition-colors duration-300 no-underline relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#c9a87c] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="tel:+1234567890"
              className="text-[12px] font-medium tracking-[0.06em] text-[#6a6a7a] hover:text-[#1a1a2e] transition-colors duration-300 no-underline"
            >
              +1 (234) 567-890
            </a>
            <Link
              href="/appointment"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#1a1a2e] text-white text-[11px] font-medium tracking-[0.14em] uppercase no-underline hover:bg-[#2a2a3e] transition-all duration-300"
            >
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
              style={{
                transform: mobileOpen ? 'rotate(45deg) translate(2.5px, 2.5px)' : 'none',
              }}
            />
            <span
              className="w-5 h-[1px] bg-[#1a1a2e] transition-all duration-400"
              style={{
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="w-5 h-[1px] bg-[#1a1a2e] transition-all duration-400 origin-center"
              style={{
                transform: mobileOpen ? 'rotate(-45deg) translate(2.5px, -2.5px)' : 'none',
              }}
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
        <div
          className="absolute inset-0 bg-black/15"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-[#faf8f5]/98 backdrop-blur-xl shadow-2xl flex flex-col pt-[88px] px-8"
          style={{
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
            <a
              href="tel:+1234567890"
              className="text-[13px] font-light text-[#6a6a7a] no-underline"
            >
              +1 (234) 567-890
            </a>
            <Link
              href="/appointment"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center px-6 py-3.5 bg-[#1a1a2e] text-white text-[11px] font-medium tracking-[0.14em] uppercase no-underline hover:bg-[#2a2a3e] transition-colors text-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
