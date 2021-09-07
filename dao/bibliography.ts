import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'
import type { BibliographyInfoDatabase, BibliographyInfoHistoryDatabase } from '@/types/base/addresses'
import type { BibliographyId } from '@/types/base/ids'
import { Bibliography } from '@/types/bibliography'
import BibliographyModel from '@/models/bibliography'
import { BibliographyHistory, BibliographyHistoryAction, BibliographyHistoryTarget } from '@/types/bibliography-history'
import type { ContentDaoInterface } from '@/dao/base/content'

/**
 * This is bibliography data access object.
*/
export default class BibliographyDao implements ContentDaoInterface<BibliographyModel> {
    #database!: DocStore<Bibliography>
    #historyDatabase!: EventStore<BibliographyHistory>

    async build (orbitdb: OrbitDB, databaseAddress: BibliographyInfoDatabase | null, historyDatabaseAddress: BibliographyInfoHistoryDatabase | null) {
      databaseAddress = databaseAddress || 'bibliography'
      historyDatabaseAddress = historyDatabaseAddress || 'bibliographyHistory'
      this.#database = await orbitdb.docstore(databaseAddress) as DocStore<Bibliography>
      this.#historyDatabase = await orbitdb.log(historyDatabaseAddress) as EventStore<BibliographyHistory>
    }

    create (
      id: string,
      name: string,
      author: string,
      category: string,
      image: string,
      publishedDate: Date,
      publisher: string,
      note: string,
      issuer: string
    ): BibliographyModel {
      const createdDate = new Date()
      const bibliography = new BibliographyModel(
        id, name, author,
        category,
        createdDate, createdDate,
        [],
        image, publishedDate, publisher,
        note, this.#historyDatabase, issuer)
      return bibliography
    }

    getAddress () {
      return this.#database.address.root
    }

    getHistoryAddress () {
      return this.#historyDatabase.address.root
    }

    convertToModel (bibliography: Bibliography, issuer: string): BibliographyModel {
      return new BibliographyModel(
        bibliography.id, bibliography.name, bibliography.author,
        bibliography.category,
        bibliography.createdDate, bibliography.updatedDate,
        bibliography.histories,
        bibliography.image, bibliography.publishedDate, bibliography.publisher,
        bibliography.note, this.#historyDatabase, issuer)
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
      // this.#database.del(bibliography.id)
      // this.addHistory('delete', 'bibliography', bibliography.id)
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
