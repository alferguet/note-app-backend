import { Module } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NoteMockRepository } from './note-mock.repository'
import { NoteEntity } from './note/note.entity'
import { NotesController } from './notes.controller'
import { NotesService } from './notes.service'

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
