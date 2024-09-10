import { req } from "./test-helpers";
// import {dataset1} from './datasets'
import { SETTINGS } from "../src/settings";
import { setDB } from "../src/db/db";
import { dataset1 } from "./datasets";
import { InputVideoType } from "../src/input-output-types/video-types";
import { Resolutions } from "../src/db/video-db-type";

describe("/videos", () => {
  beforeAll(async () => {
    // очистка базы данных перед началом тестирования
    setDB();
  });

  it("should get empty array", async () => {
    setDB(); // очистка базы данных если нужно

    const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200); // проверяем наличие эндпоинта

    expect(res.body.length).toBe(0); // проверяем ответ эндпоинта
  });
  it("should get not empty array", async () => {
    setDB(dataset1); // заполнение базы данных начальными данными если нужно

    const res = await req.get(SETTINGS.PATH.VIDEOS).expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toEqual(dataset1.videos[0]);
  });

  it("should create video", async () => {
    setDB();
    const newVideo: InputVideoType = {
      title: "t1",
      author: "a1",
      availableResolutions: [Resolutions.P144],
    };

    const res = await req
      .post(SETTINGS.PATH.VIDEOS)
      .send(newVideo) // отправка данных
      .expect(201);

    expect(res.body.availableResolutions).toEqual(newVideo.availableResolutions);
  });

  it("shouldn't create video", async () => {
    setDB();
    const newVideo: InputVideoType = {
      title: "",
      author: "",
      availableResolutions: [Resolutions.P144],
    };

    const res = await req
      .post(SETTINGS.PATH.VIDEOS)
      .send(newVideo) // отправка данных
      .expect(400);

      expect(res.body.errorsMessages.length).toBe(2);

    console.log(res.body);
  });

  it("shouldn't find", async () => {
    setDB(dataset1);

    const res = await req.get(SETTINGS.PATH.VIDEOS + "/1").expect(404); // проверка на ошибку
  });
});
