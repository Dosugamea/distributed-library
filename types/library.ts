import { AdminId, LibraryId, LibraryHistoryId } from './base/ids'

/*
* 図書室型
*  インスタンス個別の蔵書情報DB(key-value)で使用
*
* 編集可能なノード: インスタンス内の(過半数以上にtrustされている)管理者
*/

/**
 * 図書室情報
 */
export type Library = {
  /** 図書室ID(OrbitDBのキーID) */
  _id: LibraryId
  /** 図書室ID */
  id: LibraryId
  /** 図書室名 */
  name: string
  /** 図書室の管理者配列 */
  admins: AdminId[]
  /** 図書室の編集履歴 */
  histories: LibraryHistoryId[]
  /** 図書室の作成日 */
  createdDate: Date
  /** 図書室の更新日 */
  updatedDate: Date
  /** 備考欄(図書室の扱う本/ポリシー等) */
  note: string
}
