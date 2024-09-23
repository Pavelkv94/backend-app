import { BlogDbType } from "../db/blog-db-type";
import { db } from "../db/db";
import { BlogInputModel, BlogViewModel } from "../input-output-types/blogs-types";

export const blogsRepository = {
  findAll() {
    return db.blogs;
  },

  find(id: string) {
    const blog = db.blogs.find((b) => b.id === id);
    if (!blog) {
      return null;
    } else {
      return blog;
    }
  },

  create(payload: BlogInputModel): string {
    const newBlog: BlogDbType = {
      id: new Date().toISOString() + Math.random(),
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
    };
    db.blogs = [...db.blogs, newBlog];
    return newBlog.id;
  },

  findAndMap(id: string) {
    const blog = this.find(id)!; // ! используем этот метод если проверили существование
    return this.mapToOutput(blog);
  },

  delete(id: string) {
    const blog = this.find(id);
    if (!blog) {
      return false;
    } else {
      db.blogs = db.blogs.filter((el) => el.id !== id);
      return true;
    }
  },
  update(id: string, payload: BlogInputModel) {
    const blog = this.find(id);
    if (!blog) {
      return false;
    } else {
      db.blogs = db.blogs.map((el) =>
        el.id === id
          ? {
              ...el,
              name: payload.name,
              description: payload.description,
              websiteUrl: payload.websiteUrl,
            }
          : el
      );
      return true;
    }
  },
  mapToOutput(blog: BlogDbType) {
    const blogForOutput: BlogViewModel = {
      id: blog.id,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      name: blog.name,
    };
    return blogForOutput;
  },
};
