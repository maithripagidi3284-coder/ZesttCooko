const cuisines = [
  { name: "North Indian", emoji: "🍛" },
  { name: "South Indian", emoji: "🥞" },
  { name: "Chinese", emoji: "🍜" },
  { name: "Continental", emoji: "🍝" },
  { name: "Biryani & Mughlai", emoji: "🍚" },
  { name: "Desserts", emoji: "🍮" },
  { name: "Street Food", emoji: "🌮" },
  { name: "Tandoor & BBQ", emoji: "🍢" },
];

export default function Cuisines() {
  return (
    <section className="bg-white px-6 md:px-16 py-20 border-y border-ink/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          Cuisines on ChefConnect
        </h2>
        <p className="font-body text-ink/60 mt-2 max-w-lg">
          Choose from 8+ cuisines — every chef lists their specialty on their
          profile.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {cuisines.map((c) => (
            <button
              key={c.name}
              className="flex flex-col items-center gap-3 bg-cream rounded-2xl border border-ink/10 py-8 hover:border-marigold hover:bg-marigold/5 transition-colors"
            >
              <span className="text-4xl">{c.emoji}</span>
              <span className="font-display text-sm font-medium text-ink">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}