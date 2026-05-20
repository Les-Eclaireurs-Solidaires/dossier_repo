import type {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { City } from "../models/city/City.js";
import {
  EmailAlreadyExistError,
  UserNotFoundError,
} from "../exceptions/DomainError.js";
import { User } from "../models/user/User.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";

export class UserRepository implements IUserRepository {
  constructor(private db: Pool) {}

  async findByEmail(
    email: string,
    connection?: PoolConnection,
    lock?: boolean,
  ): Promise<User | null> {
    let query: string = `SELECT  
                            u.user_uuid AS uuid,
                            u.user_email AS email,
                            u.user_password AS password,
                            u.user_refresh_token AS refreshToken,
                            u.user_firstname AS firstName,
                            u.user_lastname AS lastName,
                            u.user_avatar AS avatarUrl,
                            u.user_created_at AS createdAt,
                            u.user_updated_at AS updatedAt,
                            u.user_deleted_at AS deletedAt,
                            u.id_city AS cityId,
                            c.city_name,
                            c.city_zip,
                            u.id_role AS roleId
                            FROM \`user\` AS u
                            LEFT JOIN city AS c ON u.id_city = c.city_id
                            LEFT JOIN role AS r ON u.id_role = r.role_id
                            WHERE user_email = ?`;
    if (lock) {
      query += " FOR UPDATE";
    }
    const [rows] = await this.db.execute<RowDataPacket[]>(query, [email]);
    const user = rows[0];

    if (!user) return null;

    let userCity: City | null = null;
    if (user.cityId) {
      userCity = City.hydrate(user.cityId, user.cityName, user.cityZip);
    }

    return User.hydrate({
      uuid: user.uuid,
      email: user.email,
      password: user.password,
      refreshToken: user.refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      city: userCity,
      role: user.roleId,
    });
  }

  async findByUuid(
    uuid: string,
    connection?: PoolConnection,
    lock?: boolean,
  ): Promise<User | null> {
    const db = connection ?? this.db;
    let query = `SELECT 
                      u.user_uuid AS uuid,
                      u.user_email AS email,
                      u.user_password AS password,
                      u.user_refresh_token AS refreshToken,
                      u.user_firstname AS firstName,
                      u.user_lastname AS lastName,
                      u.user_avatar AS avatarUrl,
                      u.user_created_at AS createdAt,
                      u.user_updated_at AS updatedAt,
                      u.user_deleted_at AS deletedAt,
                      u.id_city AS city_id,
                      c.city_name,
                      c.city_zip,
                      u.id_role AS roleId
                      FROM \`user\` AS u
                      LEFT JOIN city AS c ON u.id_city = c.city_id
                      LEFT JOIN role AS r ON u.id_role = r.role_id
                    WHERE user_uuid = ?`;

    if (lock) {
      query += " FOR UPDATE";
    }

    const [rows] = await (db as Pool).execute<RowDataPacket[]>(query, [uuid]);

    const user = rows[0];
    if (!user) return null;

    let userCity: City | null = null;
    if (user.cityId) {
      userCity = City.hydrate(user.cityId, user.cityName, user.cityZip);
    }

    return User.hydrate({
      uuid: user.uuid,
      email: user.email,
      password: user.password,
      refreshToken: user.refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      city: userCity,
      role: user.roleId,
    });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    const query = `SELECT 
                        u.user_uuid AS uuid,
                        u.user_email AS email,
                        u.user_password AS password,
                        u.user_refresh_token AS refreshToken,
                        u.user_firstname AS firstName,
                        u.user_lastname AS lastName,
                        u.user_avatar AS avatarUrl,
                        u.user_created_at AS createdAt,
                        u.user_updated_at AS updatedAt,
                        u.user_deleted_at AS deletedAt,
                        u.user_reset_password_token AS resetPasswordToken,
                        u.user_reset_password_expires_at AS resetPasswordExpiresAt,
                        u.id_city AS city_id,
                        c.city_name AS cityName,
                        c.city_zip AS cityZip,
                        u.id_role AS roleId
                        FROM \`user\` AS u
                        LEFT JOIN city AS c ON u.id_city = c.city_id
                        LEFT JOIN role AS r ON u.id_role = r.role_id
                        WHERE user_reset_password_token = ?`;

    const [rows] = await this.db.execute<RowDataPacket[]>(query, [token]);
    const user = rows[0];
    if (!user) return null;
    let userCity: City | null = null;
    if (user.cityId) {
      userCity = City.hydrate(user.cityId, user.cityName, user.cityZip);
    }
    return User.hydrate({
      uuid: user.uuid,
      email: user.email,
      password: user.password,
      refreshToken: user.refreshToken,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      city: userCity,
      role: user.roleId,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpiresAt: user.resetPasswordExpiresAt,
    });
  }

  async insertUser(user: User): Promise<User> {
    const query = `INSERT INTO \`user\` (
      user_uuid,
      user_email,
      user_password,
      user_refresh_token,
      user_firstname,
      user_lastname,
      user_avatar,
      user_created_at,
      id_city,
      id_role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      user.getUuid(),
      user.getEmail(),
      user.getPassword(),
      user.getRefreshToken(),
      user.getFirstName(),
      user.getLastName(),
      user.getAvatarUrl(),
      user.getCreatedAt(),
      user.getCity() ? user.getCity()!.getId() : null,
      user.getRole(),
    ];

    try {
      const [result] = await this.db.execute<ResultSetHeader>(query, values);

      return user;
    } catch (error: any) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new EmailAlreadyExistError(user.getEmail());
      }
      throw error;
    }
  }

  async updateUser(user: User): Promise<User> {
    const query = `UPDATE \`user\` 
                    SET 
                      user_email = ?, 
                      user_password = ?, 
                      user_refresh_token = ?, 
                      user_firstname = ?, 
                      user_lastname = ?, 
                      user_avatar = ?, 
                      user_updated_at = ?, 
                      id_city = ?, 
                      id_role = ? 
                    WHERE user_uuid = ?`;

    const values = [
      user.getEmail(),
      user.getPassword(),
      user.getRefreshToken(),
      user.getFirstName(),
      user.getLastName(),
      user.getAvatarUrl(),
      user.getUpdatedAt(),
      user.getCity() ? user.getCity()!.getId() : null,
      user.getRole(),
      user.getUuid(),
    ];
    const [result] = await this.db.execute<ResultSetHeader>(query, values);
    if (result.affectedRows === 0) throw new UserNotFoundError();
    return user;
  }
}
