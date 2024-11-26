import { ApiLogModel } from "../../db/models/ApiLog.model";
import { ApiLogInputModel } from "./models/apiLog.model";
import { RateLimitOptionsModel } from "./models/rateLimitOptions.model";

export class ApiLogsRepository {
  async save(log: ApiLogInputModel): Promise<string> {
    const apiLog = new ApiLogModel(log);
    const result = await apiLog.save();
    return result.id;
  }
  async checkRateLimit(options: RateLimitOptionsModel): Promise<boolean> {
    const now = new Date();
    const timeLimit = now.getTime() - options.rate * 1000;

    const result = await ApiLogModel.find({ URL: options.baseUrl, ip: options.ip, date: { $gte: new Date(timeLimit) } }).lean();

    return result.length < options.limit + 1; // + current
  }
}

export const apiLogsRepository = new ApiLogsRepository()
