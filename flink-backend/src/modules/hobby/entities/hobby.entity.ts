import { CommonEntity } from '../../../common/entities/common.entity';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserHobby } from 'src/modules/user-hobbies/entities/user-hobby.entity';
import { Category } from 'src/modules/category/entities/category.entity';



@Entity()
export class Hobby extends CommonEntity {
  @Column({ unique: true })
  title: string;

  @OneToMany(() => UserHobby, (userHobby) => userHobby.hobby)
  userHobbies: UserHobby[];

  @ManyToOne(() => Category, (category) => category.hobbies)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
