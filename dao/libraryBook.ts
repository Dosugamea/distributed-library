import type { IGunChainReference } from 'gun/types/chain'
import { LibraryModel, LibraryBookModel } from '@/models/library'
import { BibliographyModel } from '@/models/bibliography'
import type { AppState } from '@/types/appState'
import type { LibraryBookType } from '@/types/libraryBook'
import { IDao, IDaoBase } from '@/dao/base'
import { LogModel } from '@/models/base'

class LibraryBookDao extends IDaoBase<LibraryBookModel> implements IDao<LibraryBookModel> {
  #topGun: IGunChainReference<AppState>
  #gun: IGunChainReference<Record<string, LibraryBookType>>
  #library: LibraryModel | undefined = undefined
  #bibliographies: BibliographyModel[] = []
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
    const me = this
    // @ts-ignore
    me.#gun.map().get('bibliography').once(function (data: BibliographyModel, key) {
      me.#bibliographies = me.#bibliographies.filter(data => data.id !== key)
      if (!data.isDeleted) {
        me.#bibliographies.push(data)
      }
    })
  }

  createModel (
    bibliography: BibliographyModel,
    library: LibraryModel,
    note: string
  ) {
    return new LibraryBookModel(
      this.getNewId(), '', this.getCurrentUnixTime(),
      // @ts-ignore
      note, true, bibliography.id, {}, library.id, {}, false
    )
  }

  async add (
    book: LibraryBookModel,
    bibliography: BibliographyModel,
    library: LibraryModel
  ): Promise<boolean> {
    if (!book.id) {
      throw new Error('Invalid book model')
    }
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    await this.__verifyModeratorPermission()
    await this.__add(book)
    if (!bibliography.id) {
      throw new Error('Invalid bibliography model')
    }
    if (!library.id) {
      throw new Error('Invalid library model')
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
    const bibliographyRef = this.#topGun.get('bibliographies').get(
      dbBibliography.id
    )
    // @ts-ignore
    this.#gun.get(book.id).get('bibliography').put(bibliographyRef)
    const dbLibrary = await this.__shootPromise<LibraryModel>(
      this.#topGun.get('libraries').get(library.id)
    )
    if (!dbLibrary) {
      throw new Error('Library was not found')
    }
    if (!dbLibrary.id) {
      throw new Error('Library was not found')
    }
    const libraryRef = this.#topGun.get('libraries').get(
      dbLibrary.id
    )
    // @ts-ignore
    this.#gun.get(book.id).get('library').put(libraryRef)
    return true
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

  list () {
    return this.__list()
  }

  listBookAsBibliography () {
    return this.#bibliographies
  }

  findBookByBibliographyId (bibliographyId: string): LibraryBookModel | null {
    const books = this.__list().filter(book => book.bibliographyId === bibliographyId)
    if (books.length === 0) {
      return null
    }
    return books[0]
  }

  async isExist (id: string): Promise<boolean> {
    return await this.__isExist(id)
  }

  find (query: (model: LibraryBookModel) => boolean): LibraryBookModel[] {
    return this.__find(query)
  }

  count () {
    return this.__count()
  }

  async get (id: string): Promise<LibraryBookModel> {
    return await this.__get(id)
  }

  async histories (model: LibraryBookModel): Promise<LogModel[]> {
    return await this.__histories(model)
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
    let admins: string[] = []
    // @ts-ignore
    if (obj === 'aaa') {
      const keys = await this.__keys(adminsRef)
      admins = await this.__shootPromiseMultiple<string>(
        adminsRef.once().map(), keys
      )
    }
    if (!(owner + admins).includes(this.#issuer)) {
      throw new Error("You can't modify this library")
    }
  }
}

export { LibraryBookDao }
