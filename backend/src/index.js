import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./lib/db.js";
import User from "./models/user.model.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import groupRoutes from "./routes/group.route.js";
import { initSocket } from "./lib/socket.js";

dotenv.config();

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === "development"
        ? "http://localhost:5001/api/auth/google/callback"
        : "https://yochat-nlt9.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, profile);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const PORT = parseInt(process.env.PORT) || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? ["https://yochat-nlt9.onrender.com"]
      : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true,
  })
);

// Initialize Passport
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
