import { UserId, LibraryBookRentReturnId, BibliographyId } from './base/ids'
import { History } from './base/history'

/*
* 図書室情報 貸出履歴型
*  各インスタンスで1つのDB(log)を用いる
*
* 編集可能なノード: 誰でも
*/

/**
 * 蔵書の操作履歴:動作
 */
export type LibraryHistoryAction = 'rent' | 'return'

/**
 * 蔵書の操作履歴:対象
 */
export type LibraryHistoryTarget = 'book'

/**
 * 図書室の操作履歴
 */
export interface LibraryRent extends History {
  _id: LibraryBookRentReturnId
  issuer: UserId
  action: LibraryHistoryAction
  target: LibraryHistoryTarget
  value: BibliographyId
}
