import { Star } from "lucide-react";

const services = [
  {
    name: "Home-Style Cooking",
    desc: "Everyday meals, cooked fresh at your place",
    price: "₹399/hr",
    rating: "4.8",
    bg: "bg-marigold/10",
  },
  {
    name: "Kitty Party Special",
    desc: "Full spread for your kitty party or get-together",
    price: "₹999",
    rating: "4.7",
    bg: "bg-bay/10",
  },
  {
    name: "Private Event Chef",
    desc: "Multi-course menu for birthdays & celebrations",
    price: "₹1999",
    rating: "4.9",
    bg: "bg-rust/10",
  },
];

export default function CookingServices() {
  return (
    <section id="book" className="bg-cream px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          Cooking Services
        </h2>
        <p className="font-body text-ink/60 mt-2 max-w-lg">
          Pick the kind of session you need — a chef comes to your kitchen
          and cooks it fresh.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {services.map((s) => (
            <div
              key={s.name}
              className="bg-white rounded-2xl border border-ink/10 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`h-40 ${s.bg} flex items-center justify-center`}>
                <span className="font-display text-5xl">🍲</span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {s.name}
                </h3>
                <p className="font-body text-sm text-ink/60 mt-1">{s.desc}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-mono text-sm text-ink/70">
                    Starts {s.price}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-sm text-marigold">
                    <Star size={14} fill="currentColor" />
                    {s.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}