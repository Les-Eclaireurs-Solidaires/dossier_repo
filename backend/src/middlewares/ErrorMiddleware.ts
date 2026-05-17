import type { Request, Response, NextFunction } from "express";
import { DomainError } from "../exceptions/DomainError.js";
import { AppError, DtoValidationError } from "../exceptions/AppError.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof DomainError || err instanceof AppError) {
    const payload: {
      message: string;
      errors?: {
        property: string;
        constraints: string;
      }[];
    } = {
      message: err.message,
    };
    if (err instanceof DtoValidationError) {
      payload.errors = err.errors;
    }
    return res.status(err.statusCode).json(payload);
  }
  return res.status(500).json({
    message: "Erreur interne du serveur.",
    stack: err.stack,
  });
};
