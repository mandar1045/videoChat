import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

dotenv.config();

const DB_URI = process.env.MONGODB_URI;

const seedUsers = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Password for both test users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);

        // Create Admin User
        const adminUser = {
            email: "admin@lawfirm.com",
            fullName: "Law Firm Admin",
            password: hashedPassword,
            role: "admin",
        };

        // Create Client User
        const clientUser = {
            email: "client@lawfirm.com",
            fullName: "Law Firm Client",
            password: hashedPassword,
            role: "client",
        };

        // Check if they exist to avoid unique constraint errors
        const adminExists = await User.findOne({ email: adminUser.email });
        if (!adminExists) {
            await User.create(adminUser);
            console.log("Admin user created: admin@lawfirm.com (pass: password123)");
        } else {
            // Update role just in case
            await User.updateOne({ email: adminUser.email }, { role: "admin", password: hashedPassword });
            console.log("Admin user updated: admin@lawfirm.com");
        }

        const clientExists = await User.findOne({ email: clientUser.email });
        if (!clientExists) {
            await User.create(clientUser);
            console.log("Client user created: client@lawfirm.com (pass: password123)");
        } else {
            await User.updateOne({ email: clientUser.email }, { role: "client", password: hashedPassword });
            console.log("Client user updated: client@lawfirm.com");
        }

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error connecting to MongoDB or seeding data:", error);
        process.exit(1);
    }
};

seedUsers();
