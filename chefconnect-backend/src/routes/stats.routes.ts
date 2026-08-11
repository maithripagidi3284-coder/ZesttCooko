import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/public", async (req, res) => {
  try {
    const verifiedChefs = await prisma.chefProfile.count({
      // Temporary: count all chefs until verificationStatus field exists.
      // Once the verification schema lands, change to:
      // where: { verificationStatus: "APPROVED" },
    });
    res.json({ verifiedChefs, city: "Hyderabad" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;