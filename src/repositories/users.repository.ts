import { usersCollection } from "../db/db";
import { UserDbType } from "../db/user-db-type";

export const usersRepository = {
  async find(id: string) {
    const user = usersCollection.findOne({ id: id }, { projection: { _id: 0 } });

    if (!user) {
      return null;
    }
    return user;
  },
  async create(payload: UserDbType) {
    const result = await usersCollection.insertOne(payload);

    return result;
  },
};
