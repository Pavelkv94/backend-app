import { ObjectId, WithId } from "mongodb";
import { db } from "../../db/db";
import { UserEntityModel, UserViewModel } from "../../input-output-types/users-types";

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
};
