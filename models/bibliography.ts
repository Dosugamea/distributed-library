import { ContentModel } from '@/models/base'
import { ContentType } from '@/types/base/content'
import { Log } from '@/types/base/log'

/**
 * Bibliography model instance for add/edit/remove bibliography entries.
*/
export default class BibliographyModel extends ContentModel implements ContentType {
  author: string

  constructor (
    id: string,
    name: string,
    createdDate: Date,
    updatedDate: Date,
    histories: Log[],
    note: string,
    author: string
  ) {
    super(id, name, createdDate, updatedDate, histories, note)
    this.author = author
  }
}
