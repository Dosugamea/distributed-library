import { BibliographyReviewLikeId, BibliographyReviewId, UserId } from './base/ids'

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
  /** レビュー評価ID */
  _id: BibliographyReviewLikeId
  /** レビューID */
  reviewId: BibliographyReviewId
  /** ユーザーID */
  userId: UserId
  /** ユーザーが付与したコイン数 */
  coin: Number
  /** レビュー評価の投稿日 */
  createdDate: Date
}
