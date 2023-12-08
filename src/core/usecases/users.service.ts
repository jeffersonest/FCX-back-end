import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersPort } from '../ports/users.port';
import { CreateUserDto } from '../../infrastructure/controllers/dto/create-user.dto';
import { UserFilterDto } from '../../infrastructure/controllers/dto/user-filter.dto';
import { UpdateUserDto } from '../../infrastructure/controllers/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersPort: UsersPort) {}

  async createUser(user: CreateUserDto): Promise<User> {
    return this.usersPort.createUser(user);
  }

  async findAllUsers(): Promise<User[]> {
    return this.usersPort.findAllUsers();
  }

  async findUserById(id: number): Promise<User | null> {
    return this.usersPort.findUserById(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersPort.updateUser(id, updateUserDto);
  }

  async deleteUser(id: number): Promise<User> {
    return this.usersPort.deleteUser(id);
  }

  async filter(userFilterDto: UserFilterDto): Promise<User[]> {
    return this.usersPort.filter(userFilterDto);
  }

  async userDetails(): Promise<any> {
    return this.usersPort.usersDetails();
  }
}
