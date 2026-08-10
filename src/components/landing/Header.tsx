"use client";

import { ChefHat, Phone, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">

      {/* ZestCooko Logo */}
      <Link href="/" className="flex items-center">
        <img
          src="/matchlogo.png"
          alt="zestcooko"
          className="h-55 w-auto"
        />
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6 font-body text-sm text-ink/70 font-medium">
        <Link
          href="/signup?role=user"
          className="hover:text-marigold transition"
        >
          Book a Chef
        </Link>

        <Link
          href="/signup?role=chef"
          className="hover:text-marigold transition"
        >
          Become a Chef
        </Link>
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Phone */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-ink/70">
          <Phone size={16} />
          <span>+91 XXXXX XXXXX</span>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-white border border-ink/10 rounded-full px-4 py-2.5 w-64 shadow-sm">
          <Search size={16} className="text-ink/40" />

          <input
            type="text"
            placeholder='Search "kitty party"'
            className="bg-transparent outline-none text-sm text-ink placeholder:text-ink/40 w-full"
          />
        </div>

        {/* Login */}
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