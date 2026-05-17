import type ms from "ms";
import { UnauthenticatedError } from "../exceptions/AppError.js";
import type { ITokenService } from "../models/authentication/interfaces/ITokenService.js";
import type { TokenPayload } from "../models/authentication/interfaces/TokenPayload.js";
import { UserRole } from "../models/user/UserRoleEnum.js";
import crytoExt from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";

export class TokenService implements ITokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    const {
      JWT_ACCESS_SECRET,
      JWT_ACCESS_EXPIRES_IN,
      JWT_REFRESH_SECRET,
      JWT_REFRESH_EXPIRES_IN,
    } = process.env;

    if (
      !JWT_ACCESS_SECRET ||
      !JWT_ACCESS_EXPIRES_IN ||
      !JWT_REFRESH_SECRET ||
      !JWT_REFRESH_EXPIRES_IN
    ) {
      throw new Error(
        "FATAL ERROR: Variables d'environnement JWT manquantes dans le fichier .env !",
      );
    }

    this.accessSecret = JWT_ACCESS_SECRET;
    this.refreshSecret = JWT_REFRESH_SECRET;
    this.accessExpiresIn = JWT_ACCESS_EXPIRES_IN;
    this.refreshExpiresIn = JWT_REFRESH_EXPIRES_IN;
  }

  generateAccessToken(payload: TokenPayload): string {
    if (!Object.values(UserRole).includes(payload.role))
      throw new UnauthenticatedError();

    const options: SignOptions = {
      expiresIn: this.accessExpiresIn! as ms.StringValue,
    };

    return jwt.sign(payload, this.accessSecret, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    if (!Object.values(UserRole).includes(payload.role))
      throw new UnauthenticatedError();

    const options: SignOptions = {
      expiresIn: this.refreshExpiresIn! as ms.StringValue,
    };

    return jwt.sign({ ...payload }, this.refreshSecret, options);
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessSecret!);
      if (typeof decoded === "object" && decoded !== null) {
        return decoded as TokenPayload;
      }
      throw new UnauthenticatedError();
    } catch {
      throw new UnauthenticatedError();
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret!);
      if (typeof decoded === "object" && decoded !== null) {
        return decoded as TokenPayload;
      }
      throw new UnauthenticatedError();
    } catch {
      throw new UnauthenticatedError();
    }
  }

  generateRandomToken(): string {
    return crytoExt.randomBytes(32).toString("hex");
  }
}
