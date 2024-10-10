import { ObjectId, WithId } from "mongodb";

import { BlogEntityModel, BlogInputModel, BlogValidQueryModel, BlogViewModel } from "../../input-output-types/blogs-types";
import { db } from "../../db/db";

export const blogsRepository = {
  async findBlog(id: string): Promise<BlogViewModel | null> {
    const objectId = new ObjectId(id);
    const blogFromDb = await db.getCollections().blogsCollection.findOne({ _id: objectId });

    if (!blogFromDb) {
      return null;
    } else {
      const blog = { ...blogFromDb, id: blogFromDb._id.toString() };
      const { _id, ...rest } = blog;
      return rest;
    }
  },

  async createBlog(payload: BlogEntityModel): Promise<string> {
    const result = await db.getCollections().blogsCollection.insertOne(payload);
    return result.insertedId.toString();
  },

  async updateBlog(id: string, payload: BlogInputModel): Promise<boolean> {
    const objectId = new ObjectId(id);

    const result = await db.getCollections().blogsCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          name: payload.name,
          description: payload.description,
          websiteUrl: payload.websiteUrl,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const objectId = new ObjectId(id);
    const result = await db.getCollections().blogsCollection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  },
};
