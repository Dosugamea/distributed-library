import type { BibliographyInfoDatabase, BibliographyInfoHistoryDatabase } from '@/types/base/addresses'
import type { BibliographyId } from '@/types/base/ids'
import { Bibliography } from '@/types/bibliography'
import type BibliographyModel from '@/models/bibliography'
import { BibliographyHistory, BibliographyHistoryAction, BibliographyHistoryTarget } from '@/types/bibliography-history'
import OrbitDB from 'orbit-db'
import DocStore from 'orbit-db-docstore'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'

/**
 * This is bibliography data access object.
*/
export default class BibliographyDao {
    #database!: DocStore<Bibliography>
    #historyDatabase!: EventStore<BibliographyHistory>

    constructor (orbitdb: OrbitDB, databaseAddress: BibliographyInfoDatabase | null, historyDatabaseAddress: BibliographyInfoHistoryDatabase | null) {
      databaseAddress = databaseAddress || 'bibliography'
      historyDatabaseAddress = historyDatabaseAddress || 'bibliographyHistory'
      orbitdb.docstore(databaseAddress).then((db) => {
        this.#database = db as DocStore<Bibliography>
      })
      orbitdb.log(historyDatabaseAddress).then((db) => {
        this.#historyDatabase = db as EventStore<BibliographyHistory>
      })
    }

    addBibliography (bibliography: BibliographyModel) {
      if (this.getBibliography(bibliography.id)) {
        throw new Error(`Bibliography ${bibliography.id} already exists.`)
      }
      this.#database.put(bibliography)
      this.addHistory('create', 'bibliography', bibliography.id)
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
