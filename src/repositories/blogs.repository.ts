import { InsertOneResult, ObjectId } from "mongodb";
import { BlogDbType } from "../db/blog-db-type";
import { blogCollection, db } from "../db/db";
import { BlogInputModel, BlogValidQueryModel } from "../input-output-types/blogs-types";

export const blogsRepository = {
  async findAll(query: BlogValidQueryModel): Promise<BlogDbType[]> {
    const { pageSize, pageNumber, searchNameTerm, sortBy, sortDirection } = query;

    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    return blogCollection
      .find(filter, { projection: { _id: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray(); //* projection - те поля которые (не) должны приходить(значение 1/0)
  },

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    return blogCollection.countDocuments(filter);
  },

  async find(id: string) {
    const blog = blogCollection.findOne({ id: id }, { projection: { _id: 0 } });

    if (!blog) {
      return null;
    } else {
      return blog;
    }
  },

  async create(payload: BlogInputModel): Promise<InsertOneResult<Document>> {
    const result = await db.collection("blogs").insertOne(payload);

    return result;
  },

  async update(id: string, payload: BlogInputModel) {
    const result = await db.collection("blogs").updateOne(
      { id: id },
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

  async delete(id: string) {
    const result = await db.collection("blogs").deleteOne({ id: id });
    return result.deletedCount > 0;
  },

  // async findAndMap(id: string) {
  //   const blog = await this.find(id)!; // ! используем этот метод если проверили существование
  //   return this.mapToOutput(blog!);
  // },

  // async mapToOutput(blog: BlogDbType) {
  //   const blogForOutput: BlogViewModel = {
  //     id: blog.id,
  //     description: blog.description,
  //     websiteUrl: blog.websiteUrl,
  //     name: blog.name,
  //     createdAt: blog.createdAt,
  //     isMembership: blog.isMembership,
  //   };
  //   return blogForOutput;
  // },
};
