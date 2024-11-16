import { BlogValidQueryModel, BlogViewModel } from "./models/blogs.models";
import { OutputDataWithPagination } from "../../types/common-types";
import { BlogModel } from "../../db/models/Blog.model";
import { BlogViewDto } from "./dto";

export const blogsQueryRepository = {
  async findAllBlogs(query: BlogValidQueryModel): Promise<OutputDataWithPagination<BlogViewModel>> {
    const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = query;

    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const blogsFromDb = await BlogModel.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const blogsView = BlogViewDto.mapToViewArray(blogsFromDb);

    const blogsCount = await this.getBlogsCount(searchNameTerm || null);

    return {
      pagesCount: Math.ceil(blogsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: blogsCount,
      items: blogsView,
    };
  },

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    return await BlogModel.countDocuments(filter);
  },

  async findBlog(id: string): Promise<BlogViewModel | null> {
    const blogFromDb = await BlogModel.findOne({ _id: id });

    if (!blogFromDb) {
      return null;
    }
    return BlogViewDto.mapToView(blogFromDb);
  },
};
