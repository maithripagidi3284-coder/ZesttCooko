"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChefHat, Star, MapPin, Users, X } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";

const EVENT_TYPES = [
  { value: "KITTY_PARTY", label: "Kitty Party" },
  { value: "BIRTHDAY", label: "Birthday" },
  { value: "PRIVATE_EVENT", label: "Private Event" },
  { value: "FAMILY_GATHERING", label: "Family Gathering" },
  { value: "OFFICE_PARTY", label: "Office Party" },
  { value: "OTHER", label: "Other" },
];

interface ChefDetail {
  id: string;
  hourlyRate: number;
  cuisineSpecialties: string[];
  signatureDishes: string[];
  ratingAvg: number;
  ratingCount: number;
  user: { name: string | null };
}

interface AssistantOption {
  id: string;
  hourlyRate: number;
  distanceKm: number;
  user: { name: string | null };
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function maxDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 10);
  return d.toISOString().split("T")[0];
}

export default function BookChefPage() {
  const router = useRouter();
  const params = useParams();
  const chefId = params.chefId as string;

  const [chef, setChef] = useState<ChefDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [bookingType, setBookingType] = useState<"INSTANT" | "SCHEDULED">("SCHEDULED");
  const [eventType, setEventType] = useState("OTHER");
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("18:00");
  const [hours, setHours] = useState("3");
  const [headcount, setHeadcount] = useState("10");
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [customRequest, setCustomRequest] = useState("");

  const [assistants, setAssistants] = useState<AssistantOption[]>([]);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [locError, setLocError] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "USER") {
      router.push("/");
      return;
    }
    loadChef();
  }, [chefId, router]);

  async function loadChef() {
    try {
      const data = await apiGet(`/api/chefs/${chefId}`);
      setChef(data.chef);
    } catch {
      setError("Couldn't load this chef's profile");
    } finally {
      setLoading(false);
    }
  }

  function toggleDish(d: string) {
    setSelectedDishes((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  }

  const headcountNum = Number(headcount) || 0;
  const needsAssistant = headcountNum > 25;

  useEffect(() => {
    if (!needsAssistant) {
      setAssistants([]);
      setAssistantId(null);
      return;
    }
    if (!navigator.geolocation) {
      setLocError("Location access is needed to find an assistant chef");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const params = new URLSearchParams({
            lat: pos.coords.latitude.toString(),
            lng: pos.coords.longitude.toString(),
          });
          const data = await apiGet(`/api/chefs/nearby?${params.toString()}`);
          setAssistants(data.chefs.filter((c: AssistantOption) => c.id !== chefId));
        } catch {
          setLocError("Couldn't load nearby chefs for assistance");
        }
      },
      () => setLocError("Location permission denied")
    );
  }, [needsAssistant, chefId]);

  const hoursNum = Number(hours) || 0;
  const assistant = assistants.find((a) => a.id === assistantId);
  const baseAmount = (chef?.hourlyRate || 0) * hoursNum;
  const headcountFee = headcountNum * 50;
  const assistantAmount = assistant ? assistant.hourlyRate * hoursNum : 0;
  const totalAmount = baseAmount + headcountFee + assistantAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (needsAssistant && !assistantId) {
      setError("Please select an assistant chef for groups over 25");
      return;
    }

    setSubmitting(true);
    try {
      const scheduledAt =
        bookingType === "INSTANT"
          ? new Date().toISOString()
          : new Date(`${date}T${time}`).toISOString();

      const token = getToken();
      const data = await apiPost(
        "/api/bookings/create",
        {
          chefId,
          bookingType,
          eventType,
          scheduledAt,
          hours: hoursNum,
          headcount: headcountNum,
          selectedDishes,
          customRequest: customRequest || undefined,
          assistantChefId: assistantId || undefined,
        },
        token!
      );

      router.push(`/booking/${data.booking.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-ink/50">Loading chef profile...</p>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-ink/50">Chef not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream px-6 md:px-16 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-ink/10 p-6 flex items-center gap-4">
          <div className="bg-marigold/10 text-marigold rounded-full w-14 h-14 flex items-center justify-center font-display font-semibold text-xl">
            {chef.user.name?.[0]?.toUpperCase() || "C"}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              {chef.user.name || "Chef"}
            </p>
            <div className="flex items-center gap-3 text-sm font-body text-ink/60 mt-0.5">
              <span className="flex items-center gap-1 text-marigold font-mono">
                <Star size={13} fill="currentColor" />
                {chef.ratingAvg.toFixed(1)} ({chef.ratingCount})
              </span>
              <span className="font-mono">₹{chef.hourlyRate}/hr</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-ink/10 p-6 mt-6 space-y-5">
          <div>
            <label className="font-body text-sm text-ink/70 block mb-2">
              When do you need the chef?
            </label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => setBookingType("INSTANT")}
                className={`flex-1 py-2.5 rounded-lg font-body text-sm border transition ${
                  bookingType === "INSTANT"
                    ? "bg-marigold text-white border-marigold"
                    : "border-ink/15 text-ink/70"
                }`}
              >
                Book Now (Instant)
              </button>
              <button
                type="button"
                onClick={() => setBookingType("SCHEDULED")}
                className={`flex-1 py-2.5 rounded-lg font-body text-sm border transition ${
                  bookingType === "SCHEDULED"
                    ? "bg-marigold text-white border-marigold"
                    : "border-ink/15 text-ink/70"
                }`}
              >
                Schedule for later
              </button>
            </div>

            {bookingType === "SCHEDULED" && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  min={todayStr()}
                  max={maxDateStr()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                />
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
                />
              </div>
            )}
          </div>

          <div>
            <label className="font-body text-sm text-ink/70 block mb-1.5">
              Type of event
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
            >
              {EVENT_TYPES.map((et) => (
                <option key={et.value} value={et.value}>
                  {et.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Hours needed
              </label>
              <input
                type="number"
                required
                min={1}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
              />
            </div>
            <div>
              <label className="font-body text-sm text-ink/70 block mb-1.5">
                Headcount
              </label>
              <input
                type="number"
                required
                min={1}
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition"
              />
            </div>
          </div>

          {needsAssistant && (
            <div className="bg-marigold/5 border border-marigold/20 rounded-xl p-4">
              <div className="flex items-center gap-2 text-marigold mb-2">
                <Users size={16} />
                <p className="font-body text-sm font-medium">
                  Groups over 25 need an assistant chef
                </p>
              </div>
              {locError && (
                <p className="text-rust text-xs font-body mb-2">{locError}</p>
              )}
              {assistants.length === 0 ? (
                <p className="font-body text-xs text-ink/50">
                  Finding nearby chefs...
                </p>
              ) : (
                <div className="space-y-2">
                  {assistants.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => setAssistantId(a.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm font-body flex items-center justify-between transition ${
                        assistantId === a.id
                          ? "border-marigold bg-white"
                          : "border-ink/10 bg-white"
                      }`}
                    >
                      <span>{a.user.name || "Chef"}</span>
                      <span className="font-mono text-ink/50">
                        ₹{a.hourlyRate}/hr · {a.distanceKm}km
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {chef.signatureDishes.length > 0 && (
            <div>
              <label className="font-body text-sm text-ink/70 block mb-2">
                Pick dishes (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {chef.signatureDishes.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDish(d)}
                    className={`px-3 py-1.5 rounded-full text-sm font-body border transition ${
                      selectedDishes.includes(d)
                        ? "bg-marigold text-white border-marigold"
                        : "border-ink/15 text-ink/70 hover:border-marigold"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="font-body text-sm text-ink/70 block mb-1.5">
              Anything else to request? (optional)
            </label>
            <textarea
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              rows={3}
              className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-ink outline-none focus:border-marigold transition resize-none"
              placeholder="e.g. less spicy, no onion/garlic, a specific dish not listed..."
            />
          </div>

          <div className="border-t border-ink/10 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm font-body text-ink/60">
              <span>Chef ({hoursNum} hrs × ₹{chef.hourlyRate})</span>
              <span className="font-mono">₹{baseAmount}</span>
            </div>
            <div className="flex justify-between text-sm font-body text-ink/60">
              <span>Headcount fee ({headcountNum} × ₹50)</span>
              <span className="font-mono">₹{headcountFee}</span>
            </div>
            {assistant && (
              <div className="flex justify-between text-sm font-body text-ink/60">
                <span>Assistant chef ({hoursNum} hrs × ₹{assistant.hourlyRate})</span>
                <span className="font-mono">₹{assistantAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-display text-lg font-semibold text-ink pt-2">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {error && <p className="text-rust text-sm font-body">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-marigold text-white font-display font-semibold py-3 rounded-full hover:bg-marigold/90 transition disabled:opacity-60"
          >
            {submitting ? "Sending request..." : "Send booking request"}
          </button>
        </form>
      </div>
    </div>
  );
}