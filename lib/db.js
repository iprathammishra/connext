import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connection successfully established.");
  } catch (error) {
    throw new Error("Error connecting to mongoose: " + error);
  }
};

export default connectDB;
