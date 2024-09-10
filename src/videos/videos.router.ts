import { Router } from "express";
import { videosController } from "./videos.controller";

export const videoRouter = Router();

videoRouter.get("/", videosController.getVideos);
videoRouter.post("/", videosController.createVideo)