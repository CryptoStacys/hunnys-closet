import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/auth.js";
import db from "./src/database.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost",
      "https://staging-hunnys-closet-2.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 8081;

// Middleware for logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Auth routes
app.use("/auth", authRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Database initialized at: ${db.name}`);
});
