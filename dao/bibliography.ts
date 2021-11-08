import type { IGunChainReference } from 'gun/types/chain'
import { getDiff } from 'recursive-diff'
import shortUUID from 'short-uuid'
import { BibliographyModel } from '@/models/bibliography'
import { LogModel } from '@/models/base'
import type { AppState } from '@/types/appState'
import { IDao, IDaoUtils } from '@/dao/base'

/**
 * This is bibliography data access object.
*/
class BibliographyDao extends IDaoUtils implements IDao<BibliographyModel> {
  #gun: IGunChainReference<AppState['bibliographies']>
  #issuer: string

  constructor (gun: IGunChainReference<AppState>, issuer: string) {
    super()
    this.#gun = gun.get('bibliographies')
    this.#issuer = issuer
  }

  createModel (
    name: string,
    note: string,
    image: string,
    category: string,
    author: string,
    publisher: string
  ) {
    // creates new model and return instance
    const newId = shortUUID().generate().toString()
    const logTime = this.getCurrentUnixTime()
    return new BibliographyModel(
      newId, name, logTime, logTime, {}, note, image, category, author, publisher, logTime, {}, false
    )
  }

  async add (bibliography: BibliographyModel): Promise<boolean> {
    const isExist = await this.isExist(bibliography.id)
    if (isExist) {
      throw new Error(`Bibliography ${bibliography.id} already exist`)
    }
    return new Promise<boolean>((resolve, reject) => {
      const bibliographyRef = this.#gun.get(bibliography.id)
      const me = this
      try {
        // Put callback is not working for me
        bibliographyRef.put(bibliography)
        try {
          me.addHistory('add', 'bibliography', bibliography.id, bibliographyRef).then(function () {
            resolve(true)
          })
        } catch (err) {
          reject(new Error(`Failed to add bibliography: ${err}`))
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  async edit (bibliography: BibliographyModel): Promise<boolean> {
    // Not tested yet
    const existBiblio = await this.get(bibliography.id)
    const diff = getDiff(existBiblio, bibliography)
    return new Promise<boolean>((resolve, reject) => {
      const me = this
      const bibliographyRef = this.#gun.get(bibliography.id)
      bibliographyRef.put(bibliography)
      try {
        me.addHistory('edit', 'bibliography', String(diff), bibliographyRef).then(function () {
          resolve(true)
        })
      } catch (e) {
        reject(new Error(`Failed to edit bibliography: ${e}`))
      }
    })
  }

  async remove (bibliography: BibliographyModel) : Promise<boolean> {
    const isExist = await this.isExist(bibliography.id)
    if (!isExist) {
      throw new Error(`Bibliography ${bibliography.id} doesn't exist`)
    }
    // This remove function makes model uncountable.
    // It will replaced with using isDeleted flag later.
    return new Promise<boolean>((resolve, reject) => {
      // @ts-ignore
      this.#gun.get(bibliography.id).put(null)
      try {
        resolve(true)
      } catch (e) {
        reject(new Error(`Failed to remove bibliography: ${e}`))
      }
    })
  }

  async list (): Promise<BibliographyModel[]> {
    // Get total content count to wait all data loaded
    const keys = await this.idKeys()
    // This loads every models from db
    const bibliographies = await this.shootPromiseMultiple<BibliographyModel>(this.#gun.map(), keys)
    return bibliographies
  }

  async find (query: (model: BibliographyModel) => BibliographyModel): Promise<BibliographyModel[]> {
    // Since using query makes model uncountable, it just get every contents, and filter later.
    const bibliographies = await this.list()
    return bibliographies.filter(query)
  }

  async get (id: string): Promise<BibliographyModel> {
    // This function works fine
    const bibliography = await this.shootPromise<BibliographyModel>(this.#gun.get(id))
    // It return undefined if not added yet or removed
    if (bibliography === undefined) {
      throw new Error(`Bibliography ${id} doesn't exist`)
    }
    return bibliography
  }

  async idKeys (): Promise<string[]> {
    // This function gets working keys only
    const allKeys = await this.allKeys()
    console.log(allKeys)
    return new Promise<string[]>((resolve, reject) => {
      try {
        const keys : string[] = []
        let cnt = 0
        this.#gun.map().get('isDeleted').once(
          function (id) {
            if (id !== undefined) {
              keys.push(id as unknown as string)
            }
            cnt++
            if (cnt === allKeys.length) {
              resolve(keys)
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  allKeys (): Promise<string[]> {
    // This function gets every keys includes the values are deleted.
    // I couldn't found how to delete "key", not only value.
    return new Promise<string[]>((resolve, reject) => {
      try {
        this.#gun.once(
          function (list) {
            if (list !== undefined) {
              const keys = Object.keys(list).filter(key => key !== '_')
              resolve(keys)
            } else {
              reject(new Error('Failed to get bibliography keys'))
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })
  }

  async count (): Promise<number> {
    // Counting working keys means counting models
    const keys = await this.idKeys()
    return keys.length
  }

  async isExist (id: string): Promise<boolean> {
    // Trying get means isExist
    const isDefined = await this.shootPromise<BibliographyModel>(this.#gun.get(id))
    return isDefined !== undefined
  }

  private addHistory (
    action: string,
    target: string,
    value: string,
    ref: IGunChainReference<BibliographyModel>
  ): Promise<boolean> {
    // Adds history automatically when add/edit/remove content
    const logTime = this.getCurrentUnixTime()
    const log = new LogModel(
      this.#issuer, action, target, value, logTime
    )
    return new Promise<boolean>((resolve, reject) => {
      ref.get('histories').get(String(logTime)).put(log, function (resp) {
        if (resp.ok) {
          resolve(true)
        } else {
          reject(new Error(`Failed to add bibliography: ${resp.err}`))
        }
      })
    })
  }
}

export { BibliographyDao }
