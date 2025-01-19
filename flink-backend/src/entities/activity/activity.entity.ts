import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';
import { TimedEntity } from 'src/common/entity/timed-entity';

@Entity('Activity')
export class Activity extends TimedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('simple-array', { nullable: true })
  activityPhotos: string[];

  @Column('simple-array', { nullable: true })
  location: string[]; // [latitude, longitude]

  @Column('simple-array', { nullable: true })
  conditions: string[];

  @Column()
  nbOfParticipants: number;

  @ManyToMany(() => User, (user) => user.activities)
  users: User[];

  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @Column({ default: false })
  finished: boolean;
}
