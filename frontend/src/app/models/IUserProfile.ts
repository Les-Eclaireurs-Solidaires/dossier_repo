import { UserRole } from "../enum/UserRoleEnum";
import { ICity } from "./ICity";

export interface IUserProfile{
    uuid: string;
      email: string,
      firstName: string | null,
      lastName: string | null,
      avatarUrl: string,
      createdAt: string,
      updatedAt: string | null,
      city: ICity | null,
      role: UserRole,
}