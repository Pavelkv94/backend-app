import { DeviceDocument, DeviceViewModel } from "../models/securityDevices.model";

export class DeviceViewDto {
  title: string;
  ip: string;
  deviceId: string;
  lastActiveDate: string;

  constructor(model: DeviceDocument) {
    this.title = model.title;
    this.ip = model.ip;
    this.deviceId = model.deviceId;
    this.lastActiveDate = model.lastActiveDate;
  }

  static mapToView(post: DeviceDocument): DeviceViewModel {
    return new DeviceViewDto(post);
  }

  static mapToViewArray(posts: DeviceDocument[]): DeviceViewModel[] {
    return posts.map((post) => this.mapToView(post));
  }
}
