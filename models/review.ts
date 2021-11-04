import { ContentModel, LogModel } from '@/models/base'
import { ReviewType, ReviewLikeType } from '@/types/review'

/**
 * レビューへのいいねモデル
 */
class ReviewLikeModel implements ReviewLikeType {
  userId: string
  coin: number
  createdDateUnix: number

  constructor (userId: string, coin: number, createdDateUnix: number) {
    this.userId = userId
    this.coin = coin
    this.createdDateUnix = createdDateUnix
  }
}

/**
 * レビューモデル
*/
class ReviewModel extends ContentModel implements ReviewType {
  userId: string
  bibliographyId: string
  comment: string
  likes: ReviewLikeModel[]

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: LogModel[],
    note: string,
    userId: string,
    bibliographyId: string,
    comment: string,
    likes: ReviewLikeModel[]
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note)
    this.userId = userId
    this.bibliographyId = bibliographyId
    this.comment = comment
    this.likes = likes
  }
}

export { ReviewModel }
