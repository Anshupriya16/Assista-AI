import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New chat",
      trim: true,
    },
    message: { type: String, required: true, trim: true },
    reply: { type: String, required: true },
    provider: {
      type: String,
      default: "local",
      trim: true,
    },
    model: {
      type: String,
      default: "assista-local",
      trim: true,
    },
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, conversationId: 1, createdAt: -1 });

export default mongoose.model("Chat", chatSchema);
