import type { IGunChainReference } from 'gun/types/chain'
import { BibliographyModel } from '@/models/bibliography'
import type { AppState } from '@/types/appState'
import { IDao, IDaoBase } from '@/dao/base'
import { LogModel } from '@/models/base'

/**
 * This is bibliography data access object.
*/
class BibliographyDao extends IDaoBase<BibliographyModel> implements IDao<BibliographyModel> {
  constructor (gun: IGunChainReference<AppState>, issuer: string) {
    super(gun.get('bibliographies'), 'bibliography', issuer)
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
    const newId = this.getNewId()
    const logTime = this.getCurrentUnixTime()
    return new BibliographyModel(
      newId, name, logTime, logTime, {}, note, image, category, author, publisher, logTime, {}, false
    )
  }

  async add (bibliography: BibliographyModel): Promise<boolean> {
    return await this.__add(bibliography)
  }

  async edit (bibliography: BibliographyModel): Promise<boolean> {
    return await this.__edit(bibliography)
  }

  async remove (bibliography: BibliographyModel): Promise<boolean> {
    return await this.__remove(bibliography)
  }

  list (): BibliographyModel[] {
    return this.__list()
  }

  find (query: (model: BibliographyModel) => boolean): BibliographyModel[] {
    return this.__find(query)
  }

  count () {
    return this.__count()
  }

  async get (id: string): Promise<BibliographyModel> {
    return await this.__get(id)
  }

  async isExist (id: string): Promise<boolean> {
    return await this.__isExist(id)
  }

  async histories (model: BibliographyModel): Promise<LogModel[]> {
    return await this.__histories(model)
  }
}

export { BibliographyDao }
