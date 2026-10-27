"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRightIcon } from "./icons";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const SUBJECT = "New enquiry from Agriprom website";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "mt-2 block w-full rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-4 py-3.5 font-sans text-body text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_1px_2px_rgba(20,35,44,0.04)] outline-none transition-[border-color,box-shadow,background-color] duration-300 ease-brand-out hover:border-primary-600/30 hover:bg-white focus-visible:border-primary-600 focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(0,138,75,0.12)]";

const labelClass = "font-sans text-caption font-medium uppercase tracking-[0.2em] text-neutral-800";

/**
 * CONTACT · ENQUIRY FORM — glass card matching the details rail. Posts to
 * Web3Forms with the public access key; a hidden honeypot ("botcheck") filters
 * bots. Inline loading / success / error states, announced via aria-live.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot filled → silently treat as sent
    if (data.get("botcheck")) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("loading");
    try {
      data.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "");
      data.append("subject", SUBJECT);
      data.append("from_name", "Agriprom Website");

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = (await res.json().catch(() => null)) as { success?: boolean } | null;

      if (res.ok && json?.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const loading = status === "loading";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-glass ring-1 ring-black/[0.03] md:p-10">
      {/* brand accent hairline + soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(219,239,231,0.7) 0%, rgba(255,255,255,0) 70%)" }}
      />

      <div className="relative">
        <span className="font-sans text-caption uppercase tracking-[0.24em] text-primary-700">Get in Touch</span>
        <h3 className="mt-3 font-display text-h4 font-bold tracking-[-0.01em] text-neutral-900">
          Send Us an Enquiry
        </h3>
        <p className="mt-2 font-sans text-body font-bold leading-[1.5] text-neutral-800">
          Tell us what you need and our team will get back to you shortly.
        </p>
        <div aria-hidden="true" className="mt-6 h-px w-full bg-gradient-to-r from-neutral-200 via-neutral-200/60 to-transparent" />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-8 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        {/* honeypot — hidden from people and assistive tech */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div>
          <label htmlFor="cf-name" className={labelClass}>
            Name <span aria-hidden="true" className="text-accent-600">*</span>
          </label>
          <input id="cf-name" name="name" placeholder="Your full name" type="text" required autoComplete="name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Email <span aria-hidden="true" className="text-accent-600">*</span>
          </label>
          <input id="cf-email" name="email" placeholder="you@company.com" type="email" required autoComplete="email" className={inputClass} />
        </div>

        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            Phone <span aria-hidden="true" className="text-accent-600">*</span>
          </label>
          <input id="cf-phone" name="phone" placeholder="+92 300 0000000" type="tel" required autoComplete="tel" className={inputClass} />
        </div>

        <div>
          <label htmlFor="cf-company" className={labelClass}>
            Company <span className="normal-case tracking-normal text-neutral-500">(optional)</span>
          </label>
          <input id="cf-company" name="company" placeholder="Company name" type="text" autoComplete="organization" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={labelClass}>
            Message <span aria-hidden="true" className="text-accent-600">*</span>
          </label>
          <textarea id="cf-message" name="message" placeholder="How can we help?" required rows={5} className={`${inputClass} resize-y`} />
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="group inline-flex w-full items-center justify-center gap-3 rounded-sm bg-primary-600 px-8 sm:w-auto py-3.5 font-sans text-small font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 disabled:pointer-events-none disabled:opacity-70"
          >
            {loading ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-pure/40 border-t-pure"
                />
                Sending…
              </>
            ) : (
              <>
                Send Enquiry
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 ease-brand-out group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  <ArrowUpRightIcon />
                </span>
              </>
            )}
          </button>

          <p aria-live="polite" role="status" className="font-sans text-small">
            {status === "success" && (
              <span className="text-primary-700">Thank you — your enquiry has been sent. We&apos;ll be in touch soon.</span>
            )}
            {status === "error" && (
              <span className="text-red-600">Sorry, something went wrong. Please try again or call us directly.</span>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}
