import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity()
@Unique(['login', 'email', 'cpf', 'phone'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 'no name.' })
  name: string;

  @Column()
  @Unique(['login'])
  login: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  @Unique(['cpf'])
  cpf: string;

  @Column()
  password: string;

  @Column()
  @Unique(['phone'])
  phone: string;

  @Column()
  birth: Date;

  @Column()
  motherName: string;

  @Column({ default: true })
  status: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
