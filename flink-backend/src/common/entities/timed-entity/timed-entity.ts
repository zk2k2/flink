import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

/**
 * TimedEntity: A generic base class with basic time-related fields.
 */
export abstract class TimedEntity {
  @CreateDateColumn({
    update: false,
    type: 'timestamptz', // Timestamp with timezone
  })
  createdAt: Date; // Timestamp of entity creation

  @UpdateDateColumn({
    type: 'timestamptz', // Timestamp with timezone
  })
  updatedAt: Date; // Timestamp of last entity update

  @DeleteDateColumn({
    type: 'timestamptz', // Timestamp with timezone
    nullable: true, // Nullable if the entity is not soft deleted
  })
  deletedAt: Date | null; // Timestamp of soft deletion
}
