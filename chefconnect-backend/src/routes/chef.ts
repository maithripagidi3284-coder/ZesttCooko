import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      cuisineSpecialties,
      signatureDishes,
      hourlyRate,
      age,
      availabilityMode,
      travelRadiusKm,
    } = req.body;

    if (!cuisineSpecialties || cuisineSpecialties.length === 0 || !hourlyRate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const profile = await prisma.chefProfile.upsert({
      where: { userId: req.userId },
      update: {
        cuisineSpecialties,
        signatureDishes: signatureDishes || [],
        hourlyRate,
        age,
        availabilityMode: availabilityMode || "PART_TIME",
        travelRadiusKm: travelRadiusKm || 5,
      },
      create: {
        userId: req.userId as string,
        cuisineSpecialties,
        signatureDishes: signatureDishes || [],
        hourlyRate,
        age,
        availabilityMode: availabilityMode || "PART_TIME",
        travelRadiusKm: travelRadiusKm || 5,
      },
    });

    res.json({ message: "Profile saved", profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save chef profile" });
  }
});

router.post("/location", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    await prisma.chefProfile.update({
      where: { userId: req.userId },
      data: { latitude, longitude },
    });

    res.json({ message: "Location updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update location" });
  }
});

export default router;