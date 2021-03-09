import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Note } from './note.interface'

@Entity('notes')
export class NoteEntity implements Note {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 20 })
  title: string

  @Column({ type: 'varchar', length: 200 })
  message: string

  @Column({ type: 'bool' })
  favorite: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
