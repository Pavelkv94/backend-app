import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { ApiLogEntityModel } from "../../features/apiLogs/models/apiLog.model";

const ApiLogSchema = new Schema<WithId<ApiLogEntityModel>>({
  ip: { type: String, require: true },
  URL: { type: String, require: true },
  date: { type: Date, require: true },
});

export const ApiLogModel = model<WithId<ApiLogEntityModel>>("apiLogs", ApiLogSchema);
