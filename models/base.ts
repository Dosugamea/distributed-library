import { ContentType } from '@/types/base/content'
import { Log } from '@/types/base/log'

/**
 * Bibliography model instance for add/edit/remove bibliography entries.
*/
class ContentModel implements ContentType {
  id: string
  name: string
  createdDate: Date
  updatedDate: Date
  note: string
  histories: Log[]

  constructor (
    id: string,
    name: string,
    createdDate: Date,
    updatedDate: Date,
    histories: Log[],
    note: string
  ) {
    this.id = id
    this.name = name
    this.createdDate = createdDate
    this.updatedDate = updatedDate
    this.histories = histories
    this.note = note
  }
}

export { ContentModel }
