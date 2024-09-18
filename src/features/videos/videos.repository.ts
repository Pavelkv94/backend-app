// ...

import { db } from "../../db/db";
import { VideoDBType } from "../../db/video-db-type";
import { OutputErrorsType } from "../../input-output-types/output-errors-types";
import { InputUpdateVideoType, InputVideoModel, OutputVideoType, ViewVideoType } from "../../input-output-types/video-types";

export const videosRepository = {
  async findVideos(): Promise<VideoDBType[]> {
    const videos = db.videos;
    return videos;
  },
  async findVideo(id: number): Promise<OutputVideoType | null> {
    const video = db.videos.find((video) => video.id === id); // получаем видео из базы данных

    if (video) {
      return video;
    } else {
      return null;
    }
  },
  async create(input: InputVideoModel): Promise<OutputVideoType | OutputErrorsType> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newVideo: OutputVideoType = {
      id: +new Date() + Math.random(),
      title: input.title,
      author: input.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: tomorrow.toISOString(),
      availableResolutions: input.availableResolutions,
    };

    try {
      db.videos = [...db.videos, newVideo];
    } catch (e) {
      console.log(e);
    }

    return newVideo;
  },
  async updateVideo(id: number, payload: InputUpdateVideoType): Promise<boolean> {
    const video = db.videos.find((video) => video.id === id); // получаем видео из базы данных

    if (video) {
      db.videos = db.videos.map((video) =>
        video.id === id
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
      return true;
    }
    return false;
  },
  async deleteVideo(id: number): Promise<boolean> {
    const video = db.videos.find((video) => video.id === id); // получаем видео из базы данных

    if (video) {
      db.videos = db.videos.filter((video) => video.id !== id);
      return true;
    } else {
      return false;
    }
  },
};
