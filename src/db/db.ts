import { Collection, Db, MongoClient } from "mongodb";
import { BlogDbType } from "./blog-db-type";
import { PostDbType } from "./post-db-type";
import { VideoDBType } from "./video-db-type";

export type DBType = {
  videos: VideoDBType[];
  blogs: BlogDbType[];
  posts: PostDbType[];
};

export type ReadonlyDBType = {
  blogs: Readonly<BlogDbType[]>;
  posts: Readonly<PostDbType[]>;
  videos: Readonly<VideoDBType[]>;
};

export let db: Db;

export let blogCollection: Collection<BlogDbType>;
export let postCollection: Collection<PostDbType>;

// проверка подключения к бд
export const runDB = async (url: string) => {
  const client: MongoClient = new MongoClient(url);
  db = client.db(process.env.DB_NAME);

  blogCollection = db.collection<BlogDbType>("blogs");
  postCollection = db.collection<PostDbType>("posts");

  try {
    console.log("connected to MongoDB");
    await client.connect();
    return true;
  } catch (e) {
    console.log(e);
    await client.close();
    return false;
  }
};

// export const db: DBType = {
//   videos: [],
//   blogs: [],
//   posts: [],
// };

export const clearDB = async () => {
  await postCollection.drop();
  await blogCollection.drop();
};
