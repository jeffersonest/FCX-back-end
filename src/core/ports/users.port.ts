import { User } from '../entities/user.entity';
import { CreateUserDto } from '../../infrastructure/controllers/dto/create-user.dto';
import { UserFilterDto } from '../../infrastructure/controllers/dto/user-filter.dto';

export abstract class UsersPort {
  abstract createUser(user: CreateUserDto): Promise<User>;
  abstract findAllUsers(): Promise<User[]>;
  abstract findUserById(id: number): Promise<User | null>;
  abstract updateUser(id: number, createUserDto: CreateUserDto): Promise<User>;
  abstract deleteUser(id: number): Promise<User>;
  abstract handleDatabaseError(error: any): void;
  abstract filter(userFilterDto: UserFilterDto): Promise<User[]>;
}
