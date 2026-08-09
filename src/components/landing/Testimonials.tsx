import { Star } from "lucide-react";

const reviews = [
  {
    name: "Apoorva Madan",
    date: "17 Sep 2025",
    tag: "Easy To Book",
    text: "The chef took care of all our requests. Everything was smooth from booking to cleanup.",
  },
  {
    name: "Surinder Anand",
    date: "20 Nov 2025",
    tag: "Proper Hygiene",
    text: "Great service. Chef was very cooperative and maintained hygiene throughout the session.",
  },
  {
    name: "Sagar Matta",
    date: "3 Jan 2026",
    tag: "Mouthwatering Food",
    text: "The chef was so nice and the food was actually very tasty. Best kitty party we've hosted.",
  },
  {
    name: "Brijendra Singh",
    date: "23 Feb 2026",
    tag: "Guests Loved It",
    text: "We booked for a small get-together at home. Our guests were genuinely impressed.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white px-6 md:px-16 py-20 border-y border-ink/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          What Hosts Are Saying
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-cream rounded-2xl border border-ink/10 p-6"
            >
              <div className="flex items-center gap-1 text-marigold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-display text-base font-semibold text-ink mt-3">
                &ldquo;{r.tag}&rdquo;
              </p>
              <p className="font-body text-sm text-ink/60 mt-2">{r.text}</p>
              <div className="mt-4 pt-4 border-t border-ink/10">
                <p className="font-body text-sm font-medium text-ink">
                  {r.name}
                </p>
                <p className="font-mono text-xs text-ink/40">{r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}