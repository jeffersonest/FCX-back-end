import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  createQueryBuilder,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from '../../core/entities/user.entity';
import { UsersPort } from '../../core/ports/users.port';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { UserFilterDto } from '../controllers/dto/user-filter.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersAdapter implements UsersPort {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      const user = new User();
      user.name = createUserDto.name;
      user.login = createUserDto.login;
      user.email = createUserDto.email;
      user.password = hashedPassword;
      user.birth = createUserDto.birth;
      user.phone = createUserDto.phone;
      user.cpf = createUserDto.cpf;
      user.motherName = createUserDto.motherName;
      user.status = createUserDto.status;

      const userData = await this.userRepository.save(user);

      delete userData.password;

      return userData;
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('Usuário não encontrado.', 404);
    } else {
      delete user.password;
      return user;
    }
  }

  async updateUser(id: number, userData: CreateUserDto): Promise<User> {
    try {
      if (userData.email) {
        const existingUserByEmail = await this.userRepository.findOneBy({
          email: userData.email,
        });
        if (existingUserByEmail && existingUserByEmail.id != id) {
          throw new HttpException('O email fornecido já está em uso.', 400);
        }
      }

      if (userData.login) {
        const existingUserByLogin = await this.userRepository.findOneBy({
          login: userData.login,
        });
        if (existingUserByLogin && existingUserByLogin.id != id) {
          throw new HttpException('O login fornecido já está em uso.', 400);
        }
      }

      if (userData.cpf) {
        const existingUserByCpf = await this.userRepository.findOneBy({
          cpf: userData.cpf,
        });
        if (existingUserByCpf && existingUserByCpf.id != id) {
          throw new HttpException('O CPF fornecido já está em uso.', 400);
        }
      }

      if (userData.phone) {
        const existingUserByPhone = await this.userRepository.findOneBy({
          phone: userData.phone,
        });
        if (existingUserByPhone && existingUserByPhone.id != id) {
          throw new HttpException(
            'O número de telefone fornecido já está em uso.',
            400,
          );
        }
      }

      if (userData.password) {
        const saltRounds = 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);
      }

      const result = await this.userRepository.update(id, userData);
      if (result.affected === 0) {
        throw new HttpException('Usuário não encontrado.', 404);
      }

      const user = await this.userRepository.findOneBy({ id });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.handleDatabaseError(error);
    }
  }

  async deleteUser(id: number): Promise<User> {
    const result: UpdateResult = await this.userRepository.update(id, {
      status: 'false',
    });
    if (result.affected === 0) {
      throw new HttpException('Usuário não encontrado.', 404);
    }
    const user = await this.userRepository.findOneBy({ id });
    delete user.password;
    return user;
  }

  handleDatabaseError(error: any): void {
    if (error.code === '23505') {
      // Código de erro para violação de chave única no PostgreSQL
      if (error.detail.includes('email')) {
        throw new HttpException('O email fornecido já está em uso.', 400);
      }
      if (error.detail.includes('login')) {
        throw new HttpException('O login fornecido já está em uso.', 400);
      }
      if (error.detail.includes('cpf')) {
        throw new HttpException('O CPF fornecido já está em uso.', 400);
      }
      if (error.detail.includes('phone')) {
        new HttpException(
          'O número de telefone fornecido já está em uso.',
          400,
        );
      }
    }
    throw new HttpException(
      'Ocorreu um erro ao processar sua solicitação.',
      500,
    );
  }

  async filter(userFilterDto: UserFilterDto): Promise<User[]> {
    const {
      userActive,
      filterValue,
      filterType,
      birthDateBegin,
      ageRange,
      birthDateEnd,
      registerDateBegin,
      registerDateEnd,
      updateDateBegin,
      updateDateEnd,
    } = userFilterDto;

    const query = this.userRepository.createQueryBuilder('user');

    if (userActive !== undefined) {
      query.andWhere('user.status = :status', { status: userActive });
    }

    if (ageRange) {
      const [ageFrom, ageTo] = ageRange.split('>').map((age) => parseInt(age));
      const currentDate = new Date().toISOString().slice(0, 10);

      query.andWhere(
        `DATE_PART('year', AGE(:currentDate, user.birth)) >= :ageFrom AND DATE_PART('year', AGE(:currentDate, user.birth)) <= :ageTo`,
        { currentDate, ageFrom, ageTo },
      );
    }

    if (filterValue && filterType) {
      if (filterType === 'CPF') {
        query.andWhere('user.cpf = :cpf', { cpf: filterValue });
      }
      // Adicione aqui outras condições de filtro baseadas em 'filterType'
    }

    // Filtros de data - ajuste conforme sua lógica
    if (birthDateBegin) {
      query.andWhere('user.birth >= :birthDateBegin', { birthDateBegin });
    }
    if (birthDateEnd) {
      query.andWhere('user.birth <= :birthDateEnd', { birthDateEnd });
    }

    if (registerDateBegin) {
      query.andWhere('user.createdAt >= :registerDateBegin', {
        registerDateBegin,
      });
    }
    if (registerDateEnd) {
      query.andWhere('user.createdAt <= :registerDateEnd', { registerDateEnd });
    }

    if (updateDateBegin) {
      query.andWhere('user.updatedAt >= :updateDateBegin', {
        updateDateBegin,
      });
    }
    if (updateDateEnd) {
      query.andWhere('user.updatedAt <= :updateDateEnd', { updateDateEnd });
    }

    const users = await query.getMany();
    return users;
  }
}
