'use client';

import { useState } from 'react';
import Link from 'next/link';

const treatments = [
  'General Checkup',
  'Cleaning',
  'Teeth Whitening',
  'Veneers',
  'Smile Makeover',
  'Dental Implants',
  'Clear Aligners',
  'Emergency',
  'Other',
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  date: string;
  time: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  treatment?: string;
  date?: string;
  time?: string;
}

export default function AppointmentPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '', phone: '', email: '', treatment: '', date: '', time: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[+]?[\d\s()-]{7,}$/.test(formData.phone.trim())) e.phone = 'Invalid phone number';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = 'Invalid email address';
    if (!formData.treatment) e.treatment = 'Please select a treatment';
    if (!formData.date) e.date = 'Please select a date';
    else {
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) e.date = 'Date cannot be in the past';
    }
    if (!formData.time) e.time = 'Please select a time';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-6">
        <div className="max-w-[480px] text-center animate-fade-in-up">
          <div className="w-14 h-14 mx-auto mb-7 rounded-full bg-[#c9a87c]/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a87c" strokeWidth="1.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-[26px] md:text-[32px] font-extralight text-[#1a1a2e] mb-4 tracking-[-0.02em]">
            Request Received
          </h1>
          <p className="text-[14px] text-[#4a4a5a] font-light leading-[1.75] mb-7">
            Thank you. We&apos;ve received your appointment request. The clinic will contact you to confirm the details.
          </p>
          <div className="bg-white p-5 mb-7 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-[#7a7a8a]">Patient</span>
              <span className="text-[12px] text-[#1a1a2e] font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#7a7a8a]">Treatment</span>
              <span className="text-[12px] text-[#1a1a2e] font-medium">{formData.treatment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#7a7a8a]">Date</span>
              <span className="text-[12px] text-[#1a1a2e] font-medium">{formData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[12px] text-[#7a7a8a]">Time</span>
              <span className="text-[12px] text-[#1a1a2e] font-medium">{formData.time}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#aaa] mb-7 italic">
            This is a demo appointment request. No real booking has been made.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-[#1a1a2e] text-white text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-[#2a2a3e] transition-colors no-underline"
            >
              Back to Home
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', phone: '', email: '', treatment: '', date: '', time: '', message: '' });
              }}
              className="inline-flex items-center justify-center px-7 py-3.5 border border-[#1a1a2e]/15 text-[#1a1a2e] text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-[#1a1a2e]/[0.04] transition-colors"
            >
              Request Another
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/92 backdrop-blur-xl border-b border-[#c9a87c]/8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-baseline gap-1 no-underline">
            <span className="text-[18px] font-light tracking-[0.06em] text-[#1a1a2e]">Lumière</span>
            <span className="text-[18px] font-extralight tracking-[0.06em] text-[#c9a87c]">Dental</span>
          </Link>
          <Link
            href="/"
            className="text-[12px] font-medium tracking-[0.1em] uppercase text-[#6a6a7a] hover:text-[#1a1a2e] transition-colors no-underline"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="pt-[72px]">
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-14 md:py-20">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16">
            <div>
              <p className="eyebrow">Book Your Visit</p>
              <h1 className="text-[28px] md:text-[36px] font-extralight text-[#1a1a2e] tracking-[-0.02em] leading-[1.15] mb-5">
                Let&apos;s Plan Your Visit.
              </h1>
              <p className="text-[14px] text-[#4a4a5a] font-light leading-[1.75] mb-8 max-w-[380px]">
                Tell us a little about what you&apos;re looking for and we&apos;ll help you find the right next step.
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#c9a87c] mb-1">Address</p>
                  <p className="text-[14px] text-[#4a4a5a] font-light">123 Dental Avenue, Suite 200</p>
                  <p className="text-[14px] text-[#4a4a5a] font-light">New York, NY 10001</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#c9a87c] mb-1">Phone</p>
                  <a href="tel:+1234567890" className="text-[14px] text-[#4a4a5a] font-light no-underline hover:text-[#c9a87c] transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-[#c9a87c] mb-1">Hours</p>
                  <p className="text-[14px] text-[#4a4a5a] font-light">Mon — Fri: 8:00 AM — 6:00 PM</p>
                  <p className="text-[14px] text-[#4a4a5a] font-light">Sat: 9:00 AM — 2:00 PM</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-7 md:p-9" noValidate>
              <h2 className="text-[16px] font-light text-[#1a1a2e] mb-7">Appointment Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a7a8a] mb-1.5" htmlFor="name">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-3.5 py-3 bg-[#faf8f5] border text-[13px] text-[#1a1a2e] font-light focus:outline-none focus:border-[#c9a87c] transition-colors ${
                      errors.name ? 'border-red-400' : 'border-[#e8e0d4]'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a7a8a] mb-1.5" htmlFor="phone">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`w-full px-3.5 py-3 bg-[#faf8f5] border text-[13px] text-[#1a1a2e] font-light focus:outline-none focus:border-[#c9a87c] transition-colors ${
                        errors.phone ? 'border-red-400' : 'border-[#e8e0d4]'
                      }`}
                      placeholder="+1 (234) 567-890"
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a7a8a] mb-1.5" htmlFor="email">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-3.5 py-3 bg-[#faf8f5] border text-[13px] text-[#1a1a2e] font-light focus:outline-none focus:border-[#c9a87c] transition-colors ${
                        errors.email ? 'border-red-400' : 'border-[#e8e0d4]'
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a7a8a] mb-1.5" htmlFor="treatment">
                    Treatment / Reason for Visit *
                  </label>
                  <select
                    id="treatment"
                    value={formData.treatment}
                    onChange={(e) => handleChange('treatment', e.target.value)}
                    className={`w-full px-3.5 py-3 bg-[#faf8f5] border text-[13px] text-[#1a1a2e] font-light focus:outline-none focus:border-[#c9a87c] transition-colors appearance-none ${
                      errors.treatment ? 'border-red-400' : 'border-[#e8e0d4]'
                    } ${!formData.treatment ? 'text-[#7a7a8a]' : ''}`}
                  >
                    <option value="">Select a treatment</option>
                    {treatments.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.treatment && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.treatment}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a7a8a] mb-1.5" htmlFor="date">
                      Preferred Date *
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      min={today}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className={`w-full px-3.5 py-3 bg-[#faf8f5] border text-[13px] text-[#1a1a2e] font-light focus:outline-none focus:border-[#c9a87c] transition-colors ${
                        errors.date ? 'border-red-400' : 'border-[#e8e0d4]'
                      }`}
                    />
                    {errors.date && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a7a8a] mb-1.5" htmlFor="time">
                      Preferred Time *
                    </label>
                    <select
                      id="time"
                      value={formData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      className={`w-full px-3.5 py-3 bg-[#faf8f5] border text-[13px] text-[#1a1a2e] font-light focus:outline-none focus:border-[#c9a87c] transition-colors appearance-none ${
                        errors.time ? 'border-red-400' : 'border-[#e8e0d4]'
                      } ${!formData.time ? 'text-[#7a7a8a]' : ''}`}
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {errors.time && <p className="text-[11px] text-red-500 mt-1 font-light">{errors.time}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium tracking-[0.12em] uppercase text-[#7a7a8a] mb-1.5" htmlFor="message">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-3 bg-[#faf8f5] border border-[#e8e0d4] text-[13px] text-[#1a1a2e] font-light focus:outline-none focus:border-[#c9a87c] transition-colors resize-none"
                    placeholder="Any additional information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#1a1a2e] text-white text-[11px] font-medium tracking-[0.14em] uppercase hover:bg-[#2a2a3e] disabled:opacity-60 transition-all duration-300"
                >
                  {submitting ? 'Submitting...' : 'Request Appointment'}
                </button>

                <p className="text-[10px] text-[#aaa] text-center font-light">
                  This is a demo form. No real appointment will be booked.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
