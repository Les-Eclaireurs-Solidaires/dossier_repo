import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type { AuthResponse } from "../models/authentication/interfaces/AuthResponse.js";
import type { IHashService } from "../models/authentication/interfaces/IHashService.js";
import type { ITokenService } from "../models/authentication/interfaces/ITokenService.js";
import { EmailAlreadyExistError } from "../models/exceptions/DomainError.js";
import { User } from "../models/user/User.js";
import { UserRole } from "../models/user/UserRoleEnum.js";


export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService,
  ) {}
  public async register(email: string, password: string): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistError(email);
    }
    const hashedPassword: string = await this.hashService.hashString(password);

    const newUser: User = User.create(
      email,
      hashedPassword,
      null,
      null,
      null,
      null,
      UserRole.VOLUNTEER,
    );

    const accessToken: string = this.tokenService.generateAccessToken({
      uuid: newUser.getUuid(),
      role: newUser.getRole(),
    });
    const refreshToken: string = this.tokenService.generateRefreshToken({
      uuid: newUser.getUuid(),
      role: newUser.getRole(),
    });
    const hashedRefreshToken: string =
      await this.hashService.hashString(refreshToken);

    newUser.registerNewRefreshToken(hashedRefreshToken);

    await this.userRepository.insertUser(newUser);

    const response: AuthResponse = {
      accessToken,
      refreshToken: refreshToken,
      user: {
        uuid: newUser.getUuid(),
        email: newUser.getEmail(),
        role: newUser.getRole(),
      },
    };

    return response;
  }
}
