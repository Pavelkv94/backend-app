import { JWTPayloadModel } from "../../adapters/jwt/models/jwt.models";
import { db } from "../../db/db";
import { DeviceEntityModel } from "./models/securityDevices.model";

export const securityDevicesRepository = {
  async findDevice(deviceId: string): Promise<DeviceEntityModel | null> {
    const device = await db.getCollections().devicesCollection.findOne({ deviceId });
    if (device) {
      return device;
    } else {
      return null;
    }
  },
  async addDevice(payload: DeviceEntityModel): Promise<string> {
    const result = await db.getCollections().devicesCollection.insertOne(payload);

    return result.insertedId.toString();
  },
  async updateDevice(payload: DeviceEntityModel): Promise<boolean> {
    const result = await db.getCollections().devicesCollection.updateOne(
      { deviceId: payload.deviceId },
      {
        $set: payload,
      }
    );

    return result.matchedCount > 0;
  },
  async checkSession(payload: JWTPayloadModel): Promise<boolean> {
    const lastActiveDate = new Date(payload.iat * 1000).toISOString();

    const result = await db
      .getCollections()
      .devicesCollection.findOne({ user_id: payload.user_id, deviceId: payload.deviceId, lastActiveDate: lastActiveDate });

    if (result) {
      return true;
    } else {
      return false;
    }
  },

  async deleteDevices(user_id: string, deviceId: string) {
    const result = await db.getCollections().devicesCollection.deleteMany({
      user_id: user_id,
      deviceId: { $ne: deviceId },
    });

    return result.deletedCount > 0;
  },
  async deleteDevice(deviceId: string, user_id: string) {
    const result = await db.getCollections().devicesCollection.deleteOne({
      user_id: user_id,
      deviceId: deviceId,
    });

    return result.deletedCount > 0;
  },
};
