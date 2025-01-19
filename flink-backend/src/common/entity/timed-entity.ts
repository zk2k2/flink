import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';


export abstract class TimedEntity {
  @CreateDateColumn({
    update: false,
    type: 'timestamptz', 
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz', 
  })
  updatedAt: Date; 

  @DeleteDateColumn({
    type: 'timestamptz', 
    nullable: true,
  })
  deletedAt: Date | null; 
}
