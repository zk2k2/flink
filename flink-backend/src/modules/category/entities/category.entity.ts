import { CommonEntity } from 'src/common/entities/common.entity';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { Hobby } from 'src/modules/hobby/entities/hobby.entity';
import { Entity, Column, OneToMany } from 'typeorm';


@Entity()
export class Category extends CommonEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @OneToMany(() => Hobby, (hobby) => hobby.category,{ eager:true })
  hobbies: Hobby[];

  @OneToMany(() => Activity, (activity) => activity.category)
  activities: Activity[];
}
