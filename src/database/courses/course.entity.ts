import { BaseEntity } from '@/bases/entities/base.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Document, University } from '@/database/entity';
import { createSlug } from '@/utils/slug';

@Entity('courses')
export class Course extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  universityId: number;

  @ManyToOne(() => University, (university) => university.courses)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @OneToMany(() => Document, (document) => document.course)
  documents: Document[];

  @BeforeInsert()
  generateSlug() {
    this.slug = createSlug(this.name);
  }
}
