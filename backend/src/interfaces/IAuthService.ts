import type { AuthResponse } from "../models/authentication/interfaces/AuthResponse.js"
import type { User } from "../models/user/User.js"
import type { UserRole } from "../models/user/UserRoleEnum.js"

export interface IAuthService{
    register(email: string, password: string, role: UserRole): Promise<AuthResponse>
    login(email: string, password: string): Promise<AuthResponse>
    logout(uuid: string): Promise<void>
    getCurrentUser(uuid: string): Promise<User>
    refresh(refreshToken: string): Promise<AuthResponse>
    forgotPassword(email: string): Promise<void>
    resetPassword(token: string, password: string): Promise<void>

}