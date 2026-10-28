"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Toast = { id: number; kind: "success" | "error"; message: string };
type ToastApi = { success: (message: string) => void; error: (message: string) => void };

const ToastContext = createContext<ToastApi | null>(null);

/** Bottom-right toasts. Lives in a layout so a toast survives client navigation. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const push = useCallback((kind: Toast["kind"], message: string) => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "error" ? 6000 : 3000);
  }, []);

  const api = useRef<ToastApi>({
    success: (m) => push("success", m),
    error: (m) => push("error", m),
  }).current;

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.kind === "error" ? "alert" : "status"}
            className={`pointer-events-auto max-w-[420px] rounded-lg px-4 py-3 text-[14px] font-semibold shadow-[0_8px_24px_rgba(22,25,74,0.18)] ${
              t.kind === "error" ? "bg-[#B42318] text-white" : "bg-[#008848] text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast() must be used inside <ToastProvider>.");
  return ctx;
}
