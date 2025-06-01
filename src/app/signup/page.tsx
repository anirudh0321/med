import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/20 via-background to-background">
      <SignupForm />
    </main>
  );
}
