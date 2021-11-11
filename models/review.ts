import type { IGunChainReference } from 'gun/types/chain'
import { ContentModel, LogModel } from '@/models/base'
import { BibliographyModel } from '@/models/bibliography'
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
  bibliography: IGunChainReference<BibliographyModel>
  comment: string
  likes: Record<string, ReviewLikeModel>

  constructor (
    id: string,
    name: string,
    createdDateUnix: number,
    updatedDateUnix: number,
    histories: Record<string, LogModel>,
    note: string,
    userId: string,
    bibliography: IGunChainReference<BibliographyModel>,
    comment: string,
    likes: Record<string, ReviewLikeModel>,
    isDeleted: boolean
  ) {
    super(id, name, createdDateUnix, updatedDateUnix, histories, note, isDeleted)
    this.userId = userId
    this.bibliography = bibliography
    this.comment = comment
    this.likes = likes
  }
}

export { ReviewModel }
