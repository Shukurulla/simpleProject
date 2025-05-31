import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import UserRouter from "./routes/user.routes.js";
config();

const app = express();
const port = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI;
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(mongo_uri).then(() => {
  console.log("Database connected");
});

app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`Server has ben started on port - ${port}`);
});
