import { PostModel } from "../../../db/models/Post.model";
import { PostDocument } from "../models/posts.models";

export class PostRepository {
  async save(post: PostDocument): Promise<string> {
    const result = await post.save();

    return result.id;
  }

  async findPost(id: string): Promise<PostDocument | null> {
    const postDocument = await PostModel.findOne({ _id: id });

    if (!postDocument) {
      return null;
    }
    return postDocument;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ _id: id });

    return result.deletedCount > 0;
  }
}

export const postRepository = new PostRepository();
