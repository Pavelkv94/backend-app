import express from "express";
import cors from "cors";
import { videosRouter } from "./features/videos/videos.router";
import { SETTINGS } from "./settings";
import { setDB } from "./db/db";
import { postsRouter } from "./features/posts/posts.router";
import { testingRouter } from "./features/testing/testing.router";
import { blogsRouter } from "./features/blogs";

export const app = express(); // создать приложение

app.use(express.json()); // создание свойств-объектов body и query во всех реквестах
app.use(cors()); // разрешить любым фронтам делать запросы на наш бэк

app.get("/", (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: "1.1" });
});

app.use(SETTINGS.PATH.VIDEOS, videosRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING, testingRouter);

app.delete("/testing/all-data", (req, res) => {
  setDB();
  res.sendStatus(204);
});
