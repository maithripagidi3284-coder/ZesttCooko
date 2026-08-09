import { Router } from "express";
import multer from "multer";
import cloudinary from "../lib/cloudinary";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/submit-id",
  requireAuth,
  upload.single("idProof"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "ID proof image is required" });
      }

      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "chefconnect/id-proofs", type: "private" },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });

      await prisma.user.update({
        where: { id: req.userId },
        data: {
          idProofUrl: uploadResult.secure_url,
          verificationStatus: "PENDING",
        },
      });

      res.json({ message: "ID submitted for review", status: "PENDING" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to submit ID proof" });
    }
  }
);

export default router;