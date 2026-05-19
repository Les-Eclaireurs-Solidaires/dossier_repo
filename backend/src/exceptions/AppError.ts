export abstract class AppError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class EnvironmentVariableError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}
export class CorsError extends AppError {
  constructor() {
    super(`Erreur de protection Cors.`, 403);
  }
}
export class DtoValidationError extends AppError {
  public readonly errors: {
    property: string;
    constraints: string;
  }[];

  constructor(errors: any[]) {
    super("Validation failed");
    this.errors = errors;
  }
}
export class UnauthenticatedError extends AppError {
  constructor() {
    super("Token manquant, expiré ou invalide.", 401);
  }
}
export class CSRFError extends AppError {
  constructor() {
    super(`Erreur de protection CSRF.`, 403);
  }
}
export class InvalidResetPasswordTokenError extends AppError {
  constructor() {
    super(
      `Erreur de récupération du token de réinitialisation de mot de passe.`,
    );
  }
}
export class InvalidDateResetPasswordTokenError extends AppError {
  constructor() {
    super(`Token de réinitialisation de mot de passe expiré.`);
  }
}

