import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    preferences: {
      darkMode: { type: Boolean, default: true },
      saveHistory: { type: Boolean, default: true },
      language: {
        type: String,
        enum: ["English", "Hindi", "French"],
        default: "English",
      },
      tone: {
        type: String,
        enum: ["Balanced", "Friendly", "Professional", "Concise"],
        default: "Balanced",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
