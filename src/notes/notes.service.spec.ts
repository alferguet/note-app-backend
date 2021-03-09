import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NoteMockRepository } from './note-mock.repository'
import { CreateNoteDto } from './note/dto/create-note.dto'
import { NoteEntity } from './note/note.entity'
import { NotesService } from './notes.service'

const validNoteDto: CreateNoteDto = {
  title: 'Hello',
  message: 'Simple message',
}

describe('NotesService', () => {
  let service: NotesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(NoteEntity),
          useValue: new NoteMockRepository(),
        },
      ],
    }).compile()

    service = module.get<NotesService>(NotesService)
  })

  it('should save a note when given a valid dto', async () => {
    const note = await service.create(validNoteDto)
    expect(note).toEqual(
      expect.objectContaining({ ...validNoteDto, id: 1, favorite: false }),
    )
  })

  it('should return all notes when requested', async () => {
    await service.create(validNoteDto)
    const notes = await service.findAll()
    expect(notes).toEqual(
      expect.arrayContaining([expect.objectContaining(validNoteDto)]),
    )
  })

  it('should return the matching note when requested', async () => {
    await service.create(validNoteDto)
    const note = await service.findById(1)
    expect(note).toEqual(
      expect.objectContaining({ ...validNoteDto, id: 1, favorite: false }),
    )
  })

  it('should not return anything when providing an invalid id', async () => {
    await service.create(validNoteDto)
    const note = await service.findById(2)
    expect(note).toBeUndefined()
  })

  it('should set the note as favorite', async () => {
    await service.create(validNoteDto)
    const note = await service.findById(1)
    const favoriteNote = await service.setAsFavorite(note)
    expect(favoriteNote).toEqual(
      expect.objectContaining({ ...validNoteDto, id: 1, favorite: true }),
    )
  })

  it('should retrieve all favorite notes when requested', async () => {
    await service.create(validNoteDto)
    const withoutFav = await service.findFavorites()
    expect(withoutFav).toStrictEqual([])
    const note = await service.findById(1)
    await service.setAsFavorite(note)
    const withFav = await service.findFavorites()
    expect(withFav).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...validNoteDto, favorite: true }),
      ]),
    )
  })
})
