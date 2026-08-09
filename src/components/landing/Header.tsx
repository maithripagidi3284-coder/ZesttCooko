"use client";
import { ChefHat, Phone, Search } from "lucide-react";
import Link from "next/link";


export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 md:px-16 py-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-marigold/15 text-marigold rounded-full p-2">
            <ChefHat size={22} />
          </div>
          <span className="font-display text-xl font-semibold text-ink tracking-wide">
            Chef<span className="text-marigold">Connect</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 font-body text-sm text-ink/70 font-medium">
          <Link href="/signup?role=user" className="hover:text-marigold transition">Book a Chef</Link>
<Link href="/signup?role=chef" className="hover:text-marigold transition">Become a Chef</Link>
          <div className="flex items-center gap-1.5 text-ink/50">
            <Phone size={14} />
            <span className="font-mono text-xs">9004-044-234</span>
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-2 bg-white border border-ink/10 rounded-full px-4 py-2.5 w-64 shadow-sm">
          <Search size={16} className="text-ink/40" />
          <input
            type="text"
            placeholder='Search "kitty party"'
            className="bg-transparent outline-none text-sm text-ink placeholder:text-ink/40 w-full"
          />
        </div>
      <Link
  href="/login"
  className="shrink-0 font-display text-sm font-semibold text-white bg-marigold px-6 py-2.5 rounded-full hover:bg-marigold/90 transition"
>
  Sign Up / Login
</Link>
      </div>
    </header>
  );
}