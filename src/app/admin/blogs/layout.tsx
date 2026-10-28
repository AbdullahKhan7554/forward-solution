import { ToastProvider } from "@/components/admin/Toast";

export default function AdminBlogsLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
