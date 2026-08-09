"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, ArrowRight, X, MapPin } from "lucide-react";
import { apiPost } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";

const CUISINE_OPTIONS = [
  "North Indian", "South Indian", "Chinese", "Continental",
  "Biryani & Mughlai", "Desserts", "Street Food", "Tandoor & BBQ",
];

export default function ChefDetailsPage() {
  const router = useRouter();
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [dishInput, setDishInput] = useState("");
  const [dishes, setDishes] = useState<string[]>([]);
  const [rate, setRate] = useState("");
  const [age, setAge] = useState("");
  const [availability, setAvailability] = useState<"PART_TIME" | "FULL_TIME">("PART_TIME");
  const [radiusKm, setRadiusKm] = useState("5");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "CHEF") {
      router.push("/");
    }
  }, [router]);

  function toggleCuisine(c: string) {
    setCuisines((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function addDish() {
    if (dishInput.trim()) {
      setDishes((prev) => [...prev, dishInput.trim()]);
      setDishInput("");
    }
  }

  function removeDish(d: string) {
    setDishes((prev) => prev.filter((x) => x !== d));
  }

  function captureLocation() {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support location access");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocationError("Location permission denied. Please allow access.");
      }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (cuisines.length === 0) {
      setError("Select at least one cuisine specialty");
      return;
    }
    if (!rate || Number(rate) <= 0) {
      setError("Enter a valid hourly rate");
      return;
    }
    if (!location) {
      setError("Please share your location before continuing");
      return;
    }
    setLoading(true);
    try {
      const token = getToken();

      await apiPost(
        "/api/chef/profile",
        {
          cuisineSpecialties: cuisines,
          signatureDishes: dishes,
          hourlyRate: Number(rate),
          age: age ? Number(age) : undefined,
          availabilityMode: availability,
          travelRadiusKm: Number(radiusKm),
        },
        token!
      );

      await apiPost(
        "/api/chef/location",
        {
          latitude: location.lat,
          longitude: location.lng,
        },
        token!
      );

      router.push("/signup/verify-id");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="bg-marigold/15 text-marigold rounded-full p-2">
            <ChefHat size={22} />
          </div>
          <span className="font-display text-xl font-semibold text-ink">
            Chef<span className="text-marigold">Connect</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Tell us about your cooking
          </h1>
          <p className="font-body text-sm text-ink/60 mt-1">
            This is what households will see on your profile.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="font-body text-sm text-ink/70 block mb-2">
                Cuisine specialties
              </label>
              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`px-3 py-1.5 rounded-full text-sm font-body border transition ${
                      cuisines.includes(c)
                        ? "bg-marigold text-white border-marigold"
                        : "border-ink/15 text-ink/70 hover:border-marigold"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-body text-sm text-ink/70 block mb-2">
                Signature dishes
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dishInput}
                  onChange={(e) => setDishInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addDish();
                    }
                  }}
                  className="flex-1 border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                  placeholder="e.g. Hyderabadi Biryani"
                />
                <button
                  type="button"
                  onClick={addDish}
                  className="bg-bay/10 text-bay px-4 rounded-lg font-body text-sm font-medium"
                >
                  Add
                </button>
              </div>
              {dishes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {dishes.map((d) => (
                    <span
                      key={d}
                      className="flex items-center gap-1.5 bg-cream border border-ink/10 px-3 py-1 rounded-full text-sm font-body text-ink"
                    >
                      {d}
                      <button type="button" onClick={() => removeDish(d)}>
                        <X size={13} className="text-ink/40" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-ink/70 block mb-1.5">
                  Hourly rate (₹)
                </label>
                <input
                  type="number"
                  required
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                  placeholder="399"
                />
              </div>
              <div>
                <label className="font-body text-sm text-ink/70 block mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                  placeholder="25"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                How far can you travel to cook? (km)
              </label>
              <input
                type="number"
                required
                min={1}
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
              />
            </div>

            <div>
              <label className="font-body text-sm text-ink/70 block mb-2">
                Your location
              </label>
              {location ? (
                <div className="flex items-center gap-2 bg-bay/10 text-bay px-4 py-2.5 rounded-lg text-sm font-body">
                  <MapPin size={16} />
                  Location captured
                </div>
              ) : (
                <button
                  type="button"
                  onClick={captureLocation}
                  className="w-full flex items-center justify-center gap-2 border border-ink/15 rounded-lg py-2.5 text-sm font-body text-ink hover:border-marigold transition"
                >
                  <MapPin size={16} />
                  Share my current location
                </button>
              )}
              {locationError && (
                <p className="text-rust text-xs font-body mt-1.5">{locationError}</p>
              )}
            </div>

            <div>
              <label className="font-body text-sm text-ink/70 block mb-2">
                Availability
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAvailability("PART_TIME")}
                  className={`flex-1 py-2.5 rounded-lg font-body text-sm border transition ${
                    availability === "PART_TIME"
                      ? "bg-marigold text-white border-marigold"
                      : "border-ink/15 text-ink/70"
                  }`}
                >
                  Part-Time Gigs
                </button>
                <button
                  type="button"
                  onClick={() => setAvailability("FULL_TIME")}
                  className={`flex-1 py-2.5 rounded-lg font-body text-sm border transition ${
                    availability === "FULL_TIME"
                      ? "bg-marigold text-white border-marigold"
                      : "border-ink/15 text-ink/70"
                  }`}
                >
                  Full-Time
                </button>
              </div>
            </div>

            {error && <p className="text-rust text-sm font-body">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-marigold text-white font-display font-semibold py-3 rounded-full hover:bg-marigold/90 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue to ID verification"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}