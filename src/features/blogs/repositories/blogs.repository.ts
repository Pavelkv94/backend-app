import { BlogDocument, BlogEntityModel, BlogInputModel, BlogViewModel } from "../models/blogs.models";
import { BlogModel } from "../../../db/models/Blog.model";

// без ТС
export interface IBlogRepository {
  findBlog(id: string): Promise<BlogDocument | null>;
  save(blog: BlogDocument): Promise<string>;
  deleteBlog(id: string): Promise<boolean>;
}

class BlogRepository implements IBlogRepository {
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
