import { Request, Response } from "express";
import { db } from "../../db/db";
import { InputUpdateVideoType, InputVideoModel, OutputVideoType, ParamVideoType, ViewVideoType } from "../../input-output-types/video-types";
import { OutputErrorsType } from "../../input-output-types/output-errors-types";
import { Resolutions } from "../../db/video-db-type";


export const postsController = {
  async getPosts(req: Request, res: Response<OutputVideoType[]>) {
    const videos = db.videos; // получаем видео из базы данных

    res.status(200).json(videos); // отдаём видео в качестве ответа
  },
  async getPost(req: Request<ParamVideoType>, res: Response<OutputVideoType>) {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    if (!video) {
      res.sendStatus(404);
    }

    res.status(200).json(video); // отдаём видео в качестве ответа
  },
  async createPost(req: Request<{}, {}, InputVideoModel>, res: Response<OutputVideoType | OutputErrorsType>) {
    // if (errors.errorsMessages.length) {
    //   // если есть ошибки - отправляем ошибки
    //   res.status(400).json(errors);
    //   return;
    // }
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
  async updatePost(req: Request<ParamVideoType, {}, InputUpdateVideoType>, res: Response) {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    // if (errors.errorsMessages.length) {
    //   // если есть ошибки - отправляем ошибки
    //   res.status(400).json(errors);
    //   return;
    // }

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
  async deletePost(req: Request<ParamVideoType>, res: Response) {
    const video = db.videos.find((video) => video.id === +req.params.id); // получаем видео из базы данных

    if (!video) {
      res.sendStatus(404);
      return;
    }

    db.videos = db.videos.filter((video) => video.id !== +req.params.id);
    res.sendStatus(204);
  },
};
