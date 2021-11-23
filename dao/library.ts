import type { IGunChainReference } from 'gun/types/chain'
import { LibraryModel, LibraryBookModel } from '@/models/library'
import { BibliographyModel } from '@/models/bibliography'
import type { AppState } from '@/types/appState'
import { IDao, IDaoBase } from '@/dao/base'
import { LogModel } from '@/models/base'

class LibraryBookDao extends IDaoBase<LibraryBookModel> {
  #topGun: IGunChainReference<AppState>
  #gun: IGunChainReference<Record<string, LibraryBookModel>, 'books'>
  #library: LibraryModel | undefined = undefined
  #issuer: string

  constructor (gun: IGunChainReference<AppState>, library: LibraryModel, issuer: string) {
    super(gun.get('libraries').get(library.id).get('books'), 'library-book', issuer)
    this.#gun = gun.get('libraries').get(library.id).get('books')
    this.#topGun = gun
    this.#issuer = issuer
    this.__shootPromise<LibraryModel>(gun.get('libraries').get(library.id)).then(
      (libraryModel: LibraryModel | undefined) => {
        this.#library = libraryModel
      }
    )
  }

  async createModel (
    bibliography: BibliographyModel,
    note: string
  ) {
    if (!bibliography.id) {
      throw new Error('Invalid bibliography model')
    }
    const dbBibliography = await this.__shootPromise<BibliographyModel>(
      this.#topGun.get('bibliographies').get(bibliography.id)
    )
    if (!dbBibliography) {
      throw new Error('Bibliography was not found')
    }
    if (!dbBibliography.id) {
      throw new Error('Bibliography was not found')
    }
    const bibliographyRef = this.#topGun.get('bibliographies').get(bibliography.id)
    return new LibraryBookModel(
      this.getNewId(), '', this.getCurrentUnixTime(),
      note, true, bibliographyRef, false
    )
  }

  async add (book: LibraryBookModel) : Promise<boolean> {
    if (!book.id) {
      throw new Error('Invalid book model')
    }
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    await this.__verifyModeratorPermission()
    return await this.__add(book)
  }

  async edit (book: LibraryBookModel) {
    if (!book.id) {
      throw new Error('Invalid book model')
    }
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    await this.__verifyModeratorPermission()
    return await this.__edit(book)
  }

  async remove (book: LibraryBookModel) {
    if (!book.id) {
      throw new Error('Invalid book model')
    }
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    await this.__verifyModeratorPermission()
    return await this.__remove(book)
  }

  list () {
    return this.__list()
  }

  async rent (book: LibraryBookModel) {
    if (!book.id) {
      throw new Error('Invalid book model')
    }
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    const dbBookRef = this.#gun.get(book.id)
    const dbBook = await this.__shootPromise<LibraryBookModel>(
      dbBookRef
    )
    if (!dbBook) {
      throw new Error('Book was not found')
    }
    if (!dbBook.rentable) {
      throw new Error('The book is not available.')
    }
    dbBook.rentable = false
    await this.__edit(dbBook)
  }

  async listBookAsBibliography (): Promise<BibliographyModel[]> {
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    const bibliographiesRef = this.#topGun
      .get('libraries')
      .get(this.#library.id)
      .get('books')
      .map()
      .get('bibliography')
    const keys = await this.__keys(bibliographiesRef)
    const bibliographies = await this.__shootPromiseMultiple<BibliographyModel>(
      bibliographiesRef.once().map(), keys
    )
    return bibliographies
  }

  count () {
    return this.__count()
  }

  private async __verifyModeratorPermission () {
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    const owner = this.#library.owner
    if (!owner) {
      throw new Error('Library owner is not found')
    }
    const adminsRef = this.#topGun.get('libraries').get(this.#library.id).get('admins')
    const obj = await this.__shootPromise<object>(adminsRef)
    console.log(obj)
    const keys = await this.__keys(adminsRef)
    const admins = await this.__shootPromiseMultiple<string>(
      adminsRef.once().map(), keys
    )
    if (!(owner + admins).includes(this.#issuer)) {
      throw new Error("You can't modify this library")
    }
  }
}

/**
 * This is library data access object.
*/
class LibraryDao extends IDaoBase<LibraryModel> implements IDao<LibraryModel> {
  #gun: IGunChainReference<Record<string, LibraryModel>, 'libraries'>
  #topGun: IGunChainReference<AppState>
  #issuer: string

  constructor (gun: IGunChainReference<AppState>, issuer: string) {
    super(gun.get('libraries'), 'library', issuer)
    this.#gun = gun.get('libraries')
    this.#issuer = issuer
    this.#topGun = gun
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

  getBookDao (library: LibraryModel): LibraryBookDao {
    if (!library.id) {
      throw new Error('Invalid library model')
    }
    return new LibraryBookDao(this.#topGun, library, this.#issuer)
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
    if (!(owner + []).includes(this.#issuer)) {
      throw new Error("You can't modify this library")
    }
  }
}

export { LibraryDao, LibraryBookDao }
