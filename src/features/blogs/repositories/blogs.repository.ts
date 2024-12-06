import { BlogDocument, BlogEntityModel, BlogInputModel, BlogViewModel } from "../models/blogs.models";
import { BlogModel } from "../../../db/models/Blog.model";
import { injectable } from "inversify";

@injectable()
export class BlogRepository {
  async findBlog(id: string): Promise<BlogDocument | null> {
    const blogDocument = await BlogModel.findOne({ _id: id });

    if (!blogDocument) {
      return null;
    }
    return blogDocument;
  }

  async save(blog: BlogDocument): Promise<string> {
    const result = await blog.save();

    return result.id;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export const blogRepository = new BlogRepository();
