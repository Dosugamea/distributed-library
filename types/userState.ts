import type { IGunChainReference } from 'gun/types/chain'
import { ContentType } from './base/content'
import { LogType } from './base/log'
import { ReviewType } from './review'

/**
 * ユーザー情報
 */
export type UserState = ContentType & {
  /** ユーザー所持コイン */
  myCoin: number
  /** レビュー履歴 */
  myReviews : IGunChainReference<Record<string, ReviewType>>
  /** レビューした回数 */
  myReviewCount: number
  /** 借りた履歴 */
  myBorrowOrReturn: IGunChainReference<Record<string, LogType>>
  /** 借りた冊数 */
  myBorrowCount: number
  /** 返した冊数 */
  myReturnCount: number
}
