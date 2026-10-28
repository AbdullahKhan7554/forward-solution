import { ToastProvider } from "@/components/admin/Toast";

export default function AdminActivityLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
