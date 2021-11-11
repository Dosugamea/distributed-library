import type { IGunChainReference } from 'gun/types/chain'
import { ReviewModel } from '@/models/review'
import type { AppState } from '@/types/appState'
import { IDao, IDaoBase } from '@/dao/base'
import { LogModel } from '@/models/base'
import { BibliographyModel } from '@/models/bibliography'

/**
 * This is review data access object.
*/
class ReviewDao extends IDaoBase<ReviewModel> implements IDao<ReviewModel> {
  constructor (gun: IGunChainReference<AppState>, issuer: string) {
    super(gun.get('libraries'), 'review', issuer)
  }

  createModel (
    name: string,
    note: string,
    author: string,
    bibliography: IGunChainReference<BibliographyModel>,
    comment: string
  ) {
    // creates new model and return instance
    const newId = this.getNewId()
    const logTime = this.getCurrentUnixTime()
    return new ReviewModel(
      newId, name, logTime, logTime, {}, note,
      author, bibliography, comment, {}, false
    )
  }

  async add (review: ReviewModel): Promise<boolean> {
    return await this.__add(review)
  }

  async edit (review: ReviewModel): Promise<boolean> {
    return await this.__edit(review)
  }

  async remove (review: ReviewModel): Promise<boolean> {
    return await this.__remove(review)
  }

  list (): ReviewModel[] {
    return this.__list()
  }

  find (query: (model: ReviewModel) => boolean): ReviewModel[] {
    return this.__find(query)
  }

  count () {
    return this.__count()
  }

  async get (id: string): Promise<ReviewModel> {
    return await this.__get(id)
  }

  async isExist (id: string): Promise<boolean> {
    return await this.__isExist(id)
  }

  async histories (model: ReviewModel): Promise<LogModel[]> {
    return await this.__histories(model)
  }
}

export { ReviewDao }
