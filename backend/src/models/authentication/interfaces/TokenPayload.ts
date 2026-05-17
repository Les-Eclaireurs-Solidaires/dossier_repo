import type { UserRole } from "../../user/UserRoleEnum.js";

export interface TokenPayload {
  uuid: string;
  role: UserRole;
}
