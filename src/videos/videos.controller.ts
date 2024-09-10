import { Request, Response } from "express";
import { db } from "../db/db";
import { InputUpdateVideoType, InputVideoType, OutputVideoType, ParamVideoType, ViewVideoType } from "../input-output-types/video-types";
import { OutputErrorsType } from "../input-output-types/output-errors-types";
import { Resolutions } from "../db/video-db-type";

const inputValidation = (video: InputVideoType) => {
  const errors: OutputErrorsType = {
    // объект для сбора ошибок
    errorsMessages: [],
  };
  // ...
  if (!Array.isArray(video.availableResolutions) || video.availableResolutions.find((p) => !Resolutions[p])) {
    errors.errorsMessages.push({
      message: "error!!!!",
      field: "availableResolution",
    });
  }
  if (video.author.trim() === "" || !video.author) {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "author",
    });
  }
  if (video.title.trim() === "" || !video.title) {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "title",
    });
  }
  return errors;
};

export const videosController = {
  getVideos: async (req: Request, res: Response<OutputVideoType[]>) => {
    const videos = db.videos; // получаем видео из базы данных

    res.status(200).json(videos); // отдаём видео в качестве ответа
  },
  getVideo: async (req: Request<ParamVideoType>, res: Response<OutputVideoType>) => {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    if (!video) {
      res.sendStatus(404);
    }

    res.status(200).json(video); // отдаём видео в качестве ответа
  },
  createVideo: async (req: Request<{}, {}, InputVideoType>, res: Response) => {
    const errors = inputValidation(req.body);
    if (errors.errorsMessages.length) {
      // если есть ошибки - отправляем ошибки
      res.status(400).json(errors);
      return;
    }
    const payload = req.body;

    const newVideo: ViewVideoType = {
      id: +new Date() + Math.random(),
      title: payload.title,
      author: payload.author,
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions: payload.availableResolutions,
    };

    db.videos = [...db.videos, newVideo];

    res.status(201).json(newVideo);
  },
  updateVideo: async (req: Request<ParamVideoType, {}, InputUpdateVideoType>, res: Response) => {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    const errors = inputValidation(req.body);
    if (errors.errorsMessages.length) {
      // если есть ошибки - отправляем ошибки
      res.status(400).json(errors);
      return;
    }
    
    if (!video) {
      res.sendStatus(404);
      return;
    }

    const payload = req.body;

    db.videos = db.videos.map((video) =>
      video.id === +req.params.id
        ? {
            ...video,
            title: payload.title,
            author: payload.author,
            availableResolutions: payload.availableResolutions,
            canBeDownloaded: payload.canBeDownloaded,
            minAgeRestriction: payload.minAgeRestriction,
            publicationDate: payload.publicationDate,
          }
        : video
    );

    res.sendStatus(204); // отдаём видео в качестве ответа
  },
  deleteVideo: async (req: Request<ParamVideoType>, res: Response) => {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    if (!video) {
      res.sendStatus(404);
      return;
    }

    db.videos = db.videos.filter((video) => video.id !== +req.params.id);
    res.sendStatus(204);
  },
};
