import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CommonEntity } from '../../../common/entities/common.entity';
import { Location } from '../../../common/entities/location.entity';
import { Category } from 'src/modules/category/entities/category.entity';

@Entity()
export class Activity extends CommonEntity {
  @Column()
  title: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column('text')
  description: string;

  @Column('simple-array', { nullable: true })
  activityPhotos: string[];

  @ManyToOne(() => Location, { eager: true, nullable: false })
  @JoinColumn()
  location: Location;

  @Column()
  nbOfParticipants: number;

  @ManyToMany(() => User, (user) => user.activities)
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, (user) => user.createdActivities, {
    eager: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  creator: User;

  @ManyToOne(() => Category, (category) => category.activities, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid' })
  categoryId: string;
}
