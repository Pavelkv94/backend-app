import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { db } from "../../db/db";
import { PostEntityModel, PostInputModel, PostValidQueryModel, PostViewModel } from "./models/posts.models";
import { blogsRepository } from "../blogs/blogs.repository";
import { OutputDataWithPagination } from "../../types/common-types";

export const postsQueryRepository = {
  async findAllPosts(query: PostValidQueryModel, blog_id?: string): Promise<OutputDataWithPagination<PostViewModel>> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    const filter: any = blog_id ? { blogId: blog_id } : {};

    const postsFromDb = await db
      .getCollections()
      .postsCollection.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const postsView = this.mapPostsToOutput(postsFromDb);

    const postsCount = await this.getPostsCount(blog_id);

    return {
      pagesCount: Math.ceil(postsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: postsView,
    };
  },

  async findPost(id: string): Promise<PostViewModel | null> {
    const objectId = new ObjectId(id);

    const postFromDb = await db.getCollections().postsCollection.findOne({ _id: objectId });

    if (!postFromDb) {
      return null;
    } else {
      const post = { ...postFromDb, id: postFromDb._id.toString() };
      const { _id, ...rest } = post;
      return rest;
    }
  },
  async getPostsCount(blog_id?: string): Promise<number> {
    const filter: any = blog_id ? { blogId: blog_id } : {};

    return db.getCollections().postsCollection.countDocuments(filter);
  },

  mapPostsToOutput(posts: WithId<PostEntityModel>[]): PostViewModel[] {
    return posts.map((post) => ({ ...post, id: post._id.toString() })).map(({ _id, ...rest }) => rest);
  },
};
