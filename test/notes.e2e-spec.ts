import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { NotesModule } from '../src/notes/notes.module'
import { NotFoundInterceptor } from '../src/interceptors/not-found.interceptor'
import { NoteEntity } from '../src/notes/note/note.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NoteMockRepository } from '../src/notes/note-repository.mock'
import { CreateNoteDto } from '../src/notes/note/dto/create-note.dto'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(NoteEntity),
          useValue: new NoteMockRepository(),
        },
      ],
      imports: [NotesModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalInterceptors(new NotFoundInterceptor())
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/notes (GET)(START)', () => {
    return request(app.getHttpServer()).get('/notes').expect(200).expect([])
  })

  it('/notes (POST)(LONG TITLE)', () => {
    const longTitleDto: CreateNoteDto = {
      title: 'This is a larger title than we allow so this should return error',
      message: 'hello',
    }
    return request(app.getHttpServer())
      .post('/notes')
      .send(longTitleDto)
      .expect(400)
  })

  it('/notes (POST)(LONG MESSAGE)', () => {
    const message = 'This is not '.repeat(200)
    const longMessageDto: CreateNoteDto = {
      title: 'This is good',
      message,
    }
    return request(app.getHttpServer())
      .post('/notes')
      .send(longMessageDto)
      .expect(400)
  })

  const firstNote = {
    title: 'This is good',
    message: 'This is too',
    id: 1,
    favorite: false,
  }

  it('/notes (POST)(OK)', () => {
    const okayDto: CreateNoteDto = {
      title: 'This is good',
      message: 'This is too',
    }
    return request(app.getHttpServer())
      .post('/notes')
      .send(okayDto)
      .expect(201)
      .expect(firstNote)
  })

  it('/notes (GET)(FIRST)', () => {
    return request(app.getHttpServer())
      .get('/notes')
      .expect(200)
      .expect([firstNote])
  })

  it('/notes/:id (GET BY ID)(FIRST)', () => {
    return request(app.getHttpServer())
      .get('/notes/1')
      .expect(200)
      .expect(firstNote)
  })

  const firstNoteFavorite = { ...firstNote, favorite: true }
  it('/notes/favorite/:id (PUT FAV BY ID)(FIRST)', () => {
    return request(app.getHttpServer())
      .put('/notes/favorite/1')
      .expect(200)
      .expect(firstNoteFavorite)
  })

  it('/notes/favorite/:id (PUT FAV BY ID)(FIRST AGAIN)', () => {
    return request(app.getHttpServer()).put('/notes/favorite/1').expect(400)
  })

  it('/notes/favorite/:id (PUT FAV BY ID)(SECOND NOT AVAIL)', () => {
    return request(app.getHttpServer()).put('/notes/favorite/2').expect(404)
  })

  it('/notes/favorite (GET FAV)(FIRST FAV)', () => {
    return request(app.getHttpServer())
      .get('/notes/favorite')
      .expect([firstNoteFavorite])
  })
})
