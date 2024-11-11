import { MongoClient } from "mongodb";
import { BlogEntityModel } from "../features/blogs/models/blogs.models";
import { PostEntityModel } from "../features/posts/models/posts.models";
import { UserEntityModel } from "../features/users/models/users.models";
import { CommentEntityModel } from "../features/comments/models/comments.models";
import { TokenEntityModel } from "../adapters/jwt/models/jwt.models";
import { ApiLogEntityModel } from "../features/apiLogs/models/apiLog.model";

export const db = {
  client: {} as MongoClient,
  getDbName() {
    return this.client.db(process.env.DB_NAME);
  },
  async run(url: string) {
    try {
      this.client = new MongoClient(url);
      await this.client.connect();
      await this.getDbName().command({ ping: 1 });
      console.log("connected to MongoDB");
    } catch (error) {
      await this.client.close();
      console.log(`Mongo connect Error: ${error}`);
    }
  },
  async stop() {
    await this.client.close();
    console.log("Mongo connection closed");
  },
  async drop() {
    try {
      const collections = await this.getDbName().listCollections().toArray();

      for (const collection of collections) {
        const collectionName = collection.name;
        await this.getDbName().collection(collectionName).deleteMany({});
      }
    } catch (error) {
      console.log("Mongo drop db Error: " + error);
      await this.stop();
    }
  },
  async dropCollection(collectionName: string) {
    try {
      await this.getDbName().collection(collectionName).deleteMany({});
    } catch (error) {
      console.log("Mongo drop collection Error: " + error);
      await this.stop();
    }
  },
  getCollections() {
    return {
      blogsCollection: this.getDbName().collection<BlogEntityModel>("blogs"),
      postsCollection: this.getDbName().collection<PostEntityModel>("posts"),
      usersCollection: this.getDbName().collection<UserEntityModel>("users"),
      commentsCollection: this.getDbName().collection<CommentEntityModel>("comments"),
      tokensBlackListCollection: this.getDbName().collection<TokenEntityModel>("blackTokens"),
      apiLogsCollection: this.getDbName().collection<ApiLogEntityModel>("apiLogs"),

    };
  },
};
