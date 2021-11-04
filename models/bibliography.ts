import { ContentModel, LogModel } from '@/models/base'
import { ReviewModel } from '@/models/review'
import { BibliographyType } from '@/types/bibliography'

/**
 * Bibliography model instance for add/edit/remove bibliography entries.
*/
class BibliographyModel extends ContentModel implements BibliographyType {
  id: string
  image: string
  category: string
  author: string
  publisher: string
  publishedDateUnix: number
  reviews: ReviewModel[]

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: LogModel[],
    note: string,
    image: string,
    category: string,
    author: string,
    publisher: string,
    publishedDateUnix: number,
    reviews: ReviewModel[]
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note)
    this.id = id
    this.image = image
    this.category = category
    this.author = author
    this.publisher = publisher
    this.publishedDateUnix = publishedDateUnix
    this.reviews = reviews
  }
}

export { BibliographyModel }
