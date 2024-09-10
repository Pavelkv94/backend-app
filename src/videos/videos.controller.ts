import { Request, Response } from "express";
import { db } from "../db/db";
import { InputVideoType, OutputVideoType, ViewVideoType } from "../input-output-types/video-types";
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
  if (video.author.trim() === "") {
    errors.errorsMessages.push({
      message: "Not be empty",
      field: "author",
    });
  }
  if (video.title.trim() === "") {
    errors.errorsMessages.push({
      message: "Not be empty!!!!",
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

  createVideo: async (req: Request<{}, InputVideoType>, res: Response) => {
    const errors = inputValidation(req.body);
    if (errors.errorsMessages.length) {
      // если есть ошибки - отправляем ошибки
      res.status(400).json(errors);
      return;
    }
    const payload: InputVideoType = req.body;

    const newVideo: ViewVideoType = {
      id: +new Date() + Math.random(),
      title: payload.title,
      author: payload.title,
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions: payload.availableResolutions,
    };

    db.videos = [...db.videos, newVideo];

    res.status(201).json(newVideo);
  },
};
