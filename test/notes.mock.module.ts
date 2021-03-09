import { Module } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NoteMockRepository } from '../src/notes/note-repository.mock'
import { NoteEntity } from '../src/notes/note/note.entity'
import { NotesService } from '../src/notes/notes.service'
import { NotesController } from '../src/notes/notes.controller'

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    {
      provide: getRepositoryToken(NoteEntity),
      useValue: new NoteMockRepository(),
    },
  ],
})
export class NotesMockModule {}
