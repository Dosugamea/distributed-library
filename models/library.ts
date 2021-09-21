import EventStore from 'orbit-db-eventstore'
import DocStore from 'orbit-db-docstore'
import { v4 as uuid4 } from 'uuid'
import { Library as LibraryType } from '@/types/library'
import { LibraryHistory } from '@/types/library-history'
import { Book } from '@/types/library-book'
import { UserId, LibraryId, LibraryHistoryId, LibraryBookId, AdminId } from '@/types/base/ids'
import { History as HistoryData } from '@/types/base/history'
import ContentModel from '@/models/base/content'

/**
 * Library model instance
*/
export default class LibraryModel extends ContentModel implements LibraryType {
    #bookDatabase!: DocStore<Book>
    #historyDatabase!: EventStore<LibraryHistory>
    #histories: LibraryHistoryId[] = []
    #admins: AdminId[] = []
    bookDatabaseAddress: string = ''

    constructor (
      id: LibraryId,
      name: string,
      createdDate: Date,
      updatedDate: Date,
      histories: LibraryHistoryId[],
      admins: AdminId[],
      note: string,
      bookDatabase: DocStore<Book>,
      bookDatabaseAddress: string,
      historyDatabase: EventStore<LibraryHistory>,
      issuer: string
    ) {
      super(id, name, note, createdDate, updatedDate, historyDatabase, issuer)
      this.#histories = histories
      this.#admins = admins
      this.bookDatabaseAddress = bookDatabaseAddress
      this.#bookDatabase = bookDatabase
    }

    async addAdmin (id: AdminId) {
      const historyId: LibraryHistoryId = await this.addHistory('add', 'admin', id)
      this.#histories.push(historyId)
      this.#admins.push(historyId)
    }

    async removeAdmin (id: AdminId) {
      const historyId: LibraryHistoryId = await this.addHistory('remove', 'admin', id)
      this.#histories.push(historyId)
      this.#admins = this.#admins.filter(admin => admin !== id)
    }

    async addBook (book: Book) {
      if (this.isBookExist(book.id)) {
        throw new Error(`Book ${book.id} already exist`)
      }
      const historyId: LibraryHistoryId = await this.addHistory('add', 'book', book.id)
      this.#histories.push(historyId)
      this.#bookDatabase.put(book)
    }

    async editBook (book: Book) {
      if (!this.isBookExist(book.id)) {
        throw new Error(`Book ${book.id} doesn't exist`)
      }
      const historyId: LibraryHistoryId = await this.addHistory('edit', 'book', book.id)
      this.#histories.push(historyId)
      this.#bookDatabase.del(book.id)
      this.#bookDatabase.put(book)
    }

    async removeBook (book: Book) {
      if (!this.isBookExist(book.id)) {
        throw new Error(`Book ${book.id} doesn't exist`)
      }
      const historyId: LibraryHistoryId = await this.addHistory('remove', 'book', book.id)
      this.#histories.push(historyId)
      this.#bookDatabase.del(book.id)
    }

    async rentBook (issuer: UserId, book: Book) {
      if (!this.isBookExist(book.id)) {
        throw new Error(`Book ${book.id} doesn't exist`)
      }
      const historyId: LibraryHistoryId = await this.addBookHistory('rent', 'book', book.id, issuer)
      this.#histories.push(historyId)
    }

    async returnBook (issuer: UserId, book: Book) {
      if (!this.isBookExist(book.id)) {
        throw new Error(`Book ${book.id} doesn't exist`)
      }
      const historyId: LibraryHistoryId = await this.addBookHistory('return', 'book', book.id, issuer)
      this.#histories.push(historyId)
    }

    listBook () {
      return this.#bookDatabase.get('')
    }

    listBookWithQuery (query: any) : Book[] {
      return this.#bookDatabase.query(query)
    }

    isBookExist (bookId: LibraryBookId) : boolean {
      return this.#bookDatabase.get(bookId).length > 0
    }

    protected async addBookHistory (action: string, target: string, value: string, issuer: string): Promise<string> {
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

    get admins () {
      return this.#admins
    }

    get histories () {
      return this.#histories
    }

    get _id (): string {
      return this.id
    }
}
