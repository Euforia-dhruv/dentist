import { DentalHero } from '@/components/dental/DentalHero';
import { Navbar } from '@/components/dental/Navbar';
import { Footer } from '@/components/dental/Footer';

const treatmentCategories = [
  {
    num: '01',
    label: 'Cosmetic Dentistry',
    items: [
      { name: 'Veneers', desc: 'Ultra-thin porcelain shells for a flawless smile.' },
      { name: 'Teeth Whitening', desc: 'Professional-grade brightening for lasting radiance.' },
      { name: 'Smile Design', desc: 'Complete transformation tailored to your facial features.' },
    ],
  },
  {
    num: '02',
    label: 'Restorative',
    items: [
      { name: 'Crowns', desc: 'Custom restorations that blend seamlessly.' },
      { name: 'Implants', desc: 'Permanent tooth replacement with natural feel.' },
      { name: 'Full Mouth Rehabilitation', desc: 'Comprehensive restoration of function and aesthetics.' },
    ],
  },
  {
    num: '03',
    label: 'Preventive',
    items: [
      { name: 'Cleaning', desc: 'Thorough professional hygiene care.' },
      { name: 'Exams', desc: 'Comprehensive oral health assessments.' },
      { name: 'Gum Care', desc: 'Periodontal therapy and maintenance.' },
    ],
  },
];

