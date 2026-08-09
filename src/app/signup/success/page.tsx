import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <div className="bg-bay/10 text-bay rounded-full p-4 w-fit mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink mt-6">
          You&apos;re all set!
        </h1>
        <p className="font-body text-ink/60 mt-2">
          Your ChefConnect account has been created.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 bg-marigold text-white font-display font-semibold px-8 py-3 rounded-full hover:bg-marigold/90 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}