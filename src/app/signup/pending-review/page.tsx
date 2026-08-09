import Link from "next/link";
import { Clock } from "lucide-react";

export default function PendingReviewPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="bg-marigold/10 text-marigold rounded-full p-4 w-fit mx-auto">
          <Clock size={40} />
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink mt-6">
          Under review
        </h1>
        <p className="font-body text-ink/60 mt-2">
          Your ID has been submitted. We&apos;ll verify it and activate your
          chef profile shortly — usually within 24 hours.
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