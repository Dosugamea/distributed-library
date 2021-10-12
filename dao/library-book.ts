import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'
import type { LibraryInfoDatabase, LibraryInfoHistoryDatabase } from '@/types/base/addresses'
import { LibraryHistory, LibraryHistoryAction, LibraryHistoryTarget } from '@/types/library-history'
import { Book as LibraryBookType } from '@/types/library-book'
import LibraryBookModel from '@/models/library-book'
import { LibraryBookId, BibliographyId } from '@/types/base/ids'

export default class LibraryBookDao {
  #database!: DocStore<LibraryBookType>
  #historyDatabase!: EventStore<LibraryHistory>
  #orbitdb!: OrbitDB

  async build (orbitdb: OrbitDB, databaseAddress: LibraryInfoDatabase | null, historyDatabaseAddress: LibraryInfoHistoryDatabase | null) {
    databaseAddress = databaseAddress || 'libraryBooks'
    historyDatabaseAddress = historyDatabaseAddress || 'libraryBooksHistory'
    this.#database = await orbitdb.docstore(databaseAddress) as DocStore<LibraryBookType>
    this.#historyDatabase = await orbitdb.log(historyDatabaseAddress) as EventStore<LibraryHistory>
    this.#orbitdb = orbitdb
  }

  create (
    id: LibraryBookId,
    bibliographyId: BibliographyId,
    rentable: boolean,
    note: string,
    issuer: string
  ): LibraryBookModel {
    const libraryBookModel = new LibraryBookModel(
      id, bibliographyId, rentable,
      note, [], this.#historyDatabase, issuer)
    return libraryBookModel
  }

  getAddress () {
    return this.#database.address.root
  }

  getHistoryAddress () {
    return this.#historyDatabase.address.root
  }

  convertToModel (book: LibraryBookType, issuer: string): LibraryBookModel {
    return new LibraryBookModel(
      book.id, book.bibliographyId, book.rentable,
      book.note, [], this.#historyDatabase, issuer
    )
  }

  async add (libraryBook: LibraryBookType) : Promise<string> {
    if (this.isExist(libraryBook.id)) {
      throw new Error(`LibraryBook ${libraryBook.id} already exist`)
    }
    const dbPutResp = await this.#database.put(libraryBook)
    this.addHistory('add', 'book', libraryBook.id)
    return dbPutResp
  }

  async edit (libraryBook: LibraryBookType) {
    if (!this.isExist(libraryBook.id)) {
      throw new Error(`Library ${libraryBook.id} doesn't exist`)
    }
    await this.#database.del(libraryBook.id)
    await this.#database.put(libraryBook)
    this.addHistory('edit', 'book', libraryBook.id)
  }

  remove (libraryBook: LibraryBookType) {
    if (!this.isExist(libraryBook.id)) {
      throw new Error(`Library ${libraryBook.id} doesn't exist`)
    }
    this.#database.del(libraryBook.id)
    this.addHistory('remove', 'book', libraryBook.id)
  }

  find (query : any) : LibraryBookType[] {
    return this.#database.query(query)
  }

  get (libraryBookId: LibraryBookId): LibraryBookType {
    const docs = this.#database.get(libraryBookId)
    if (docs.length === 0) { throw new Error(`LibraryBook ${libraryBookId} doesn't exist`) }
    return docs[0]
  }

  isExist (libraryBookId: LibraryBookId) : boolean {
    return this.#database.get(libraryBookId).length > 0
  }

  private addHistory (action: LibraryHistoryAction, target: LibraryHistoryTarget, value: string) {
    const h: LibraryHistory = {
      id: uuid4(),
      createdDate: new Date(),
      issuer: 'self',
      action,
      target,
      value
    }
    this.#historyDatabase.add(h)
  }
}
