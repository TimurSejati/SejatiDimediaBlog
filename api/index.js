import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import post2Routes from "./routes/post2.route.js";
import commentRoutes from "./routes/comment.route.js";
import categoryRoutes from "./routes/category.route.js";
import tagRoutes from "./routes/tag.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();
app.use(
  // cors({
  //   origin: "http://localhost:5173",
  //   credentials: true,
  //   methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  // })
  cors({
    origin: "https://sejatidimedia-blog.vercel.app",
    credentials: true,
    methods: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  })
);

app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/post2", post2Routes);
app.use("/api/comment", commentRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/tag", tagRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
