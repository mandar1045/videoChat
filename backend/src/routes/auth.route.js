import express from "express";
import { checkAuth, login, logout, signup, updateProfile, deleteAccount, googleAuth, googleAuthCallback, googleSignIn } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import passport from "passport";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.delete("/delete-account", protectRoute, deleteAccount);

router.get("/check", protectRoute, checkAuth);

// Google OAuth routes
router.get("/google", googleAuth);
router.get("/google/callback", passport.authenticate("google", { session: false }), googleAuthCallback);
router.post("/google-signin", googleSignIn);

export default router;
