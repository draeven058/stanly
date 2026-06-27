import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Purchase complete" };

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <div className="min-h-svh bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">Payment successful!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. You'll receive a confirmation email
          shortly with your download link.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-5 text-left space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            What's next
          </p>
          {[
            { icon: "📧", text: "Check your email for the download link" },
            { icon: "⬇️", text: "Download your purchase from the link in the email" },
            { icon: "💬", text: "Reply to the email if you have any questions" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3 text-sm">
              <span>{icon}</span>
              <span className="text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>

        <Button asChild className="mt-8 w-full" size="lg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
