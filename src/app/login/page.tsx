"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChefHat, ArrowRight } from "lucide-react";
import { apiPost } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost("/api/auth/login", { email, password });
      saveAuth(data.token, data.user);

      if (data.user.role === "CHEF") {
        if (data.user.verificationStatus !== "APPROVED") {
          router.push("/signup/pending-review");
        } else {
          router.push("/chef/dashboard");
        }
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="bg-marigold/15 text-marigold rounded-full p-2">
            <ChefHat size={22} />
          </div>
          <span className="font-display text-xl font-semibold text-ink">
            Chef<span className="text-marigold">Connect</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Welcome back
          </h1>
          <p className="font-body text-sm text-ink/60 mt-1">
            Log in to your ChefConnect account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                placeholder="Your password"
              />
            </div>

            {error && <p className="text-rust text-sm font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-marigold text-white font-display font-semibold py-3 rounded-full hover:bg-marigold/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-ink/50 mt-6">
          New to ChefConnect?{" "}
          <Link href="/signup?role" className="text-marigold font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}