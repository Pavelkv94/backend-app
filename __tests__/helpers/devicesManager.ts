import { SETTINGS } from "../../src/settings";
import { req } from "./test-helpers";

export const devicesManager = {
  async getDevicesWithoutAuth() {
    const response = await req.get(SETTINGS.PATH.SECURITY + "/devices");

    return response;
  },
  async getDevicesWithAuth(refreshToken:string) {
    const response = await req.get(SETTINGS.PATH.SECURITY + "/devices").set("Cookie", [`refreshToken=${refreshToken}`]);

    return response;
  },
  async deleteOtherDevices(refreshToken:string) {
    const response = await req.delete(SETTINGS.PATH.SECURITY + "/devices").set("Cookie", [`refreshToken=${refreshToken}`]);

    return response;
  },
  async deleteDevice(refreshToken:string, deviceId: string) {
    const response = await req.delete(SETTINGS.PATH.SECURITY + "/devices" + `/${deviceId}`).set("Cookie", [`refreshToken=${refreshToken}`]);

    return response;
  },
//   async loginUserWithAgent(data: any, agent: string) {
//     const response = await req.post(SETTINGS.PATH.AUTH + "/login").set({"user-agent": agent}).send(data);

//     return response;
//   },
  
//   async registerUser(data: any) {
//     const response = await req.post(SETTINGS.PATH.AUTH + "/registration").send(data);

//     return response;
//   },
//   async getMe(token: string) {
//     const response = await req.get(SETTINGS.PATH.AUTH + "/me").set({ Authorization: "Bearer " + token });

//     return response;
//   },
//   async confirmation(code: string) {
//     const response = await req.post(SETTINGS.PATH.AUTH + "/registration-confirmation").send({ code });

//     return response;
//   },
//   async resendEmail(email: string) {
//     const response = await req.post(SETTINGS.PATH.AUTH + "/registration-email-resending").send({ email });

//     return response;
//   },

//   async refresh(refreshToken?: string) {
//     const response = await req.post(SETTINGS.PATH.AUTH + "/refresh-token").set("Cookie", [`session=${refreshToken}`]);

//     return response;
//   },
};
