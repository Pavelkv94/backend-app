import { EmailConfirmationEntityType, RecoveryPasswordEntityType, UsersValidInputQueryModel, UserViewModel } from "../models/users.models";
import { OutputDataWithPagination } from "../../../types/common-types";
import { MeViewModel } from "../../auth/models/auth.models";
import { UserModel } from "../../../db/models/User.model";
import { MeViewDto, UserViewDto } from "./dto";

export class UserQueryRepository {
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

    const usersFromDb = await UserModel.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection });

    const usersView = UserViewDto.mapToViewArray(usersFromDb);

    const usersCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm);

    return {
      pagesCount: Math.ceil(usersCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: usersCount,
      items: usersView,
    };
  }
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

    return UserModel.countDocuments(filter);
  }
  async findUserById(id: string): Promise<UserViewModel | null> {
    const userFromDb = await UserModel.findOne({ _id: id });

    if (!userFromDb) {
      return null;
    }

    return UserViewDto.mapToView(userFromDb);
  }
  async findUserByEmail(email: string): Promise<UserViewModel | null> {
    const userFromDb = await UserModel.findOne({ email: email });

    if (!userFromDb) {
      return null;
    }

    return UserViewDto.mapToView(userFromDb);
  }
  async findUserByConfirmationCode(code: string): Promise<UserViewModel | null> {
    const userFromDb = await UserModel.findOne({ 'emailConfirmation.confirmationCode': code });

    if (!userFromDb) {
      return null;
    }

    return UserViewDto.mapToView(userFromDb);
  }
  async findEmailConfirmationByCode(code: string): Promise<EmailConfirmationEntityType | null> {
    const userFromDb = await UserModel.findOne({ 'emailConfirmation.confirmationCode': code }).lean();

    if (!userFromDb) {
      return null;
    }

    return userFromDb.emailConfirmation;
  }
  async findEmailConfirmationByEmail(email: string): Promise<EmailConfirmationEntityType | null> {
    const userFromDb = await UserModel.findOne({ email: email }).lean();

    if (!userFromDb) {
      return null;
    }

    return userFromDb.emailConfirmation;
  }
  async findRecoveryByCode(code: string): Promise<RecoveryPasswordEntityType | null> {
    const userFromDb = await UserModel.findOne({ "recoveryConfirmation.recoveryCode": code }).lean();

    if (!userFromDb) {
      return null;
    }

    return userFromDb.recoveryConfirmation;
  }
  async findMe(user_id: string): Promise<MeViewModel | null> {
    const userFromDb = await UserModel.findOne({ _id: user_id });

    if (!userFromDb) {
      return null;
    }

    const meDto = new MeViewDto(userFromDb);

    return meDto;
  }
}

export const userQueryRepository = new UserQueryRepository();
