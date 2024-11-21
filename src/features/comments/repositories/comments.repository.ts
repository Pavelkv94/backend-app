import { CommentModel } from "../../../db/models/Comment.model";
import { CommentDocument, CommentViewModel } from "../models/comments.models";

export class CommentRepository {
  async findComment(id: string): Promise<CommentDocument | null> {
    const commentDocument = await CommentModel.findOne({ _id: id });

    if (!commentDocument) {
      return null;
    }
    return commentDocument;
  }
  async save(comment: CommentDocument): Promise<string> {
    const result = await comment.save();
    return result.id;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export const commentRepository = new CommentRepository();
