import express from "express";
import cors from "cors";
import { videosRouter } from "./routers/videos.router";
import { SETTINGS } from "./settings";
import { postsRouter } from "./routers/posts.router";
import { testingRouter } from "./routers/testing.router";
import { blogsRouter } from "./routers/blogs.router";

export const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ version: "1.1" });
});

app.use(SETTINGS.PATH.VIDEOS, videosRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);
