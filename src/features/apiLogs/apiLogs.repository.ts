import { db } from "../../db/db";
import { ApiLogModel } from "./models/apiLog.model";
import { RateLimitOptionsModel } from "./models/rateLimitOptions.model";

export const apiLogsRepository = {
  async save(log: ApiLogModel): Promise<string> {
    const result = await db.getCollections().apiLogsCollection.insertOne(log);
    return result.insertedId.toString();
  },
  async checkRateLimit(options: RateLimitOptionsModel): Promise<boolean> {
    const now = new Date();
    const timeLimit = now.getTime() - options.rate * 1000;

    const result = await db
      .getCollections()
      .apiLogsCollection.find({ URL: options.baseUrl, ip: options.ip, date: { $gte: new Date(timeLimit) } })
      .toArray();

      
    return result.length < options.limit + 1; // + current
  },
};
