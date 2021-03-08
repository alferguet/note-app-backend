import { Note } from '../note.interface'

export class ReadNoteDto implements Note {
  readonly id: number

  readonly title: string

  readonly message: string

  readonly favorite: boolean
}
