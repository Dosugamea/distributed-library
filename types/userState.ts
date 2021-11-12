import type { IGunChainReference } from 'gun/types/chain'
import { ContentType } from './base/content'
import { LogType } from './base/log'
import { ReviewType } from './review'

/**
 * ユーザー情報
 */
export type UserState = ContentType & {
  /** ユーザー所持コイン */
  coin: number
  /** レビュー履歴 */
  reviews : IGunChainReference<Record<string, ReviewType>>
  /** レビューした回数 */
  reviewCount: number
  /** 借りた履歴 */
  borrowOrReturn: IGunChainReference<Record<string, LogType>>
  /** 借りた冊数 */
  borrowCount: number
  /** 返した冊数 */
  returnCount: number
}
