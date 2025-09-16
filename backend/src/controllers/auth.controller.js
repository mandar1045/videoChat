import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import passport from "passport";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      newUser.lastSeen = new Date();
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastSeen = new Date();
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Clear the cookie
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAccount controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleAuthCallback = async (req, res) => {
  try {
    const { googleId, displayName, emails, photos } = req.user;

    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: emails[0].value });

      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = googleId;
        existingUser.profilePic = photos[0].value || existingUser.profilePic;
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = new User({
          googleId,
          fullName: displayName,
          email: emails[0].value,
          profilePic: photos[0].value || "",
        });
        await user.save();
      }
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT token
    generateToken(user._id, res);

    // Redirect to frontend with success
    const frontendUrl = process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : "/";

    res.redirect(`${frontendUrl}?auth=success`);
  } catch (error) {
    console.log("Error in Google auth callback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const googleSignIn = async (req, res) => {
  console.log("Google sign-in endpoint called");
  try {
    const { credential } = req.body;
    console.log("Credential received:", credential ? "Yes" : "No");

    if (!credential) {
      console.log("No credential provided");
      return res.status(400).json({ message: "Credential is required" });
    }

    // Verify the Google credential (you might want to use Google's token verification)
    // For now, we'll decode the JWT to get user info
    let payload;
    try {
      const parts = credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }
      payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      console.log("Decoded payload:", { googleId: payload.sub, email: payload.email, name: payload.name });
    } catch (decodeError) {
      console.log("Error decoding JWT:", decodeError);
      return res.status(400).json({ message: "Invalid credential" });
    }

    const { sub: googleId, name: displayName, email, picture: profilePic } = payload;

    if (!googleId || !email) {
      console.log("Missing googleId or email in payload");
      return res.status(400).json({ message: "Invalid credential data" });
    }

    console.log("Looking for existing user with googleId:", googleId);
    let user = await User.findOne({ googleId });

    if (!user) {
      console.log("User not found, checking for existing email:", email);
      // Check if user exists with same email
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log("Linking Google account to existing user");
        // Link Google account to existing user
        existingUser.googleId = googleId;
        existingUser.profilePic = profilePic || existingUser.profilePic;
        await existingUser.save();
        user = existingUser;
      } else {
        console.log("Creating new user");
        // Create new user
        user = new User({
          googleId,
          fullName: displayName,
          email,
          profilePic: profilePic || "",
        });
        await user.save();
      }
    } else {
      console.log("Found existing Google user");
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate JWT token
    console.log("Generating token for user:", user._id);
    generateToken(user._id, res);

    console.log("Google sign-in successful");
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in Google sign-in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
