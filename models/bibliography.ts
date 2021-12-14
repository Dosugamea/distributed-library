import type { IGunChainReference } from 'gun/types/chain'
import { ContentModel, LogModel } from '@/models/base'
import { BibliographyType } from '@/types/bibliography'
import { ReviewType } from '@/types/review'
import { LibraryType } from '@/types/library'

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
  isbn: string | undefined
  reviews: Record<string, IGunChainReference<ReviewType, string, false>>
  libraries: Record<string, IGunChainReference<LibraryType, string, false>>

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: Record<string, LogModel>,
    note: string,
    image: string,
    category: string,
    author: string,
    publisher: string,
    publishedDateUnix: number,
    isbn: string | undefined,
    reviews: Record<string, IGunChainReference<ReviewType, string, false>>,
    libraries: Record<string, IGunChainReference<LibraryType, string, false>>,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note, isDeleted)
    this.id = id
    this.image = image
    this.category = category
    this.author = author
    this.publisher = publisher
    this.publishedDateUnix = publishedDateUnix
    this.isbn = isbn
    this.reviews = reviews
    this.libraries = libraries
  }
}

export { BibliographyModel }
