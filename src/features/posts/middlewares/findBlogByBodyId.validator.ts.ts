import { body } from "express-validator";
import { blogsRepository } from "../../blogs/blogs.repository";

export const findBlogByBodyIdValidator = body("blogId").custom(async (blogId) => {
  const blog = await blogsRepository.findBlog(blogId);
  if (!blog) {
    throw new Error("no blog!");
  }
});
