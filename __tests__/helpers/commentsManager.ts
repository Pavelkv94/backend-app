import { CommentInputModel } from "../../src/features/comments/models/comments.models";
import { SETTINGS } from "../../src/settings";
import { req } from "./test-helpers";

export const commentsManager = {
  async getComments(post_id: string) {
    const response = await req.get(`${SETTINGS.PATH.POSTS}/${post_id}/comments`);

    return response;
  },

  async getComment(id: string) {
    const response = await req.get(`${SETTINGS.PATH.COMMENTS}/${id}`);

    return response;
  },

  async createCommentWithAuthJWT(post_id: string, token: string, payload: any) {
    const response = await req
      .post(`${SETTINGS.PATH.POSTS}/${post_id}/comments`)
      .set({ Authorization: "Bearer " + token })
      .send(payload);

    return response;
  },

  async deleteCommentWithAuth(id: string, token: string) {
    const response = await req.delete(`${SETTINGS.PATH.COMMENTS}/${id}`).set({ Authorization: "Bearer " + token });

    return response;
  },
  async updateCommentWithAuth(id: string, token: string, payload: CommentInputModel) {
    const response = await req.put(`${SETTINGS.PATH.COMMENTS}/${id}`).set({ Authorization: "Bearer " + token }).send(payload);

    return response;
  },

  async createCommentWithInvalidJwtHeader(post_id: string, token: string, payload: CommentInputModel) {
    const response = await req
      .post(`${SETTINGS.PATH.POSTS}/${post_id}/comments`)
      .set({ Authorization: "Invalid " + token })
      .send(payload);

    return response;
  },

  async createCommentWithInvalidJwt(post_id: string, token: string, payload: CommentInputModel) {
    const response = await req
      .post(`${SETTINGS.PATH.POSTS}/${post_id}/comments`)
      .set({ Authorization: "Bearer " + "123" })
      .send(payload);

    return response;
  },
};
