"use client";
import { motion } from "framer-motion";
import { MapPin, ChefHat } from "lucide-react";
import Link from "next/link";

const chefs = [
  { top: "20%", left: "70%", eta: "12 min", delay: 0 },
  { top: "65%", left: "78%", eta: "18 min", delay: 0.4 },
  { top: "75%", left: "25%", eta: "22 min", delay: 0.8 },
  { top: "25%", left: "20%", eta: "15 min", delay: 1.2 },
];

export default function Hero() {
  return (
    <section className="bg-cream px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center w-full">
        <div>
          <span className="font-mono text-xs bg-marigold/10 text-marigold tracking-widest uppercase px-3 py-1.5 rounded-full">
            ● Live in Hyderabad
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-semibold text-ink mt-5 leading-[1.1]">
            A chef, at your door,
            <br />
            in <span className="text-marigold">15 minutes</span>.
          </h1>
          <p className="font-body text-lg text-ink/60 mt-6 max-w-md">
            Book a vetted local chef for your kitty party, private event, or
            any occasion. They come to your kitchen and cook it fresh.
          </p>
          <div className="flex gap-4 mt-8">
  <Link
    href="/signup?role=user"
    className="bg-marigold text-white font-display font-semibold px-8 py-3.5 rounded-full hover:bg-marigold/90 transition shadow-lg shadow-marigold/25"
  >
    Book a Chef
  </Link>
  <Link
    href="/signup?role=chef"
    className="border-2 border-ink/15 text-ink font-display font-semibold px-8 py-3.5 rounded-full hover:border-bay hover:text-bay transition"
  >
    Become a Chef
  </Link>
</div>
        </div>

        <div className="relative aspect-square w-full max-w-md mx-auto">
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 m-auto rounded-full border border-marigold/25"
              style={{ width: `${ring * 33}%`, height: `${ring * 33}%` }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: ring * 0.3 }}
            />
          ))}

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-ink text-white rounded-full p-3 shadow-lg">
              <MapPin size={20} />
            </div>
          </div>

          {chefs.map((chef, i) => (
            <motion.div
              key={i}
              className="absolute flex items-center gap-2"
              style={{ top: chef.top, left: chef.left }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: chef.delay }}
            >
              <div className="bg-bay text-white rounded-full p-2 shadow-md">
                <ChefHat size={16} />
              </div>
              <span className="font-mono text-xs bg-white text-ink px-2 py-1 rounded-full border border-ink/10 shadow-sm">
                {chef.eta}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}