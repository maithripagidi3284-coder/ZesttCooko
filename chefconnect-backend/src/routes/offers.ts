import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/pending", requireAuth, async (req: AuthRequest, res) => {
  try {
    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.userId },
    });
    if (!chefProfile) {
      return res.status(404).json({ error: "Chef profile not found" });
    }

    const offers = await prisma.bookingOffer.findMany({
      where: {
        chefId: chefProfile.id,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      include: { booking: true },
      orderBy: { offeredAt: "desc" },
    });

    res.json({ offers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load offers" });
  }
});

router.post("/:offerId/respond", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { accept } = req.body;

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId: req.userId },
    });
    if (!chefProfile) {
      return res.status(404).json({ error: "Chef profile not found" });
    }

   const offer = await prisma.bookingOffer.findUnique({
      where: { id: req.params.offerId as string },
      include: { booking: true },
    });

    if (!offer || offer.chefId !== chefProfile.id) {
      return res.status(404).json({ error: "Offer not found" });
    }
    if (offer.status !== "PENDING") {
      return res.status(400).json({ error: "This offer has already been responded to" });
    }
    if (offer.expiresAt < new Date()) {
      return res.status(400).json({ error: "This offer has expired" });
    }

    if (accept) {
      await prisma.bookingOffer.update({
        where: { id: offer.id },
        data: { status: "ACCEPTED", respondedAt: new Date() },
      });
      await prisma.booking.update({
        where: { id: offer.bookingId },
        data: { status: "CONFIRMED", chefId: chefProfile.id },
      });
      res.json({ message: "Booking accepted" });
    } else {
      await prisma.bookingOffer.update({
        where: { id: offer.id },
        data: { status: "REJECTED", respondedAt: new Date() },
      });
      res.json({ message: "Booking rejected" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to respond to offer" });
  }
});

export default router;