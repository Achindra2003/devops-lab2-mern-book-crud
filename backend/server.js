import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;


// Database
connectDB();


// Middleware
app.use(cors());

app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Book API is running"
    });
});

// DevOps Telemetry & Health Probe endpoint (Liveness & Readiness)
app.get("/api/health", async (req, res) => {
    const dbStateMap = {
        0: "Disconnected",
        1: "Connected",
        2: "Connecting",
        3: "Disconnecting"
    };

    const dbState = mongoose.connection.readyState;
    const isDbHealthy = dbState === 1;

    let dbLatencyMs = null;
    if (isDbHealthy && mongoose.connection.db) {
        try {
            const start = Date.now();
            await mongoose.connection.db.admin().ping();
            dbLatencyMs = Date.now() - start;
        } catch (pingErr) {
            console.error("Health probe ping failed:", pingErr.message);
        }
    }

    const healthPayload = {
        status: isDbHealthy ? "UP" : "DEGRADED",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        database: {
            state: dbStateMap[dbState] || "Unknown",
            connected: isDbHealthy,
            host: mongoose.connection.host || null,
            name: mongoose.connection.name || null,
            latencyMs: dbLatencyMs
        },
        system: {
            nodeVersion: process.version,
            memoryUsageMB: Math.round(process.memoryUsage().rss / (1024 * 1024))
        }
    };

    res.status(isDbHealthy ? 200 : 503).json(healthPayload);
});


// Routes
app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);


// Start server
app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );
});