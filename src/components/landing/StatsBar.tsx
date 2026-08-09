import { Users, MapPin, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Parties Cooked" },
  { icon: MapPin, value: "Hyderabad", label: "Live City" },
  { icon: Star, value: "4.8", label: "Chef Rating" },
];

export default function StatsBar() {
  return (
    <div className="bg-white border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 grid grid-cols-3 gap-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3 justify-center">
            <div className="bg-marigold/10 text-marigold rounded-full p-3">
              <Icon size={20} />
            </div>
            <div>
              <p className="font-display text-xl text-ink font-semibold leading-tight">
                {value}
              </p>
              <p className="font-body text-xs text-ink/50">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}