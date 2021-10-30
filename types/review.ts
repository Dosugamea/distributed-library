import { Content } from './base/content'
import { UserId, BibliographyId } from './base/ids'

/*
* レビュー型
*  全インスタンス共通のレビューDB(feed)で使用
*
* 編集可能なノード: 誰でも(追加と削除のみ) / identifyIDが一致する場合のみ処理成立
*/

/**
 * レビュー情報
 */
export type Review = Content & {
  /** ユーザーID */
  userId: UserId
  /** 書誌ID */
  bibliographyId: BibliographyId
  /** ユーザーが付与したコイン数 */
  coin: number
  /** レビュー本文 */
  comment: string
  /** レビューの投稿日 */
  createdDate: Date
}

/*
* レビュー評価型
*  全インスタンス共通のレビュー評価DB(追加専用doc)で使用
*
* 編集可能なノード: 誰でも
*/

/**
 * レビュー評価情報
 */
export interface ReviewLike {
  /** ユーザーID */
  userId: UserId
  /** ユーザーが付与したコイン数 */
  coin: number
  /** レビュー評価の投稿日 */
  createdDate: Date
}
