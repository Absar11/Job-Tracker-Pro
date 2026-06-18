import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { dbService } from "./src/backend/services/dbService.js";
import authRoutes from "./src/backend/routes/authRoutes.js";
import jobRoutes from "./src/backend/routes/jobRoutes.js";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize DB Service (Mongo or full local File fallback)
  await dbService.initialize();

  // Parse request payloads
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging Middleware (Aesthetic console logs)
  app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
  });

  // REST API Definitions
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/jobs", jobRoutes);

  // Global Express Error Handler
  app.use((err, req, res, next) => {
    console.error("Unhandled API Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error occurred.",
    });
  });

  // Integrate Vite Dev Server Middleware or Production Asset Server
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server integrating into Express...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in Production Mode. Serving compiled static web app assets.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Job Tracker Pro is live! listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal: failed to bootstrap server starting:", err);
});
