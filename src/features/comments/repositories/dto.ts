import { CommentDocument, CommentViewModel } from "../models/comments.models";

export class CommentViewDto {
  id: string;
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;

  constructor(model: CommentDocument) {
    this.id = model._id.toString();
    this.content = model.content;
    this.postId = model.postId;
    this.content = model.content;
    this.createdAt = model.createdAt;
    this.commentatorInfo = model.commentatorInfo;
  }

  static mapToView(comment: CommentDocument): CommentViewModel {
    return new CommentViewDto(comment);
  }

  static mapToViewArray(comments: CommentDocument[]): CommentViewModel[] {
    return comments.map((comment) => this.mapToView(comment));
  }
}
