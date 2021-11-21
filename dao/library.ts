import type { IGunChainReference } from 'gun/types/chain'
import { LibraryModel, LibraryBookModel } from '@/models/library'
import { BibliographyModel } from '@/models/bibliography'
import type { AppState } from '@/types/appState'
import { IDao, IDaoBase } from '@/dao/base'
import { LogModel } from '@/models/base'

class LibraryBookDao extends IDaoBase<LibraryBookModel> {
  #gun: IGunChainReference<Record<string, LibraryBookModel>, 'books'>
  #topGun: IGunChainReference<AppState>
  #issuer: string

  constructor (gun: IGunChainReference<AppState>, library: LibraryModel, issuer: string) {
    super(gun.get('libraries').get(library.id).get('books'), 'library-book', issuer)
    this.#gun = gun.get('libraries').get(library.id).get('books')
    this.#topGun = gun
    this.#issuer = issuer
  }

  async createModel (
    bibliography: BibliographyModel,
    note: string,
    owner: string
  ) {
    if (!bibliography.id) {
      throw new Error('Invalid bibliography model')
    }
    const biblio = await this.__shootPromise<BibliographyModel>(
      this.#topGun.get('bibliographies').get(bibliography.id)
    )
    if (!biblio) {
      throw new Error('Bibliography was not found')
    }
    if (!biblio.id) {
      throw new Error('Bibliography was not found')
    }
    const newId = this.getNewId()
    const logTime = this.getCurrentUnixTime()
    return new LibraryBookModel(
      newId, name, logTime, logTime, {}, note, owner, {}, {}, false
    )
  }

  async add (book: LibraryBookModel) {
    if (!book.id) {
      throw new Error('Invalid library model')
    }
    const dbLibrary = await this.get(library.id)
    if (!dbLibrary.id) {
      throw new Error('Library was not found')
    }
    this.#gun.get(library.id).get('books').put(newBook)
    await this.__verifyModeratorPermission(library)
    console.log('Not yet implemented')
  }

  async editBook (library: LibraryModel, book: LibraryBookModel) {
    await this.__verifyModeratorPermission(library)
    console.log('Not yet implemented')
  }

  async removeBook (library: LibraryModel, book: LibraryBookModel) {
    await this.__verifyModeratorPermission(library)
    console.log('Not yet implemented')
  }

  async listBook (library: LibraryModel) {
    console.log('Not yet implemented')
  }

}

/**
 * This is library data access object.
*/
class LibraryDao extends IDaoBase<LibraryModel> implements IDao<LibraryModel> {
  #gun: IGunChainReference<Record<string, LibraryModel>, 'libraries'>
  #issuer: string

  constructor (gun: IGunChainReference<AppState>, issuer: string) {
    super(gun.get('libraries'), 'library', issuer)
    this.#gun = gun.get('libraries')
    this.#issuer = issuer
  }

  createModel (
    name: string,
    note: string,
    owner: string
  ) {
    // creates new model and return instance
    const newId = this.getNewId()
    const logTime = this.getCurrentUnixTime()
    return new LibraryModel(
      newId, name, logTime, logTime, {}, note, owner, {}, {}, false
    )
  }

  async add (library: LibraryModel): Promise<boolean> {
    return await this.__add(library)
  }

  async edit (library: LibraryModel): Promise<boolean> {
    await this.__verifyModeratorPermission(library)
    return await this.__edit(library)
  }

  async remove (library: LibraryModel): Promise<boolean> {
    await this.__verifyOwnerPermission(library)
    return await this.__remove(library)
  }

  list (): LibraryModel[] {
    return this.__list()
  }

  find (query: (model: LibraryModel) => boolean): LibraryModel[] {
    return this.__find(query)
  }

  count () {
    return this.__count()
  }

  async get (id: string): Promise<LibraryModel> {
    return await this.__get(id)
  }

  async isExist (id: string): Promise<boolean> {
    return await this.__isExist(id)
  }

  async histories (model: LibraryModel): Promise<LogModel[]> {
    return await this.__histories(model)
  }

  private async __verifyOwnerPermission (library: LibraryModel) {
    if (!library.id) {
      throw new Error('Invalid library model')
    }
    const dbLibrary = await this.get(library.id)
    const owner = dbLibrary.owner
    if (owner !== this.#issuer) {
      throw new Error("You can't modify this library")
    }
  }

  private async __verifyModeratorPermission (library: LibraryModel) {
    if (!library.id) {
      throw new Error('Invalid library model')
    }
    const dbLibrary = await this.get(library.id)
    const owner = dbLibrary.owner
    if (!owner) {
      throw new Error('Library owner is not found')
    }
    const keys = await this.__keys(this.#gun.get(library.id).get('admins'))
    const admins = await this.__shootPromiseMultiple<string>(
      this.#gun.get(library.id).get('admins').once().map(), keys
    )
    if (!(owner + admins).includes(this.#issuer)) {
      throw new Error("You can't modify this library")
    }
  }
}

export { LibraryDao, LibraryBookDao }
