import { ContentType } from './base/content'
import { AdminId, LibraryId } from './base/ids'
import { BibliographyType } from './bibliography'

/*
* 図書室の蔵書情報型
*  インスタンス個別の蔵書情報DB(docs)で使用
*
* 編集可能なノード: 図書室の管理者
*/

/**
 * 図書室の蔵書情報
 */
export type BookType = {
  /** 貸出可能な状態か */
  rentable: boolean
  /** 備考欄(本の状態等) */
  note: string
  /** 書誌 */
  bibliography: BibliographyType
}

/*
* 図書室型
*  インスタンス個別の蔵書情報DB(key-value)で使用
*
* 編集可能なノード: インスタンス内の(過半数以上にtrustされている)管理者
*/

/**
 * 図書室情報
 */
export type LibraryType = ContentType & {
  /** 図書室ID */
  libraryId: LibraryId
  /** 図書室名 */
  name: string
  /** 図書室の作者ID */
  owner: AdminId
  /** 図書室の管理者配列 */
  admins: AdminId[]
  /** 図書室の作成日 */
  createdDate: Date
  /** 図書室の更新日 */
  updatedDate: Date
  /** 備考欄(図書室の扱う本/ポリシー等) */
  note: string
  /** 所蔵する本 */
  books: BookType[]
}
