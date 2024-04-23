import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log("Connected to DB");
    });
  } catch (error) {
    console.log("Error connecting to database", error);
  }
}
