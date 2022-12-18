import express from "express";

import bodyParser from "body-parser";

import mongoose from "mongoose";

import cors from "cors";

import dotenv from "dotenv";

import multer from "multer";

import helmet from "helmet";

import morgan from "morgan";

import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "it is working" });
});

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(process.env.MONGO_URI);
    console.log(`${error}. Couldn't connect to the database`);
  });
