'use client';

export function Footer() {
  return (
    <footer className="bg-[#171725] text-white/50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Footer Content */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-10">
            <div className="lg:col-span-1">
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-[18px] font-light tracking-[0.06em] text-white">Lumière</span>
                <span className="text-[18px] font-extralight tracking-[0.06em] text-[#c9a87c]">Dental</span>
              </div>
              <p className="text-[14px] font-light leading-[1.8] text-white/30 max-w-[260px]">
                Exceptional dentistry, designed around you.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#c9a87c]/50 mb-5">
                Navigation
              </h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Treatments', href: '#treatments' },
                  { label: 'About', href: '#about' },
                  { label: 'Technology', href: '#technology' },
                  { label: 'Results', href: '#results' },
                  { label: 'Reviews', href: '#testimonials' },
                  { label: 'Contact', href: '#contact' },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13px] font-light text-white/30 hover:text-white/70 transition-colors duration-300 no-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#c9a87c]/50 mb-5">
                Treatments
              </h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {['Veneers', 'Teeth Whitening', 'Dental Implants', 'Clear Aligners', 'Smile Design'].map((item) => (
                  <li key={item}>
                    <a
                      href="#treatments"
                      className="text-[13px] font-light text-white/30 hover:text-white/70 transition-colors duration-300 no-underline"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#c9a87c]/50 mb-5">
                Contact
              </h4>
              <div className="flex flex-col gap-2.5 text-[13px] font-light text-white/30">
                <p>123 Dental Avenue, Suite 200</p>
                <p>New York, NY 10001</p>
                <a href="tel:+1234567890" className="hover:text-white/70 transition-colors no-underline text-[#c9a87c]/40">
                  +1 (234) 567-890
                </a>
                <a href="mailto:hello@lumieredental.com" className="hover:text-white/70 transition-colors no-underline text-white/30">
                  hello@lumieredental.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-light text-white/15">
            &copy; 2026 Lumière Dental. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] font-light text-white/15 hover:text-white/30 transition-colors no-underline"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
