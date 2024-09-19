import { Request, Response } from "express";
import { InputUpdateVideoType, InputVideoModel, OutputVideoType, ParamVideoType } from "../../input-output-types/video-types";
import { OutputErrorsType } from "../../input-output-types/output-errors-types";
import { Resolutions } from "../../db/video-db-type";
import { videosRepository } from "./videos.repository";

const inputValidation = (video: InputVideoModel) => {
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
    const videos = await videosRepository.findVideos(); // получаем видео из базы данных
    res.status(200).json(videos); // отдаём видео в качестве ответа
  },
  async getVideo(req: Request<ParamVideoType>, res: Response<OutputVideoType>) {
    const video = await videosRepository.findVideo(+req.params.id);
    if (!video) {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(video); // отдаём видео в качестве ответа
  },
  async createVideo(req: Request<{}, {}, InputVideoModel>, res: Response<OutputVideoType | OutputErrorsType>) {
    const errors = inputValidation(req.body);
    if (errors.errorsMessages.length) {
      res.status(400).json(errors);
      return;
    }
    const newVideo = await videosRepository.create(req.body);
    res.status(201).json(newVideo);
  },
  async updateVideo(req: Request<ParamVideoType, {}, InputUpdateVideoType>, res: Response) {
    const errors = inputUpdateValidation(req.body);
    if (errors.errorsMessages.length) {
      res.status(400).json(errors);
      return;
    }
    const isUpdated = await videosRepository.updateVideo(+req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  async deleteVideo(req: Request<ParamVideoType>, res: Response) {
    const isDeleted = await videosRepository.deleteVideo(+req.params.id);

    if (!isDeleted) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
};
