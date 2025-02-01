import { Entity, ManyToOne, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Hobby } from '../../hobby/entities/hobby.entity';
import { CommonEntity } from 'src/common/entities/common.entity';

@Entity()
export class UserHobby extends CommonEntity {
  @ManyToOne(() => User, (user) => user.userHobbies, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Hobby, (hobby) => hobby.userHobbies, { eager: true, onDelete: 'CASCADE' })
  hobby: Hobby;

  @Column({ type: 'int', default: 1 })
  interestLevel: number;
}
