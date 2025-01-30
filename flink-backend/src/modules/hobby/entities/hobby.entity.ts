import { CommonEntity } from '../../../common/entities/common.entity';
import { UserHobby } from './user-hobby.entity';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../../common/entities/category.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Hobby extends CommonEntity {
  @Column({unique: true})
  title: string;

  @Column()
  photo: string;

  @OneToMany(() => UserHobby, (userHobby) => userHobby.hobby)
  userHobbies: UserHobby[];

  @ManyToOne(() => Category, (category) => category.hobbies)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
