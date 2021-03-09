import { FindConditions } from "typeorm"
import { CreateNoteDto } from "./note/dto/create-note.dto"
import { NoteEntity } from "./note/note.entity"

export class NoteMockRepository {
  private notes: NoteEntity[] = []

  async find(): Promise<NoteEntity[]> {
    return this.notes
  }
  async findOne(params: FindConditions<NoteEntity>): Promise<NoteEntity> {
    return this.notes.find((note) => note.id === params.id)
  }
  async findFavorites(): Promise<NoteEntity[]> {
    return this.notes.filter((note) => note.favorite)
  }

  async save(note: CreateNoteDto): Promise<NoteEntity> {
    const now = new Date()
    this.notes.push({
      id: this.notes.length + 1,
      favorite: false,
      createdAt: now,
      updatedAt: now,
      ...note,
    })
    return this.notes[this.notes.length - 1]
  }
}