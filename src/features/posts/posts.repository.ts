import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { db } from "../../db/db";
import { PostEntityModel, PostInputModel, PostValidQueryModel, PostViewModel } from "./models/posts.models";
import { blogsRepository } from "../blogs/blogs.repository";

export const postsRepository = {
  async findPost(id: string): Promise<PostViewModel | null> {
    const objectId = new ObjectId(id);

    const postFromDb = await db.getCollections().postsCollection.findOne({ _id: objectId });

    if (!postFromDb) {
      return null;
    } else {
      const post = { ...postFromDb, id: postFromDb._id.toString() };
      const { _id, ...rest } = post;
      return rest;
    }
  },
  async createPost(payload: PostEntityModel): Promise<string> {
    const result = await db.getCollections().postsCollection.insertOne(payload);

    return result.insertedId.toString();
  },
  async updatePost(id: string, payload: PostInputModel): Promise<boolean> {
    const blog = await blogsRepository.findBlog(payload.blogId);
    const objectId = new ObjectId(id);

    const result = await db.getCollections().postsCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          title: payload.title,
          shortDescription: payload.shortDescription,
          content: payload.content,
          blogId: payload.blogId,
          blogName: blog!.name,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async deletePost(id: string): Promise<boolean> {
    const objectId = new ObjectId(id);

    const result = await db.getCollections().postsCollection.deleteOne({ _id: objectId });

    return result.deletedCount > 0;
  },
};
