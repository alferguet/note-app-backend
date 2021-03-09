import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateNoteDto } from './note/dto/create-note.dto'
import { NoteEntity } from './note/note.entity'

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(NoteEntity)
    readonly noteRepository: Repository<NoteEntity>,
  ) {}

  async create(noteDto: CreateNoteDto): Promise<NoteEntity> {
    return await this.noteRepository.save(noteDto)
  }

  async findAll(): Promise<NoteEntity[]> {
    return await this.noteRepository.find()
  }

  async findById(id: number): Promise<NoteEntity> {
    return await this.noteRepository.findOne({ id })
  }

  async findFavorites(): Promise<NoteEntity[]> {
    return await this.noteRepository.find({ where: { favorite: true } })
  }

  async setAsFavorite(note: NoteEntity): Promise<NoteEntity> {
    note.favorite = true
    return this.noteRepository.save(note)
  }
}
