import type { BibliographyInfoDatabase } from '@/types/base/addresses'
import OrbitDB from 'orbit-db'
import FeedStore from 'orbit-db-feedstore'

export default class InstanceDao {
    db!: FeedStore<any>

    constructor (orbitdb: OrbitDB, db: BibliographyInfoDatabase) {
      orbitdb.feed(db).then((data) => {
        this.db = data
      })
    }
}
