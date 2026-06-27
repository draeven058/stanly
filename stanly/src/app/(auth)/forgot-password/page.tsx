import { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { forgotPassword } from "@/actions/auth";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return <AuthForm action={forgotPassword} type="forgot-password" />;
}
