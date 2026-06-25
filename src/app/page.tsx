import Link from "next/link";
import { Zap, Package, ShoppingBag, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-lg font-bold">Stanly</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-8">
          <Zap className="h-3 w-3" fill="currentColor" />
          The creator monetization platform
        </div>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Sell anything.{" "}
          <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
            From one link.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
          Digital downloads, courses, memberships, and links — all from your personalized Stanly page.
          No code required.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/store/demo">See an example store</Link>
          </Button>
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Package, title: "Digital products", desc: "Sell PDFs, templates, presets, and any downloadable file." },
            { icon: ShoppingBag, title: "Courses & memberships", desc: "Monetize your knowledge with structured content and communities." },
            { icon: BarChart3, title: "Analytics", desc: "Track views, orders, and revenue in a clean dashboard." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6 text-left">
              <div className="rounded-lg bg-primary/10 p-2.5 w-fit">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
