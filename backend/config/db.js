import mongoose from "mongoose";

// Utility to safely sanitize URI for logging without exposing database credentials
const sanitizeUri = (uri) => {
    if (!uri) return "UNDEFINED";
    return uri.replace(/\/\/([^:]+):([^@]+)@/, "//$1:****@");
};

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("❌ [Database Error] MONGO_URI is not defined in environment variables.");
        console.error("👉 Please copy .env.example to .env and configure your MongoDB Atlas connection string.");
        process.exit(1);
    }

    // Connection lifecycle event listeners
    mongoose.connection.on("connected", () => {
        const host = mongoose.connection.host;
        const name = mongoose.connection.name;
        console.log(`✅ MongoDB Connected successfully to [${host}/${name}]`);
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("⚠️  MongoDB disconnected. Attempting automatic reconnection...");
    });

    try {
        console.log(`🔌 Connecting to MongoDB: ${sanitizeUri(mongoUri)}`);
        
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000, // Fail fast if Atlas cluster is unreachable
            socketTimeoutMS: 45000,
        });

        console.log("🚀 MongoDB Atlas connection initialized");
    } catch (error) {
        console.error("❌ MongoDB Initial Connection Error:", error.message);
        console.error("👉 Tip: For MongoDB Atlas, verify that your IP address is whitelisted in Atlas Network Access (or set to 0.0.0.0/0 for testing), and check your database username/password.");
        process.exit(1);
    }
};

// Graceful application shutdown
process.on("SIGINT", async () => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
});

export default connectDB;