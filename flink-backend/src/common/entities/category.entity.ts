import { Entity, Column, OneToMany } from 'typeorm';

import { Activity } from '../../modules/activity/entities/activity.entity';
import { Hobby } from '../../modules/hobby/entities/hobby.entity';
import { CommonEntity } from './common.entity';

@Entity()
export class Category extends CommonEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @OneToMany(() => Hobby, (hobby) => hobby.category)
  hobbies: Hobby[];

  @OneToMany(() => Activity, (activity) => activity.category)
  activities: Activity[];
}
