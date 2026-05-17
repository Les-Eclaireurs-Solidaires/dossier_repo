import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthService } from "./AuthService.js";
import { UserRole } from "../models/user/UserRoleEnum.js";
import { EmailAlreadyExistError } from "../exceptions/DomainError.js";

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
    };

    mockHashService = {
      hashString: vi.fn().mockResolvedValue("hashed_password"),
      compareStringToHash: vi.fn(),
    };

    mockTokenService = {
      generateAccessToken: vi.fn().mockReturnValue("abc"),
      generateRefreshToken: vi.fn().mockReturnValue("xyz"),
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
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.insertUser.mockResolvedValue(true);

      const result = await authService.register(
        "nouveau@test.com",
        "Password123!",
        UserRole.VOLUNTEER,
      );

      expect(result).toBeDefined();
      expect(result.accessToken).toBe("abc");
      expect(result.refreshToken).toBe("xyz");
      expect(mockHashService.hashString).toHaveBeenCalledWith("Password123!");
      expect(mockUserRepository.insertUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "nouveau@test.com",
          role: UserRole.VOLUNTEER,
          password: "hashed_password",
        }),
      );
    });

    it("should throw an EmailAlreadyExistError if the email already exists", async () => {
      // GIVEN
      mockUserRepository.findByEmail.mockResolvedValue({
        uuid: "123",
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
});
