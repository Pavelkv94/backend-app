import { body } from "express-validator";
import { blogsRepository } from "../../repositories/blogs.repository";

export const findBlogByBodyIdValidator = body("blogId").custom(async (blogId) => {
  const blog = await blogsRepository.find(blogId);
  if (!blog) {
    throw new Error("no blog!");
  }
});
