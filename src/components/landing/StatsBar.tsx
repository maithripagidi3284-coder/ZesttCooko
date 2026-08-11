"use client";
import { useEffect, useState } from "react";
import { Users, MapPin, ShieldCheck } from "lucide-react";

interface PublicStats {
  verifiedChefs: number;
  city: string;
}

export default function StatsBar() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats/public`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats({ verifiedChefs: 0, city: "Hyderabad" }));
  }, []);

  const items = [
    {
      icon: Users,
      value: stats ? `${stats.verifiedChefs}+` : "—",
      label: "Verified Chefs",
    },
    { icon: MapPin, value: stats?.city ?? "Hyderabad", label: "Live City" },
    { icon: ShieldCheck, value: "ID + Background", label: "Every Chef Checked" },
  ];

  return (
    <div className="bg-white border-y border-ink/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 grid grid-cols-3 gap-6">
        {items.map(({ icon: Icon, value, label }) => (
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