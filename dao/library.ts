import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { nanoid } from 'nanoid'
import { v4 as uuid4 } from 'uuid'
import type { LibraryInfoDatabase, LibraryInfoHistoryDatabase } from '@/types/base/addresses'
import type { LibraryId } from '@/types/base/ids'
import { Library } from '@/types/library'
import { LibraryHistory, LibraryHistoryAction, LibraryHistoryTarget } from '@/types/library-history'
import LibraryModel from '@/models/library'

export default class LibraryDao {
  #database!: DocStore<any>
  #historyDatabase!: EventStore<LibraryHistory>
  #defaultAdmin!: string

  async build (orbitdb: OrbitDB, databaseAddress: LibraryInfoDatabase | null, historyDatabaseAddress: LibraryInfoHistoryDatabase | null) {
    databaseAddress = databaseAddress || 'library'
    historyDatabaseAddress = historyDatabaseAddress || 'libraryHistory'
    this.#database = await orbitdb.docstore(databaseAddress, { accessController: { write: ['*'] } }) as DocStore<any>
    this.#historyDatabase = await orbitdb.log(historyDatabaseAddress, { accessController: { write: ['*'] } })
    // @ts-ignore
    this.#defaultAdmin = orbitdb.identity.publicKey
  }

  create (
    name: string,
    note: string,
    issuer: string
  ): LibraryModel {
    const id = nanoid(20)
    const createdDate = new Date()
    const library = new LibraryModel(
      id, name,
      createdDate, createdDate,
      [], [this.#defaultAdmin],
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

  listenWrite (runner: any) {
    this.#database.events.on('write', runner)
  }

  listenUpdate (runner: any) {
    this.#database.events.on('replicated', runner)
  }

  listenReady (runner: any) {
    this.#database.events.on('ready', runner)
  }

  convertToModel (library: Library, issuer: string): LibraryModel {
    return new LibraryModel(
      library.id, library.name, library.createdDate, library.updatedDate,
      library.histories, library.admins,
      library.note,
      this.#historyDatabase, issuer)
  }

  convertToType (library: LibraryModel): object {
    return {
      _id: library._id,
      id: library.id,
      name: library.name,
      createdDate: '',
      updatedDate: '',
      histories: [].toString(),
      admins: [].toString(),
      note: library.note
    }
  }

  async add (library: LibraryModel) : Promise<string> {
    if (this.isExist(library.id)) {
      throw new Error(`Library ${library.id} already exist`)
    }
    const dbPutResp = await this.#database.put(this.convertToType(library))
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

  list (): object[] {
    const docs = this.#database.get('')
    return docs
  }

  isExist (libraryId: LibraryId) : boolean {
    return this.#database.get(libraryId).length > 0
  }

  private addHistory (action: LibraryHistoryAction, target: LibraryHistoryTarget, value: string) {
    const h: object = {
      id: uuid4(),
      createdDate: new Date().toString(),
      issuer: 'self',
      action,
      target,
      value
    }
    this.#historyDatabase.add(h)
  }
}
