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

// const mongoUri = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

// const client = new MongoClient(mongoUri);

// export const coursesCollection = client.db("test").collection<CourseType>("Courses");

// export async function runDb() {
//   try {
//     await client.connect();
//     await client.db("test").command({ ping: 1 });
//     console.log("Log: MongoDB connected!");
//   } catch (error) {
//     console.log(error);
//   }
// }

export const db: DBType = {
  videos: [],
  blogs: [],
  posts: [],
};

export const setDB = (dataset?: Partial<ReadonlyDBType>) => {
  if (!dataset) {
    db.videos = [];
    db.blogs = [];
    db.posts = [];
    return;
  }

  db.videos = dataset.videos?.map((b) => ({ ...b })) || db.videos;
  db.blogs = dataset.blogs?.map((b) => ({ ...b })) || db.blogs;
  db.posts = dataset.posts?.map((p) => ({ ...p })) || db.posts;
};
