import { UserRole } from "../enum/UserRoleEnum";

export interface IAuthResponse {
  uuid: string;
  email: string;
  role: UserRole;
}
