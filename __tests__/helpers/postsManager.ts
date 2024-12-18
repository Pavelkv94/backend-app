import { PostForBlogInputModel, PostInputModel } from "../../src/features/posts/models/posts.models";
import { SETTINGS } from "../../src/settings";
import { codedAuth } from "./datasets";
import { req } from "./test-helpers";

export const postsManager = {
  async getPosts() {
    const response = await req.get(SETTINGS.PATH.POSTS);

    return response;
  },

  async getPost(id: string) {
    const response = await req.get(`${SETTINGS.PATH.POSTS}/${id}`);

    return response;
  },
  async createPostForBlog(data: any, blog_id: string) {
    const response = await req
      .post(`${SETTINGS.PATH.BLOGS}/${blog_id}/posts`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data);

    return response;
  },

  async createPostWithAuth(data: PostForBlogInputModel) {
    const response = await req
      .post(SETTINGS.PATH.POSTS)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data);

    return response;
  },
  async createPostWithoutAuth(data: PostInputModel) {
    const response = await req.post(SETTINGS.PATH.POSTS).send(data);

    return response;
  },
  async updatePostWithAuth(data: PostInputModel, id: string) {
    const response = await req
      .put(`${SETTINGS.PATH.POSTS}/${id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data);

    return response;
  },
  async updatePostWithoutAuth(data: PostInputModel, id: string) {
    const response = await req.put(`${SETTINGS.PATH.POSTS}/${id}`).send(data);

    return response;
  },
  async deletePostWithAuth(id: string) {
    const response = await req.delete(`${SETTINGS.PATH.POSTS}/${id}`).set({ Authorization: "Basic " + codedAuth });

    return response;
  },
  async deletePostWithoutAuth(id: string) {
    const response = await req.delete(`${SETTINGS.PATH.POSTS}/${id}`).set({ Authorization: "Fail" });

    return response;
  },
};
