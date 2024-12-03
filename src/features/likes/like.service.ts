import { LikeModel } from "../../db/models/Like.model";
import { userRepository, UserRepository } from "../users/repositories/users.repository";
import { likeRepository, LikeRepository } from "./like.repository";
import { LikeDocument, LikeStatusType } from "./models/like.model";

export class LikeService {
  constructor(private likeRepository: LikeRepository, private userRepository: UserRepository) {}

  async findLike(userId: string, parent_id: string): Promise<LikeDocument | null> {
    const like = this.likeRepository.findLike(userId, parent_id);

    return like;
  }

  async createLike(userId: string, parent_id: string, likeStatus: LikeStatusType): Promise<boolean> {
    
    const user = await this.userRepository.findUserById(userId);

    const newLike = {
      user_id: userId,
      user_login: user?.login,
      parent_id: parent_id,
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

export const likeService = new LikeService(likeRepository, userRepository);
