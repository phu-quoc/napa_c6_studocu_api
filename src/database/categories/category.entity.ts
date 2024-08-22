import { BaseEntity } from '@/bases/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Document } from '@/database/entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Document, (document) => document.category)
  documents: Document[];
}
