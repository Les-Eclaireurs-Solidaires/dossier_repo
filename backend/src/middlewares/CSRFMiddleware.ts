import type { NextFunction, Request, Response } from "express";
import { CSRFError } from "../exceptions/AppError.js";

const EXCLUDED_METHODS = ["GET", "HEAD", "OPTIONS"];

const EXCLUDED_ROUTES = ["/auth/login", "/auth/register", "/auth/refresh"];

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (EXCLUDED_METHODS.includes(req.method) || EXCLUDED_ROUTES.includes(req.path)) {
    return next();
  }

  const csrfTokenFromCookie = req.cookies["XSRF-TOKEN"];
  const csrfTokenFromHeader = req.headers["x-xsrf-token"];

  if (!csrfTokenFromCookie || !csrfTokenFromHeader) {
    return next(new CSRFError());
  }

  if (csrfTokenFromCookie !== csrfTokenFromHeader) {
    return next(new CSRFError());
  }

  next();
};