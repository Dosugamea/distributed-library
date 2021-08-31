import { BibliographyReviewId, UserId, BibliographyId, BibliographyReviewHistoryId } from './base/ids'

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
    id: BibliographyReviewId
    /** ユーザーID */
    userId: UserId
    /** 書誌ID */
    bibliographyId: BibliographyId
    /** ユーザーが付与したコイン数 */
    coin: number
    /** レビュータイトル */
    name: string
    /** レビュー本文 */
    note: string
    /** レビューの編集履歴 */
    histories: BibliographyReviewHistoryId[]
    /** レビューの投稿日 */
    createdDate: Date
    /** レビューの更新日 */
    updatedDate: Date
}
