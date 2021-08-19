import type { BibliographyReviewDatabase, BibliographyReviewHistoryDatabase } from '@/types/base/addresses'
import type { BibliographyReviewId, UserId } from '@/types/base/ids'
import type { Review } from '@/types/review'
import type Bibliography from '@/models/Bibliography'
import { BibliographyReviewHistory, BibliographyReviewHistoryAction, BibliographyReviewHistoryTarget } from '@/types/review-history'
import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'

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
