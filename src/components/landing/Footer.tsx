import { ChefHat, Phone } from "lucide-react";

const columns = [
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Privacy Policy", "Terms & Conditions"],
  },
  {
    title: "For Hosts",
    links: ["Sign Up / Login", "My Bookings", "My Wallet", "How It Works", "Contact Us"],
  },
  {
    title: "For Chefs",
    links: ["Register as Partner", "Chef Guidelines", "Earnings & Payouts"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream px-6 md:px-16 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-marigold/15 text-marigold rounded-full p-2">
                <ChefHat size={20} />
              </div>
              <span className="font-display text-lg font-semibold">
                Chef<span className="text-marigold">Connect</span>
              </span>
            </div>
            <p className="font-body text-sm text-cream/50 mt-4 max-w-xs">
              Book a vetted local chef for your kitty party or private event
              — fresh food, cooked right in your kitchen.
            </p>
            <div className="flex items-center gap-1.5 mt-4 text-cream/60 font-mono text-sm">
              <Phone size={14} />
              9004-044-234
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-marigold uppercase tracking-wide">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-sm text-cream/60 hover:text-cream transition"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 mt-12 pt-6 text-center">
          <p className="font-body text-xs text-cream/40">
            © 2026 ChefConnect. Made for hosts and chefs, in Hyderabad.
          </p>
        </div>
      </div>
    </footer>
  );
}