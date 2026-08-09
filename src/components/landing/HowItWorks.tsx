import { Search, ChefHat, CookingPot } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Post your party",
    desc: "Tell us the date, headcount, and cuisine you want — instant or scheduled.",
  },
  {
    num: "02",
    icon: ChefHat,
    title: "Pick a nearby chef",
    desc: "Browse chefs near you by specialty, rating, and ETA — you choose who comes.",
  },
  {
    num: "03",
    icon: CookingPot,
    title: "They cook, fresh",
    desc: "Your chef arrives, cooks in your kitchen, and you rate the experience after.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="relative">
              <span className="font-display text-6xl font-bold text-marigold/15 absolute -top-4 left-0">
                {num}
              </span>
              <div className="relative pt-10">
                <div className="bg-bay/10 text-bay rounded-full p-3 w-fit">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mt-4">
                  {title}
                </h3>
                <p className="font-body text-sm text-ink/60 mt-2">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}