import type { City } from "../city/City.js";
import type { UserRole } from "./UserRoleEnum.js";


export interface UserParam {
  uuid: string;
  email: string;
  password: string;
  refreshToken: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpiresAt?: Date | null;
  city: City | null;
  role: UserRole;
}
