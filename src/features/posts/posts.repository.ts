import { PostEntityModel, PostInputModel, PostViewModel } from "./models/posts.models";
import { blogsRepository } from "../blogs/repositories/blogs.repository";
import { PostModel } from "../../db/models/Post.model";
import { PostViewDto } from "./dto";

export const postsRepository = {
  async findPost(id: string): Promise<PostViewModel | null> {
    const postFromDb = await PostModel.findOne({ _id: id });

    if (!postFromDb) {
      return null;
    }
    return PostViewDto.mapToView(postFromDb);
  },
  async createPost(payload: PostEntityModel): Promise<string> {
    const post = new PostModel(payload);
    const result = await post.save();

    return result.id;
  },
  async updatePost(id: string, payload: PostInputModel): Promise<boolean> {
    const blog = await blogsRepository.findBlog(payload.blogId);

    const result = await PostModel.updateOne(
      { _id: id },
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

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ _id: id });

    return result.deletedCount > 0;
  },
};
