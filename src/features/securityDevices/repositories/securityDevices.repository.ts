import { injectable } from "inversify";
import { SecurityDeviceModel } from "../../../db/models/SecurityDevice.model";
import { DeviceEntityModel } from "../models/securityDevices.model";
@injectable()
export class SecurityDeviceRepository {
  async findDevice(deviceId: string): Promise<string | null> {
    const device = await SecurityDeviceModel.findOne({ deviceId }).lean();

    if (!device) {
      return null;
    }

    return device.user_id;
  }
  async addDevice(payload: DeviceEntityModel): Promise<string> {
    const device = new SecurityDeviceModel(payload);
    const result = await device.save();

    return result.id.toString();
  }
  async updateDevice(payload: DeviceEntityModel): Promise<boolean> {
    const result = await SecurityDeviceModel.updateOne(
      { deviceId: payload.deviceId },
      {
        $set: payload,
      }
    );

    return result.matchedCount > 0;
  }

  async deleteDevices(user_id: string, deviceId: string) {
    const result = await SecurityDeviceModel.deleteMany({
      user_id: user_id,
      deviceId: { $ne: deviceId },
    });

    return result.deletedCount > 0;
  }
  async deleteDevice(deviceId: string, user_id: string) {
    const result = await SecurityDeviceModel.deleteOne({
      user_id: user_id,
      deviceId: deviceId,
    });

    return result.deletedCount > 0;
  }
}
