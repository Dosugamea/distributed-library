import { AdminId, LibraryId, UserId } from './base/ids'
import { Book } from './library-book'

/*
* 図書室型
*  インスタンス個別の蔵書情報DB(key-value)で使用
*
* 編集可能なノード: インスタンス内の(過半数以上にtrustされている)管理者
*/

/**
 * 図書室情報
 */
export interface Library {
  /** 図書室ID(OrbitDBのキーID) */
  _id: LibraryId
  /** 図書室ID */
  id: LibraryId
  /** 図書室名 */
  name: string
  /** 図書室の管理者配列 */
  admins: AdminId[]
  /** 図書室の作成日 */
  createdDate: Date
  /** 図書室の更新日 */
  updatedDate: Date
  /** 備考欄(図書室の扱う本/ポリシー等) */
  note: string
  /** 管理者を追加する */
  addAdmin(id: AdminId): void
  /** 管理者を削除する */
  removeAdmin(id: AdminId): void
  /** 蔵書を追加する */
  addBook(book: Book): void
  /** 蔵書を編集する */
  editBook(book: Book): void
  /** 蔵書を削除する */
  removeBook(book: Book): void
  /** 蔵書一覧を取得する(システム操作で呼び出される) */
  listBook(): Book[]
  /** 蔵書一覧をクエリ付きで取得する(システム操作で呼び出される) */
  listBookWithQuery(query: any): Book[]
  /** 本を借りる(システム操作で呼び出される) */
  rentBook(issuer: UserId, book: Book): void
  /** 本を返す(システム操作で呼び出される) */
  returnBook(issuer: UserId, book: Book): void
}
