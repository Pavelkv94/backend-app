import { Collection, Db, MongoClient } from "mongodb";
import { BlogDbType } from "./blog-db-type";
import { PostDbType } from "./post-db-type";

export type DBType = {
  blogs: BlogDbType[];
  posts: PostDbType[];
};

export type ReadonlyDBType = {
  blogs: Readonly<BlogDbType[]>;
  posts: Readonly<PostDbType[]>;
};

export let db: Db;

export let blogCollection: Collection<BlogDbType>;
export let postCollection: Collection<PostDbType>;

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

export const clearDB = async () => {
  await postCollection.drop();
  await blogCollection.drop();
};

export const clearBlogs = async () => {
  await blogCollection.drop();
};

export const clearPosts = async () => {
  await postCollection.drop();
};
