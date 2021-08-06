import type { BibliographyInfoDatabase, BibliographyInfoHistoryDatabase } from '@/types/base/addresses'
import { Bibliography } from '@/types/bibliography'
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

    addBibliography (bibliography: Bibliography) {
      const isExist = this.#database.get(bibliography.id)
      if (isExist) {
        throw new Error(`Bibliography ${bibliography.id} already exists.`)
      }
      this.#database.put(bibliography)
      this.addHistory('create', 'bibliography', bibliography.id)
    }

    editBibliography (bibliography: Bibliography) {
      const isExist = this.#database.get(bibliography.id)
      if (!isExist) {
        throw new Error(`Bibliography ${bibliography.id} was not existed.`)
      }
      this.#database.put(bibliography)
      this.addHistory('edit', 'bibliography', bibliography.id)
    }

    removeBibliography (bibliography: Bibliography) {
      const isExist = this.#database.get(bibliography.id)
      if (!isExist) {
        throw new Error(`Bibliography ${bibliography.id} was not existed.`)
      }
      // this.#database.del(bibliography.id)
      // this.addHistory('delete', 'bibliography', bibliography.id)
      throw new Error('Remove bibliography is not implemented')
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
