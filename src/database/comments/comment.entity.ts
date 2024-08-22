import { BaseEntity } from '@/bases/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Document, User } from '@/database/entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column()
  userId: number;

  @Column()
  documentId: number;

  @Column()
  comment: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Document, (document) => document.comments)
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
