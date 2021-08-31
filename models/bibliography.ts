import EventStore from 'orbit-db-eventstore'
import { Bibliography as BibliographyType } from '@/types/bibliography'
import { BibliographyHistory } from '@/types/bibliography-history'
import { BibliographyHistoryId } from '@/types/base/ids'
import ContentModel from '@/models/base/content'

/**
 * Bibliography model instance for add/edit/remove bibliography entries.
*/
export default class BibliographyModel extends ContentModel implements BibliographyType {
    #author: string = ''
    #category: string = ''
    #histories: BibliographyHistoryId[] = []
    #image: string = ''
    #publishedDate: string
    #publisher: string = ''

    constructor (
      id: string,
      name: string,
      author: string,
      category: string,
      createdDate: Date,
      updatedDate: Date,
      histories: BibliographyHistoryId[],
      image: string,
      publishedDate: Date,
      publisher: string,
      note: string,
      historyDatabase: EventStore<BibliographyHistory>,
      issuer: string
    ) {
      super(id, name, note, createdDate, updatedDate, historyDatabase, issuer)
      this.#author = author
      this.#category = category
      this.#histories = histories
      this.#image = image
      this.#publishedDate = this.dateToString(publishedDate)
      this.#publisher = publisher
    }

    dateToString (date: Date): string {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }

    set author (name: string) {
      this.#author = name
      this.addHistory('edit', 'author', name).then((hash: BibliographyHistoryId) => {
        this.#histories.push(hash)
      })
    }

    get author (): string {
      return this.#author
    }

    set category (name: string) {
      this.#category = name
      this.addHistory('edit', 'category', name).then((hash: BibliographyHistoryId) => {
        this.#histories.push(hash)
      })
    }

    get category (): string {
      return this.#category
    }

    set image (url: string) {
      this.#image = url
      this.addHistory('edit', 'image', url).then((hash: BibliographyHistoryId) => {
        this.#histories.push(hash)
      })
    }

    get image (): string {
      return this.#image
    }

    set publisher (name: string) {
      this.#publisher = name
      this.addHistory('edit', 'publisher', name).then((hash: BibliographyHistoryId) => {
        this.#histories.push(hash)
      })
    }

    get publisher (): string {
      return this.#publisher
    }

    set publishedDate (date: Date) {
      this.#publishedDate = this.dateToString(date)
      this.addHistory('edit', 'publishedDate', this.dateToString(date)).then((hash: BibliographyHistoryId) => {
        this.#histories.push(hash)
      })
    }

    get publishedDate (): Date {
      return new Date(this.#publishedDate)
    }

    get histories () {
      return this.#histories
    }
}
