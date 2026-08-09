"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChefHat, User, ArrowRight } from "lucide-react";
import { apiPost } from "@/lib/api";

function RolePicker() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="bg-marigold/15 text-marigold rounded-full p-2">
            <ChefHat size={22} />
          </div>
          <span className="font-display text-xl font-semibold text-ink">
            Chef<span className="text-marigold">Connect</span>
          </span>
        </div>

        <h1 className="font-display text-2xl font-semibold text-ink">
          How do you want to join?
        </h1>
        <p className="font-body text-sm text-ink/60 mt-1 mb-8">
          Pick the option that fits you.
        </p>

        <div className="space-y-4">
          <Link
            href="/signup?role=user"
            className="block bg-white border border-ink/10 rounded-2xl p-6 text-left hover:border-marigold hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-marigold/10 text-marigold rounded-full p-2.5">
                <User size={20} />
              </div>
              <div>
                <p className="font-display font-semibold text-ink">
                  I want to book a chef
                </p>
                <p className="font-body text-sm text-ink/50">
                  For kitty parties, private events, and more
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/signup?role=chef"
            className="block bg-white border border-ink/10 rounded-2xl p-6 text-left hover:border-bay hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="bg-bay/10 text-bay rounded-full p-2.5">
                <ChefHat size={20} />
              </div>
              <div>
                <p className="font-display font-semibold text-ink">
                  I want to become a chef partner
                </p>
                <p className="font-body text-sm text-ink/50">
                  Earn money cooking for households near you
                </p>
              </div>
            </div>
          </Link>
        </div>

        <p className="font-body text-sm text-ink/50 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-marigold font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role = roleParam === "chef" ? "chef" : "user";

  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (roleParam !== "user" && roleParam !== "chef") {
    return <RolePicker />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/api/auth/signup/send-code", { email, whatsapp });
      sessionStorage.setItem("signup_email", email);
      sessionStorage.setItem("signup_whatsapp", whatsapp);
      sessionStorage.setItem("signup_role", role);
      router.push("/signup/verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          <div className="flex items-center gap-2 text-bay mb-2">
            {role === "chef" ? <ChefHat size={18} /> : <User size={18} />}
            <span className="font-mono text-xs uppercase tracking-wide">
              {role === "chef" ? "Chef Signup" : "Host Signup"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {role === "chef" ? "Become a Chef" : "Create your account"}
          </h1>
          <p className="font-body text-sm text-ink/60 mt-1">
            {role === "chef"
              ? "Start earning by cooking for households near you."
              : "Book a chef for your next party or event."}
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
                WhatsApp number
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                placeholder="98765 43210"
              />
            </div>

            {error && (
              <p className="text-rust text-sm font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-marigold text-white font-display font-semibold py-3 rounded-full hover:bg-marigold/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Continue"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-sm text-ink/50 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-marigold font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}