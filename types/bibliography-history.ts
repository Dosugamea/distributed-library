import { AdminId, BibliographyHistoryId } from './base/ids'
import { History } from './base/history'

/*
* 書誌情報編集履歴型
*  全インスタンス共通で1つのDB(追加専用のdocs)を用いる
*  identifyとadminIdが一致していないと追加できない仕様とする
*
* 編集可能なノード: 各インスタンスの(全インスタンスの過半数以上にtrustされている)管理者
*/

/**
 * 書誌情報の編集操作:動作
 */
export type BibliographyHistoryAction = 'create' | 'edit'

/**
 * 書誌情報の編集操作:対象
 */
export type BibliographyHistoryTarget = 'bibliography' | 'title' | 'category' | 'author' | 'publisher' | 'publishedDate' | 'note'

/**
 * 書誌情報の編集履歴
 */
export interface BibliographyHistory extends History {
  id: BibliographyHistoryId
  issuer: AdminId
  action: BibliographyHistoryAction
  target: BibliographyHistoryTarget
  value: string
}
