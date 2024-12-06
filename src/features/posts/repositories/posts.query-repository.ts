import { injectable } from "inversify";
import { LikeModel } from "../../../db/models/Like.model";
import { PostModel } from "../../../db/models/Post.model";
import { OutputDataWithPagination } from "../../../types/common-types";
import { PostValidQueryModel, PostViewModel } from "../models/posts.models";
import { PostViewDto } from "./dto";

@injectable()
export class PostQueryRepository {
  async findAllPosts(query: PostValidQueryModel, userId: string | null, blog_id?: string): Promise<OutputDataWithPagination<PostViewModel>> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    const filter: any = blog_id ? { blogId: blog_id } : {};

    const postsFromDb = await PostModel.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const postIds = postsFromDb.map((post) => post.id);

    const likes = await LikeModel.find({ parent_id: { $in: postIds } })
      .sort({ updatedAt: "desc" })
      .lean();

    let postsView: PostViewModel[];

    if (!userId) {
      postsView = postsFromDb.map((post) => {
        const newestLikes = likes
          .filter((like) => like.parent_id === post.id && like.status === "Like")
          .slice(0, 3)
          .map((like) => ({
            addedAt: like.updatedAt,
            userId: like.user_id,
            login: like.user_login,
          }));
        return PostViewDto.mapToView(post, "None", newestLikes);
      });
    } else {
      const userLikes = likes.filter((like) => like.user_id === userId);

      postsView = postsFromDb.map((post) => {
        const postLikes = userLikes.filter((like) => like.parent_id === post.id);
        const newestLikes = likes
          .filter((like) => like.parent_id === post.id && like.status === "Like")
          .slice(0, 3)
          .map((like) => ({
            addedAt: like.updatedAt,
            userId: like.user_id,
            login: like.user_login,
          }));
        const myStatus = postLikes.length > 0 ? postLikes[0].status : "None";
        return PostViewDto.mapToView(post, myStatus, newestLikes);
      });
    }

    const postsCount = await this.getPostsCount(blog_id);

    return {
      pagesCount: Math.ceil(postsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: postsView,
    };
  }

  async findPost(id: string, userId: string | null): Promise<PostViewModel | null> {
    const postFromDb = await PostModel.findOne({ _id: id });

    if (!postFromDb) {
      return null;
    }
    const postLikes = await LikeModel.find({ parent_id: postFromDb.id }).sort({ updatedAt: "desc" }).lean();

    const newestLikes = postLikes
      .filter((like) => like.status === "Like")
      .slice(0, 3)
      .map((like) => ({ addedAt: like.updatedAt, userId: like.user_id, login: like.user_login }));
    const currentUserLike = postLikes.find((like) => like.user_id === userId);
    const myStatus = currentUserLike ? currentUserLike.status : "None";
    return PostViewDto.mapToView(postFromDb, myStatus, newestLikes);
  }
  async getPostsCount(blog_id?: string): Promise<number> {
    const filter: any = blog_id ? { blogId: blog_id } : {};

    return PostModel.countDocuments(filter);
  }
}
