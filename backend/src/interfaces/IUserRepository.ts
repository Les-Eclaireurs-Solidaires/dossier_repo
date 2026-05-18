import type { PoolConnection } from "mysql2/promise";
import type { User } from "../models/user/User.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUuid(
    uuid: string,
    connection?: PoolConnection,
    lock?: boolean,
  ): Promise<User | null>;
  insertUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
}
