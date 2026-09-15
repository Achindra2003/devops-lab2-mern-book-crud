import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Book from "../models/Book.js";

dotenv.config();

const sampleBooks = [
    {
        title: "The Phoenix Project: A Novel about IT, DevOps, and Helping Your Business Win",
        author: "Gene Kim, Kevin Behr, George Spafford",
        genre: "DevOps / Technology",
        publishedYear: 2013,
        price: 29.99,
        isbn: "978-0988262591"
    },
    {
        title: "Site Reliability Engineering: How Google Runs Production Systems",
        author: "Niall Richard Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff",
        genre: "Cloud Infrastructure",
        publishedYear: 2016,
        price: 39.99,
        isbn: "978-1491929124"
    },
    {
        title: "Accelerate: The Science of Lean Software and DevOps",
        author: "Nicole Forsgren, Jez Humble, Gene Kim",
        genre: "Software Engineering",
        publishedYear: 2018,
        price: 24.99,
        isbn: "978-1942788331"
    }
];

const seedDatabase = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("❌ MONGO_URI is missing in .env. Cannot seed database.");
        process.exit(1);
    }

    try {
        console.log("🔌 Connecting to MongoDB for seeding...");
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ Connected to MongoDB successfully.");

        // Create or find a test seed user
        const seedEmail = "devops.demo@example.com";
        let user = await User.findOne({ email: seedEmail });

        if (!user) {
            const hashedPassword = await bcrypt.hash("DevOpsPass123!", 10);
            user = await User.create({
                name: "DevOps Student",
                email: seedEmail,
                password: hashedPassword
            });
            console.log(`👤 Created seed user: ${seedEmail} (Password: DevOpsPass123!)`);
        } else {
            console.log(`👤 Using existing seed user: ${seedEmail}`);
        }

        // Check if books already exist
        const existingCount = await Book.countDocuments({ createdBy: user._id });
        if (existingCount === 0) {
            const booksWithUser = sampleBooks.map((b) => ({ ...b, createdBy: user._id }));
            await Book.insertMany(booksWithUser);
            console.log(`📚 Seeded ${sampleBooks.length} sample books into the database.`);
        } else {
            console.log(`📚 Found ${existingCount} existing books for this user. Skipping book insert.`);
        }

        console.log("🎉 Database seeding and Atlas connectivity check completed successfully!");
        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
};

seedDatabase();
