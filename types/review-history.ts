import { UserId, BibliographyReviewHistoryId } from './base/ids'
import { History } from './base/history'

/*
* 書誌レビュー編集履歴型
*  全インスタンス共通で1つのDB(追加専用)を用いる
*/

/**
 * 書誌レビュー情報の編集操作:動作
 */
export type BibliographyReviewHistoryAction = 'add' | 'edit' | 'remove'

/**
 * 書誌レビュー情報の編集操作:対象
 */
export type BibliographyReviewHistoryTarget = 'note'

/**
 * 書誌情報の編集履歴
 */
export interface BibliographyReviewHistory extends History {
  id: BibliographyReviewHistoryId
  issuer: UserId
  action: BibliographyReviewHistoryAction
  target: BibliographyReviewHistoryTarget
  value: string
}
