import { PostDocument, PostViewModel } from "../models/posts.models";

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;

  constructor(model: PostDocument) {
    this.id = model._id.toString();
    this.title = model.title;
    this.shortDescription = model.shortDescription;
    this.content = model.content;
    this.blogId = model.blogId;
    this.blogName = model.blogName;
    this.createdAt = model.createdAt;
  }

  static mapToView(post: PostDocument): PostViewModel {
    return new PostViewDto(post);
  }

  static mapToViewArray(posts: PostDocument[]): PostViewModel[] {
    return posts.map((post) => this.mapToView(post));
  }
}
