import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import tradeOrderRoutes from "./routes/trade-order.routes";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/trade_orders", tradeOrderRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Global error handler
app.use(errorHandler);

export default app;
