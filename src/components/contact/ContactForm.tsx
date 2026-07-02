"use client";

import { useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/components/primitives/RevealText";
import { cn } from "@/lib/utils";

/**
 * CONTACT · SCENE 03 — THE MESSAGE (INQUIRY FORM).
 *
 * An ultra-premium inquiry experience: one large soft-glass container holding
 * luxury underline inputs with floating animated labels, an accent underline
 * that draws on focus, calm inline validation and a premium Send Message button.
 * Fields fade+rise in sequence on scroll (GSAP). Reduced motion: visible, static
 * and fully functional.
 */

const PRODUCT_INTERESTS = [
  "General Enquiry",
  "Veterinary Pharmaceuticals",
  "Feed Additives",
  "Animal Nutrition",
  "Animal Health",
  "Partnership",
];

type Fields = {
  name: string;
  company: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = {
  name: "",
  company: "",
  phone: "",
  email: "",
  interest: "",
  message: "",
};

/** Luxury floating-label underline input. */
function FloatField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
}: {
  id: keyof Fields;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div data-field className="relative pt-6">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "peer block w-full appearance-none border-b bg-transparent pb-2 font-sans text-body text-neutral-900 outline-none transition-colors duration-200 ease-brand-out placeholder:text-transparent",
          error ? "border-red-400" : "border-neutral-300"
        )}
      />
      {/* animated accent underline */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent-500 transition-transform duration-300 ease-brand-out peer-focus:scale-x-100",
          error && "bg-red-400"
        )}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-6 origin-left font-sans text-body text-neutral-400 transition-all duration-200 ease-brand-out peer-focus:top-0 peer-focus:text-caption peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary-700 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-caption peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-neutral-500"
      >
        {label}
        {required && <span className="text-accent-600"> *</span>}
      </label>
      {error && <p className="mt-2 font-sans text-caption text-red-500">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const rootRef = useRef<HTMLElement>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof Fields) => (v: string) => {
    setFields((f) => ({ ...f, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!fields.name.trim()) e.name = "Please tell us your name.";
    if (!fields.email.trim()) e.email = "An email helps us reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
      e.email = "That email doesn't look right.";
    if (!fields.message.trim()) e.message = "Let us know how we can help.";
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitted(true);
  };

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-form-fade]", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch("[data-form-fade]", {
        start: "top 88%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, overwrite: true }),
      });

      gsap.set("[data-field]", { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch("[data-field]", {
        start: "top 90%",
        onEnter: (b) =>
          gsap.to(b, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true }),
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="contact-form"
      aria-labelledby="contact-form-heading"
      className="relative overflow-hidden bg-base"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 44% at 20% 4%, rgba(219,239,231,0.3) 0%, rgba(255,255,255,0) 56%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-container px-6 py-[16vh] md:px-12 xl:px-20">
        <header className="mx-auto max-w-3xl text-center">
          <div data-form-fade className="mb-8 flex items-center justify-center gap-4">
            <span className="font-sans text-caption tracking-[0.2em] text-neutral-400">(03)</span>
            <span className="h-px w-10 bg-neutral-300" />
            <span className="font-serif text-small italic text-neutral-400">The Message</span>
          </div>
          <h2
            id="contact-form-heading"
            className="font-display font-light leading-[1.05] tracking-[-0.015em] text-neutral-900"
          >
            <RevealText
              text="Tell Us What You Need"
              as="span"
              trigger="scroll"
              stagger={0.06}
              className="justify-center text-[8.5vw] md:text-[4.4vw] xl:text-[54px]"
            />
          </h2>
          <p
            data-form-fade
            className="mx-auto mt-8 max-w-[52ch] text-pretty font-sans text-body-lg text-neutral-600"
          >
            Send us a message and our team will be in touch shortly. We&rsquo;re available around
            the clock.
          </p>
        </header>

        {/* Large glass container */}
        <div className="mx-auto mt-[9vh] max-w-[860px]">
          <div className="rounded-3xl border border-white/70 bg-white/60 p-8 shadow-glass backdrop-blur-xl backdrop-saturate-150 md:p-14">
            {submitted ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/15 text-accent-600">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <h3 className="font-display text-h3 font-light text-neutral-900">
                  Thank you, {fields.name.split(" ")[0] || "friend"}.
                </h3>
                <p className="mt-4 max-w-[42ch] font-sans text-body-lg text-neutral-600" role="status">
                  Your message is on its way — we&rsquo;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-x-10 gap-y-2 md:grid-cols-2">
                <FloatField id="name" label="Full Name" required value={fields.name} onChange={set("name")} error={errors.name} autoComplete="name" />
                <FloatField id="company" label="Company / Organisation" value={fields.company} onChange={set("company")} autoComplete="organization" />
                <FloatField id="phone" label="Phone" type="tel" value={fields.phone} onChange={set("phone")} autoComplete="tel" />
                <FloatField id="email" label="Email" type="email" required value={fields.email} onChange={set("email")} error={errors.email} autoComplete="email" />

                {/* Product interest — select (label always floated) */}
                <div data-field className="relative pt-6 md:col-span-2">
                  <label
                    htmlFor="interest"
                    className="absolute left-0 top-0 font-sans text-caption uppercase tracking-[0.18em] text-neutral-500"
                  >
                    Product Interest
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    value={fields.interest}
                    onChange={(e) => set("interest")(e.target.value)}
                    className="peer block w-full appearance-none border-b border-neutral-300 bg-transparent pb-2 font-sans text-body text-neutral-900 outline-none transition-colors duration-200 ease-brand-out focus:border-accent-500"
                  >
                    <option value="" disabled>
                      Select an area…
                    </option>
                    {PRODUCT_INTERESTS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-0 text-neutral-400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m4 6 4 4 4-4" />
                    </svg>
                  </span>
                </div>

                {/* Message — textarea with floating label */}
                <div data-field className="relative pt-6 md:col-span-2">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={fields.message}
                    placeholder=" "
                    aria-invalid={!!errors.message}
                    onChange={(e) => set("message")(e.target.value)}
                    className={cn(
                      "peer block w-full resize-none appearance-none border-b bg-transparent pb-2 font-sans text-body text-neutral-900 outline-none transition-colors duration-200 ease-brand-out placeholder:text-transparent",
                      errors.message ? "border-red-400" : "border-neutral-300"
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent-500 transition-transform duration-300 ease-brand-out peer-focus:scale-x-100",
                      errors.message && "bg-red-400"
                    )}
                  />
                  <label
                    htmlFor="message"
                    className="pointer-events-none absolute left-0 top-6 origin-left font-sans text-body text-neutral-400 transition-all duration-200 ease-brand-out peer-focus:top-0 peer-focus:text-caption peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary-700 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-caption peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] peer-[:not(:placeholder-shown)]:text-neutral-500"
                  >
                    Message<span className="text-accent-600"> *</span>
                  </label>
                  {errors.message && <p className="mt-2 font-sans text-caption text-red-500">{errors.message}</p>}
                </div>

                {/* Send */}
                <div data-field className="mt-6 md:col-span-2">
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 py-4 font-sans text-body font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 sm:w-auto"
                  >
                    Send Message
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 ease-brand-out group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
