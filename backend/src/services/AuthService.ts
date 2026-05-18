import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type { AuthResponse } from "../models/authentication/interfaces/AuthResponse.js";
import type { IHashService } from "../models/authentication/interfaces/IHashService.js";
import type { ITokenService } from "../models/authentication/interfaces/ITokenService.js";
import {
  EmailAlreadyExistError,
  UserCredentialsError,
  UserNotFoundError,
} from "../exceptions/DomainError.js";
import { User } from "../models/user/User.js";
import { UserRole } from "../models/user/UserRoleEnum.js";
import { UnauthenticatedError } from "../exceptions/AppError.js";

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService,
  ) {}
  public async register(
    email: string,
    password: string,
    role: UserRole,
  ): Promise<AuthResponse> {
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
      role,
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
  public async login(email: string, password: string) {
    if (!email || !password) {
      throw new UserCredentialsError();
    }
    const user: User | null = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserCredentialsError();
    }
    const isPasswordValid: boolean = await this.hashService.compareStringToHash(
      password,
      user.getPassword(),
    );
    if (!isPasswordValid) {
      throw new UserCredentialsError();
    }
    const accessToken: string = this.tokenService.generateAccessToken({
      uuid: user.getUuid(),
      role: user.getRole(),
    });

    const refreshToken: string = this.tokenService.generateRefreshToken({
      uuid: user.getUuid(),
      role: user.getRole(),
    });

    const hashedRefreshToken: string =
      await this.hashService.hashString(refreshToken);

    user.registerNewRefreshToken(hashedRefreshToken);

    const isUpdated = await this.userRepository.updateUser(user);
    if (!isUpdated) throw new UserNotFoundError();

    const response: AuthResponse = {
      accessToken : accessToken,
      refreshToken: refreshToken,
      user: {
        uuid: user.getUuid(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    };

    return response;
  }
  public async logout(uuid: string) {
    const user: User | null = await this.userRepository.findByUuid(uuid);
    if (!user) {
      throw new UserNotFoundError();
    }
    user.resetRefreshToken();
    await this.userRepository.updateUser(user);
  }
  public async getCurrentUser(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
  public async refresh(refreshToken: string) {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findByUuid(payload.uuid);
    if (!user) {
      throw new UserNotFoundError();
    }
    const userRefreshToken = user.getRefreshToken();
    if (userRefreshToken === null) {
      throw new UnauthenticatedError();
    }
    const isRefreshTokenValid = await this.hashService.compareStringToHash(
      refreshToken,
      userRefreshToken,
    );
    if (!isRefreshTokenValid) {
      // DÉTECTION DE VOL DE TOKEN
      // On supprime le token en base pour déconnecter de force tous les appareils de cet utilisateur
      user.resetRefreshToken();
      await this.userRepository.updateUser(user);
      throw new UnauthenticatedError();
    }

    const accessToken = this.tokenService.generateAccessToken({
      uuid: user.getUuid(),
      role: user.getRole(),
    });

    const newRefreshToken = this.tokenService.generateRefreshToken({
      uuid: user.getUuid(),
      role: user.getRole(),
    });

    const hashedRefreshToken =
      await this.hashService.hashString(newRefreshToken);
    user.registerNewRefreshToken(hashedRefreshToken);

    const isUpdated = await this.userRepository.updateUser(user);
    if (!isUpdated) throw new UserNotFoundError();

    const response: AuthResponse = {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        uuid: user.getUuid(),
        email: user.getEmail(),
        role: user.getRole(),
      },
    };

    return response;
  }
}
