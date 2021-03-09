import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { NotFoundInterceptor } from '../src/interceptors/not-found.interceptor'
import { CreateNoteDto } from '../src/notes/note/dto/create-note.dto'
import { NotesMockModule } from '../src/notes/notes-mock.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NotesMockModule],
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

  it('/notes (POST)(OK)', () => {
    const okayDto: CreateNoteDto = {
      title: 'This is good',
      message: 'This is too',
    }
    return request(app.getHttpServer())
      .post('/notes')
      .send(okayDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 1)
      })
  })

  it('/notes (GET)(FIRST)', () => {
    return request(app.getHttpServer())
      .get('/notes')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1)
        expect(res.body[0]).toHaveProperty('id', 1)
      })
  })

  it('/notes/:id (GET BY ID)(FIRST)', () => {
    return request(app.getHttpServer())
      .get('/notes/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', 1)
      })
  })

  it('/notes/favorite/:id (PUT FAV BY ID)(FIRST)', () => {
    return request(app.getHttpServer())
      .put('/notes/1/favorite')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('favorite', true)
      })
  })

  it('/notes/:id/favprite (PUT FAV BY ID)(FIRST AGAIN)', () => {
    return request(app.getHttpServer()).put('/notes/1/favorite').expect(400)
  })

  it('/notes/:id/favorite (PUT FAV BY ID)(SECOND NOT AVAIL)', () => {
    return request(app.getHttpServer()).put('/notes/2/favorite').expect(404)
  })

  it('/notes/favorites (GET FAV)(FIRST FAV)', () => {
    request(app.getHttpServer())
      .get('/notes')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1)
      })

    return request(app.getHttpServer())
      .get('/notes/favorites')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveLength(1)
        expect(res.body[0]).toHaveProperty('favorite', true)
        expect(res.body[0]).toHaveProperty('id', 1)
      })
  })
})
