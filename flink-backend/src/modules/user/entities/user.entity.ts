import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Achievement } from '../../achievement/entities/achievement.entity';
import { UserHobby } from '../../hobby/entities/user-hobby.entity';
import { CommonEntity } from '../../../common/entities/common.entity';
import { Location } from '../../../common/entities/location.entity';

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

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ nullable: true })
  profilePic: string;

  @Column({ unique: true })
  phone: string;


  @Column({ default: 0 })
  xp: number; 

  @OneToMany(() => Activity, (activity) => activity.creator)
  createdActivities: Activity[];

  @ManyToMany(() => Activity, (activity) => activity.users)
  activities: Activity[];

  @OneToMany(() => Achievement, (achievement) => achievement.user)
  achievements: Achievement[];

  @OneToMany(() => UserHobby, (userHobby) => userHobby.user)
  userHobbies: UserHobby[];

  @ManyToOne(() => Location, { eager: true, nullable: false })
  @JoinColumn()
  location: Location;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @Column({ nullable: true })
  refreshToken: string; 
}

