export type DeviceEntityModel = {
  title: string;
  expirationDate: number;
  ip: string;
  deviceId: string;
  lastActiveDate: string;
  user_id: string;
};

export type DeviceViewModel = {
  title: string;
  ip: string;
  deviceId: string;
  lastActiveDate: string;
};

export type URIParamsDeviceModel = {
  id: string;
};