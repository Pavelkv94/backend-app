import { SETTINGS } from "../../src/settings";
import { req } from "./test-helpers";

export const authManager = {
  async loginUser(data: any) {
    const response = await req.post(SETTINGS.PATH.AUTH + "/login").send(data);

    return response;
  },
  async registerUser(data: any) {
    const response = await req.post(SETTINGS.PATH.AUTH + "/registration").send(data);

    return response;
  },
  async getMe(token: string) {
    const response = await req.get(SETTINGS.PATH.AUTH + "/me").set({ Authorization: "Bearer " + token });

    return response;
  },
  async confirmation(code: string) {
    const response = await req.post(SETTINGS.PATH.AUTH + "/registration-confirmation").send({code});

    return response;
  },
};
