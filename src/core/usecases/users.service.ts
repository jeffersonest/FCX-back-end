import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import {UsersPort} from "../ports/users.port";

@Injectable()
export class UsersService {
  constructor(private usersPort: UsersPort) {}

  async createUser(user: User): Promise<User> {
    return this.usersPort.createUser(user);
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersPort.findAllUsers();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersPort.findUserById(id);
  }

  async updateUser(id: number, user: User): Promise<User> {
    return this.usersPort.updateUser(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.usersPort.deleteUser(id);
  }
}
