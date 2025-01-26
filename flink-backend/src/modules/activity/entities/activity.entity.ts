import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../../common/entities/common.entity';
import { ActivityConditions } from '../../../common/enums/activity-conditions.enum';
import { Location } from '../../../common/entities/location.entity';
import { JoinColumn } from 'typeorm';
import { ActivityTypes } from '../../../common/enums/activity-types.enum';

@Entity()
export class Activity extends CommonEntity {
  @Column()
  title: string;

  @Column({ type: 'date' })
  date: Date;

  @Column('text')
  description: string;

  @Column('enum', { enum: ActivityTypes })
  type: ActivityTypes;

  @Column('simple-array')
  activityPhotos: string[];

  @ManyToOne(() => Location, { eager: true, nullable: false })
  @JoinColumn()
  location: Location;

  @Column('enum', { enum: ActivityConditions, nullable: true })
  conditions: ActivityConditions;

  @Column()
  nbOfParticipants: number;

  @ManyToMany(() => User, (user) => user.activities)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, (user) => user.createdActivities, {
    eager: true,
    nullable: false,
  })
  creator: User;

  @Column({ default: false })
  isFinished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
