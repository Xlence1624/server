import "dotenv/config";
import express from 'express';
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoute.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoute.js";
import commentRoutes from "./routes/commentRoute.js";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api", commentRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});