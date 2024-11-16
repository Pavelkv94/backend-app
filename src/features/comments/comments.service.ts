import { ResultObject, ResultStatus } from "../../types/common-types";
import { MeViewModel } from "../auth/models/auth.models";
import { commentsRepository } from "./comments.repository";
import { CommentEntityModel, CommentInputModel } from "./models/comments.models";

export const commentsService = {
  async createComment(post_id: string, payload: CommentInputModel, user: MeViewModel): Promise<string> {
    const newComment: CommentEntityModel = {
      postId: post_id,
      content: payload.content,
      commentatorInfo: {
        userId: user.userId,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    };
    const commentId = await commentsRepository.create(newComment);

    return commentId;
  },
  async updateComment(id: string, payload: CommentInputModel, userId: string): Promise<ResultObject<boolean | null>> {
    const comment = await commentsRepository.find(id);

    const isOwner = comment!.commentatorInfo.userId === userId;

    if (!isOwner) {
      return {
        status: ResultStatus.FORBIDDEN,
        errorMessage: "Access forbidden",
        data: null,
      };
    }

    const isUpdated = await commentsRepository.update(id, payload);

    return {
      status: isUpdated ? ResultStatus.SUCCESS : ResultStatus.FORBIDDEN,
      data: isUpdated,
    };
  },
  async deleteComment(id: string, userId: string): Promise<ResultObject<boolean | null>> {
    const comment = await commentsRepository.find(id);

    const isOwner = comment!.commentatorInfo.userId === userId;

    if (!isOwner) {
      return {
        status: ResultStatus.FORBIDDEN,
        errorMessage: "Access forbidden",
        data: null,
      };
    }

    const isDeletedComment = await commentsRepository.delete(id);
    return {
      status: isDeletedComment ? ResultStatus.SUCCESS : ResultStatus.FORBIDDEN,
      data: isDeletedComment,
    };
  },
};
