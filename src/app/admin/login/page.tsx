"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(form.get("email")),
      password: String(form.get("password")),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  const field =
    "w-full rounded-sm border border-walnut/60 bg-espresso px-4 py-3 text-linen placeholder:text-linenDim/60 focus:border-brass";

  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brass/50 text-brass">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-display text-3xl text-linen">CH FURNITURE</h1>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-brass">Admin Panel</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-sm border border-walnut/50 bg-bark p-7">
          <input name="email" type="email" required placeholder="Email" className={field} />
          <input name="password" type="password" required placeholder="Password" className={field} />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-brass w-full disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
