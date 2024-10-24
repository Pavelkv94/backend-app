import { ObjectId, WithId } from "mongodb";
import { db } from "../../db/db";
import { EmailConfirmationEntityType, UserEntityModelWithoutPassword, UsersValidInputQueryModel, UserViewModel } from "./models/users.models";
import { OutputDataWithPagination } from "../../types/common-types";
import { MeViewModel } from "../auth/models/auth.models";

export const usersQueryRepository = {
  async findAllUsers(query: UsersValidInputQueryModel): Promise<OutputDataWithPagination<UserViewModel>> {
    const { pageSize, pageNumber, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = query;

    let filter: any = {
      $or: [],
    };

    if (searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    }
    if (searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    }

    if (filter.$or.length === 0) {
      filter = {};
    }

    const usersFromDb = await db
      .getCollections()
      .usersCollection.find(filter, { projection: { password: 0 } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();

    const usersView = this.mapUsersToOutput(usersFromDb);

    const usersCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm);

    return {
      pagesCount: Math.ceil(usersCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: usersCount,
      items: usersView,
    };
  },
  async getUsersCount(searchLoginTerm: string, searchEmailTerm: string): Promise<number> {
    let filter: any = {
      $or: [],
    };

    if (searchLoginTerm) {
      filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    }
    if (searchEmailTerm) {
      filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    }

    if (filter.$or.length === 0) {
      filter = {};
    }

    return db.getCollections().usersCollection.countDocuments(filter);
  },
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
  async findUserByEmail(email: string): Promise<WithId<UserEntityModelWithoutPassword> | null> {
    const userFromDb = await db.getCollections().usersCollection.findOne({ email: email }, { projection: { password: 0 } });

    if (!userFromDb) {
      return null;
    } else {
      return userFromDb;
    }
  },
  async findEmailConfirmationByUser(id: string): Promise<EmailConfirmationEntityType | null> {
    const objectId = new ObjectId(id);
    const userFromDb = await db.getCollections().usersCollection.findOne({ _id: objectId });

    if (!userFromDb) {
      return null;
    } else {
      return userFromDb.emailConfirmation;
    }
  },
  async findUserByEmailConfirmation(code: string): Promise<WithId<UserEntityModelWithoutPassword> | null> {
    const userFromDb = await db.getCollections().usersCollection.findOne({ "emailConfirmation.confirmationCode": code }, { projection: { password: 0 } });

    if (!userFromDb) {
      return null;
    } else {
      return userFromDb;
    }
  },
  async findMe(user_id: string): Promise<MeViewModel | null> {
    const objectId = new ObjectId(user_id);
    const userFromDb = await db.getCollections().usersCollection.findOne({ _id: objectId }, { projection: { password: 0, createdAt: 0, _id: 0 } });

    if (!userFromDb) {
      return null;
    } else {
      const user = { ...userFromDb, userId: user_id };
      return user;
    }
  },
  mapUsersToOutput(users: WithId<UserEntityModelWithoutPassword>[]): UserViewModel[] {
    return users.map((user) => ({ ...user, id: user._id.toString() })).map(({ _id, ...rest }) => rest);
  },
};
