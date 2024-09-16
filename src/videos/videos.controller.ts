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

  if (video.title?.trim() === "" || !video.title || video.title.length > 40) {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "title",
    });
  }

  if (video.author?.trim() === "" || !video.author || video.author.length > 20) {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "author",
    });
  }

  if (!Array.isArray(video.availableResolutions) || video.availableResolutions.find((p) => !Resolutions[p])) {
    errors.errorsMessages.push({
      message: "error!!!!",
      field: "availableResolutions",
    });
  }

  return errors;
};

const inputUpdateValidation = (video: InputUpdateVideoType) => {
  const errors: OutputErrorsType = {
    // объект для сбора ошибок
    errorsMessages: [],
  };
  // ...

  if (video.author?.trim() === "" || !video.author || video.author.length > 20) {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "author",
    });
  }
  if (video.title?.trim() === "" || !video.title || video.title.length > 40) {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "title",
    });
  }

  if (typeof video.canBeDownloaded !== "boolean") {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "canBeDownloaded",
    });
  }

  if (typeof video.publicationDate !== "string") {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "publicationDate",
    });
  }

  if (video.minAgeRestriction && (video.minAgeRestriction > 18 || video.minAgeRestriction < 1)) {
    errors.errorsMessages.push({
      message: "Invalid value",
      field: "minAgeRestriction",
    });
  }

  if (!Array.isArray(video.availableResolutions) || video.availableResolutions.find((p) => !Resolutions[p])) {
    errors.errorsMessages.push({
      message: "error!!!!",
      field: "availableResolution",
    });
  }

  return errors;
};

export const videosController = {
  async getVideos(req: Request, res: Response<OutputVideoType[]>) {
    const videos = db.videos; // получаем видео из базы данных

    res.status(200).json(videos); // отдаём видео в качестве ответа
  },
  async getVideo(req: Request<ParamVideoType>, res: Response<OutputVideoType>) {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    if (!video) {
      res.sendStatus(404);
    }

    res.status(200).json(video); // отдаём видео в качестве ответа
  },
  async createVideo(req: Request<{}, {}, InputVideoType>, res: Response<OutputVideoType | OutputErrorsType>) {
    const errors = inputValidation(req.body);
    if (errors.errorsMessages.length) {
      // если есть ошибки - отправляем ошибки
      res.status(400).json(errors);
      return;
    }
    const payload = req.body;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newVideo: ViewVideoType = {
      id: +new Date() + Math.random(),
      title: payload.title,
      author: payload.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: tomorrow.toISOString(),
      availableResolutions: payload.availableResolutions,
    };

    db.videos = [...db.videos, newVideo];

    res.status(201).json(newVideo);
  },
  async updateVideo(req: Request<ParamVideoType, {}, InputUpdateVideoType>, res: Response) {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    const errors = inputUpdateValidation(req.body);
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
  async deleteVideo(req: Request<ParamVideoType>, res: Response) {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    if (!video) {
      res.sendStatus(404);
      return;
    }

    db.videos = db.videos.filter((video) => video.id !== +req.params.id);
    res.sendStatus(204);
  },
};
