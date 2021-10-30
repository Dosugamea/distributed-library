import type { IGunChainReference } from 'gun/types/chain'
import type { Bibliography } from '@/types/bibliography'
import type { AppState } from '@/types/appState'
import type { BibliographyId } from '@/types/base/ids'
import { IDao } from '@/dao/base'
import { getDiff, applyDiff, rdiffResult } from 'recursive-diff'

/**
 * This is bibliography data access object.
*/
export default class BibliographyDao implements IDao<Bibliography> {
  #gun: IGunChainReference<AppState>

  constructor (gun: IGunChainReference<AppState>) {
    this.#gun = gun
  }

  async add (bibliography: BibliographyModel) : Promise<string> {
    if (this.isExist(bibliography.id)) {
      throw new Error(`Bibliography ${bibliography.id} already exist`)
    }
    const dbPutResp = await this.#database.put(bibliography)
    this.addHistory('create', 'bibliography', bibliography.id)
    return dbPutResp
  }

  async edit (bibliography: BibliographyModel) {
    if (!this.isExist(bibliography.id)) {
      throw new Error(`Bibliography ${bibliography.id} doesn't exist`)
    }
    await this.#database.del(bibliography.id)
    await this.#database.put(bibliography)
    this.addHistory('edit', 'bibliography', bibliography.id)
  }

  remove (bibliography: BibliographyModel) {
    if (!this.isExist(bibliography.id)) {
      throw new Error(`Bibliography ${bibliography.id} doesn't exist`)
    }
    throw new Error('Remove bibliography is not implemented')
  }

  find (query : any) : Bibliography[] {
    return this.#database.query(query)
  }

  get (bibliographyId: BibliographyId): Bibliography {
    const docs = this.#database.get(bibliographyId)
    if (docs.length === 0) { throw new Error(`Bibliography ${bibliographyId} doesn't exist`) }
    return docs[0]
  }

  isExist (bibliographyId: BibliographyId) : boolean {
    return this.#database.get(bibliographyId).length > 0
  }

  private addHistory (action: BibliographyHistoryAction, target: BibliographyHistoryTarget, value: string) {
    const h: BibliographyHistory = {
      id: uuid4(),
      createdDate: new Date(),
      issuer: 'self',
      action,
      target,
      value
    }
    this.#historyDatabase.add(h)
  }
}
