import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'
import type { LibraryInfoDatabase, LibraryInfoHistoryDatabase } from '@/types/base/addresses'
import type { LibraryId } from '@/types/base/ids'
import { Library } from '@/types/library'
import { LibraryHistory, LibraryHistoryAction, LibraryHistoryTarget } from '@/types/library-history'
import LibraryModel from '@/models/library'

export default class LibraryDao {
  #database!: DocStore<Library>
  #historyDatabase!: EventStore<LibraryHistory>

  async build (orbitdb: OrbitDB, databaseAddress: LibraryInfoDatabase | null, historyDatabaseAddress: LibraryInfoHistoryDatabase | null) {
    databaseAddress = databaseAddress || 'library'
    historyDatabaseAddress = historyDatabaseAddress || 'libraryHistory'
    this.#database = await orbitdb.docstore(databaseAddress) as DocStore<Library>
    this.#historyDatabase = await orbitdb.log(historyDatabaseAddress) as EventStore<LibraryHistory>
  }

  create (
    id: string,
    name: string,
    admins: string[],
    note: string,
    issuer: string
  ): LibraryModel {
    const createdDate = new Date()
    const library = new LibraryModel(
      id, name,
      createdDate, createdDate,
      [], admins,
      note,
      this.#historyDatabase, issuer)
    return library
  }

  getAddress () {
    return this.#database.address.root
  }

  getHistoryAddress () {
    return this.#historyDatabase.address.root
  }

  convertToModel (library: Library, issuer: string): LibraryModel {
    return new LibraryModel(
      library.id, library.name, library.createdDate, library.updatedDate,
      library.histories, library.admins,
      library.note,
      this.#historyDatabase, issuer)
  }

  async add (library: LibraryModel) : Promise<string> {
    if (this.isExist(library.id)) {
      throw new Error(`Library ${library.id} already exist`)
    }
    const dbPutResp = await this.#database.put(library)
    this.addHistory('create', 'library', library.id)
    return dbPutResp
  }

  async edit (library: LibraryModel) {
    if (!this.isExist(library.id)) {
      throw new Error(`Library ${library.id} doesn't exist`)
    }
    await this.#database.del(library.id)
    await this.#database.put(library)
    this.addHistory('edit', 'library', library.id)
  }

  remove (library: LibraryModel) {
    if (!this.isExist(library.id)) {
      throw new Error(`Library ${library.id} doesn't exist`)
    }
    // this.#database.del(library.id)
    // this.addHistory('delete', 'library', library.id)
    throw new Error('Remove library is not implemented')
  }

  find (query : any) : Library[] {
    return this.#database.query(query)
  }

  get (libraryId: LibraryId): Library {
    const docs = this.#database.get(libraryId)
    if (docs.length === 0) { throw new Error(`Library ${libraryId} doesn't exist`) }
    return docs[0]
  }

  isExist (libraryId: LibraryId) : boolean {
    return this.#database.get(libraryId).length > 0
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
