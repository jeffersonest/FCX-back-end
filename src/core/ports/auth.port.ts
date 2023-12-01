import { User } from '../entities/user.entity';

export abstract class AuthPort {
  abstract validateUser(login: string, password: string): Promise<User | null>;
  abstract validateUserPayload(payload: any): Promise<User>;
}
