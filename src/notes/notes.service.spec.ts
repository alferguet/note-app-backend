import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { FindConditions } from 'typeorm'
import { CreateNoteDto } from './note/dto/create-note.dto'
import { NoteEntity } from './note/note.entity'
import { NotesService } from './notes.service'

class NoteMockRepository {
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
      expect.objectContaining({ ...note, favorite: true }),
    )
  })

  it('should throw as the note is already a favorite', async () => {
    await service.create(validNoteDto)
    const note = await service.findById(1)
    const favoriteNote = await service.setAsFavorite(note)
    expect(favoriteNote).toEqual(
      expect.objectContaining({ ...note, favorite: true }),
    )
    expect(service.setAsFavorite(favoriteNote)).rejects.toThrow()
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
