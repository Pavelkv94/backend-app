import { CommentModel } from "../../../db/models/Comment.model";
import { LikeModel } from "../../../db/models/Like.model";
import { OutputDataWithPagination } from "../../../types/common-types";
import { CommentValidQueryModel, CommentViewModel } from "../models/comments.models";
import { CommentViewDto } from "./dto";

export class CommentQueryRepository {
  async findAllComments(id: string, query: CommentValidQueryModel, userId: string | null): Promise<OutputDataWithPagination<CommentViewModel>> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    const filter: any = { postId: id };

    const commentsFromDb = await CommentModel.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

      
    const commentsView = await Promise.all(
      commentsFromDb.map(async (comment) => {
        const filter = userId ? { user_id: userId, parent_id: comment.id } : { parent_id: comment.id };

        const like = await LikeModel.findOne(filter);
        const likes = await LikeModel.find({});

        const myStatus = like && like.user_id === userId ? like.status : "None";
        return CommentViewDto.mapToView(comment, myStatus);
      })
    );
    const commentsCount = await this.getCommentsCount(id);

    return {
      pagesCount: Math.ceil(commentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: commentsCount,
      items: commentsView,
    };
  }
  async findComment(id: string, userId: string | null): Promise<CommentViewModel | null> {
    const commentFromDb = await CommentModel.findOne({ _id: id });

    if (!commentFromDb) {
      return null;
    }

    const likeFilter = userId ? { user_id: userId, parent_id: commentFromDb.id } : { parent_id: commentFromDb.id };

    const like = await LikeModel.findOne(likeFilter);

    const myStatus = like && like.user_id === userId ? like.status : "None";

    return CommentViewDto.mapToView(commentFromDb, myStatus);
  }
  async getCommentsCount(id: string) {
    const filter: any = { postId: id };

    return await CommentModel.countDocuments(filter);
  }
}

export const commentQueryRepository = new CommentQueryRepository();
