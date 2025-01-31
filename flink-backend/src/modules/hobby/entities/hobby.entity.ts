import { CommonEntity } from '../../../common/entities/common.entity';
import { UserHobby } from '../../user-hobbies/entities/user-hobby.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Hobby extends CommonEntity {
  @Column({ unique: true })
  title: string;

  @Column()
  photo: string;

  @OneToMany(() => UserHobby, (userHobby) => userHobby.hobby)
  userHobbies: UserHobby[];
}
