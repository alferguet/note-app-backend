import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'
import { Note } from '../note.interface'

export class CreateNoteDto implements Note {
  @IsString()
  @Length(1, 20)
  @ApiProperty({ example: 'Resume' })
  readonly title: string

  @IsString()
  @Length(1, 200)
  @ApiProperty({ example: 'Today I went out' })
  readonly message: string
}
