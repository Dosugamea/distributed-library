import type { IGunChainReference } from 'gun/types/chain'
import { ContentModel, LogModel } from '@/models/base'
import { ReviewModel } from '@/models/review'
import { UserState } from '@/types/userState'

/**
 * User model instance
*/
class UserModel extends ContentModel implements UserState {
  /** ユーザー所持コイン */
  myCoin: number
  /** レビュー履歴 */
  myReviews : IGunChainReference<Record<string, ReviewModel>>
  /** レビューした回数 */
  myReviewCount: number
  /** 借りた履歴 */
  myBorrowOrReturn: IGunChainReference<Record<string, LogModel>>
  /** 借りた冊数 */
  myBorrowCount: number
  /** 返した冊数 */
  myReturnCount: number

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: Record<string, LogModel>,
    note: string,
    myCoin: number,
    myReviews: IGunChainReference<Record<string, ReviewModel>>,
    myReviewCount: number,
    myBorrowOrReturn: IGunChainReference<Record<string, LogModel>>,
    myBorrowCount: number,
    myReturnCount: number,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note, isDeleted)
    this.myCoin = myCoin
    this.myReviews = myReviews
    this.myReviewCount = myReviewCount
    this.myBorrowOrReturn = myBorrowOrReturn
    this.myBorrowCount = myBorrowCount
    this.myReturnCount = myReturnCount
  }
}

export { UserModel }
