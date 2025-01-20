import { CommonEntity } from '../../../common/entities/common.entity';
import { UserHobby } from './user-hobby.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('Hobby')
export class Hobby extends CommonEntity {
  @Column()
  title: string;

  @Column()
  photo: string;

  @OneToMany(() => UserHobby, (userHobby) => userHobby.hobby)
  userHobbies: UserHobby[];
}
