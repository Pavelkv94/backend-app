import { Router } from "express";
import { videosController } from "../constrollers/videos.controller";

export const videosRouter = Router();

videosRouter.get("/", videosController.getVideos);
videosRouter.get("/:id", videosController.getVideo);
videosRouter.post("/", videosController.createVideo);
videosRouter.put("/:id", videosController.updateVideo);
videosRouter.delete("/:id", videosController.deleteVideo);
