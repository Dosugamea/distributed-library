import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'
import { LibraryHistory } from '@/types/library-history'
import { Book } from '@/types/library-book'
import { History as HistoryData } from '@/types/base/history'
import { LibraryBookHistoryId, LibraryBookId, BibliographyId } from '@/types/base/ids'

/**
 * Library model instance
*/
export default class LibraryBookModel implements Book {
    #historyDatabase!: EventStore<LibraryHistory>
    #histories: LibraryBookHistoryId[] = []
    #id: LibraryBookId = ''
    #bibliographyId: BibliographyId = ''
    #issuer: string = ''
    #rentable: boolean = true
    #note: string = ''

    constructor (
      id: LibraryBookId,
      bibliographyId: BibliographyId,
      rentable: boolean,
      note: string,
      histories: LibraryBookHistoryId[],
      historyDatabase: EventStore<LibraryHistory>,
      issuer: string
    ) {
      this.#id = id
      this.#bibliographyId = bibliographyId
      this.#rentable = rentable
      this.#note = note
      this.#histories = histories
      this.#historyDatabase = historyDatabase
      this.#issuer = issuer
    }

    get _id (): string {
      return this.#id
    }

    get id (): string {
      return this.#id
    }

    get bibliographyId (): string {
      return this.#bibliographyId
    }

    set rentable (isRentable: boolean) {
      this.#rentable = isRentable
      this.addBookHistory('edit', 'rentable', isRentable.toString()).then((hash: LibraryBookHistoryId) => {
        this.#histories.push(hash)
      })
    }

    get rentable () {
      return this.#rentable
    }

    set note (note: string) {
      this.#note = note
      this.addBookHistory('edit', 'note', note).then((hash: LibraryBookHistoryId) => {
        this.#histories.push(hash)
      })
    }

    get note () {
      return this.#note
    }

    get histories () {
      return this.#histories
    }

    protected async addBookHistory (action: string, target: string, value: string): Promise<string> {
      const issuer = this.#issuer
      const h: HistoryData = {
        id: uuid4(),
        createdDate: new Date(),
        issuer,
        action,
        target,
        value
      }
      return await this.#historyDatabase.add(h)
    }
}
