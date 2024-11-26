import { PostModel } from "../../../db/models/Post.model";
import { OutputDataWithPagination } from "../../../types/common-types";
import { PostValidQueryModel, PostViewModel } from "../models/posts.models";
import { PostViewDto } from "./dto";

export class PostQueryRepository {
  async findAllPosts(query: PostValidQueryModel, blog_id?: string): Promise<OutputDataWithPagination<PostViewModel>> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    const filter: any = blog_id ? { blogId: blog_id } : {};

    const postsFromDb = await PostModel.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const postsView = PostViewDto.mapToViewArray(postsFromDb);

    const postsCount = await this.getPostsCount(blog_id);

    return {
      pagesCount: Math.ceil(postsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: postsView,
    };
  }

  async findPost(id: string): Promise<PostViewModel | null> {
    const postFromDb = await PostModel.findOne({ _id: id });

    if (!postFromDb) {
      return null;
    }
    return PostViewDto.mapToView(postFromDb);
  }
  async getPostsCount(blog_id?: string): Promise<number> {
    const filter: any = blog_id ? { blogId: blog_id } : {};

    return PostModel.countDocuments(filter);
  }
}

export const postQueryRepository = new PostQueryRepository();
