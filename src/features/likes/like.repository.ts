import { LikeModel } from "../../db/models/Like.model";
import { LikeDocument } from "./models/like.model";

export class LikeRepository {
  async findLike(userId: string, commentId: string): Promise<LikeDocument | null> {
    const like = await LikeModel.findOne({ user_id: userId, parent_id: commentId });

    if(!like) {
      return null
    }
    return like 
  }
  async save(like: LikeDocument) {
    const result = await like.save();

    return result.id;
  }
}

export const likeRepository = new LikeRepository();
