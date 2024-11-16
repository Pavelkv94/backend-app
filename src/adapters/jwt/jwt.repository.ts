// import { WithId } from "mongodb";
// import { db } from "../../db/db";
// import { TokenEntityModel } from "./models/jwt.models";

// export const jwtRepository = {
//   async addToBlackList(token: string): Promise<string> {
//     const result = await db.getCollections().tokensBlackListCollection.insertOne({ token });
//     return result.insertedId.toString();
//   },
//   async findInBlackList(token: string): Promise<WithId<TokenEntityModel> | null> {
//     const result = await db.getCollections().tokensBlackListCollection.findOne({ token });
//     return result;
//   },
// };
