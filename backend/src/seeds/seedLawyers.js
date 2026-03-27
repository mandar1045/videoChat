/**
 * seedLawyers.js
 *
 * Creates 4 lawyer accounts (role: "admin") and assigns the existing
 * 15 demo users + client@lawfirm.com across them (~4 clients each).
 *
 * Run with:
 *   node src/seeds/seedLawyers.js
 * (from the /backend directory, with MONGODB_URI set in .env)
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

dotenv.config();

const LAWYER_PASSWORD = "lawyer123";

// ─── 4 Lawyer definitions ────────────────────────────────────────────────────
const lawyers = [
  {
    email: "jane.doe@lexconnect.com",
    fullName: "Atty. Jane Doe",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    specialty: "Criminal Defense",
  },
  {
    email: "michael.smith@lexconnect.com",
    fullName: "Atty. Michael Smith",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    specialty: "Corporate Law",
  },
  {
    email: "sarah.vance@lexconnect.com",
    fullName: "Atty. Sarah Vance",
    profilePic: "https://randomuser.me/api/portraits/women/68.jpg",
    specialty: "Family Law",
  },
  {
    email: "robert.chen@lexconnect.com",
    fullName: "Atty. Robert Chen",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    specialty: "Real Estate",
  },
];

// ─── Client email → lawyer email assignment ──────────────────────────────────
const clientAssignments = {
  "jane.doe@lexconnect.com": [
    "emma.thompson@example.com",
    "olivia.miller@example.com",
    "sophia.davis@example.com",
    "ava.wilson@example.com",
  ],
  "michael.smith@lexconnect.com": [
    "isabella.brown@example.com",
    "mia.johnson@example.com",
    "charlotte.williams@example.com",
    "amelia.garcia@example.com",
  ],
  "sarah.vance@lexconnect.com": [
    "james.anderson@example.com",
    "william.clark@example.com",
    "benjamin.taylor@example.com",
    "lucas.moore@example.com",
  ],
  "robert.chen@lexconnect.com": [
    "henry.jackson@example.com",
    "alexander.martin@example.com",
    "daniel.rodriguez@example.com",
    "client@lawfirm.com",   // the original test client
  ],
};

// ─── Main ────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✔  Connected to MongoDB");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(LAWYER_PASSWORD, salt);

    // 1. Upsert 4 lawyer accounts
    const lawyerIds = {}; // email → ObjectId

    for (const lawyer of lawyers) {
      const existing = await User.findOne({ email: lawyer.email });

      if (existing) {
        await User.updateOne(
          { email: lawyer.email },
          { role: "admin", password: hashedPassword, profilePic: lawyer.profilePic }
        );
        lawyerIds[lawyer.email] = existing._id;
        console.log(`↺  Updated lawyer: ${lawyer.fullName} (${lawyer.email})`);
      } else {
        const created = await User.create({
          email: lawyer.email,
          fullName: lawyer.fullName,
          password: hashedPassword,
          profilePic: lawyer.profilePic,
          role: "admin",
        });
        lawyerIds[lawyer.email] = created._id;
        console.log(`✚  Created lawyer: ${lawyer.fullName} (${lawyer.email})`);
      }
    }

    // 2. Assign clients
    let totalAssigned = 0;

    for (const [lawyerEmail, clientEmails] of Object.entries(clientAssignments)) {
      const lawyerId = lawyerIds[lawyerEmail];

      for (const clientEmail of clientEmails) {
        const result = await User.updateOne(
          { email: clientEmail },
          { assignedLawyer: lawyerId, role: "client" }
        );

        if (result.matchedCount === 0) {
          console.warn(`⚠   Client not found in DB, skipping: ${clientEmail}`);
        } else {
          totalAssigned++;
          console.log(`   → Assigned ${clientEmail}  →  ${lawyerEmail}`);
        }
      }
    }

    console.log(`\n✔  Done. 4 lawyers created/updated. ${totalAssigned} clients assigned.\n`);

    // 3. Print login credentials summary
    console.log("─────────────────────────────────────────────────────────");
    console.log("LAWYER LOGIN CREDENTIALS  (password for all: lawyer123)");
    console.log("─────────────────────────────────────────────────────────");
    lawyers.forEach((l) => {
      const assigned = clientAssignments[l.email];
      console.log(`\n  ${l.fullName} · ${l.specialty}`);
      console.log(`  Email   : ${l.email}`);
      console.log(`  Password: ${LAWYER_PASSWORD}`);
      console.log(`  Clients : ${assigned.join(", ")}`);
    });
    console.log("\n─────────────────────────────────────────────────────────\n");

    process.exit(0);
  } catch (err) {
    console.error("✘  Seed error:", err);
    process.exit(1);
  }
};

seed();
