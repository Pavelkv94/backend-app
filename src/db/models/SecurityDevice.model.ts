import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { DeviceEntityModel } from "../../features/securityDevices/models/securityDevices.model";

const SecurityDeviceSchema = new Schema<WithId<DeviceEntityModel>>({
  title: { type: String, require: true },
  expirationDate: { type: Number, require: true },
  ip: { type: String, require: true },
  deviceId: { type: String, require: true },
  lastActiveDate: { type: String, require: true },
  user_id: { type: String, require: true },
});

export const SecurityDeviceModel = model<WithId<DeviceEntityModel>>("devices", SecurityDeviceSchema);
