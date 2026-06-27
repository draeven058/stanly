"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/actions/auth";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      {label}
    </Button>
  );
}

interface AuthFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  type: "login" | "signup" | "forgot-password";
}

export function AuthForm({ action, type }: AuthFormProps) {
  const [state, formAction] = useActionState(action, {});

  const isLogin = type === "login";
  const isSignup = type === "signup";
  const isForgot = type === "forgot-password";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
          <span className="text-xl font-bold text-primary-foreground">S</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isLogin && "Welcome back"}
          {isSignup && "Create your account"}
          {isForgot && "Reset your password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLogin && "Sign in to your Stanly account"}
          {isSignup && "Start selling your digital products"}
          {isForgot && "We'll email you a reset link"}
        </p>
      </div>

      {state.error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {state.success}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {isSignup && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" placeholder="Jane Smith" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  stanly.to/
                </span>
                <Input
                  id="username"
                  name="username"
                  placeholder="janesmth"
                  className="pl-[4.5rem]"
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="jane@example.com" required />
        </div>

        {!isForgot && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {isLogin && (
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={isSignup ? "Min. 8 characters" : "••••••••"}
              required
            />
          </div>
        )}

        <SubmitButton
          label={
            isLogin ? "Sign in" : isSignup ? "Create account" : "Send reset email"
          }
        />
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-primary hover:underline"
        >
          {isLogin ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
