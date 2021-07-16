import { AdminId, LibraryHistoryId, BibliographyId } from './base/ids'
import { History } from './base/history'

/*
* 図書室情報編集履歴型
*  各インスタンスで1つのDB(追加専用のdocs)を用いる
*  identifyとadminIdが一致していないと追加できない仕様とする
*
* 編集可能なノード: 図書室の管理者
*/

/**
 * 図書室の操作履歴:動作
 */
export type LibraryHistoryAction = 'create' | 'edit' | 'remove'

/**
 * 図書室の操作履歴:対象
 */
export type LibraryHistoryTarget = 'library' | 'name' | 'admin' | 'note'

/**
 * 図書室の操作履歴
 */
export interface LibraryHistory extends History {
  _id: LibraryHistoryId
  issuer: AdminId
  action: LibraryHistoryAction
  target: LibraryHistoryTarget
  value: string | BibliographyId | AdminId
}
