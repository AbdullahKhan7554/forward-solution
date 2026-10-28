"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logLogin } from "@/app/admin/actions";

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
  // invite and password-reset links land here with a session in the URL hash; they set a password first
  const [settingPassword, setSettingPassword] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    if (!access_token || !refresh_token) return;
    window.history.replaceState(null, "", window.location.pathname);
    createClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ data, error }) => {
        if (error) return setError("This link has expired. Ask an admin to invite you again.");
        setEmail(data.user?.email ?? "");
        setSettingPassword(true);
      });
  }, []);

  async function enterAdmin() {
    await logLogin().catch(() => {});
    router.replace("/admin");
    router.refresh();
  }

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
    await enterAdmin();
  }

  async function setNewPassword(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    await enterAdmin();
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
          onSubmit={settingPassword ? setNewPassword : signIn}
          className="box-border flex w-[600px] flex-col gap-[22px] rounded-[20px] border border-[#E3E7EF] bg-white px-[52px] py-14"
        >
          <div>
            <h2 className={`${display} m-0 text-[34px] font-bold text-[#171842]`}>
              {settingPassword ? "Set your password" : "Sign in"}
            </h2>
            <p className="mb-0 mt-2 text-[18px] text-[#5B6178]">
              {settingPassword ? `Choose a password for ${email}.` : "Use your admin email and password."}
            </p>
          </div>
          {!settingPassword && (
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
          )}
          <label className={label}>
            {settingPassword ? "New password" : "Password"}
            <input
              type="password"
              required
              autoComplete={settingPassword ? "new-password" : "current-password"}
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
            {settingPassword ? "Save password" : "Sign in"}
          </button>
          {!settingPassword && (
            <button
              type="button"
              onClick={forgotPassword}
              className="text-center text-[17px] text-[#00733C] hover:text-[#16194A]"
            >
              Forgot password?
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
