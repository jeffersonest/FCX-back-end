import { User } from '../entities/user.entity';
import { RecoverAccessDto } from '../../infrastructure/controllers/dto/recover-access.dto';

export abstract class AuthPort {
  abstract validateUser(login: string, password: string): Promise<User | null>;
  abstract validateUserPayload(payload: any): Promise<User>;
  abstract recoverPassword(recoverAccessDto: RecoverAccessDto): Promise<any>;
}
