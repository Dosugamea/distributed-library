import { ContentType } from './base/content'
import { LogType } from './base/log'
import { ReviewType } from './review'
import { LibraryType } from './library'

/**
 * ユーザー情報
 */
export type UserState = ContentType & {
  /** ユーザー所持コイン */
  coin: number
  /** レビュー履歴 */
  reviews : Record<string, ReviewType>
  /** レビューした回数 */
  reviewCount: number
  /** 借りた履歴 */
  borrowOrReturn: Record<string, LogType>
  /** 借りた冊数 */
  borrowCount: number
  /** 返した冊数 */
  returnCount: number
  /** 所有する本棚 */
  libraries: Record<string, LibraryType>
  /** 所有する本棚数 */
  libraryCount: number
}
