import type { IGunChainReference } from 'gun/types/chain'
import { ContentModel, LogModel } from '@/models/base'
import { BibliographyModel } from '@/models/bibliography'
import { LibraryType, LibraryBookType } from '@/types/library'
import { AdminId } from '@/types/base/ids'

/**
 * 本棚の蔵書モデル
 */
class LibraryBookModel extends ContentModel implements LibraryBookType {
  /** 貸出可能な状態か */
  rentable: boolean
  /** 書誌 */
  bibliography: IGunChainReference<BibliographyModel>
  /** 削除フラグ */
  isDeleted: boolean

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    note: string,
    rentable: boolean,
    bibliography: IGunChainReference<BibliographyModel>,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, createdDateUnix, {}, note, isDeleted)
    this.rentable = rentable
    this.bibliography = bibliography
    this.isDeleted = isDeleted
  }
}

/**
 * レビューへのいいねモデル
 */
class LibraryModel extends ContentModel implements LibraryType {
  /** 図書室の作成者 */
  owner: AdminId
  /** 図書室の管理者配列 */
  admins: Record<string, AdminId>
  /** 所蔵する本 */
  books: Record<string, LibraryBookModel>

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: Record<string, LogModel>,
    note: string,
    owner: AdminId,
    admins: Record<string, AdminId>,
    books: Record<string, LibraryBookModel>,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note, isDeleted)
    this.owner = owner
    this.admins = admins
    this.createdDateUnix = createdDateUnix
    this.books = books
  }
}

export { LibraryModel, LibraryBookModel }
