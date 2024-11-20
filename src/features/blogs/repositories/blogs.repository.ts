import { BlogDocument, BlogEntityModel, BlogInputModel, BlogViewModel } from "../models/blogs.models";
import { BlogModel } from "../../../db/models/Blog.model";
import { BlogViewDto } from "./dto";

export const blogsRepository = {
  async findBlog(id: string): Promise<BlogViewModel | null> {
    const blogFromDb = await BlogModel.findOne({ _id: id });

    if (!blogFromDb) {
      return null;
    }
    return BlogViewDto.mapToView(blogFromDb);
  },

  async save(blog: BlogDocument): Promise<string> {
    const result = await blog.save();

    return result.id;
  },

  async updateBlog(id: string, payload: BlogInputModel): Promise<boolean> {
    const result = await BlogModel.updateOne(
      { _id: id },
      {
        $set: {
          name: payload.name,
          description: payload.description,
          websiteUrl: payload.websiteUrl,
        },
      }
    );
    return result.matchedCount > 0;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },
};
