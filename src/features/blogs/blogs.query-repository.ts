import { ObjectId, WithId } from "mongodb";
import { BlogEntityModel, BlogValidQueryModel, BlogViewModel } from "./models/blogs.models";
import { db } from "../../db/db";
import { OutputDataWithPagination } from "../../types/common-types";

export const blogsQueryRepository = {
  async findAllBlogs(query: BlogValidQueryModel): Promise<OutputDataWithPagination<BlogViewModel>> {
    const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = query;

    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const blogsFromDb = await db
      .getCollections()
      .blogsCollection.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const blogsView = this.mapBlogsToOutput(blogsFromDb);

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

    return await db.getCollections().blogsCollection.countDocuments(filter);
  },

  async findBlog(id: string): Promise<BlogViewModel | null> {
    const objectId = new ObjectId(id);
    
    const blogFromDb = await db.getCollections().blogsCollection.findOne({ _id: objectId });

    if (!blogFromDb) {
      return null;
    } else {
      const blog = { ...blogFromDb, id: blogFromDb._id.toString() };
      const { _id, ...rest } = blog;
      return rest;
    }
  },

  mapBlogsToOutput(blogs: WithId<BlogEntityModel>[]): BlogViewModel[] {
    return blogs.map((blog) => ({ ...blog, id: blog._id.toString() })).map(({ _id, ...rest }) => rest);
  },
};
