import express from "express";
import chefRoutes from "./routes/chef";
import chefsRoutes from "./routes/chefs";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import verificationRoutes from "./routes/verification";
import dashboardRoutes from "./routes/dashboard";
import bookingsRoutes from "./routes/bookings";
import offersRoutes from "./routes/offers";
import statsRoutes from "./routes/stats.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chef", chefRoutes);
app.use("/api/chefs", chefsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/stats", statsRoutes);
app.get("/", (req, res) => {
  res.json({ status: "ChefConnect API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});