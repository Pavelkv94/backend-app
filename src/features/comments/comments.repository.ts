import { ObjectId } from "mongodb";
import { db } from "../../db/db";
import { CommentEntityModel, CommentInputModel } from "./models/comments.models";

export const commentsRepository = {
  async find(id: string): Promise<CommentEntityModel | null> {
    const objectId = new ObjectId(id);

    const result = await db.getCollections().commentsCollection.findOne({ _id: objectId });
    return result;
  },
  async create(payload: CommentEntityModel): Promise<string> {
    const result = await db.getCollections().commentsCollection.insertOne(payload);
    return result.insertedId.toString();
  },
  async update(id: string, payload: CommentInputModel): Promise<boolean> {
    const objectId = new ObjectId(id);

    const result = await db.getCollections().commentsCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          content: payload.content,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const objectId = new ObjectId(id);
    const result = await db.getCollections().commentsCollection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  },
};
