import express from "express";

import bodyParser from "body-parser";

import mongoose from "mongoose";

import cors from "cors";

import dotenv from "dotenv";

import multer from "multer";

import helmet from "helmet";

import morgan from "morgan";

import path from "path";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//App setup

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));

app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cors());

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

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
