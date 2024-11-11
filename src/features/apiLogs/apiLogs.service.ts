import { apiLogsRepository } from "./apiLogs.repository";
import { ApiLogModel } from "./models/apiLog.model";
import { RateLimitOptionsModel } from "./models/rateLimitOptions.model";

export const apiLogsService = {
  async saveLog(log: ApiLogModel): Promise<string> {
    const logId = await apiLogsRepository.save(log);
    return logId;
  },
  async checkRateLimit(options: RateLimitOptionsModel): Promise<boolean> {
    const isAllowed = await apiLogsRepository.checkRateLimit(options);
    return isAllowed;
  },
};
