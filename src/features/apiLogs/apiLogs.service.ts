import { ApiLogsRepository, apiLogsRepository } from "./apiLogs.repository";
import { ApiLogInputModel } from "./models/apiLog.model";
import { RateLimitOptionsModel } from "./models/rateLimitOptions.model";

export class ApiLogsService {
  constructor(public apiLogsRepository: ApiLogsRepository) {}

  async saveLog(log: ApiLogInputModel): Promise<string> {
    const logId = await this.apiLogsRepository.save(log);
    return logId;
  }
  async checkRateLimit(options: RateLimitOptionsModel): Promise<boolean> {
    const isAllowed = await this.apiLogsRepository.checkRateLimit(options);
    return isAllowed;
  }
}

export const apiLogsService = new ApiLogsService(apiLogsRepository);
