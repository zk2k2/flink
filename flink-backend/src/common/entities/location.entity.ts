import { Entity, Column, OneToOne, Point } from 'typeorm';
import { CommonEntity } from './common.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class Location extends CommonEntity {
  @Column()
  name: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  coordinates: Point;

  @OneToOne(() => User, (user) => user.location, { onDelete: 'CASCADE' })
  user: User;
}