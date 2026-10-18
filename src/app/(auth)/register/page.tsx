"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
      return;
    }

    const data = await res.json();
    setError(typeof data.error === "string" ? data.error : "Registration failed.");
  }

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded-md py-2 text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 transition-colors"
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-center text-neutral-500">
        Already have an account?{" "}
        <Link href="/login" className="text-black font-medium hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
