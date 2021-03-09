import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { CreateNoteDto } from './note/dto/create-note.dto'
import { ReadNoteDto } from './note/dto/update-note.dto'
import { NotesService } from './notes.service'

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto): Promise<ReadNoteDto> {
    try {
      return this.notesService.create(createNoteDto)
    } catch (err) {
      console.log(`Failed to create a note: ${err.message}`)
      throw new InternalServerErrorException('Failed to create the note')
    }
  }

  @Get()
  async findAll(): Promise<ReadNoteDto[]> {
    return await this.notesService.findAll()
  }

  @Get('/favorites')
  async findFavorites(): Promise<ReadNoteDto[]> {
    return await this.notesService.findFavorites()
  }

  @Get(':id')
  async findOne(@Param('id') noteId: number): Promise<ReadNoteDto> {
    return await this.notesService.findById(noteId)
  }

  @Put(':id/favorite')
  async setAsFavorite(@Param('id') id: number): Promise<ReadNoteDto> {
    const note = await this.notesService.findById(id)
    if (!note) return null
    if (note.favorite) {
      const errMessage = 'Failed to set note as favorite'
      console.log(errMessage)
      throw new BadRequestException(errMessage)
    }
    try {
      return await this.notesService.setAsFavorite(note)
    } catch (err) {
      console.log('Failed to set note as favorite')
      throw new InternalServerErrorException()
    }
  }
}
