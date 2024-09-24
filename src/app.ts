import express from "express";
import cors from "cors";
import { SETTINGS } from "./settings";
import { postsRouter } from "./routers/posts.router";
import { testingRouter } from "./routers/testing.router";
import { blogsRouter } from "./routers/blogs.router";
import dotenv from "dotenv";
import { runDB } from "./db/db";

const url = process.env.MONGO_URL || "mongodb://0.0.0.0:27017"
export const app = express();

dotenv.config()

runDB(url)
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ version: "1.1" });
});

app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);
