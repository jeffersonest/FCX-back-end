import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../../core/entities/user.entity';
import { UsersPort } from '../../core/ports/users.port';
import { CreateUserDto } from '../controllers/dto/create-user.dto';
import { UserFilterDto } from '../controllers/dto/user-filter.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../controllers/dto/update-user.dto';

@Injectable()
export class UsersAdapter implements UsersPort {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      await this.checkUserExists(0, createUserDto);

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
      if (error instanceof HttpException) {
        throw error;
      }
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

  async checkUserExists(id: number, userData: CreateUserDto): Promise<void> {
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
  }
  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    try {
      await this.checkUserExists(id, userData);

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
      ageRange,
      birthDateBegin,
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
      const currentDate = new Date().toISOString().slice(0, 10);

      if (ageRange.startsWith('>')) {
        const age = parseInt(ageRange.slice(1));
        query.andWhere(
          `DATE_PART('year', AGE(:currentDate, user.birth)) >= :age`,
          { currentDate, age },
        );
      } else {
        const [ageFrom, ageTo] = ageRange
          .split('>')
          .map((age) => parseInt(age));
        query.andWhere(
          `DATE_PART('year', AGE(:currentDate, user.birth)) BETWEEN :ageFrom AND :ageTo`,
          { currentDate, ageFrom, ageTo },
        );
      }
    }

    if (filterValue && filterType) {
      if (filterType === 'document') {
        query.andWhere('user.cpf LIKE :cpf', { cpf: `%${filterValue}%` });
      }

      if (filterType === 'name') {
        query.andWhere('user.name LIKE :name', { name: `%${filterValue}%` });
      }

      if (filterType === 'email') {
        query.andWhere('user.email LIKE :email', { email: `%${filterValue}%` });
      }
    }

    if (birthDateBegin && birthDateEnd) {
      query.andWhere('user.birth BETWEEN :start AND :end', {
        start: this.setTimeBeginOfDay(birthDateBegin).toISOString(),
        end: this.setTimeEndOfDay(birthDateEnd).toISOString(),
      });
    }

    if (registerDateBegin && registerDateEnd) {
      query.andWhere('user.createdAt BETWEEN :start AND :end', {
        start: this.setTimeBeginOfDay(registerDateBegin).toISOString(),
        end: this.setTimeEndOfDay(registerDateEnd).toISOString(),
      });
    }

    if (updateDateBegin && updateDateEnd) {
      query.andWhere('user.updatedAt BETWEEN :start AND :end', {
        start: this.setTimeBeginOfDay(updateDateBegin).toISOString(),
        end: this.setTimeEndOfDay(updateDateEnd).toISOString(),
      });
    }

    const users = await query.getMany();

    users.map((user) => {
      delete user.password;
    });

    return users;
  }

  setTimeEndOfDay(dateInput: Date): Date {
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (date instanceof Date && !isNaN(date.getTime())) {
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      return endDate;
    } else {
      return dateInput instanceof Date ? dateInput : new Date();
    }
  }

  setTimeBeginOfDay(dateInput: Date): Date {
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (date instanceof Date && !isNaN(date.getTime())) {
      const endDate = new Date(date);
      endDate.setHours(0, 0, 0, 0);
      return endDate;
    } else {
      return dateInput instanceof Date ? dateInput : new Date();
    }
  }
}
