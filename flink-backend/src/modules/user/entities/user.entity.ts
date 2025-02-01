import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';
import { Achievement } from '../../achievement/entities/achievement.entity';
import { UserHobby } from '../../user-hobbies/entities/user-hobby.entity';
import { CommonEntity } from '../../../common/entities/common.entity';
import { Location } from '../../../common/entities/location.entity';

@Entity()
export class User extends CommonEntity {
  @Column()
  firstName: string;
  @Column()
  lastName: string;

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

  @ManyToMany(() => Achievement, (achievement) => achievement.users)
  @JoinTable()
  achievements: Achievement[];

  @OneToMany(() => UserHobby, (userHobby) => userHobby.user)
  userHobbies: UserHobby[];

  @OneToOne(() => Location, { eager: true, nullable: false, cascade: true })
  @JoinColumn()
  location: Location;

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'user_followers',
    joinColumn: {
      name: 'followingId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'followerId',
      referencedColumnName: 'id',
    },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @Column({ nullable: true })
  refreshToken: string;
}

