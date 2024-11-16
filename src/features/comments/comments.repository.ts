import { CommentEntityModel, CommentInputModel, CommentViewModel } from "./models/comments.models";
import { CommentModel } from "../../db/models/Comment.model";
import { CommentViewDto } from "./dto";

export const commentsRepository = {
  async find(id: string): Promise<CommentViewModel | null> {
    const commentFromDb = await CommentModel.findOne({ _id: id });

    if (!commentFromDb) {
      return null;
    }
    return CommentViewDto.mapToView(commentFromDb);
  },
  async create(payload: CommentEntityModel): Promise<string> {
    const comment = new CommentModel(payload);
    const result = await comment.save();
    return result.id;
  },
  async update(id: string, payload: CommentInputModel): Promise<boolean> {
    const result = await CommentModel.updateOne(
      { _id: id },
      {
        $set: {
          content: payload.content,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },
};
