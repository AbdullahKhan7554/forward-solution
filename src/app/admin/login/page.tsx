"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const display = "[font-family:var(--font-admin-display),sans-serif]";
const label = "flex flex-col gap-[10px] text-[17px] font-semibold text-[#171842]";
const input =
  "rounded-[10px] border border-[#D5DAE6] px-[18px] py-4 text-[18px] font-normal text-[#1B1F3B] [font-family:inherit]";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError("Incorrect email or password.");
      setBusy(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  async function forgotPassword() {
    setError(null);
    setNotice(null);
    if (!email) {
      setError("Enter your email above, then click “Forgot password?”.");
      return;
    }
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    if (error) setError(error.message);
    else setNotice("If that email has an admin account, a reset link is on its way.");
  }

  return (
    <div className="flex min-h-screen text-[#1B1F3B]">
      <div className="box-border flex w-[690px] shrink-0 flex-col bg-[#171842] px-[72px] py-8 text-white">
        <div className={`${display} text-[36px] font-extrabold leading-[1.05]`}>
          <span className="text-[#4FC3F7]">AGRIPROM</span>
          <br />
          <span className="text-[#4ADE80]">PAKISTAN</span>
        </div>
        <div className="flex grow flex-col justify-center gap-[18px]">
          <div className="text-[16px] font-bold tracking-[4px] text-[#4ADE80]">ADMIN PANEL</div>
          <h1 className={`${display} m-0 text-[60px] font-bold leading-[1.12] tracking-[-1px]`}>
            Manage your products and blogs in a few clicks.
          </h1>
          <p className="m-0 text-[22px] leading-[1.6] text-[#D3D6EE]">
            Add or edit products, write blogs and publish. Changes go live on agriprompakistan.com
            instantly.
          </p>
        </div>
      </div>
      <div className="flex grow items-center justify-center bg-[#F5F6FA]">
        <form
          onSubmit={signIn}
          className="box-border flex w-[600px] flex-col gap-[22px] rounded-[20px] border border-[#E3E7EF] bg-white px-[52px] py-14"
        >
          <div>
            <h2 className={`${display} m-0 text-[34px] font-bold text-[#171842]`}>Sign in</h2>
            <p className="mb-0 mt-2 text-[18px] text-[#5B6178]">Use your admin email and password.</p>
          </div>
          <label className={label}>
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </label>
          <label className={label}>
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
          </label>
          {error && (
            <p role="alert" className="m-0 text-[16px] text-[#B42318]">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="m-0 text-[16px] text-[#00733C]">
              {notice}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-[10px] bg-[#008848] p-[18px] text-center text-[18px] font-bold text-white disabled:opacity-70"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={forgotPassword}
            className="text-center text-[17px] text-[#00733C] hover:text-[#16194A]"
          >
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}
