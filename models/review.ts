import EventStore from 'orbit-db-eventstore'
import { Review as ReviewType } from '@/types/review'
import { BibliographyReviewHistory } from '@/types/review-history'
import { BibliographyReviewHistoryId, UserId, BibliographyId } from '@/types/base/ids'
import ContentModel from '@/models/base/content'

/**
 * Review model instance for add/edit/remove review entries.
*/
export default class ReviewModel extends ContentModel implements ReviewType {
    #histories: BibliographyReviewHistoryId[] = []
    #userId: UserId = ''
    #bibliographyId: BibliographyId = ''
    #coin: number = 0

    constructor (
      id: string,
      userId: UserId,
      bibliographyId: BibliographyId,
      coin: number,
      name: string,
      createdDate: Date,
      updatedDate: Date,
      histories: BibliographyReviewHistoryId[],
      note: string,
      historyDatabase: EventStore<BibliographyReviewHistory>,
      issuer: string
    ) {
      super(id, name, note, createdDate, updatedDate, historyDatabase, issuer)
      this.#userId = userId
      this.#coin = coin
      this.#bibliographyId = bibliographyId
      this.#histories = histories
    }

    get histories () {
      return this.#histories
    }

    get userId () {
      return this.#userId
    }

    get bibliographyId () {
      return this.#bibliographyId
    }

    get coin () {
      return this.#coin
    }

    get _id (): string {
      return this.id
    }
}
