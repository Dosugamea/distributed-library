import { AdminInfoDatabase } from '@/types/base/addresses'
import { Admin, AdminHistory } from '@/types/admin'
import OrbitDB from 'orbit-db'
import KeyValueStore from 'orbit-db-kvstore'
import { AdminId } from '~/types/base/ids'

export default class AdminDao implements Admin {
  db!: KeyValueStore<any>
  dbName: string = 'admin-account'

  id: string = ''
  createdDate: Date = new Date()
  updatedDate: Date = new Date()
  histories: AdminHistory[] = []
  note: string = ''
  trust: AdminId[] = []
  preferredId: string = ''
  standardCode: string = ''

  constructor (orbitdb: OrbitDB, dbAddress: AdminInfoDatabase | null) {
    if (dbAddress == null) {
      dbAddress = this.dbName
    }
    orbitdb.keyvalue(dbAddress).then((db) => {
      this.db = db
    })
  }

  get name (): string {
    return this.db.get('name') as string
  }

  set name (name: string) {
    this.db.set('name', name)
  }
}
