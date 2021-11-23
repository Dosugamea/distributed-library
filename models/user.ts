import { ContentModel, LogModel } from '@/models/base'
import { ReviewModel } from '@/models/review'
import { UserState } from '@/types/userState'

/**
 * User model instance
*/
class UserModel extends ContentModel implements UserState {
  /** ユーザー所持コイン */
  coin: number
  /** レビュー履歴 */
  reviews : Record<string, ReviewModel>
  /** レビューした回数 */
  reviewCount: number
  /** 借りた履歴 */
  borrowOrReturn: Record<string, LogModel>
  /** 借りた冊数 */
  borrowCount: number
  /** 返した冊数 */
  returnCount: number

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: Record<string, LogModel>,
    note: string,
    coin: number,
    reviews: Record<string, ReviewModel>,
    reviewCount: number,
    borrowOrReturn: Record<string, LogModel>,
    borrowCount: number,
    returnCount: number,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note, isDeleted)
    this.coin = coin
    this.reviews = reviews
    this.reviewCount = reviewCount
    this.borrowOrReturn = borrowOrReturn
    this.borrowCount = borrowCount
    this.returnCount = returnCount
  }
}

export { UserModel }
