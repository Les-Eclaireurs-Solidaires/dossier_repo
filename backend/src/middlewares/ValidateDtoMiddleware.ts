import { plainToInstance, type ClassConstructor } from "class-transformer";
import { validate } from "class-validator";
import type { NextFunction, Request, Response} from "express";
import { DtoValidationError } from "../config/AppError.js";


export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      throw new DtoValidationError(
        errors.map((e) => ({
          property: e.property,
          constraints: e.constraints,
        })),
      );
    }
    res.locals.validateBody = dtoInstance;
    next();
  };
}
