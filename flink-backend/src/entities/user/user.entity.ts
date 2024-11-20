import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Activity } from '../activity/activity.entity';
import { Achievement } from '../achievement/achievement.entity';
import { TimedEntity } from 'src/common/entities/timed-entity/timed-entity';

@Entity('User')
export class User extends TimedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  profilePic: string;

  @Column()
  phone: string;

  @Column({ default: 0 })
  score: number;

  @OneToMany(() => Achievement, (achievement) => achievement.user)
  achievements: Achievement[];

  @ManyToMany(() => Activity, (activity) => activity.users)
  @JoinTable()
  activities: Activity[];

  @Column('simple-array', { nullable: true })
  location: string[]; // [latitude, longitude]

  @Column('simple-array', { nullable: true })
  interests: string[];

  @Column('simple-array', { nullable: true })
  habits: string[];

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
