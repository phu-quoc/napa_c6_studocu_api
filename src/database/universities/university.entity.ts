import { BaseEntity } from '@/bases/entities/base.entity';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Course, User } from '@/database/entity';
import { createSlug } from '@/utils/slug';

@Entity('universities')
export class University extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  country: string;

  @OneToMany(() => User, (user) => user.university)
  users: User[];

  @OneToMany(() => Course, (course) => course.university)
  courses: Course[];

  @BeforeInsert()
  generateSlug() {
    this.slug = createSlug(this.name);
  }
}
