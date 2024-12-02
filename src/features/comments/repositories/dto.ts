import { LikeStatusType } from "../../likes/models/like.model";
import { CommentDocument, CommentViewModel } from "../models/comments.models";

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusType;
  };

  constructor(model: CommentDocument, myStatus: LikeStatusType) {
    this.id = model._id.toString();
    this.content = model.content;
    this.content = model.content;
    this.createdAt = model.createdAt;
    this.commentatorInfo = model.commentatorInfo;
    this.likesInfo = {
      likesCount: model.likesInfo.likesCount,
      dislikesCount: model.likesInfo.dislikesCount,
      myStatus: myStatus, //external
    };
  }

  static mapToView(comment: CommentDocument, myStatus: LikeStatusType): CommentViewModel {
    return new CommentViewDto(comment, myStatus);
  }
}
