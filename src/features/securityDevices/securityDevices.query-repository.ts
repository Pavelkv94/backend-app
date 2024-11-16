import { SecurityDeviceModel } from "../../db/models/SecurityDevice.model";
import { DeviceViewDto } from "./dto";
import { DeviceViewModel } from "./models/securityDevices.model";

export const securityDevicesQueryRepository = {
  async findDevice(device_id: string): Promise<boolean> {
    const deviceFromDb = await SecurityDeviceModel.findOne({ deviceId: device_id });
    return !!deviceFromDb;
  },
  async getSecurityDevices(user_id: string): Promise<DeviceViewModel[]> {
    const devices = await SecurityDeviceModel.find({ user_id });

    return DeviceViewDto.mapToViewArray(devices);
  },
};
