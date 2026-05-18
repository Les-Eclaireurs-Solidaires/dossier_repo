import type { NextFunction, Request, Response } from "express";
import type { ITokenService } from "../models/authentication/interfaces/ITokenService.js";
import { UnauthenticatedError } from "../exceptions/AppError.js";

export const requireAuth = (tokenService: ITokenService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new UnauthenticatedError();
      }

      const payload = tokenService.verifyAccessToken(token);
      req.user = payload;

      next();
    } catch (error) {
      next(error);
    }
  };
};
