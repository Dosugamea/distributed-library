import type { IGunChainReference } from 'gun/types/chain'
import { BibliographyType } from './bibliography'
import { ContentType } from './base/content'

/*
* レビュー型
*  全インスタンス共通のレビューDB(feed)で使用
*
* 編集可能なノード: 誰でも(追加と削除のみ) / identifyIDが一致する場合のみ処理成立
*/

/*
* レビュー評価型
*  全インスタンス共通のレビュー評価DB(追加専用doc)で使用
*
* 編集可能なノード: 誰でも
*/

/**
 * レビュー評価情報
 */
export type ReviewLikeType = {
  /** ユーザーID */
  readonly userId: string
  /** ユーザーが付与したコイン数 */
  coin: number
  /** レビュー評価の投稿日 */
  readonly createdDateUnix: number
}

/**
 * レビュー情報
 */
export type ReviewType = ContentType & {
  /** ユーザーID */
  readonly userId: string
  /** 書誌 */
  bibliography: IGunChainReference<BibliographyType>
  /** レビュー本文 */
  comment: string
  /** レビューの投稿日 */
  readonly createdDateUnix: number
  /** レビューへのいいね */
  likes: Record<string, ReviewLikeType>
}
