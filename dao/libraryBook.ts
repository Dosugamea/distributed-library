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
  #histories: LogModel[] = []

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
    this.#gun.map().get('bibliography').once(function (data: BibliographyModel, key) {
      if (!data.id) {
        return
      }
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

  initWatcher (book: LibraryBookModel) {
    const me = this
    // @ts-ignore
    this.#gun.get(book.id).get('histories').map().on(function (data: LogModel, key: string) {
      if (data.id) {
        me.#histories = me.#histories.filter(data => data.id !== key)
        me.#histories.push(data)
      }
    })
  }

  async add (
    book: LibraryBookModel,
    bibliography: BibliographyModel,
    library: LibraryModel
  ): Promise<boolean> {
    // 与えられた引数の検証
    if (!book.id) {
      throw new Error('Invalid book model')
    }
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    if (!bibliography.id) {
      throw new Error('Invalid bibliography model')
    }
    if (!library.id) {
      throw new Error('Invalid library model')
    }
    await this.__verifyModeratorPermission()
    // 書誌への参照を取得
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
    // 本棚への参照を取得
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
    // データの登録
    await this.__add(book)
    // @ts-ignore
    this.#gun.get(book.id).get('bibliography').put(bibliographyRef)
    // @ts-ignore
    this.#gun.get(book.id).get('library').put(libraryRef)
    this.#topGun.get(
      'bibliographies'
    ).get(
      bibliography.id
    ).get(
      'libraries'
    ).get(
      this.getNewId()
    // @ts-ignore
    ).put(libraryRef)
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

  async borrowBook (book: LibraryBookModel) {
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
    if (dbBook.rentable === false) {
      throw new Error('The book is not available.')
    }
    return await this.__editBoolean(dbBookRef.get('rentable'), false, dbBookRef)
  }

  async returnBook (book: LibraryBookModel) {
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
    if (dbBook.rentable === true) {
      throw new Error('The book is already available.')
    }
    return await this.__editBoolean(dbBookRef.get('rentable'), true, dbBookRef)
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

  histories (): LogModel[] {
    return this.#histories
  }

  findInHistories (bookId: string): LogModel[] {
    return this.#histories.filter(data => data.value === bookId)
  }

  private __verifyModeratorPermission () {
    if (!this.#library) {
      throw new Error('Invalid library model')
    }
    const owner = this.#library.owner
    if (!owner) {
      throw new Error('Library owner is not found')
    }
    const admins: string[] = []
    if (!(owner + admins).includes(this.#issuer)) {
      throw new Error("You can't modify this library")
    }
  }
}

export { LibraryBookDao }
