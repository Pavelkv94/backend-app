import { inject, injectable } from "inversify";
import { CommentModel } from "../../db/models/Comment.model";
import { ResultObject, ResultStatus } from "../../types/common-types";
import { MeViewModel } from "../auth/models/auth.models";
import { LikeService } from "../likes/like.service";
import { LikeDocument, LikeStatusType } from "../likes/models/like.model";
import { CommentDocument, CommentEntityModel, CommentInputModel } from "./models/comments.models";
import { CommentRepository } from "./repositories/comments.repository";

@injectable()
export class CommentService {
  constructor(@inject(CommentRepository) private commentRepository: CommentRepository, @inject(LikeService) private likeService: LikeService) {}

  async createComment(post_id: string, payload: CommentInputModel, user: MeViewModel): Promise<string> {
    const commentDto: CommentEntityModel = {
      postId: post_id,
      content: payload.content,
      commentatorInfo: {
        userId: user.userId,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      },
    };
    const comment = new CommentModel(commentDto);

    const commentId = await this.commentRepository.save(comment);

    return commentId;
  }
  async updateComment(id: string, payload: CommentInputModel, userId: string): Promise<ResultObject<string | null>> {
    const comment = await this.commentRepository.findComment(id);

    if (!comment) {
      return {
        status: ResultStatus.NOT_FOUND,
        errorMessage: "Comment not found",
        data: null,
      };
    }

    const isOwner = comment!.commentatorInfo.userId === userId;

    if (!isOwner) {
      return {
        status: ResultStatus.FORBIDDEN,
        errorMessage: "Access forbidden",
        data: null,
      };
    }
    comment.content = payload.content;

    const updatedCommentId = await this.commentRepository.save(comment);

    return {
      status: updatedCommentId ? ResultStatus.SUCCESS : ResultStatus.FORBIDDEN,
      data: updatedCommentId,
    };
  }
  async deleteComment(id: string, userId: string): Promise<ResultObject<boolean | null>> {
    const comment = await this.commentRepository.findComment(id);

    if (!comment) {
      return {
        status: ResultStatus.NOT_FOUND,
        errorMessage: "Comment not found",
        data: null,
      };
    }

    const isOwner = comment.commentatorInfo.userId === userId;

    if (!isOwner) {
      return {
        status: ResultStatus.FORBIDDEN,
        errorMessage: "Access forbidden",
        data: null,
      };
    }

    const isDeletedComment = await this.commentRepository.delete(id);
    return {
      status: isDeletedComment ? ResultStatus.SUCCESS : ResultStatus.FORBIDDEN,
      data: isDeletedComment,
    };
  }
  private async updateCommentLikesCount(commentId: string, likeDocument: LikeDocument | null, newStatus: LikeStatusType): Promise<boolean> {
    const comment = await this.commentRepository.findComment(commentId);

    if (!comment) {
      throw new Error("Something was wrong.");
    }

    if (!likeDocument) {
      //first like
      this.likesCounter("None", newStatus, comment);
    } else {
      //existing like
      this.likesCounter(likeDocument.status, newStatus, comment);
    }

    const updatedCommentId = await this.commentRepository.save(comment);

    if (!updatedCommentId) {
      return false;
    }
    return true;
  }
  async changeLikeStatus(userId: string, commentId: string, newStatus: LikeStatusType) {
    const likeDocument = await this.likeService.findLike(userId, commentId);

    const isCalculatedCommentLikes = await this.updateCommentLikesCount(commentId, likeDocument, newStatus);

    if (!isCalculatedCommentLikes) {
      throw new Error("Comment likes caclulating is failed");
    }
    if (likeDocument) {
      await this.likeService.updateLike(likeDocument, newStatus);
    } else {
      await this.likeService.createLike(userId, commentId, newStatus);
    }
  }
  private async likesCounter(prevStatus: LikeStatusType, newStatus: LikeStatusType, comment: CommentDocument) {
    if (prevStatus === "Like") comment.likesInfo.likesCount -= 1;
    if (prevStatus === "Dislike") comment.likesInfo.dislikesCount -= 1;
    if (newStatus === "Like") comment.likesInfo.likesCount += 1;
    if (newStatus === "Dislike") comment.likesInfo.dislikesCount += 1;
  }
}
