import { ContentModel, LogModel } from '@/models/base'
import { BibliographyModel } from '@/models/bibliography'
import { LibraryType, LibraryBookType } from '@/types/library'
import { AdminId } from '@/types/base/ids'

/**
 * 本棚の蔵書モデル
 */
class LibraryBookModel implements LibraryBookType {
  /** 貸出可能な状態か */
  rentable: boolean
  /** 備考欄(本の状態等) */
  note: string
  /** 書誌 */
  bibliography: BibliographyModel

  constructor (rentable: boolean, note: string, bibliography: BibliographyModel) {
    this.rentable = rentable
    this.note = note
    this.bibliography = bibliography
  }
}

/**
 * レビューへのいいねモデル
 */
class LibraryModel extends ContentModel implements LibraryType {
  /** 図書室の作成者 */
  owner: AdminId
  /** 図書室の管理者配列 */
  admins: AdminId[]
  /** 所蔵する本 */
  books: LibraryBookModel[]

  constructor (
    id: string,
    name: string,
    createdDate: Date,
    updatedDate: Date,
    histories: LogModel[],
    note: string,
    owner: AdminId,
    admins: AdminId[],
    books: LibraryBookModel[]
  ) {
    super(id, name, createdDate, updatedDate, histories, note)
    this.owner = owner
    this.admins = admins
    this.createdDate = createdDate
    this.books = books
  }
}

export { LibraryModel, LibraryBookModel }
