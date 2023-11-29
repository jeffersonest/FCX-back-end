// src/core/ports/user.port.ts

import { User } from '../entities/user.entity';

export abstract class UsersPort {
  abstract createUser(user: User): Promise<User>;
  abstract findAllUsers(): Promise<User[]>;
  abstract findUserById(id: number): Promise<User | null>;
  abstract updateUser(id: number, user: User): Promise<User>;
  abstract deleteUser(id: number): Promise<void>;
}
