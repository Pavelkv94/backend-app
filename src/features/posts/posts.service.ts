import { PostDocument, PostEntityModel, PostForBlogInputModel, PostInputModel } from "./models/posts.models";
import { BlogRepository } from "../blogs/repositories/blogs.repository";
import { PostRepository } from "./repositories/posts.repository";
import { PostModel } from "../../db/models/Post.model";
import { LikeDocument, LikeStatusType } from "../likes/models/like.model";
import {  LikeService } from "../likes/like.service";
import { inject, injectable } from "inversify";

@injectable()
export class PostService {
  constructor(@inject(BlogRepository) private blogRepository: BlogRepository, @inject(PostRepository) private postRepository: PostRepository, @inject(LikeService) private likeService: LikeService) {}

  async createPost(payload: PostInputModel): Promise<string> {
    const blog = await this.blogRepository.findBlog(payload.blogId);

    const postDto: PostEntityModel = {
      ...payload,
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };

    const post = new PostModel(postDto);

    const postId: string = await this.postRepository.save(post);

    return postId;
  }

  async createForBlog(payload: PostForBlogInputModel, blog_id: string): Promise<string | null> {
    const blog = await this.blogRepository.findBlog(blog_id);

    const postDto: PostEntityModel = {
      ...payload,
      blogName: blog!.name,
      blogId: blog_id,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        newestLikes: [],
      },
    };

    const post = new PostModel(postDto);

    const postId: string = await this.postRepository.save(post);

    return postId;
  }

  async updatePost(id: string, payload: PostInputModel): Promise<string | null> {
    const post = await this.postRepository.findPost(id);
    const blog = await this.blogRepository.findBlog(payload.blogId);

    if (!post || !blog) {
      return null;
    }

    post.title = payload.title;
    post.shortDescription = payload.shortDescription;
    post.content = payload.content;
    post.blogId = payload.blogId;
    post.blogName = blog.name;

    const updatedPostId = await this.postRepository.save(post);

    return updatedPostId;
  }

  async deletePost(id: string): Promise<boolean> {
    const isDeleted = await this.postRepository.deletePost(id);
    return isDeleted;
  }

  async changeLikeStatus(userId: string, postId: string, newStatus: LikeStatusType) {
    const likeDocument = await this.likeService.findLike(userId, postId);

    const isCalculatedCommentLikes = await this.updatePostLikesCount(postId, likeDocument, newStatus);

    if (!isCalculatedCommentLikes) {
      throw new Error("Comment likes caclulating is failed");
    }
    if (likeDocument) {
      await this.likeService.updateLike(likeDocument, newStatus);
    } else {
      await this.likeService.createLike(userId, postId, newStatus);
    }
  }

  private async updatePostLikesCount(postId: string, likeDocument: LikeDocument | null, newStatus: LikeStatusType): Promise<boolean> {
    const post = await this.postRepository.findPost(postId);

    if (!post) {
      throw new Error("Something was wrong.");
    }

    if (!likeDocument) {
      //first like
      this.likesCounter("None", newStatus, post);
    } else {
      //existing like
      this.likesCounter(likeDocument.status, newStatus, post);
    }

    const updatedPostId = await this.postRepository.save(post);

    if (!updatedPostId) {
      return false;
    }
    return true;
  }

  private async likesCounter(prevStatus: LikeStatusType, newStatus: LikeStatusType, post: PostDocument) {
    if (prevStatus === "Like") post.extendedLikesInfo.likesCount -= 1;
    if (prevStatus === "Dislike") post.extendedLikesInfo.dislikesCount -= 1;
    if (newStatus === "Like") post.extendedLikesInfo.likesCount += 1;
    if (newStatus === "Dislike") post.extendedLikesInfo.dislikesCount += 1;
  }
}
