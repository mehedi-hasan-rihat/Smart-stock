"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function login(email: string, password: string, setLoad: (v: boolean) => void) {
    setError(null);
    setLoad(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoad(false);

    if (res.ok) {
      router.push("/dashboard");
      return;
    }

    const data = await res.json();
    setError(typeof data.error === "string" ? data.error : "Invalid credentials.");
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    await login(form.get("email") as string, form.get("password") as string, setLoading);
  }

  async function handleDemo() {
    await login("demo@smartstock.dev", "password123", setDemoLoading);
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Log in</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={loading || demoLoading} className="w-full">
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs text-gray-400">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={handleDemo}
        disabled={loading || demoLoading}
        className="w-full"
      >
        {demoLoading ? "Logging in…" : "Continue with demo account"}
      </Button>

      <p className="mt-4 text-sm text-center text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-black font-medium hover:underline">
          Register
        </Link>
      </p>
    </>
  );
}
