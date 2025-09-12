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
      required: function() {
        return !this.googleId; // Password required only if not a Google user
      },
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
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
