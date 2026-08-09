import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, cuisine } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);

    const chefs = await prisma.chefProfile.findMany({
      where: {
        isOnline: true,
        latitude: { not: null },
        longitude: { not: null },
        user: { verificationStatus: "APPROVED" },
        ...(cuisine
          ? { cuisineSpecialties: { has: cuisine as string } }
          : {}),
      },
      include: {
        user: { select: { name: true, profilePicUrl: true } },
      },
    });

    const nearby = chefs
      .map((chef) => {
        const distance = distanceKm(userLat, userLng, chef.latitude!, chef.longitude!);
        return { ...chef, distanceKm: Math.round(distance * 10) / 10 };
      })
      .filter((chef) => chef.distanceKm <= chef.travelRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({ chefs: nearby });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch nearby chefs" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const chef = await prisma.chefProfile.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { name: true, profilePicUrl: true } } },
    });
    if (!chef) return res.status(404).json({ error: "Chef not found" });
    res.json({ chef });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chef" });
  }
});
export default router;