import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "./AuthService.js";
import { UserRole } from "../models/user/UserRoleEnum.js";
import {
  EmailAlreadyExistError,
  UserCredentialsError,
  UserNotFoundError,
} from "../exceptions/DomainError.js";
import { UnauthenticatedError } from "../exceptions/AppError.js";

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepository: any;
  let mockHashService: any;
  let mockTokenService: any;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: vi.fn(),
      findByUuid: vi.fn(),
      insertUser: vi.fn(),
      updateUser: vi.fn(),
    };

    mockHashService = {
      hashString: vi.fn(),
      compareStringToHash: vi.fn(),
    };

    mockTokenService = {
      generateAccessToken: vi.fn().mockReturnValue("access_token_generated"),
      generateRefreshToken: vi.fn().mockReturnValue("refresh_token_generated"),
      verifyAccessToken: vi.fn(),
      verifyRefreshToken: vi.fn(),
      generateRandomToken: vi.fn(),
    };

    authService = new AuthService(
      mockUserRepository,
      mockHashService,
      mockTokenService,
    );
  });
  describe("register", () => {
    it("should successfully register a new user when email is unique", async () => {
      mockHashService.hashString.mockResolvedValue("hashed_password");
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.insertUser.mockResolvedValue(true);

      const result = await authService.register(
        "nouveau@test.com",
        "Password123!",
        UserRole.VOLUNTEER,
      );

      expect(result).toBeDefined();
      expect(result.accessToken).toBe("access_token_generated");
      expect(result.refreshToken).toBe("refresh_token_generated");
      expect(mockHashService.hashString).toHaveBeenCalledWith("Password123!");
      expect(mockUserRepository.insertUser).toHaveBeenCalledWith(
        expect.objectContaining({
          password: "hashed_password",
        }),
      );
    });

    it("should throw an EmailAlreadyExistError if the email already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        email: "deja@pris.com",
      });

      await expect(
        authService.register(
          "deja@pris.com",
          "Password123!",
          UserRole.VOLUNTEER,
        ),
      ).rejects.toThrow(EmailAlreadyExistError);

      expect(mockUserRepository.insertUser).not.toHaveBeenCalled();
    });
  });
  describe("login()", () => {
    it("should return tokens and user profile if email and password are valid", async () => {
      const mockUser = {
        getPassword: () => "un_mot_de_passe_hashe",
        getUuid: () => "123-uuid",
        getRole: () => UserRole.VOLUNTEER,
        getEmail: () => "user@test.com",
        registerNewRefreshToken: vi.fn(),
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue(mockUser);
      mockHashService.compareStringToHash.mockResolvedValue(true);

      const result = await authService.login("user@test.com", "Password123!");

      expect(result).toBeDefined();
      expect(result.accessToken).toBe("access_token_generated");
      expect(result.refreshToken).toBe("refresh_token_generated");
      expect(result.user).toEqual({
        uuid: "123-uuid",
        email: "user@test.com",
        role: UserRole.VOLUNTEER,
      });
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(mockUser);
      expect(mockUserRepository.updateUser).toHaveBeenCalledTimes(1);
      expect(mockHashService.compareStringToHash).toHaveBeenCalledWith(
        "Password123!",
        "un_mot_de_passe_hashe",
      );
      expect(mockUser.registerNewRefreshToken).toHaveBeenCalled();
    });
    it("should throw a UserCredentialsError if the email does not exist", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login("user@test.com", "Password123!"),
      ).rejects.toThrow(UserCredentialsError);

      expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    });
    it("should throw a UserCredentialsError if the password is invalid", async () => {
      const mockUser = {
        getPassword: () => "un_mot_de_passe_hashe",
        getUuid: () => "2234-sdsd-uuid",
        getRole: () => UserRole.VOLUNTEER,
        getEmail: () => "user@test.com",
        registerNewRefreshToken: vi.fn(),
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockHashService.compareStringToHash.mockResolvedValue(false);

      await expect(
        authService.login("user@test.com", "Password123!"),
      ).rejects.toThrow(UserCredentialsError);

      expect(mockUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockHashService.compareStringToHash).toHaveBeenCalled();
      expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
      expect(mockTokenService.generateRefreshToken).not.toHaveBeenCalled();
      expect(mockUser.registerNewRefreshToken).not.toHaveBeenCalled();
      expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    });
  });
  describe("refresh()", () => {
    it("should generate new tokens if the provided refresh token matches the database", async () => {
      const oldRefreshToken = "vieux_token_fourni_par_le_cookie";
      const newRefreshToken = "NOUVEAU_TOKEN_TOUT_NEUF";
      const newAccessToken = "NOUVEAU_ACCESS_TOKEN";

      const mockUser = {
        getUuid: () => "123-uuid",
        getRole: () => UserRole.VOLUNTEER,
        getEmail: () => "user@test.com",
        getRefreshToken: () => "vieux_token_hashe_en_bdd",
        registerNewRefreshToken: vi.fn(),
      };
      mockTokenService.verifyRefreshToken.mockReturnValue({
        uuid: "123-uuid",
        role: UserRole.VOLUNTEER,
      });
      mockUserRepository.findByUuid.mockResolvedValue(mockUser);
      mockHashService.compareStringToHash.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockReturnValue(newAccessToken);
      mockTokenService.generateRefreshToken.mockReturnValue(newRefreshToken);
      mockUserRepository.updateUser.mockResolvedValue(true);

      const result = await authService.refresh(oldRefreshToken);

      expect(result.accessToken).toBe(newAccessToken);
      expect(result.refreshToken).toBe(newRefreshToken);
      expect(result.user).toEqual({
        uuid: "123-uuid",
        email: "user@test.com",
        role: UserRole.VOLUNTEER,
      });
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(
        oldRefreshToken,
      );
      expect(mockHashService.compareStringToHash).toHaveBeenCalledWith(
        oldRefreshToken,
        "vieux_token_hashe_en_bdd",
      );
      expect(mockUser.registerNewRefreshToken).toHaveBeenCalled();
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(mockUser);
    });
    it("should throw an UnauthenticatedError and revoke tokens in DB upon token theft detection (different hash)", async () => {
      const oldRefreshToken = "vieux_token_fourni_par_le_cookie";
      const refreshTokenDB = "vieux_token_hashe_en_bdd";
      const mockUser = {
        getUuid: () => "123-uuid",
        getRole: () => UserRole.VOLUNTEER,
        getEmail: () => "user@test.com",
        getRefreshToken: () => refreshTokenDB,
        resetRefreshToken: vi.fn(),
      };

      mockTokenService.verifyRefreshToken.mockReturnValue({
        uuid: "123-uuid",
        role: UserRole.VOLUNTEER,
      });
      mockUserRepository.findByUuid.mockResolvedValue(mockUser);
      mockHashService.compareStringToHash.mockResolvedValue(false);

      await expect(authService.refresh(oldRefreshToken)).rejects.toThrow(
        UnauthenticatedError,
      );

      expect(mockUser.resetRefreshToken).toHaveBeenCalled();
      expect(mockUserRepository.updateUser).toHaveBeenCalled();
      expect(mockUserRepository.updateUser).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
      expect(mockTokenService.generateRefreshToken).not.toHaveBeenCalled();
      expect(mockHashService.hashString).not.toHaveBeenCalled();
    });
    it("should throw an UnauthenticatedError if the user has no refresh token in DB", async () => {
      const mockUser = {
        getUuid: () => "123-uuid",
        getRefreshToken: () => null,
      };
      mockTokenService.verifyRefreshToken.mockReturnValue({
        uuid: "123-uuid",
        role: UserRole.VOLUNTEER,
      });
      mockUserRepository.findByUuid.mockResolvedValue(mockUser);

      await expect(authService.refresh("refresh_token")).rejects.toThrow(
        UnauthenticatedError,
      );

      expect(mockUserRepository.findByUuid).toHaveBeenCalledWith("123-uuid");
    });
  });
  describe("logout()", () => {
    it("should reset the user's refresh token in the database", async () => {
      const mockUser = {
        getUuid: () => "123-uuid",
        resetRefreshToken: vi.fn(),
      };
      mockUserRepository.findByUuid.mockResolvedValue(mockUser);

      await authService.logout("123-uuid");

      expect(mockUser.resetRefreshToken).toHaveBeenCalled();
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(mockUser);
    });

    it("should throw a UserNotFoundError if the UUID is not found", async () => {
      mockUserRepository.findByUuid.mockResolvedValue(null);

      await expect(authService.logout("123-uuid")).rejects.toThrow(
        UserNotFoundError,
      );

      expect(mockUserRepository.findByUuid).toHaveBeenCalledWith("123-uuid");
    });
  });

  describe("getCurrentUser()", () => {
    it("should return the corresponding User entity for a given UUID", async () => {
      const mockUser = {
        getUuid: () => "123-uuid",
        getEmail: () => "user@test.com",
        getRole: () => UserRole.VOLUNTEER,
      };
      mockUserRepository.findByUuid.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser("123-uuid");

      expect(result.getUuid()).toEqual("123-uuid");
      expect(result.getEmail()).toEqual("user@test.com");
      expect(result.getRole()).toEqual(UserRole.VOLUNTEER);
      expect(mockUserRepository.findByUuid).toHaveBeenCalledWith("123-uuid");
    });
    it("should throw a UserNotFoundError if the UUID is not found", async () => {
      mockUserRepository.findByUuid.mockResolvedValue(null);

      await expect(authService.getCurrentUser("123-uuid")).rejects.toThrow(
        UserNotFoundError,
      );

      expect(mockUserRepository.findByUuid).toHaveBeenCalledWith("123-uuid");
    });
  });
});
