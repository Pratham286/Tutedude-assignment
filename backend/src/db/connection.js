import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/PrathamDB`);
    // console.log(`MongoDB connected at ${connectionInstance.connection.host}`);
    console.log(`MongoDB connected successfully`);
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1) // Provided by Node
  }
};