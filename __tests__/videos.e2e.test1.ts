import { req } from "./helpers/test-helpers";
// import {dataset1} from './datasets'
import { SETTINGS } from "../src/settings";
// import { setDB } from "../src/db/db";
import { Resolutions } from "../src/db/video-db-type";
import { InputVideoModel } from "../src/input-output-types/video-types";
import { MongoMemoryServer } from "mongodb-memory-server";
import { clearDB, runDB } from "../src/db/db";
// import { dataset1 } from "./helpers/datasets";

describe("/videos", () => {
  let client: MongoMemoryServer;

  beforeAll(async () => {
    // запуск виртуального сервера с временной бд
    client = await MongoMemoryServer.create();

    const uri = client.getUri();

    await runDB(uri);
    // await req.delete(SETTINGS.PATH.TESTING + "/all-data");
    clearDB();
  });

  afterAll(async () => {
    await client.stop();
  });

  it("temp", async () => {
    expect(1).toBe(1);
  });

  // it("should get object", async () => {
  //   const res = await req.get("/").expect(200); // проверяем наличие эндпоинта
  // });

  // it("should get object", async () => {
  //   const res = await req.get("/").expect(200); // проверяем наличие эндпоинта
  // });

  // it("should get empty array", async () => {
  //   setDB(); // очистка базы данных если нужно

  //   const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200); // проверяем наличие эндпоинта

  //   expect(res.body.length).toBe(0); // проверяем ответ эндпоинта
  // });
  // it("should get not empty array", async () => {
  //   setDB(dataset1); // заполнение базы данных начальными данными если нужно

  //   const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);

  //   expect(res.body.length).toBe(1);
  //   expect(res.body[0]).toEqual(dataset1.videos[0]);
  // });

  // it("should create video", async () => {
  //   setDB();
  //   const newVideo: InputVideoModel = {
  //     title: "t1",
  //     author: "a1",
  //     availableResolutions: [Resolutions.P144],
  //   };

  //   const createResponse = await req
  //     .post(SETTINGS.PATH.VIDEOS)
  //     .send(newVideo) // отправка данных
  //     .expect(201);

  //   expect(createResponse.body.availableResolutions).toEqual(newVideo.availableResolutions);

  //   const getVideosResponse = await req.get(SETTINGS.PATH.VIDEOS).expect(200); // проверка на ошибку

  //   expect(getVideosResponse.body.length).toBe(1);

  //   const getVideoResponse = await req.get(`${SETTINGS.PATH.VIDEOS}/${createResponse.body.id}`).expect(200); // проверка на ошибку
  // });

  // it("shouldn't create video", async () => {
  //   setDB();
  //   const newVideo = {
  //     title: "",
  //     author: "",
  //     availableResolutions: null,
  //   };

  //   const res = await req
  //     .post(SETTINGS.PATH.VIDEOS)
  //     .send(newVideo) // отправка данных
  //     .expect(400);

  //   expect(res.body.errorsMessages.length).toBe(3);
  // });

  // it("shouldn't find", async () => {
  //   setDB(dataset1);

  //   const res = await req.get(SETTINGS.PATH.VIDEOS + "/1").expect(404); // проверка на ошибку
  // });

  // it("should get video by id", async () => {
  //   setDB();

  //   // Создаем новое видео
  //   const newVideo: InputVideoModel = {
  //     title: "t1",
  //     author: "a1",
  //     availableResolutions: [Resolutions.P144],
  //   };

  //   const createResponse = await req.post(SETTINGS.PATH.VIDEOS).send(newVideo).expect(201);

  //   const videoId = createResponse.body.id; // Получаем ID созданного видео

  //   // Получаем видео по ID
  //   const getResponse = await req.get(`${SETTINGS.PATH.VIDEOS}/${videoId}`).expect(200);

  //   expect(getResponse.body).toEqual(createResponse.body);
  // });

  // it("should delete video by id", async () => {
  //   setDB();

  //   // Создаем новое видео
  //   const newVideo: InputVideoModel = {
  //     title: "t1",
  //     author: "a1",
  //     availableResolutions: [Resolutions.P144],
  //   };

  //   const createResponse = await req.post(SETTINGS.PATH.VIDEOS).send(newVideo).expect(201);

  //   const videoId = createResponse.body.id; // Получаем ID созданного видео

  //   const deleteResponse = await req.delete(`${SETTINGS.PATH.VIDEOS}/${videoId}`).expect(204);

  //   const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200); // проверяем наличие эндпоинта

  //   expect(res.body.length).toBe(0); // проверяем ответ эндпоинта
  // });
  // it("shouldn't delete video by id", async () => {
  //   setDB();

  //   const deleteResponse = await req.delete(`${SETTINGS.PATH.VIDEOS}/1}`).expect(404);

  //   const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200); // проверяем наличие эндпоинта

  //   expect(res.body.length).toBe(0); // проверяем ответ эндпоинта
  // });

  // it("should update video by id", async () => {
  //   setDB();

  //   // Создаем новое видео
  //   const newVideo: InputVideoModel = {
  //     title: "t1",
  //     author: "a1",
  //     availableResolutions: [Resolutions.P144],
  //   };

  //   const createResponse = await req.post(SETTINGS.PATH.VIDEOS).send(newVideo).expect(201);

  //   const videoId = createResponse.body.id; // Получаем ID созданного видео

  //   const updatedVideo = {
  //     title: "t2",
  //     author: "a2",
  //     availableResolutions: [Resolutions.P1080],
  //     canBeDownloaded: false,
  //     minAgeRestriction: 2,
  //     publicationDate: new Date().toISOString(),
  //   };

  //   const updateResponse = await req.put(`${SETTINGS.PATH.VIDEOS}/${videoId}`).send(updatedVideo).expect(204);

  //   const updateResponseFailed = await req
  //     .put(`${SETTINGS.PATH.VIDEOS}/${videoId + 1}`)
  //     .send(updatedVideo)
  //     .expect(404);

  //   const getResponse = await req.get(`${SETTINGS.PATH.VIDEOS}/${videoId}`).expect(200);

  //   expect(updatedVideo.title).toEqual(getResponse.body.title);
  //   expect(updatedVideo.author).toEqual(getResponse.body.author);
  //   expect(updatedVideo.availableResolutions).toEqual(getResponse.body.availableResolutions);
  //   expect(updatedVideo.canBeDownloaded).toEqual(getResponse.body.canBeDownloaded);
  //   expect(updatedVideo.minAgeRestriction).toEqual(getResponse.body.minAgeRestriction);
  //   expect(updatedVideo.publicationDate).toEqual(getResponse.body.publicationDate);
  // });

  // it("shouldn't update video by id", async () => {
  //   setDB();

  //   // Создаем новое видео
  //   const newVideo = {
  //     title: "t1",
  //     author: "a1",
  //     availableResolutions: [Resolutions.P144],
  //   };

  //   const createResponse = await req.post(SETTINGS.PATH.VIDEOS).send(newVideo).expect(201);

  //   const videoId = createResponse.body.id; // Получаем ID созданного видео

  //   const updatedVideo = {
  //     title: null,
  //     author: "a2",
  //     availableResolutions: [Resolutions.P1080],
  //     canBeDownloaded: false,
  //     minAgeRestriction: 2,
  //     publicationDate: new Date().toISOString(),
  //   };

  //   const updateResponse = await req.put(`${SETTINGS.PATH.VIDEOS}/${videoId}`).send(updatedVideo).expect(400);
  //   expect(updateResponse.body.errorsMessages.length).toBe(1);
  // });

  // it("should delete all data", async () => {
  //   setDB();

  //   const deleteResponse = await req.delete(`/testing/all-data`).expect(204);

  //   const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200); // проверяем наличие эндпоинта

  //   expect(res.body.length).toBe(0); // проверяем ответ эндпоинта
  // });
});