const testimonials = [
  {
    text: 'The entire experience felt thoughtful from the first consultation to the final result.',
    name: 'Sarah M.',
    treatment: 'Smile Transformation',
  },
  {
    text: 'Professional, precise, and genuinely caring. The technology they use made the entire process comfortable.',
    name: 'James R.',
    treatment: 'Dental Implants',
  },
  {
    text: 'I finally have the smile I always wanted. The team understood exactly what I wanted and delivered beautifully.',
    name: 'Priya K.',
    treatment: 'Veneers',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <DentalHero />

      {/* Our Philosophy */}
      <section id="about" className="section-padding bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20 md:mb-24">
            <p className="eyebrow text-center">Our Philosophy</p>
            <h2 className="section-heading text-center">
              Dentistry with intention
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-16 md:gap-20">
            {[
              {
                num: '01',
                title: 'Digital Precision',
                desc: 'Every treatment planned with advanced 3D imaging and digital workflows for exceptional accuracy.',
              },
              {
                num: '02',
                title: 'Personal Care',
                desc: 'Treatment plans designed around your individual goals, anatomy, and lifestyle.',
              },
              {
                num: '03',
                title: 'Exceptional Results',
                desc: 'Combining clinical expertise with thoughtful aesthetic dentistry for lasting confidence.',
              },
            ].map((item) => (
              <div key={item.num} className="group">
                <span className="text-[10px] font-medium tracking-[0.25em] text-[#c9a87c]">{item.num}</span>
                <div className="gold-divider my-5 group-hover:w-10 transition-all duration-500" />
                <h3 className="text-[18px] font-light text-[#1a1a2e] mb-3 tracking-[-0.01em]">{item.title}</h3>
                <p className="text-[15px] text-[#4a4a5a] font-light leading-[1.75]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments - Editorial Layout */}
      <section id="treatments" className="section-padding bg-[#f5f2ed]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20 md:mb-24">
            <p className="eyebrow text-center">What We Offer</p>
            <h2 className="section-heading text-center">
              Treatments
            </h2>
          </div>

          <div className="space-y-16">
            {treatmentCategories.map((category) => (
              <div key={category.num}>
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-[10px] font-medium tracking-[0.25em] text-[#c9a87c]/50">{category.num}</span>
                  <div className="gold-divider" />
                  <h3 className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#c9a87c]">
                    {category.label}
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {category.items.map((treatment) => (
                    <div key={treatment.name} className="group cursor-pointer">
                      <h4 className="text-[16px] font-light text-[#1a1a2e] mb-2 group-hover:text-[#c9a87c] transition-colors duration-300">
                        {treatment.name}
                      </h4>
                      <p className="text-[14px] text-[#7a7a8a] font-light leading-[1.7]">
                        {treatment.desc}
                      </p>
                      <div className="gold-divider mt-4 w-0 group-hover:w-8 transition-all duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a href="/appointment" className="link-gold justify-center">
              Book a Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="section-padding bg-[#171725]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20 md:mb-24">
            <p className="eyebrow text-center !text-[#c9a87c]/60">Advanced Tools</p>
            <h2 className="section-heading text-center !text-white">
              Our Technology
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Digital Scanning',
                desc: 'Precise digital impressions without conventional discomfort.',
              },
              {
                title: '3D Treatment Planning',
                desc: 'Every treatment mapped digitally before it begins.',
              },
              {
                title: 'Precision Dentistry',
                desc: 'Technology combined with clinician expertise for exceptional outcomes.',
              },
              {
                title: 'Personalized Care',
                desc: 'Treatment designed around the individual patient.',
              },
            ].map((tech, i) => (
              <div key={i} className="p-8 border border-white/[0.05] hover:border-[#c9a87c]/15 transition-colors duration-500 group">
                <span className="text-[10px] font-medium tracking-[0.25em] text-[#c9a87c]/40">
                  0{i + 1}
                </span>
                <h3 className="text-[18px] font-light text-white mt-3 mb-3 group-hover:text-[#c9a87c]/90 transition-colors duration-300">{tech.title}</h3>
                <p className="text-[14px] text-white/35 font-light leading-[1.75]">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor */}
      <section className="section-padding bg-[#f5f2ed]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <p className="eyebrow">Meet Your Dentist</p>
              <h2 className="text-[32px] md:text-[40px] font-extralight text-[#1a1a2e] tracking-[-0.02em] leading-[1.1] mb-5">
                Dr. Alexandra Chen
              </h2>
              <p className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#c9a87c] mb-6">
                Founder & Lead Dentist
              </p>
              <div className="space-y-4 text-[15px] text-[#4a4a5a] font-light leading-[1.75]">
                <p>
                  With over 15 years of experience in cosmetic and restorative dentistry, Dr. Chen combines clinical excellence with an artistic eye for natural-looking results.
                </p>
                <p>
                  Specializing in digital smile design, minimally invasive procedures, and full-mouth rehabilitation, she leads a team dedicated to transforming lives through exceptional dental care.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-6">
                {[
                  { label: 'Experience', value: '15+ Years' },
                  { label: 'Patients Treated', value: '5,000+' },
                  { label: 'Specialization', value: 'Cosmetic' },
                  { label: 'Approach', value: 'Digital-First' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#7a7a8a] mb-1">{stat.label}</p>
                    <p className="text-[16px] font-light text-[#1a1a2e]">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a href="/appointment" className="link-gold">
                  Book with Dr. Chen
                </a>
              </div>
            </div>
            <div className="order-1 lg:order-2 aspect-[3/4] bg-gradient-to-br from-[#e8e0d4] to-[#d4ccc0] flex items-center justify-center overflow-hidden">
              <img
                src="/images/doctor-portrait.jpg"
                alt="Dr. Alexandra Chen"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="section-padding bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow text-center">Results</p>
            <h2 className="section-heading text-center">
              Smile Transformations
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { img: '/images/smile-after-1.jpg', label: 'Smile Makeover', timeline: '6 weeks' },
              { img: '/images/before-after-1.jpg', label: 'Veneers', timeline: '4 weeks' },
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#f0ebe3] to-[#e8e0d4] overflow-hidden mb-4">
                  <img
                    src={item.img}
                    alt={`${item.label} transformation`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[14px] font-light text-[#1a1a2e] group-hover:text-[#c9a87c] transition-colors">{item.label}</h4>
                  <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#7a7a8a]">{item.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Editorial */}
      <section id="testimonials" className="section-padding bg-[#f5f2ed]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow text-center">Patient Stories</p>
            <h2 className="section-heading text-center">
              What Our Patients Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {testimonials.map((t, i) => (
              <div key={i} className="group">
                <div className="gold-divider mb-6 group-hover:w-10 transition-all duration-500" />
                <blockquote className="text-[16px] text-[#1a1a2e] font-light leading-[1.7] mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div>
                  <p className="text-[13px] font-medium text-[#1a1a2e]">{t.name}</p>
                  <p className="text-[11px] text-[#7a7a8a] font-light tracking-[0.05em]">{t.treatment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <p className="eyebrow">Get In Touch</p>
              <h2 className="text-[32px] md:text-[40px] font-extralight text-[#1a1a2e] tracking-[-0.02em] leading-[1.1] mb-7">
                Visit the Clinic
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#c9a87c] mb-2">Address</p>
                  <p className="text-[15px] text-[#4a4a5a] font-light">123 Dental Avenue, Suite 200</p>
                  <p className="text-[15px] text-[#4a4a5a] font-light">New York, NY 10001</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#c9a87c] mb-2">Contact</p>
                  <a href="tel:+1234567890" className="text-[15px] text-[#4a4a5a] font-light no-underline hover:text-[#c9a87c] transition-colors block">
                    +1 (234) 567-890
                  </a>
                  <a href="mailto:hello@lumieredental.com" className="text-[15px] text-[#4a4a5a] font-light no-underline hover:text-[#c9a87c] transition-colors block">
                    hello@lumieredental.com
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#c9a87c] mb-2">Hours</p>
                  <p className="text-[15px] text-[#4a4a5a] font-light">Mon — Fri: 8:00 AM — 6:00 PM</p>
                  <p className="text-[15px] text-[#4a4a5a] font-light">Sat: 9:00 AM — 2:00 PM</p>
                </div>
              </div>
            </div>
            <div className="aspect-[4/3] bg-gradient-to-br from-[#f0ebe3] to-[#e8e0d4] flex items-center justify-center overflow-hidden">
              <img
                src="/images/clinic-interior.jpg"
                alt="Lumière Dental clinic interior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#171725]">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-[32px] md:text-[44px] font-extralight text-white mb-5 tracking-[-0.025em] leading-[1.1]">
            Your smile, thoughtfully designed.
          </h2>
          <p className="text-[15px] text-white/35 font-light mb-10 leading-[1.75]">
            Schedule your consultation and discover what modern dentistry can do for you.
          </p>
          <a
            href="/appointment"
            className="btn-primary"
          >
            Book an Appointment
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
