import OrbitDB from 'orbit-db'
import type KeyValueStore from 'orbit-db-kvstore'
import { GenesisLibrary } from '@/types/genesis-instance'
import {
  LibraryInfoDatabase, LibraryInfoHistoryDatabase,
  LibraryBookInfoDatabase, LibraryBookInfoHistoryDatabase
} from '@/types/base/addresses'

export default class Instance implements GenesisLibrary {
  #db!: KeyValueStore<any>

  async build (orbitdb: OrbitDB, databaseAddress: string | null) {
    databaseAddress = databaseAddress || 'genesis-instance'
    this.#db = await orbitdb.keyvalue(databaseAddress) as KeyValueStore<GenesisLibrary>
  }

  getAddress () : string {
    return this.#db.address.root
  }

  async create (
    library: LibraryInfoDatabase, libraryHistory: LibraryInfoHistoryDatabase,
    book: LibraryBookInfoDatabase, bookHistory: LibraryBookInfoHistoryDatabase
  ) {
    await this.#db.set('library', library)
    await this.#db.set('libraryHistory', libraryHistory)
    await this.#db.set('book', book)
    await this.#db.set('bookHistory', bookHistory)
  }

  get library () : LibraryInfoDatabase { return this.#db.get('library') as LibraryInfoDatabase }

  get libraryHistory () : LibraryInfoHistoryDatabase { return this.#db.get('libraryHistory') as LibraryInfoHistoryDatabase }

  get book () : LibraryBookInfoDatabase { return this.#db.get('book') as LibraryBookInfoDatabase }

  get bookHistory () : LibraryBookInfoHistoryDatabase { return this.#db.get('bookHistory') as LibraryBookInfoHistoryDatabase }
}
