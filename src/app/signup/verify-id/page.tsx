"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Upload, ArrowRight, ShieldCheck } from "lucide-react";
import { apiUpload } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";

export default function VerifyIdPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "CHEF") {
      router.push("/");
    }
  }, [router]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please upload your ID proof");
      return;
    }
    setLoading(true);
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("idProof", file);
      await apiUpload("/api/verification/submit-id", formData, token!);
      router.push("/signup/pending-review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
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
            <ShieldCheck size={18} />
            <span className="font-mono text-xs uppercase tracking-wide">
              Safety verification
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Verify your identity
          </h1>
          <p className="font-body text-sm text-ink/60 mt-1">
            Upload a clear photo of your Aadhaar or PAN card. This is
            reviewed manually before your profile goes live — households
            trust that every chef here is verified.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-ink/20 rounded-xl p-6 text-center hover:border-marigold transition">
                {preview ? (
                  <img
                    src={preview}
                    alt="ID preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                ) : (
                  <>
                    <Upload className="mx-auto text-ink/40" size={28} />
                    <p className="font-body text-sm text-ink/60 mt-2">
                      Tap to upload ID photo
                    </p>
                    <p className="font-body text-xs text-ink/40 mt-1">
                      Clear, unblurred, matches your profile photo
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {error && <p className="text-rust text-sm font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-marigold text-white font-display font-semibold py-3 rounded-full hover:bg-marigold/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Submit for review"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}