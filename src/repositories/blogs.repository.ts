import { ObjectId } from "mongodb";
import { BlogDbType } from "../db/blog-db-type";
import { blogCollection, db } from "../db/db";
import { BlogInputModel, BlogViewModel } from "../input-output-types/blogs-types";

export const blogsRepository = {
  async findAll(): Promise<BlogDbType[]> {
    return blogCollection.find({}).toArray(); //find({}, {projection: {_id: 0}}) //todo projection - те поля которые (не) должны приходить(значение 1/0)
  },

  async find(id: string) {
    const blog = blogCollection.findOne({ id: id });

    if (!blog) {
      return null;
    } else {
      return blog;
    }
  },

  async create(payload: BlogInputModel): Promise<string> {
    const id = new ObjectId();

    const newBlog: BlogDbType = {
      id: id.toString(),
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection("blogs").insertOne(newBlog);
    return newBlog.id;
  },

  async findAndMap(id: string) {
    const blog = await this.find(id)!; // ! используем этот метод если проверили существование
    return this.mapToOutput(blog!);
  },

  async delete(id: string) {
    const result = await db.collection("blogs").deleteOne({ id: id });
    return result.deletedCount > 0;
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

  async mapToOutput(blog: BlogDbType) {
    const blogForOutput: BlogViewModel = {
      id: blog.id,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      name: blog.name,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
    return blogForOutput;
  },
};
