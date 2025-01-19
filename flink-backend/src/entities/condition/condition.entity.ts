import { TimedEntity } from 'src/common/entity/timed-entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Condition')
export class Condition extends TimedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
