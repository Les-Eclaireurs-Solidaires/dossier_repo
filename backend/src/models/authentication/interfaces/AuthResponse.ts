import type { UserRole } from "../../user/UserRoleEnum.js";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    uuid: string;
    email: string;
    role: UserRole;
  }
}

