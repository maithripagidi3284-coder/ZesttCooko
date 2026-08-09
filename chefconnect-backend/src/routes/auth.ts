import { Router } from "express";
import prisma from "../lib/prisma";
import { sendVerificationEmail } from "../lib/resend";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/signup/send-code", async (req, res) => {
  try {
    const { email, whatsapp } = req.body;

    if (!email || !whatsapp) {
      return res.status(400).json({ error: "Email and WhatsApp number are required" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { whatsapp }] },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email or WhatsApp number already registered" });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.verificationCode.create({
      data: { email, code, expiresAt },
    });
console.log(`\n🔑 Verification code for ${email}: ${code}\n`);

    try {
      await sendVerificationEmail(email, code);
    } catch (emailErr) {
      console.error("Email send failed (check terminal for code above):", emailErr);
    }

    res.json({ message: "Verification code sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});
router.post("/signup/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const record = await prisma.verificationCode.findFirst({
      where: { email, code },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return res.status(400).json({ error: "Invalid code" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ error: "Code has expired" });
    }

    res.json({ message: "Code verified", verified: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to verify code" });
  }
});
router.post("/signup/complete", async (req, res) => {
  try {
    const { email, whatsapp, code, name, password, role, profilePicUrl } = req.body;

    if (!email || !whatsapp || !code || !name || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const record = await prisma.verificationCode.findFirst({
      where: { email, code },
      orderBy: { createdAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        whatsapp,
        name,
        passwordHash,
        role: role.toUpperCase(),
        profilePicUrl: profilePicUrl || null,
        isVerified: true,
      },
    });

   await prisma.verificationCode.deleteMany({ where: { email } });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Account created",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to complete signup" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log in" });
  }
});
export default router;