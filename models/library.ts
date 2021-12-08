import type { IGunChainReference } from 'gun/types/chain'
import { ContentModel, LogModel } from '@/models/base'
import { BibliographyModel } from '@/models/bibliography'
import { LibraryType } from '@/types/library'
import { LibraryBookType } from '@/types/libraryBook'
import { AdminId } from '@/types/base/ids'

/**
 * 本棚モデル
 */
class LibraryModel extends ContentModel implements LibraryType {
  /** 図書室の作成者 */
  owner: AdminId
  /** 図書室の管理者配列 */
  admins: Record<string, AdminId>
  /** */
  books: Record<string, LibraryBookType>

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: Record<string, LogModel>,
    note: string,
    owner: AdminId,
    admins: Record<string, AdminId>,
    books: Record<string, LibraryBookType>,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note, isDeleted)
    this.owner = owner
    this.admins = admins
    this.books = books
    this.createdDateUnix = createdDateUnix
  }
}

/**
 * 本棚の蔵書モデル
 */
class LibraryBookModel extends ContentModel implements LibraryBookType {
  /** 貸出可能な状態か */
  rentable: boolean
  /** 書誌ID(識別用) */
  bibliographyId: string
  /** 書誌 */
  bibliography: IGunChainReference<BibliographyModel>
  /** 本棚ID(識別用) */
  libraryId: string
  /** 本棚 */
  library: IGunChainReference<LibraryModel>
  /** 削除フラグ */
  isDeleted: boolean

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    note: string,
    rentable: boolean,
    bibliographyId: string,
    bibliography: IGunChainReference<BibliographyModel>,
    libraryId: string,
    library: IGunChainReference<LibraryModel>,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, createdDateUnix, {}, note, isDeleted)
    this.rentable = rentable
    this.bibliographyId = bibliographyId
    this.bibliography = bibliography
    this.libraryId = libraryId
    this.library = library
    this.isDeleted = isDeleted
  }
}

export { LibraryModel, LibraryBookModel }
