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
import { CommonEntity } from 'src/common/entities/common.entity';
import { ActivityConditionsEnum } from 'src/common/enums/activity.conditions.enum';

@Entity('Activity')
export class Activity extends CommonEntity {
  @Column()
  title: string;

  @Column({ type: 'date' })
  date: Date;

  @Column('text')
  description: string;

  @Column()
  type: string;

  @Column('simple-array')
  activityPhotos: string[];

  @Column()
  location: string;

  @Column('enum', { enum: ActivityConditionsEnum })
  conditions: ActivityConditionsEnum;

  @Column()
  nbOfParticipants: number;

  @ManyToMany(() => User, (user) => user.activities)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, (user) => user.createdActivities, { eager: true })
  creator: User;

  @Column({ default: false })
  isFinished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
