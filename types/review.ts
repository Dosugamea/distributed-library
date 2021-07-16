import { BibliographyReviewId, UserId, BibliographyId } from './base/ids'

/*
* レビュー型
*  全インスタンス共通のレビューDB(feed)で使用
*
* 編集可能なノード: 誰でも(追加と削除のみ) / identifyIDが一致する場合のみ処理成立
*/

/**
 * レビュー情報
 */
export interface Review {
    /** レビューID */
    reviewId: BibliographyReviewId
    /** ユーザーID */
    userId: UserId
    /** 書誌ID */
    bibliographyId: BibliographyId
    /** ユーザーが付与したコイン数 */
    coin: Number
    /** レビュー本文 */
    comment: String
    /** レビューの投稿日 */
    createdDate: Date
}
