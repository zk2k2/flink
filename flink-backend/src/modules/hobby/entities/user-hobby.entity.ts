import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Hobby } from './hobby.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity()
export class UserHobby extends CommonEntity {
  @ManyToOne(() => User, (user) => user.userHobbies, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Hobby, (hobby) => hobby.userHobbies, { onDelete: 'CASCADE' })
  hobby: Hobby;

  @Column({ type: 'int', default: 1 })
  interestLevel: number;
}
