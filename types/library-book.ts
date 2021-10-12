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
  // /** 蔵書を追加する */
  // addBook(book: Book): void
  // /** 蔵書を編集する */
  // editBook(book: Book): void
  // /** 蔵書を削除する */
  // removeBook(book: Book): void
  // /** 蔵書一覧を取得する(システム操作で呼び出される) */
  // listBook(): Book[]
  // /** 蔵書一覧をクエリ付きで取得する(システム操作で呼び出される) */
  // listBookWithQuery(query: any): Book[]
  // /** 本を借りる(システム操作で呼び出される) */
  // rentBook(issuer: UserId, book: Book): void
  // /** 本を返す(システム操作で呼び出される) */
  // returnBook(issuer: UserId, book: Book): void
}
