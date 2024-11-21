import { CommentModel } from "../../../db/models/Comment.model";
import { OutputDataWithPagination } from "../../../types/common-types";
import { CommentValidQueryModel, CommentViewModel } from "../models/comments.models";
import { CommentViewDto } from "./dto";

export class CommentQueryRepository {
  async findAllComments(id: string, query: CommentValidQueryModel): Promise<OutputDataWithPagination<CommentViewModel>> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    const filter: any = { postId: id };

    const commentsFromDb = await CommentModel.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const commentsView = CommentViewDto.mapToViewArray(commentsFromDb);

    const commentsCount = await this.getCommentsCount(id);

    return {
      pagesCount: Math.ceil(commentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: commentsCount,
      items: commentsView,
    };
  }
  async findComment(id: string): Promise<CommentViewModel | null> {
    const commentFromDb = await CommentModel.findOne({ _id: id });

    if (!commentFromDb) {
      return null;
    }
    return CommentViewDto.mapToView(commentFromDb);
  }
  async getCommentsCount(id: string) {
    const filter: any = { postId: id };

    return await CommentModel.countDocuments(filter);
  }
}

export const commentQueryRepository = new CommentQueryRepository();
