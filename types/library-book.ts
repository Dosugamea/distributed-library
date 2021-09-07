import { BibliographyId, LibraryBookId } from './base/ids'

/*
* 図書室の蔵書情報型
*  インスタンス個別の蔵書情報DB(docs)で使用
*
* 編集可能なノード: 図書室の管理者
*/

/**
 * 図書室の蔵書情報
 */
export interface Book {
  /** 蔵書ID(OrbitDBのキーID) */
  _id: LibraryBookId
  /** 蔵書ID */
  id: LibraryBookId
  /** 書誌ID */
  bibliographyId: BibliographyId
  /** 貸出可能な状態か */
  rentable: boolean
  /** 備考欄(本の状態等) */
  note: string
}
