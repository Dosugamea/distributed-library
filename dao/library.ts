import type { IGunChainReference } from 'gun/types/chain'
import { LibraryModel } from '@/models/library'
import type { AppState } from '@/types/appState'
import { IDao, IDaoBase } from '@/dao/base'
import { LogModel } from '@/models/base'

/**
 * This is library data access object.
*/
class LibraryDao extends IDaoBase<LibraryModel> implements IDao<LibraryModel> {
  constructor (gun: IGunChainReference<AppState>, issuer: string) {
    super(gun.get('libraries'), 'library', issuer)
  }

  createModel (
    name: string,
    note: string,
    owner: string
  ) {
    // creates new model and return instance
    const newId = this.getNewId()
    const logTime = this.getCurrentUnixTime()
    return new LibraryModel(
      newId, name, logTime, logTime, {}, note, owner, {}, {}, false
    )
  }

  async add (library: LibraryModel): Promise<boolean> {
    return await this.__add(library)
  }

  async edit (library: LibraryModel): Promise<boolean> {
    return await this.__edit(library)
  }

  async remove (library: LibraryModel): Promise<boolean> {
    return await this.__remove(library)
  }

  list (): LibraryModel[] {
    return this.__list()
  }

  find (query: (model: LibraryModel) => boolean): LibraryModel[] {
    return this.__find(query)
  }

  count () {
    return this.__count()
  }

  async get (id: string): Promise<LibraryModel> {
    return await this.__get(id)
  }

  async isExist (id: string): Promise<boolean> {
    return await this.__isExist(id)
  }

  async histories (model: LibraryModel): Promise<LogModel[]> {
    return await this.__histories(model)
  }
}

export { LibraryDao }
