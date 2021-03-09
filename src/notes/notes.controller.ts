import { Logger } from '../logger'
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
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger'
import { CreateNoteDto } from './note/dto/create-note.dto'
import { ReadNoteDto } from './note/dto/update-note.dto'
import { NotesService } from './notes.service'

@Controller('notes')
@ApiTags('Notes')
export class NotesController {
  private readonly logger = new Logger('NotesController')
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiBadRequestResponse({ description: 'Failed DTO validation' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  create(@Body() createNoteDto: CreateNoteDto): Promise<ReadNoteDto> {
    try {
      return this.notesService.create(createNoteDto)
    } catch (err) {
      this.logger.error(`Failed to create a note: ${err.message}`)
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
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(@Param('id') noteId: number): Promise<ReadNoteDto> {
    return await this.notesService.findById(noteId)
  }

  @Put(':id/favorite')
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Already a favorite' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async setAsFavorite(@Param('id') id: number): Promise<ReadNoteDto> {
    const note = await this.notesService.findById(id)
    if (!note) return null
    if (note.favorite) {
      const errMessage = `Note with id ${note.id} is already a favorite`
      this.logger.error(errMessage)
      throw new BadRequestException(errMessage)
    }
    try {
      return await this.notesService.setAsFavorite(note)
    } catch (err) {
      const message = `Failed to set note with id ${id} as favorite: ${err.message}`
      this.logger.error(message)
      throw new InternalServerErrorException(message)
    }
  }
}
