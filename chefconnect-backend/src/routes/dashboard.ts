import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/chef", requireAuth, async (req: AuthRequest, res) => {
  try {
    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!chefProfile) {
      return res.status(404).json({ error: "Chef profile not found" });
    }

    const bookings = await prisma.booking.findMany({
      where: { chefId: chefProfile.id },
      orderBy: { createdAt: "desc" },
    });

    const completed = bookings.filter((b) => b.status === "COMPLETED");
    const complaints = bookings.filter((b) => b.hasComplaint);

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const weeklyEarnings = completed
      .filter((b) => b.completedAt && b.completedAt >= startOfWeek)
      .reduce((sum, b) => sum + b.chefPayout, 0);

    const monthlyEarnings = completed
      .filter((b) => b.completedAt && b.completedAt >= startOfMonth)
      .reduce((sum, b) => sum + b.chefPayout, 0);

    const totalEarnings = completed.reduce((sum, b) => sum + b.chefPayout, 0);

    // Build last 7 days earnings for the graph
    const dailyEarnings: { date: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const amount = completed
        .filter((b) => b.completedAt && b.completedAt >= day && b.completedAt < nextDay)
        .reduce((sum, b) => sum + b.chefPayout, 0);

      dailyEarnings.push({
        date: day.toLocaleDateString("en-IN", { weekday: "short" }),
        amount,
      });
    }

    res.json({
      profile: {
        isOnline: chefProfile.isOnline,
        ratingAvg: chefProfile.ratingAvg,
        ratingCount: chefProfile.ratingCount,
        verificationStatus: chefProfile.userId,
      },
      stats: {
        totalEarnings,
        weeklyEarnings,
        monthlyEarnings,
        completedOrders: completed.length,
        pendingOrders: bookings.filter((b) => b.status === "SEARCHING").length,
        complaintsCount: complaints.length,
      },
      dailyEarnings,
      recentBookings: bookings.slice(0, 10),
      complaints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

router.post("/toggle-online", requireAuth, async (req: AuthRequest, res) => {
  try {
    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.userId },
    });

    if (!chefProfile) {
      return res.status(404).json({ error: "Chef profile not found" });
    }

    const updated = await prisma.chefProfile.update({
      where: { userId: req.userId },
      data: { isOnline: !chefProfile.isOnline },
    });

    res.json({ isOnline: updated.isOnline });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle status" });
  }
});

export default router;