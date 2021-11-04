import type { IGunChainReference } from 'gun/types/chain'
import type { BibliographyModel } from '@/models/bibliography'
import type { BibliographyType } from '@/types/bibliography'
import type { AppState } from '@/types/appState'
import type { BibliographyId } from '@/types/base/ids'
import { IDao, shootPromise } from '@/dao/base'
import { getDiff, applyDiff, rdiffResult } from 'recursive-diff'

/**
 * This is bibliography data access object.
*/
export default class BibliographyDao implements IDao<BibliographyModel> {
  #gun: IGunChainReference<AppState['bibliographies']>

  constructor (gun: IGunChainReference<AppState>) {
    this.#gun = gun.get('bibliographies')
  }

  async add (bibliography: BibliographyModel): Promise<boolean> {
    const isExist = await this.isExist(bibliography.id)
    if (isExist) {
      throw new Error(`Bibliography ${bibliography.id} already exist`)
    }
    return new Promise<boolean>((resolve, reject) => {
      const me = this
      const bibliographyRef = this.#gun.get(bibliography.id)
      bibliographyRef.put(bibliography, function (resp) {
        if (resp.ok) {
          me.addHistory('add', 'bibliography', 'new', bibliographyRef).then(function () {
            resolve(true)
          })
        } else {
          reject(new Error(`Failed to add bibliography: ${resp.err}`))
        }
      })
    })
  }

  async edit (bibliography: BibliographyModel): Promise<boolean> {
    const existBiblio = await this.get(bibliography.id)
    const diff = getDiff(existBiblio, bibliography)
    return new Promise<boolean>((resolve, reject) => {
      const me = this
      const bibliographyRef = this.#gun.get(bibliography.id)
      bibliographyRef.put(bibliography, function (resp) {
        if (resp.ok) {
          me.addHistory('add', 'bibliography', 'new', bibliographyRef).then(function () {
            resolve(true)
          })
        } else {
          reject(new Error(`Failed to add bibliography: ${resp.err}`))
        }
      })
    })
  }

  async remove (bibliography: BibliographyModel) : Promise<boolean> {
    const isExist = await this.isExist(bibliography.id)
    if (!isExist) {
      throw new Error(`Bibliography ${bibliography.id} doesn't exist`)
    }
    throw new Error('Remove bibliography is not implemented')
  }

  async find (query : any) : Bibliography[] {
    return this.#database.query(query)
  }

  async get (id: string): Promise<BibliographyModel> {
    const bibliography = await shootPromise<BibliographyModel>(this.#gun.get(id))
    if (bibliography === undefined) {
      throw new Error(`Bibliography ${id} doesn't exist`)
    }
    return bibliography
  }

  async isExist (id: string): Promise<boolean> {
    const isDefined = await shootPromise<BibliographyModel>(this.#gun.get(id))
    return isDefined !== undefined
  }

  private async addHistory(
    action: string,
    target: string,
    value: string,
    ref: IGunChainReference
  ) {
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
