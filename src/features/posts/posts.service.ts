import { ObjectId } from "mongodb";
import { PostDocument, PostEntityModel, PostForBlogInputModel, PostInputModel, PostValidQueryModel, PostViewModel } from "./models/posts.models";
import { blogRepository, IBlogRepository } from "../blogs/repositories/blogs.repository";
import { postRepository, PostRepository } from "./repositories/posts.repository";
import { PostModel } from "../../db/models/Post.model";

export class PostService {
  constructor(public blogRepository: IBlogRepository, public postRepository: PostRepository) {}

  async createPost(payload: PostInputModel): Promise<string> {
    const blog = await this.blogRepository.findBlog(payload.blogId);

    const postDto: PostEntityModel = {
      ...payload,
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
    };

    const post = new PostModel(postDto);

    const postId: string = await this.postRepository.save(post);

    return postId;
  }

  async createForBlog(payload: PostForBlogInputModel, blog_id: string): Promise<string | null> {
    const blog = await this.blogRepository.findBlog(blog_id);

    const postDto: PostEntityModel = {
      ...payload,
      blogName: blog!.name,
      blogId: blog_id,
      createdAt: new Date().toISOString(),
    };

    const post = new PostModel(postDto);

    const postId: string = await this.postRepository.save(post);

    return postId;
  }

  async updatePost(id: string, payload: PostInputModel): Promise<string | null> {
    const post = await this.postRepository.findPost(id);
    const blog = await this.blogRepository.findBlog(payload.blogId);

    if (!post || !blog) {
      return null;
    }

    post.title = payload.title;
    post.shortDescription = payload.shortDescription;
    post.content = payload.content;
    post.blogId = payload.blogId;
    post.blogName = blog.name;

    const updatedPostId = await this.postRepository.save(post);

    return updatedPostId;
  }

  async deletePost(id: string): Promise<boolean> {
    const isDeleted = await this.postRepository.deletePost(id);
    return isDeleted;
  }
}

export const postService = new PostService(blogRepository, postRepository);
