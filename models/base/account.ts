import OrbitDB from 'orbit-db'
import type KeyValueStore from 'orbit-db-kvstore'
import { Account } from '@/types/base/account'
import { History } from '@/types/base/history'

export default class AccountModel implements Account {
  protected __db!: KeyValueStore<any>
  protected __updatedDate: Date = new Date()
  protected __histories : History[] = []

  constructor (orbitdb: OrbitDB, dbAddress: string | null, dbName: string) {
    if (dbAddress === null) {
      dbAddress = dbName
    }
    orbitdb.keyvalue(dbAddress).then((db) => {
      this.__db = db
      this.__histories = this.__db.get('histories') as History[]
    })
  }

  get id () : string { return this.__db.get('id') as string }

  get name () { return this.__db.get('name') as string }

  set name (name: string) {
    this.__db.set('name', name)
    this.__db.set('updatedDate', new Date())
    this.addHistory('edit', 'name', name)
  }

  get note () { return this.__db.get('note') as string }

  get createdDate (): Date { return this.__db.get('createdDate') as Date }

  get standardCode () { return '' }

  get preferredId () { return '' }

  get updatedDate (): Date { return this.__db.get('updatedDate') as Date }

  get histories (): History[] { return this.__histories }

  protected getNewHistoryId (): number {
    return this.__histories.length + 1
  }

  protected addHistory (action: string, target: string, value: string) {
    const h: History = {
      id: this.getNewHistoryId(),
      createdDate: new Date(),
      issuer: 'self',
      action,
      target,
      value
    }
    this.__histories.push(h)
    this.__db.set('histories', this.__histories)
  }
}
