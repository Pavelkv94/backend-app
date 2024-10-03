import { InsertOneResult } from "mongodb";
import { db, postCollection } from "../db/db";
import { PostDbType } from "../db/post-db-type";
import { PostInputModel, PostOutputModel, PostValidQueryModel } from "../input-output-types/posts-types";
import { blogsRepository } from "./blogs.repository";

export const postsRepository = {
  async findAllPosts(query: PostValidQueryModel, blog_id?: string): Promise<PostDbType[]> {
    const { pageSize, pageNumber, sortBy, sortDirection } = query;

    const filter: any = blog_id ? { blogId: blog_id } : {};

    return postCollection
      .find(filter, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();
  },

  async find(id: string): Promise<PostDbType | null> {
    const post = postCollection.findOne({ id: id }, { projection: { _id: 0 } });

    if (!post) {
      return null;
    }
    return post;
  },
  async getPostsCount(blog_id?: string): Promise<number> {
    const filter: any = blog_id ? { blogId: blog_id } : {};

    return postCollection.countDocuments(filter);
  },

  async create(payload: PostInputModel): Promise<InsertOneResult<Document>> {
    const result = await db.collection("posts").insertOne(payload);

    return result;
  },
  async update(id: string, payload: PostInputModel): Promise<boolean> {
    const blog = await blogsRepository.find(payload.blogId);

    const result = await db.collection("posts").updateOne(
      { id: id },
      {
        $set: {
          title: payload.title,
          shortDescription: payload.shortDescription,
          content: payload.content,
          blogId: payload.blogId,
          blogName: blog!.name,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.collection("posts").deleteOne({ id: id });

    return result.deletedCount > 0;
  },

  // async findForOutput(id: string): Promise<null | PostOutputModel | null> {
  //   const post = await this.find(id);
  //   return post;
  // },

  // async findAndMap(id: string) {
  //   const post = await this.find(id);
  //   return this.mapToOutput(post!);
  // },
  // mapToOutput(post: PostDbType): PostDbType {
  //   return {
  //     id: post.id,
  //     title: post.title,
  //     shortDescription: post.shortDescription,
  //     content: post.content,
  //     blogId: post.blogId,
  //     blogName: post.blogName,
  //     createdAt: post.createdAt,
  //   };
  // },
};
