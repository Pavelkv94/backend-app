import { db } from "../../db/db";
import { DeviceEntityModel, DeviceViewModel } from "./models/securityDevices.model";

export const securityDevicesQueryRepository = {
  async findDevice(device_id: string) {
    const deviceFromDb = await db.getCollections().devicesCollection.findOne({ deviceId: device_id });
    return !!deviceFromDb;
  },
  async getSecurityDevices(user_id: string): Promise<DeviceViewModel[]> {
    const result = await db.getCollections().devicesCollection.find({ user_id }).toArray();

    return this.mapSecurityDevicesToOutput(result);
  },
  mapSecurityDevicesToOutput(devices: DeviceEntityModel[]): DeviceViewModel[] {
    return devices.map((device) => ({
      title: device.title,
      ip: device.ip,
      deviceId: device.deviceId,
      lastActiveDate: device.lastActiveDate,
    }));
  },
};
