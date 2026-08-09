"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, MapPin, Star, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import { getUser } from "@/lib/auth";

const CUISINE_OPTIONS = [
  "North Indian", "South Indian", "Chinese", "Continental",
  "Biryani & Mughlai", "Desserts", "Street Food", "Tandoor & BBQ",
];

interface Chef {
  id: string;
  hourlyRate: number;
  cuisineSpecialties: string[];
  signatureDishes: string[];
  ratingAvg: number;
  ratingCount: number;
  distanceKm: number;
  user: { name: string | null; profilePicUrl: string | null };
}

export default function HomePage() {
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [activeCuisine, setActiveCuisine] = useState<string | null>(null);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "USER") {
      router.push("/");
      return;
    }
    requestLocation();
  }, [router]);

  function requestLocation() {
    setLocationError("");
    setLoading(true);
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location access");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocationError("Location permission denied. Enable it to see chefs near you.");
        setLoading(false);
      }
    );
  }

  useEffect(() => {
    if (!location) return;
    fetchChefs();
  }, [location, activeCuisine]);

  async function fetchChefs() {
    if (!location) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: location.lat.toString(),
        lng: location.lng.toString(),
      });
      if (activeCuisine) params.append("cuisine", activeCuisine);

      const data = await apiGet(`/api/chefs/nearby?${params.toString()}`);
      setChefs(data.chefs);
    } catch {
      setChefs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-ink/10 px-6 md:px-16 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-marigold/15 text-marigold rounded-full p-2">
              <ChefHat size={20} />
            </div>
            <span className="font-display text-lg font-semibold text-ink">
              Chef<span className="text-marigold">Connect</span>
            </span>
          </div>
          {location && (
            <button
              onClick={requestLocation}
              className="flex items-center gap-1.5 text-sm font-body text-ink/60 hover:text-marigold transition"
            >
              <RefreshCw size={14} />
              Refresh location
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Chefs near you
        </h1>
        <p className="font-body text-ink/60 mt-1">
          Pick a chef by specialty and distance — they cook fresh, right in your kitchen.
        </p>

        {locationError && (
          <div className="bg-rust/10 text-rust rounded-xl p-4 mt-6 flex items-center justify-between">
            <span className="font-body text-sm">{locationError}</span>
            <button
              onClick={requestLocation}
              className="font-body text-sm font-medium underline shrink-0 ml-4"
            >
              Try again
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          <button
            onClick={() => setActiveCuisine(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-body border transition ${
              activeCuisine === null
                ? "bg-marigold text-white border-marigold"
                : "border-ink/15 text-ink/70 hover:border-marigold"
            }`}
          >
            All cuisines
          </button>
          {CUISINE_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCuisine(c)}
              className={`px-3 py-1.5 rounded-full text-sm font-body border transition ${
                activeCuisine === c
                  ? "bg-marigold text-white border-marigold"
                  : "border-ink/15 text-ink/70 hover:border-marigold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="font-body text-ink/50 text-center py-16">
              Finding chefs near you...
            </p>
          ) : chefs.length === 0 ? (
            <p className="font-body text-ink/50 text-center py-16">
              No chefs found nearby yet. Try a different cuisine, or check back soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chefs.map((chef) => (
                <div
                  key={chef.id}
                  className="bg-white rounded-2xl border border-ink/10 p-5 hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-marigold/10 text-marigold rounded-full w-12 h-12 flex items-center justify-center font-display font-semibold text-lg">
                      {chef.user.name?.[0]?.toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="font-display font-semibold text-ink">
                        {chef.user.name || "Chef"}
                      </p>
                      <div className="flex items-center gap-1 text-marigold text-sm font-mono">
                        <Star size={13} fill="currentColor" />
                        {chef.ratingAvg.toFixed(1)} ({chef.ratingCount})
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {chef.cuisineSpecialties.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="bg-cream text-ink/70 text-xs font-body px-2 py-1 rounded-full border border-ink/10"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink/10">
                    <div className="flex items-center gap-1.5 text-ink/60 text-sm font-body">
                      <MapPin size={14} />
                      {chef.distanceKm} km away
                    </div>
                    <div className="flex items-center gap-1.5 text-ink/60 text-sm font-mono">
                      <Clock size={14} />
                      ₹{chef.hourlyRate}/hr
                    </div>
                  </div>

                  <Link
                    href={`/book/${chef.id}`}
                    className="w-full mt-4 bg-marigold text-white font-display font-semibold py-2.5 rounded-full hover:bg-marigold/90 transition text-center block"
                  >
                    Book this chef
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}