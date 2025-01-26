import { CommonEntity } from 'src/common/entities/common.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Achievement extends CommonEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  photo: string;

  @ManyToOne(() => User, (user) => user.achievements)
  user: User;
}
