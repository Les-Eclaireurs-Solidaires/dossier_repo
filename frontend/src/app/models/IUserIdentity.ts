import { UserRole } from "../enum/UserRoleEnum";

export interface IUserIdentity {
  uuid: string;
  email: string;
  role: UserRole;
}
