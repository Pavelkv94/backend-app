import { db, postCollection } from "../db/db";
import { PostDbType } from "../db/post-db-type";
import { PostInputModel, PostOutputModel } from "../input-output-types/posts-types";
import { blogsRepository } from "./blogs.repository";

export const postsRepository = {
  async findPosts(): Promise<PostDbType[]> {
    return postCollection.find({}).toArray();
  },

  async find(id: string): Promise<PostDbType | null> {
    const post = postCollection.findOne({ id: id });
    if (!post) {
      return null;
    }
    return post;
  },

  async findForOutput(id: string): Promise<null | PostOutputModel | null> {
    const post = await this.find(id);
    return post;
  },

  async create(payload: PostInputModel): Promise<{ id: string }> {
    const blog = await blogsRepository.find(payload.blogId);

    const newPost: PostDbType = {
      ...payload,
      id: (Date.now() + Math.random()).toString(),
      blogName: blog!.name,
    };

    try {
      const result = await db.collection("posts").insertOne(newPost);
    } catch (err) {
      // log
      console.log(err);
    }

    return { id: newPost.id };
  },
  async update(id: string, payload: PostInputModel): Promise<boolean> {
    const blog = await blogsRepository.find(payload.blogId);

    const foundPost = await this.find(id);

    if (!foundPost) {
      return false;
    }

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
    const foundPost = await this.find(id);

    if (!foundPost) {
      return false;
    }
    try {
      const result = await db.collection("posts").deleteOne({ id: id });
    } catch (err) {
      // log
      console.log(err);
    }
    return true;
  },

  async findAndMap(id: string) {
    const post = await this.find(id);
    return this.mapToOutput(post!);
  },
  mapToOutput(post: PostDbType): PostDbType {
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
    };
  },
};
