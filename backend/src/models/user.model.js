import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password required only if not a Google user
      },
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    // For clients: which lawyer they are assigned to
    assignedLawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but enforces uniqueness for non-null
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
