import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not set in .env.");
    }

    if (uri.includes("<db_password>") || uri.includes("<password>")) {
      throw new Error(
        "Invalid MONGO_URI in .env. Replace <db_password> or <password> with your actual MongoDB password."
      );
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return true;
  } catch (err) {
    if (
      err.message &&
      (err.message.includes("bad auth") || err.message.includes("authentication failed"))
    ) {
      console.error(
        "MongoDB authentication failed: check your MONGO_URI username/password in .env."
      );
    } else {
      console.error("MongoDB connection failed:", err.message || err);
    }
    return false;
  }
};

export default connectDB;
