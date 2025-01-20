import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Achievement } from '../../achievement/entities/achievement.entity';
import { UserHobby } from '../../hobby/entities/user-hobby.entity';
import { CommonEntity } from '../../../common/entities/common.entity';

@Entity()
export class User extends CommonEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  profilePic: string;

  @Column({ unique: true })
  phone: string;

  @Column({ default: 0 })
  score: number;

  @ManyToMany(() => Activity, (activity) => activity.users)
  createdActivities: Activity[];

  @ManyToMany(() => Activity, (activity) => activity.users)
  activities: Activity[];

  @OneToMany(() => Achievement, (achievement) => achievement.user)
  achievements: Achievement[];

  @OneToMany(() => UserHobby, (userHobby) => userHobby.user)
  userHobbies: UserHobby[];

  @Column('text')
  location: string;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}
