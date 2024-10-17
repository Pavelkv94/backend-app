import { ObjectId, WithId } from "mongodb";
import { db } from "../../db/db";
import { CommentEntityModel, CommentValidQueryModel, CommentViewModel } from "./models/comments.models";
import { OutputDataWithPagination } from "../../types/common-types";

export const commentQueryRepository = {
  async findAllComments(id: string, query: CommentValidQueryModel): Promise<OutputDataWithPagination<CommentViewModel>> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    const filter: any = { postId: id };

    const commentsFromDb = await db
      .getCollections()
      .commentsCollection.find(filter, { projection: { postId: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const commentsView = this.mapCommentsToOutput(commentsFromDb);

    const commentsCount = await this.getCommentsCount(id);

    return {
      pagesCount: Math.ceil(commentsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: commentsCount,
      items: commentsView,
    };
  },
  async findComment(id: string): Promise<CommentViewModel | null> {
    const objectId = new ObjectId(id);
    const commentFromDb = await db.getCollections().commentsCollection.findOne({ _id: objectId }, { projection: { postId: 0 } });

    if (!commentFromDb) {
      return null;
    } else {
      const comment = { ...commentFromDb, id: commentFromDb._id.toString() };
      const { _id, ...rest } = comment;
      return rest;
    }
  },
  async getCommentsCount(id: string) {
    const filter: any = { postId: id };

    return await db.getCollections().commentsCollection.countDocuments(filter);
  },
  mapCommentsToOutput(comments: WithId<CommentEntityModel>[]): CommentViewModel[] {
    return comments.map((blog) => ({ ...blog, id: blog._id.toString() })).map(({ _id, ...rest }) => rest);
  },
};
