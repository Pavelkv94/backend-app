import { BlogDbType } from "./blog-db-type";
import { PostDbType } from "./post-db-type";
import { VideoDBType } from "./video-db-type";

export type DBType = {
  // типизация базы данных (что мы будем в ней хранить)
  videos: VideoDBType[];
  blogs: BlogDbType[];
  posts: PostDbType[];
};

export type ReadonlyDBType = {
  // тип для dataset
  blogs: Readonly<BlogDbType[]>;
  posts: Readonly<PostDbType[]>;
  videos: Readonly<VideoDBType[]>;
};

export const db: DBType = {
  // создаём базу данных (пока это просто переменная)
  videos: [],
  blogs: [],
  posts: [],
};

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<ReadonlyDBType>) => {
  if (!dataset) {
    // если в функцию ничего не передано - то очищаем базу данных
    db.videos = [];
    db.blogs = [];
    db.posts = [];
    return;
  }

  // если что-то передано - то заменяем старые значения новыми
  db.videos = dataset.videos?.map((b) => ({ ...b })) || db.videos;
  db.blogs = dataset.blogs?.map((b) => ({ ...b })) || db.blogs;
  db.posts = dataset.posts?.map((p) => ({ ...p })) || db.posts;
};
