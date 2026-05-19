import { CityMapper } from "../city/CityMapper.js";
import { User } from "./User.js";

export class UserMapper {
  static toDomain(raw: any): User {
    return User.hydrate({
      uuid: raw.uuid,
      email: raw.email,
      password: raw.password,
      refreshToken: raw.refreshToken,
      firstName: raw.firstName,
      lastName: raw.lastName,
      avatarUrl: raw.avatarUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      city: CityMapper.toDomain(raw),
      role: raw.roleId,
      resetPasswordToken: raw.resetPasswordToken,
      resetPasswordExpiresAt: raw.resetPasswordExpiresAt,
    });
  }
  static toProfile(user: User): any {
    return {
      uuid: user.getUuid(),
      email: user.getEmail(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      avatarUrl: user.getAvatarUrl(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      city: user.getCity(),
      role: user.getRole(),
    };
  }
}
