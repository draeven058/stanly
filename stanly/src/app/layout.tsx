import type { Metadata } from "next";
import "@/styles/globals.css";
import { ToastProvider } from "@/providers/toast-provider";

export const metadata: Metadata = {
  title: { default: "Stanly", template: "%s | Stanly" },
  description: "Sell digital products, courses, and memberships — all from one link.",
  openGraph: { type: "website", siteName: "Stanly" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
