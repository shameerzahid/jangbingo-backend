import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

import { connectDB, disconnectDB } from "./config/database";
import { specs } from "./config/swagger";

import notFound from "./middleware/notFound";

// Import routes
import healthRoutes from "./routes/health";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import equipmentRoutes from "./routes/equipment";
import jobPostRoutes from "./routes/jobPosts";
import communityRoutes from "./routes/communities";

// Load environment variables
dotenv.config();

const app = express();

// Connect to PostgreSQL
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || "900000"), // 15 minutes
  max: parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || "100"), // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env["NODE_ENV"] !== "test") {
  app.use(morgan("combined"));
}

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "JangbiGO Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/v1/health",
      users: "/api/v1/users",
      auth: "/api/v1/auth",
      equipment: "/api/v1/equipment",
      jobPosts: "/api/v1/job-posts",
      communities: "/api/v1/communities",
      docs: "/api-docs"
    }
  });
});

// Swagger documentation
app.use("/api-docs", swaggerUi.serve as any);
app.use("/api-docs", swaggerUi.setup(specs, {
  swaggerOptions: {
    url: "/api-docs/swagger.json",
    docExpansion: "none",
    filter: true,
    showRequestHeaders: true,
  },
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "JangbiGO API Documentation",
}) as any);

// Serve swagger.json
app.get("/api-docs/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

// Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/equipment", equipmentRoutes);
app.use("/api/v1/job-posts", jobPostRoutes);
app.use("/api/v1/communities", communityRoutes);

// 404 handler
app.use(notFound);

const PORT = process.env["PORT"] || 3000;

if (process.env["NODE_ENV"] !== "test") {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env["NODE_ENV"]}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  });

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  });
}

export default app;
