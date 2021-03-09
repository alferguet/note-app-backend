import { FindConditions, FindManyOptions } from 'typeorm'
import { NoteEntity } from './note/note.entity'

export class NoteMockRepository {
  private notes: NoteEntity[] = []

  async find(options: FindManyOptions<NoteEntity>): Promise<NoteEntity[]> {
    const where = options?.where as FindConditions<NoteEntity>
    if (where?.favorite) return this.notes.filter((note) => note.favorite)
    return this.notes
  }

  async findOne(params: FindConditions<NoteEntity>): Promise<NoteEntity> {
    return this.notes.find((note) => note.id === params.id)
  }

  async save(noteToSave: NoteEntity): Promise<NoteEntity> {
    const now = new Date()
    const savedNote = {
      ...noteToSave,
      id: noteToSave.id || this.notes.length + 1,
      favorite: noteToSave.favorite || false,
      createdAt: noteToSave.createdAt || now,
      updatedAt: now,
    }
    const noteIndex = this.notes.findIndex((note) => note.id === savedNote.id)
    if (noteIndex >= 0) {
      this.notes[noteIndex] = savedNote
    } else {
      this.notes.push(savedNote)
    }
    return savedNote
  }
}
