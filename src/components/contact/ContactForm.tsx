"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRightIcon } from "./icons";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const SUBJECT = "New enquiry from Agriprom website";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "mt-2 block w-full rounded-xl border border-neutral-200 bg-white/90 px-4 py-3 font-sans text-body text-neutral-900 placeholder:text-neutral-400 outline-none transition-[border-color,box-shadow] duration-200 ease-brand-out hover:border-primary-600/30 focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-accent-500/60";

const labelClass = "font-sans text-caption uppercase tracking-[0.24em] text-neutral-900";

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
    <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-glass md:p-8">
      <h3 className="font-display text-h4 font-light tracking-[-0.01em] text-neutral-900">
        Send Us an Enquiry
      </h3>
      <p className="mt-2 font-sans text-body leading-[1.5] text-neutral-800">
        Tell us what you need and our team will get back to you shortly.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          <input id="cf-name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </div>

        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Email <span aria-hidden="true" className="text-accent-600">*</span>
          </label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>

        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            Phone <span aria-hidden="true" className="text-accent-600">*</span>
          </label>
          <input id="cf-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
        </div>

        <div>
          <label htmlFor="cf-company" className={labelClass}>
            Company <span className="normal-case tracking-normal text-neutral-500">(optional)</span>
          </label>
          <input id="cf-company" name="company" type="text" autoComplete="organization" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={labelClass}>
            Message <span aria-hidden="true" className="text-accent-600">*</span>
          </label>
          <textarea id="cf-message" name="message" required rows={5} className={`${inputClass} resize-y`} />
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="group inline-flex items-center justify-center gap-3 rounded-sm bg-primary-600 px-7 py-3.5 font-sans text-small font-medium text-pure shadow-soft outline-none transition-[transform,box-shadow,background-color] duration-200 ease-brand-out hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-medium focus-visible:ring-2 focus-visible:ring-accent-500 disabled:pointer-events-none disabled:opacity-70"
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
