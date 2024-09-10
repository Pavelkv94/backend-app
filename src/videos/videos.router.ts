import { Router } from "express";
import { videosController } from "./videos.controller";

export const videoRouter = Router();

videoRouter.get("/", videosController.getVideos);
videoRouter.get("/:id", videosController.getVideo);
videoRouter.post("/", videosController.createVideo);
videoRouter.put("/:id", videosController.updateVideo);
videoRouter.delete("/:id", videosController.deleteVideo);
