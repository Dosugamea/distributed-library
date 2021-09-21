import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'
import type { BibliographyReviewDatabase, BibliographyReviewHistoryDatabase } from '@/types/base/addresses'
import type { BibliographyReviewId, UserId } from '@/types/base/ids'
import type { Review } from '@/types/review'
import ReviewModel from '@/models/Review'
import Bibliography from '@/models/bibliography'
import { BibliographyReviewHistory, BibliographyReviewHistoryAction, BibliographyReviewHistoryTarget } from '@/types/review-history'

/**
 * This is review data access object.
*/
export default class ReviewDao {
  #database!: DocStore<Review>
  #historyDatabase!: EventStore<BibliographyReviewHistory>
  #issuer: UserId = ''

  constructor (orbitdb: OrbitDB, databaseAddress: BibliographyReviewDatabase | null, historyDatabaseAddress: BibliographyReviewHistoryDatabase | null) {
    databaseAddress = databaseAddress || 'review'
    historyDatabaseAddress = historyDatabaseAddress || 'reviewHistory'
    // @ts-ignore
    this.#issuer = orbitdb.identity.publicKey
    orbitdb.docs(databaseAddress).then((db) => {
      this.#database = db as DocStore<Review>
    })
    orbitdb.log(historyDatabaseAddress, { accessController: { write: ['*'] } }).then((db) => {
      this.#historyDatabase = db as EventStore<BibliographyReviewHistory>
    })
  }

  async add (review: ReviewModel) : Promise<string> {
    if (this.isExist(review.id)) {
      throw new Error(`Review ${review.id} already exist`)
    }
    const dbPutResp = await this.#database.put(review)
    this.addHistory('add', 'note', review.id)
    return dbPutResp
  }

  async edit (review: ReviewModel) {
    if (!this.isExist(review.id)) {
      throw new Error(`Review ${review.id} doesn't exist`)
    }
    await this.#database.del(review.id)
    await this.#database.put(review)
    this.addHistory('edit', 'note', review.id)
  }

  remove (review: ReviewModel) {
    if (!this.isExist(review.id)) {
      throw new Error(`Review ${review.id} doesn't exist`)
    }
    // this.#database.del(review.id)
    // this.addHistory('delete', 'review', review.id)
    throw new Error('Remove review is not implemented')
  }

  find (query : any) : Review[] {
    return this.#database.query(query)
  }

  get (reviewId: BibliographyReviewId): Review {
    const docs = this.#database.get(reviewId)
    if (docs.length === 0) { throw new Error(`Review ${reviewId} doesn't exist`) }
    return docs[0]
  }

  isExist (reviewId: BibliographyReviewId) : boolean {
    return this.#database.get(reviewId).length > 0
  }

  getReviewByBibliography (bibliography: Bibliography): Review[] {
    return this.#database.get((doc: Review) => doc.bibliographyId === bibliography.id) as Review[]
  }

  getReviewById (reviewId: BibliographyReviewId): Review[] {
    return this.#database.get((doc: Review) => doc.id === reviewId) as Review[]
  }

  private addHistory (action: BibliographyReviewHistoryAction, target: BibliographyReviewHistoryTarget, value: string) {
    const h: BibliographyReviewHistory = {
      id: uuid4(),
      createdDate: new Date(),
      issuer: this.#issuer,
      action,
      target,
      value
    }
    this.#historyDatabase.add(h)
  }
}
