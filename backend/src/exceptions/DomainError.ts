export abstract class DomainError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this,  new.target.prototype);
  }
}
 export class EmailAlreadyExistError extends DomainError {
  constructor(email: string) {
    super(`L'email ${email} est déjà utilisé.`, 409);
  }
}
export class UserEmailError extends DomainError {
  constructor() {
    super("L'email est obligatoire");
  }
}
export class UserPasswordError extends DomainError {
  constructor() {
    super("Le mot de passe est obligatoire");
  }
}
export class UserRoleError extends DomainError {
  constructor() {
    super("Le rôle est obligatoire");
  }
}
export class CityNotEmptyError extends DomainError {
  constructor() {
    super("Le nom de la ville ne peut pas être vide.");
  }
}
export class ZipNotEmptyError extends DomainError {
  constructor() {
    super("Le code postal ne peut pas être vide.");
  }
} 
