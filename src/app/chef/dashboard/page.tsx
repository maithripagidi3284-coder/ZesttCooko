"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChefHat, TrendingUp, Package, Star, AlertTriangle,
  Power, Clock,
} from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";

interface DashboardData {
  profile: { isOnline: boolean; ratingAvg: number; ratingCount: number };
  stats: {
    totalEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
    completedOrders: number;
    pendingOrders: number;
    complaintsCount: number;
  };
  dailyEarnings: { date: string; amount: number }[];
  recentBookings: Array<{
    id: string;
    status: string;
    totalAmount: number;
    chefPayout: number;
    scheduledAt: string;
    hasComplaint: boolean;
  }>;
  complaints: Array<{ id: string; complaintText: string | null }>;
}

export default function ChefDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== "CHEF") {
      router.push("/");
      return;
    }
    if (user.verificationStatus !== "APPROVED") {
      router.push("/signup/pending-review");
      return;
    }
    loadDashboard();
  }, [router]);

  async function loadDashboard() {
    try {
      const result = await apiGet("/api/dashboard/chef", getToken()!);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleOnline() {
    setToggling(true);
    try {
      await apiPost("/api/dashboard/toggle-online", {}, getToken()!);
      loadDashboard();
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-ink/50">Loading your dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-ink/50">Couldn&apos;t load dashboard.</p>
      </div>
    );
  }

  const maxDaily = Math.max(...data.dailyEarnings.map((d) => d.amount), 1);

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

          <button
            onClick={toggleOnline}
            disabled={toggling}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition ${
              data.profile.isOnline
                ? "bg-bay/10 text-bay"
                : "bg-ink/5 text-ink/50"
            }`}
          >
            <Power size={14} />
            {data.profile.isOnline ? "Online" : "Offline"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-10">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Your Dashboard
        </h1>
        <p className="font-body text-ink/60 mt-1">
          Track your earnings, bookings, and ratings.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <StatCard
            icon={TrendingUp}
            label="This week"
            value={`₹${data.stats.weeklyEarnings}`}
            color="marigold"
          />
          <StatCard
            icon={TrendingUp}
            label="This month"
            value={`₹${data.stats.monthlyEarnings}`}
            color="bay"
          />
          <StatCard
            icon={Package}
            label="Completed orders"
            value={data.stats.completedOrders.toString()}
            color="marigold"
          />
          <StatCard
            icon={Star}
            label="Rating"
            value={`${data.profile.ratingAvg.toFixed(1)} (${data.profile.ratingCount})`}
            color="bay"
          />
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 p-6 mt-8">
          <h2 className="font-display text-lg font-semibold text-ink mb-6">
            Last 7 days
          </h2>
          <div className="flex items-end gap-3 h-40">
            {data.dailyEarnings.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end h-32">
                  <div
                    className="w-full bg-marigold/80 rounded-t-md transition-all"
                    style={{
                      height: `${Math.max((d.amount / maxDaily) * 100, 3)}%`,
                    }}
                  />
                </div>
                <span className="font-mono text-xs text-ink/40">{d.date}</span>
              </div>
            ))}
          </div>
        </div>

        {data.stats.complaintsCount > 0 && (
          <div className="bg-rust/5 border border-rust/20 rounded-2xl p-6 mt-8">
            <div className="flex items-center gap-2 text-rust">
              <AlertTriangle size={18} />
              <h2 className="font-display text-lg font-semibold">
                Complaints ({data.stats.complaintsCount})
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              {data.complaints.map((c) => (
                <div key={c.id} className="bg-white rounded-lg p-4 text-sm font-body text-ink/70">
                  {c.complaintText || "No details provided"}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-ink/10 p-6 mt-8">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">
            Recent bookings
          </h2>
          {data.recentBookings.length === 0 ? (
            <p className="font-body text-ink/50 text-sm py-8 text-center">
              No bookings yet. They&apos;ll show up here once you start
              receiving requests.
            </p>
          ) : (
            <div className="space-y-3">
              {data.recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between border-b border-ink/5 pb-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-ink/40" />
                    <span className="font-body text-sm text-ink">
                      {new Date(b.scheduledAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-ink/70">
                    ₹{b.chefPayout}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-1 rounded-full ${
                      b.status === "COMPLETED"
                        ? "bg-bay/10 text-bay"
                        : "bg-marigold/10 text-marigold"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "marigold" | "bay";
}) {
  return (
    <div className="bg-white rounded-2xl border border-ink/10 p-5">
      <div
        className={`w-fit rounded-full p-2.5 ${
          color === "marigold" ? "bg-marigold/10 text-marigold" : "bg-bay/10 text-bay"
        }`}
      >
        <Icon size={18} />
      </div>
      <p className="font-display text-2xl font-semibold text-ink mt-3">
        {value}
      </p>
      <p className="font-body text-sm text-ink/50">{label}</p>
    </div>
  );
}