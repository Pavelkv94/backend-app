import { LikeModel } from "../../db/models/Like.model";
import { likeRepository, LikeRepository } from "./like.repository";
import { LikeDocument, LikeInputModel, LikeStatusType } from "./models/like.model";

export class LikeService {
  constructor(public likeRepository: LikeRepository) {}

  async findLike(userId: string, commentId: string): Promise<LikeDocument | null> {
    const like = this.likeRepository.findLike(userId, commentId);

    return like;
  }

  async createLike(userId: string, commentId: string, likeStatus: LikeStatusType): Promise<boolean> {
    const newLike = {
      user_id: userId,
      parent_id: commentId,
      status: likeStatus,
      updatedAt: new Date().toISOString(),
    };
    const like = new LikeModel(newLike);

    const likeId = await this.likeRepository.save(like);

    return !!likeId;
  }

  async updateLike(like: LikeDocument, likeStatus: LikeStatusType): Promise<boolean> {
    like.status = likeStatus;
    like.updatedAt = new Date().toISOString();

    const likeId = await this.likeRepository.save(like);

    return !!likeId;
  }
}

export const likeService = new LikeService(likeRepository);
