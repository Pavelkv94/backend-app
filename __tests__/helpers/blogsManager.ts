import { BlogInputModel } from "../../src/input-output-types/blogs-types";
import { SETTINGS } from "../../src/settings";
import { codedAuth } from "./datasets";
import { req } from "./test-helpers";

export const blogsManager = {
  async getBlogs() {
    const response = await req.get(SETTINGS.PATH.BLOGS);

    return response;
  },

  async getBlog(id: string) {
    const response = await req.get(`${SETTINGS.PATH.BLOGS}/${id}`);

    return response;
  },
  async createBlogWithAuth(data: BlogInputModel) {
    const response = await req
      .post(SETTINGS.PATH.BLOGS)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data);

    return response;
  },
  async createBlogWithoutAuth(data: BlogInputModel) {
    const response = await req.post(SETTINGS.PATH.BLOGS).send(data);

    return response;
  },
  async updateBlogWithAuth(data: BlogInputModel, id: string) {
    const response = await req
      .put(`${SETTINGS.PATH.BLOGS}/${id}`)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data);

    return response;
  },
  async updateBlogWithoutAuth(data: BlogInputModel, id: string) {
    const response = await req
      .put(`${SETTINGS.PATH.BLOGS}/${id}`)
      .send(data);

    return response;
  },
  async deleteBlogWithAuth(id: string) {
    const response = await req.delete(`${SETTINGS.PATH.BLOGS}/${id}`).set({ Authorization: "Basic " + codedAuth });

    return response;
  },
  async deleteBlogWithoutAuth(id: string) {
    const response = await req.delete(`${SETTINGS.PATH.BLOGS}/${id}`);

    return response;
  },
};
