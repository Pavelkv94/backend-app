import { BlogInputModel, BlogViewModel } from "../../src/features/blogs/models/blogs.models";
import { PostForBlogInputModel, PostInputModel } from "../../src/features/posts/models/posts.models";
import { fromUTF8ToBase64 } from "../../src/global-middlewares/admin.middleware";
import { SETTINGS } from "../../src/settings";

export const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);

export const createString = (length: number) => {
  let s = "";
  for (let x = 1; x <= length; x++) {
    s += x % 10;
  }
  return s;
};

export const newBlog: BlogInputModel = {
  name: "n1",
  description: "d1",
  websiteUrl: "http://some.com",
};

export const newBlogPost: PostForBlogInputModel = {
  title: "Post Title",
  shortDescription: "Post Desc",
  content: "Post Content",
};

export const fakeId: string = "66fe520519de2ba63a26d417";

export const buildPost = (blogFromDb: BlogViewModel): PostInputModel => ({
  title: "t1",
  shortDescription: "s1",
  content: "c1",
  blogId: blogFromDb.id,
});

export const newUser = {
  login: "Login123",
  password: "12345678",
  email: "example123@example.com",
};

export const newUser2 = {
  login: "user2",
  password: "123456782",
  email: "user2@example.com",
};

export const newComment = {
  content: "default comment with correct length",
};
