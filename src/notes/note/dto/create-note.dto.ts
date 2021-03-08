import { IsString, Length } from 'class-validator'
import { Note } from '../note.interface'

export class CreateNoteDto implements Note {
  @IsString()
  @Length(1, 20)
  readonly title: string

  @IsString()
  @Length(1, 200)
  readonly message: string
}
