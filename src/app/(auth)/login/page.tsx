import { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { login } from "@/actions/auth";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return <AuthForm action={login} type="login" />;
}
