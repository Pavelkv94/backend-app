import { UserInputModel } from "../../src/features/users/domain/users.models";
import { SETTINGS } from "../../src/settings";
import { codedAuth } from "./datasets";
import { req } from "./test-helpers";

export const usersManager = {
  async getUsersWithAuth(query?: string) {
    const response = await req.get(`${SETTINGS.PATH.USERS}${query ? query : ""}`).set({ Authorization: "Basic " + codedAuth });

    return response;
  },
  async getUsersWithoutAuth(query?: string) {
    const response = await req.get(`${SETTINGS.PATH.USERS}${query ? query : ""}`);

    return response;
  },
  async getUsersWithInvalidToken(query?: string) {
    const response = await req.get(`${SETTINGS.PATH.USERS}${query ? query : ""}`).set({ Authorization: "Basic " + "invalid" });

    return response;
  },
  async getUsersWithInvalidAuthHeader(query?: string) {
    const response = await req.get(`${SETTINGS.PATH.USERS}${query ? query : ""}`).set({ Authorization: "BasicInvalidHeader " + codedAuth });

    return response;
  },

  async createUser(data: UserInputModel) {
    const response = await req
      .post(SETTINGS.PATH.USERS)
      .set({ Authorization: "Basic " + codedAuth })
      .send(data);

    return response;
  },

  async deleteUser(id: string) {
    const response = await req.delete(`${SETTINGS.PATH.USERS}/${id}`).set({ Authorization: "Basic " + codedAuth });

    return response;
  },

  async passwordRecovery(email: string) {
    const response = await req.post(`${SETTINGS.PATH.AUTH}/password-recovery`).send({ email });

    return response;
  },
};
