"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChefHat, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";

interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  hours: number;
  headcount: number;
  totalAmount: number;
  eventType: string;
}

export default function BookingStatusPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/");
      return;
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [bookingId, router]);

  async function load() {
    try {
      const data = await apiGet(`/api/bookings/${bookingId}`, getToken()!);
      setBooking(data.booking);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-ink/50">Loading...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-ink/50">Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="bg-marigold/15 text-marigold rounded-full p-2">
            <ChefHat size={22} />
          </div>
          <span className="font-display text-xl font-semibold text-ink">
            Chef<span className="text-marigold">Connect</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-ink/10 p-8 shadow-sm">
          {booking.status === "SEARCHING" && (
            <>
              <Loader2 className="animate-spin text-marigold mx-auto" size={40} />
              <h1 className="font-display text-2xl font-semibold text-ink mt-4">
                Waiting for chef to respond
              </h1>
              <p className="font-body text-sm text-ink/60 mt-2">
                We&apos;ve sent your request. This page updates automatically.
              </p>
            </>
          )}

          {booking.status === "CONFIRMED" && (
            <>
              <CheckCircle2 className="text-bay mx-auto" size={40} />
              <h1 className="font-display text-2xl font-semibold text-ink mt-4">
                Chef confirmed!
              </h1>
              <p className="font-body text-sm text-ink/60 mt-2">
                Your chef will arrive as scheduled.
              </p>
            </>
          )}

          {(booking.status === "CANCELLED" || booking.status === "FAILED_NO_CHEFS") && (
            <>
              <XCircle className="text-rust mx-auto" size={40} />
              <h1 className="font-display text-2xl font-semibold text-ink mt-4">
                {booking.status === "FAILED_NO_CHEFS"
                  ? "No chefs available"
                  : "Booking cancelled"}
              </h1>
              <p className="font-body text-sm text-ink/60 mt-2">
                Sorry about that — please try booking another chef, or contact
                us for a refund.
              </p>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-ink/10 text-left space-y-2">
            <div className="flex justify-between text-sm font-body">
              <span className="text-ink/50">When</span>
              <span className="text-ink">
                {new Date(booking.scheduledAt).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-ink/50">Duration</span>
              <span className="text-ink">{booking.hours} hours</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-ink/50">Guests</span>
              <span className="text-ink">{booking.headcount}</span>
            </div>
            <div className="flex justify-between font-display font-semibold pt-2">
              <span className="text-ink">Total</span>
              <span className="text-ink">₹{booking.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}