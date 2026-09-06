
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://orjimichael73_db_user:teaBEq1qZ1151Y7i@eyilzpencluster.0bzuvsl.mongodb.net/?appName=EyilzPenCluster");
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;