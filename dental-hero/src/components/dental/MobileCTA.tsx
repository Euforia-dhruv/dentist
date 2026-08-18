'use client';

import Link from 'next/link';

export function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-white/95 backdrop-blur-md border-t border-[#c9a87c]/10 px-4 py-3 flex gap-3">
        <a
          href="tel:+1234567890"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1a1a2e]/[0.06] text-[#1a1a2e] text-[12px] font-medium tracking-[0.1em] uppercase no-underline hover:bg-[#1a1a2e]/[0.1] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          Call
        </a>
        <Link
          href="/appointment"
          className="flex-[2] flex items-center justify-center py-3.5 bg-[#1a1a2e] text-white text-[12px] font-medium tracking-[0.12em] uppercase no-underline hover:bg-[#2a2a3e] transition-colors"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
