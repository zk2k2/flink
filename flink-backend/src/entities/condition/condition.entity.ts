import { TimedEntity } from 'src/common/entities/timed-entity/timed-entity';
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
