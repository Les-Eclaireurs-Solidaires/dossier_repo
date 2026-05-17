import { City } from "../city/City.js";
import {
  UserEmailError,
  UserPasswordError,
  UserRoleError,
} from "../../exceptions/DomainError.js";
import type { UserParam } from "./UserParam.js";
import type { UserRole } from "./UserRoleEnum.js";

export class User {
  private uuid: string;
  private email: string;
  private password: string;
  private refreshToken: string | null;
  private firstName: string | null;
  private lastName: string | null;
  private avatarUrl: string;
  private createdAt: Date;
  private updatedAt: Date | null;
  private deletedAt: Date | null;
  private city: City | null;
  private role: UserRole;

  private constructor(
    uuid: string,
    email: string,
    password: string,
    refreshToken: string | null,
    firstName: string | null,
    lastName: string | null,
    avatarUrl: string,
    createdAt: Date,
    updatedAt: Date | null,
    deletedAt: Date | null,
    city: City | null,
    role: UserRole,
  ) {
    this.uuid = uuid;
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatarUrl = avatarUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
    this.city = city;
    this.role = role;
  }

  public static create(
    email: string,
    password: string,
    firstName: string | null,
    lastName: string | null,
    avatarUrl: string | null,
    city: City | null,
    role: UserRole,
  ): User {
    const generateUUID = crypto.randomUUID();
    const generateCreatedDate = new Date();
    const finalAvatarUrl = avatarUrl ?? "public/avatar/default.png";

    if (!email || email.trim() === "") throw new UserEmailError();
    if (!password) throw new UserPasswordError();
    if (!role) throw new UserRoleError();
    return new User(
      generateUUID,
      email,
      password,
      null,
      firstName,
      lastName,
      finalAvatarUrl,
      generateCreatedDate,
      null,
      null,
      city,
      role,
    );
  }
  public static hydrate(param: UserParam): User {
    return new User(
      param.uuid,
      param.email,
      param.password,
      param.refreshToken,
      param.firstName,
      param.lastName,
      param.avatarUrl,
      param.createdAt,
      param.updatedAt,
      param.deletedAt,
      param.city,
      param.role,
    );
  }
  public registerNewRefreshToken(newRefreshToken: string): void {
    this.refreshToken = newRefreshToken;
  }
  public resetRefreshToken(): void {
    this.refreshToken = null;
  }
  public changeEmail(newEmail: string): void {
    this.email = newEmail;
    this.updatedAt = new Date();
  }
  public changePassword(newPassword: string): void {
    this.password = newPassword;
    this.updatedAt = new Date();
  }
  public getUuid(): string {
    return this.uuid;
  }
  public getEmail(): string {
    return this.email;
  }
  public getPassword(): string {
    return this.password;
  }
  public getRole(): UserRole {
    return this.role;
  }
  public getRefreshToken(): string | null {
    return this.refreshToken;
  }
  public getFirstName(): string | null {
    return this.firstName;
  }
  public getLastName(): string | null {
    return this.lastName;
  }
  public getAvatarUrl(): string {
    return this.avatarUrl;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public getUpdatedAt(): Date | null {
    return this.updatedAt;
  }
  public getDeletedAt(): Date | null {
    return this.deletedAt;
  }
  public getCity(): City | null {
    return this.city;
  }
}
