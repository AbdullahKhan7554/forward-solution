import { ToastProvider } from "@/components/admin/Toast";

export default function AdminProductsLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
