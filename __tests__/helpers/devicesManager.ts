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
};
