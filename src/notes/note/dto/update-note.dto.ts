import { ApiProperty } from '@nestjs/swagger'
import { Note } from '../note.interface'

export class ReadNoteDto implements Note {
  @ApiProperty({ example: 1 })
  readonly id: number

  @ApiProperty({ example: 'Resume' })
  readonly title: string

  @ApiProperty({ example: 'Today I went out' })
  readonly message: string

  readonly favorite: boolean
}
