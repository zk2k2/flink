import { Entity, Column, Point } from 'typeorm';
import { CommonEntity } from './common.entity';

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
}
