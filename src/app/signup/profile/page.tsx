"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, User, ArrowRight } from "lucide-react";
import { apiPost } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

function ProfileForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState<"user" | "chef">("user");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signup_email");
    const storedWhatsapp = sessionStorage.getItem("signup_whatsapp");
    const storedCode = sessionStorage.getItem("signup_code");
    const storedRole = sessionStorage.getItem("signup_role") as "user" | "chef";

    if (!storedEmail || !storedWhatsapp || !storedCode) {
      router.push("/signup");
      return;
    }
    setEmail(storedEmail);
    setWhatsapp(storedWhatsapp);
    setCode(storedCode);
    setRole(storedRole || "user");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost("/api/auth/signup/complete", {
        email,
        whatsapp,
        code,
        name,
        password,
        role,
      });
      sessionStorage.clear();
      saveAuth(data.token, data.user);

      if (data.user.role === "CHEF") {
        router.push("/signup/chef-details");
      } else {
        router.push("/signup/success");
      }
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
              Final step
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Complete your profile
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full border border-ink/10 bg-cream rounded-lg px-4 py-2.5 text-ink/50"
              />
            </div>

            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                WhatsApp number
              </label>
              <input
                type="tel"
                disabled
                value={whatsapp}
                className="w-full border border-ink/10 bg-cream rounded-lg px-4 py-2.5 text-ink/50"
              />
            </div>

            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Create a password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                placeholder="At least 6 characters"
              />
            </div>

            {error && <p className="text-rust text-sm font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-marigold text-white font-display font-semibold py-3 rounded-full hover:bg-marigold/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileForm />
    </Suspense>
  );
}