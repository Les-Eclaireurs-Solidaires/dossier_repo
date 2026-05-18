import { Transform } from "class-transformer";
import {
  IsEmail,
  IsEnum,
  MaxLength,
  MinLength,
  NotContains,
} from "class-validator";
import { UserRole } from "../../models/user/UserRoleEnum.js";

export class RegisterDTO {
  @IsEmail({}, { message: "L'adresse email n'est pas valide." })
  @Transform(({ value }) => value.trim())
  @MaxLength(255, {
    message: "L'adresse email ne doit pas dépasser 255 caractères.",
  })
  email!: string;
  @MinLength(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  })
  @MaxLength(255, {
    message: "Le mot de passe ne doit pas dépasser 255 caractères.",
  })
  @NotContains(" ", {
    message: "Le mot de passe ne doit pas contenir d'espaces.",
  })
  password!: string;
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return UserRole[value as keyof typeof UserRole] ?? value;
    }
    return value;
  })
  @IsEnum(UserRole, { message: "Le rôle n'est pas valide." })
  role!: UserRole;
}
