import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ENDPOINTS } from "./constants/endpoints";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/imageRoutes";
import { errorHandler } from "./middleware/errorHandler";
import mongoose from "mongoose";
import { MESSAGES } from "./constants/messages";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  ENDPOINTS.UPLOADS.STATIC_ROUTE,
  express.static(ENDPOINTS.UPLOADS.DIRECTORY),
);
app.use(ENDPOINTS.AUTH.BASE, authRoutes);
app.use(ENDPOINTS.IMAGES.BASE, imageRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(MESSAGES.MONGODB_CONNECTED);
    app.listen(PORT, () => console.log(`${MESSAGES.SERVER_RUNNING} ${PORT}`));
  })
  .catch((error) => console.error(error));
