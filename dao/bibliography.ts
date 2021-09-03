import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'
import type { BibliographyInfoDatabase, BibliographyInfoHistoryDatabase } from '@/types/base/addresses'
import type { BibliographyId } from '@/types/base/ids'
import { Bibliography } from '@/types/bibliography'
import BibliographyModel from '@/models/bibliography'
import { BibliographyHistory, BibliographyHistoryAction, BibliographyHistoryTarget } from '@/types/bibliography-history'

/**
 * This is bibliography data access object.
*/
export default class BibliographyDao {
    #database!: DocStore<Bibliography>
    #historyDatabase!: EventStore<BibliographyHistory>

    async build (orbitdb: OrbitDB, databaseAddress: BibliographyInfoDatabase | null, historyDatabaseAddress: BibliographyInfoHistoryDatabase | null) {
      databaseAddress = databaseAddress || 'bibliography'
      historyDatabaseAddress = historyDatabaseAddress || 'bibliographyHistory'
      this.#database = await orbitdb.docstore(databaseAddress) as DocStore<Bibliography>
      this.#historyDatabase = await orbitdb.log(historyDatabaseAddress) as EventStore<BibliographyHistory>
    }

    createBibliography (
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

    getBibliographyAddress () {
      return this.#database.address.root
    }

    getBibliographyHistoryAddress () {
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

    async addBibliography (bibliography: BibliographyModel) {
      if (this.isBibliographyExist(bibliography.id)) {
        throw new Error(`Bibliography ${bibliography.id} already exists.`)
      }
      const dbPutResp = await this.#database.put(bibliography)
      this.addHistory('create', 'bibliography', bibliography.id)
      return dbPutResp
    }

    editBibliography (bibliography: BibliographyModel) {
      this.getBibliography(bibliography.id)
      this.#database.put(bibliography)
      this.addHistory('edit', 'bibliography', bibliography.id)
    }

    removeBibliography (bibliography: BibliographyModel) {
      this.getBibliography(bibliography.id)
      // this.#database.del(bibliography.id)
      // this.addHistory('delete', 'bibliography', bibliography.id)
      throw new Error('Remove bibliography is not implemented')
    }

    findBibliography (query : any) : Bibliography[] {
      return this.#database.query(query)
    }

    getBibliography (bibliographyId: BibliographyId): Bibliography {
      const docs = this.#database.get(bibliographyId)
      if (docs.length === 0) { throw new Error(`Could not find bibliography ${bibliographyId}`) }
      return docs[0]
    }

    isBibliographyExist (bibliographyId: BibliographyId) : boolean {
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
