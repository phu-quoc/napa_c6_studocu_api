import { BaseEntity } from '@/bases/entities/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category, Comment, Course, User } from '@/database/entity';
import { createSlug } from '@/utils/slug';

@Entity('documents')
export class Document extends BaseEntity {
  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  categoryId: number;

  @Column()
  uploadedBy: number;

  @Column()
  academicYear: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  path: string;

  @Column({ default: 0 })
  view: number;

  @Column()
  courseId: number;

  @ManyToOne(() => Category, (category) => category.documents)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;

  @ManyToOne(() => Course, (course) => course.documents)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToMany(() => User, (users) => users.likedDocuments)
  @JoinTable({
    name: 'likes',
    joinColumn: { name: 'document_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];

  @OneToMany(() => Comment, (comment) => comment.document)
  comments: Comment[];

  @BeforeInsert()
  generateSlug() {
    this.slug = createSlug(this.title);
  }
}
