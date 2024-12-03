import { LikeStatusType, NewestLikeType } from "../../likes/models/like.model";
import { PostDocument, PostViewModel } from "../models/posts.models";

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusType;
    newestLikes: NewestLikeType[];
  };

  constructor(model: PostDocument, myStatus: LikeStatusType, newestLikes: NewestLikeType[]) {
    this.id = model._id.toString();
    this.title = model.title;
    this.shortDescription = model.shortDescription;
    this.content = model.content;
    this.blogId = model.blogId;
    this.blogName = model.blogName;
    this.createdAt = model.createdAt;
    this.extendedLikesInfo = {
      likesCount: model.extendedLikesInfo.likesCount,
      dislikesCount: model.extendedLikesInfo.dislikesCount,
      myStatus: myStatus, //external
      newestLikes: newestLikes,
    };
  }

  static mapToView(post: PostDocument, myStatus: LikeStatusType, newestLikes: NewestLikeType[]): PostViewModel {
    return new PostViewDto(post, myStatus, newestLikes);
  }
}
