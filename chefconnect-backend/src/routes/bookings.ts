import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/create", requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      chefId,
      bookingType,
      eventType,
      scheduledAt,
      hours,
      headcount,
      selectedDishes,
      customRequest,
      assistantChefId,
    } = req.body;

    if (!chefId || !hours || !headcount || !scheduledAt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (headcount > 25 && !assistantChefId) {
      return res.status(400).json({
        error: "Groups over 25 need an assistant chef selected",
      });
    }

    const chef = await prisma.chefProfile.findUnique({ where: { id: chefId } });
    if (!chef) {
      return res.status(404).json({ error: "Chef not found" });
    }

    let assistantPayout = 0;
    let assistantChef = null;
    if (assistantChefId) {
      assistantChef = await prisma.chefProfile.findUnique({
        where: { id: assistantChefId },
      });
      if (!assistantChef) {
        return res.status(404).json({ error: "Assistant chef not found" });
      }
      assistantPayout = assistantChef.hourlyRate * hours * 0.65;
    }

    const totalAmount =
      chef.hourlyRate * hours + headcount * 50 + (assistantChef ? assistantChef.hourlyRate * hours : 0);
    const platformFee = totalAmount * 0.35;
    const chefPayout = chef.hourlyRate * hours * 0.65;

    const booking = await prisma.booking.create({
      data: {
        userId: req.userId as string,
        requestedChefId: chefId,
        bookingType: bookingType || "SCHEDULED",
        eventType: eventType || "OTHER",
        scheduledAt: new Date(scheduledAt),
        hours,
        headcount,
        selectedDishes: selectedDishes || [],
        customRequest,
        assistantChefId: assistantChefId || null,
        totalAmount,
        platformFee,
        chefPayout,
        assistantPayout: assistantChef ? assistantPayout : null,
        status: "SEARCHING",
      },
    });

    const offerWindowMs =
      booking.bookingType === "INSTANT" ? 15 * 60 * 1000 : 2 * 60 * 60 * 1000;

    await prisma.bookingOffer.create({
      data: {
        bookingId: booking.id,
        chefId: chefId,
        expiresAt: new Date(Date.now() + offerWindowMs),
      },
    });

    res.json({ message: "Booking created, waiting for chef response", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { offers: { orderBy: { offeredAt: "desc" } } },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

export default router;