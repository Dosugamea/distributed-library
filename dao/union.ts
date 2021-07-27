import type { BibliographyInfoDatabase } from '@/types/base/addresses'
import type { IPFS } from 'ipfs-core-types'
import OrbitDB from 'orbit-db'
import FeedStore from 'orbit-db-feedstore'

export default class BibliographyDao {
    db!: FeedStore<any>
    ipfs: IPFS

    constructor (ipfs: IPFS, orbitdb: OrbitDB, db: BibliographyInfoDatabase) {
      this.ipfs = ipfs
      orbitdb.feed(db).then((data) => {
        this.db = data
      })
    }
}
