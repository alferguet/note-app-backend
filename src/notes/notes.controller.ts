import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  InternalServerErrorException,
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
      throw new InternalServerErrorException()
    }
  }

  @Get()
  async findAll(): Promise<ReadNoteDto[]> {
    return await this.notesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') noteId: number): Promise<ReadNoteDto> {
    return await this.notesService.findById(noteId)
  }

  @Put(':id/favorite')
  async setAsFavorite(@Param('id') id: number): Promise<ReadNoteDto> {
    return await this.notesService.setAsFavorite(id)
  }
}
