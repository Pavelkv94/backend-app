import { CommentModel } from "../../db/models/Comment.model";
import { ResultObject, ResultStatus } from "../../types/common-types";
import { MeViewModel } from "../auth/models/auth.models";
import { LikeDocument, LikeStatusType } from "../likes/models/like.model";
import { CommentEntityModel, CommentInputModel } from "./models/comments.models";
import { commentRepository, CommentRepository } from "./repositories/comments.repository";

export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

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
  async updateCommentLikesCount(commentId: string, likeDocument: LikeDocument | null, newStatus: LikeStatusType): Promise<boolean> {
    const comment = await this.commentRepository.findComment(commentId);

    if (!comment) {
      throw new Error("Something was wrong.");
    }

    const likesCounter = (prevStatus: LikeStatusType, newStatus: LikeStatusType) => {
      if (prevStatus === "Like") comment.likesInfo.likesCount -= 1;
      if (prevStatus === "Dislike") comment.likesInfo.dislikesCount -= 1;
      if (newStatus === "Like") comment.likesInfo.likesCount += 1;
      if (newStatus === "Dislike") comment.likesInfo.dislikesCount += 1;
    };

    if (!likeDocument) {
      //first like
      likesCounter("None", newStatus);
    } else {
      //existing like
      likesCounter(likeDocument.status, newStatus);
    }

    const updatedCommentId = await this.commentRepository.save(comment);

    if (!updatedCommentId) {
      return false;
    }
    return true;
  }
}

export const commentService = new CommentService(commentRepository);
