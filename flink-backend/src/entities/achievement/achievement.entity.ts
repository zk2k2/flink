import { TimedEntity } from 'src/common/entities/timed-entity/timed-entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('Achievement')
export class Achievement extends TimedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  photo: string;

  @ManyToOne(() => User, (user) => user.achievements)
  user: User;
}
