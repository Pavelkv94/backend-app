import { injectable } from "inversify";
import { LikeModel } from "../../db/models/Like.model";
import { LikeDocument } from "./models/like.model";

@injectable()
export class LikeRepository {
  async findLike(userId: string, parent_id: string): Promise<LikeDocument | null> {
    const like = await LikeModel.findOne({ user_id: userId, parent_id: parent_id });

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