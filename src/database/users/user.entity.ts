import { BaseEntity } from '@/bases/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Comment, Document, University } from '@/database/entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  universityId: number;

  @Column({ type: 'timestamptz', nullable: true })
  premiumExpireAt: Date;

  @Column({ default: false })
  active: boolean;

  @Column({ nullable: true })
  resetCode: string;

  @Column({ type: 'timestamptz', nullable: true })
  resetCodeExpireAt: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToOne(() => University, (university) => university.users)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @OneToMany(() => Document, (document) => document.uploader)
  documents: Document[];

  @ManyToMany(() => Document, (document) => document.users)
  likedDocuments: Document[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
