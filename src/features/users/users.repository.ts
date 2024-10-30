import { ObjectId, WithId } from "mongodb";
import { db } from "../../db/db";
import { UserEntityModel, UserViewModel } from "./models/users.models";

export const usersRepository = {
  async findUser(id: string): Promise<UserViewModel | null> {
    const objectId = new ObjectId(id);
    const userFromDb = await db.getCollections().usersCollection.findOne({ _id: objectId }, { projection: { password: 0 } });

    if (!userFromDb) {
      return null;
    } else {
      const user = { ...userFromDb, id: userFromDb._id.toString() };
      const { _id, ...rest } = user;
      return rest;
    }
  },
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserEntityModel> | null> {
    const user = await db.getCollections().usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });

    return user;
  },
  async create(payload: UserEntityModel): Promise<string> {
    const result = await db.getCollections().usersCollection.insertOne(payload);

    return result.insertedId.toString();
  },
  async deleteUser(id: string): Promise<boolean> {
    const objectId = new ObjectId(id);
    const result = await db.getCollections().usersCollection.deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  },
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<boolean> {
    const objectId = new ObjectId(user_id);
    const result = await db.getCollections().usersCollection.updateOne({ _id: objectId }, { $set: { "emailConfirmation.isConfirmed": status } });

    return result.matchedCount > 0;
  },
  async setConfirmCode(user_id: string, newCode: string, newDate: string): Promise<boolean> {
    const objectId = new ObjectId(user_id);
    const result = await db
      .getCollections()
      .usersCollection.updateOne({ _id: objectId }, { $set: { "emailConfirmation.confirmationCode": newCode, "emailConfirmation.expirationDate": newDate } });

    return result.matchedCount > 0;
  }
};
