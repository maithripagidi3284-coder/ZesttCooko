"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, ArrowRight } from "lucide-react";
import { apiPost } from "@/lib/api";

function VerifyForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signup_email");
    if (!storedEmail) {
      router.push("/signup");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/api/auth/signup/verify-code", { email, code });
      sessionStorage.setItem("signup_code", code);
      router.push("/signup/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
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
            Check your email
          </h1>
          <p className="font-body text-sm text-ink/60 mt-1">
            We sent a 6-digit code to <span className="text-ink font-medium">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Verification code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full border border-ink/15 rounded-lg px-4 py-3 text-ink text-center text-2xl font-mono tracking-[0.5em] outline-none focus:border-marigold transition"
                placeholder="------"
              />
            </div>

            {error && <p className="text-rust text-sm font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-marigold text-white font-display font-semibold py-3 rounded-full hover:bg-marigold/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}