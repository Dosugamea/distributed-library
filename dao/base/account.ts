import OrbitDB from 'orbit-db'
import KeyValueStore from 'orbit-db-kvstore'
import { Account } from '@/types/base/account'
import { History as HistoryData } from '@/types/base/history'

export default class AccountDao implements Account {
  db!: KeyValueStore<any>
  #histories: HistoryData[] = []

  constructor (orbitdb: OrbitDB, dbAddress: string | null, dbName: string) {
    if (dbAddress === null) {
      dbAddress = dbName
    }
    orbitdb.keyvalue(dbAddress).then((db) => {
      this.db = db
      this.#histories = this.db.get('histories') as HistoryData[]
    })
  }

  getNewHistoryId (): number {
    return this.#histories.length + 1
  }

  private addHistory (action: string, target: string, value: string) {
    const h: HistoryData = {
      id: this.getNewHistoryId(),
      createdDate: new Date(),
      issuer: 'self',
      action,
      target,
      value
    }
    this.#histories.push(h)
    this.db.set('histories', this.#histories)
  }

  set id (_: string) {
    throw new Error("You can't change an account id!")
  }

  get id (): string {
    return this.db.get('id') as string
  }

  set createdDate (_: Date) {
    throw new Error("You can't change createdDate!")
  }

  get createdDate () : Date {
    return this.db.get('createdDate') as Date
  }

  set updatedDate (_: Date) {
    throw new Error("You can't change updatedDate directly!")
  }

  get updatedDate () : Date {
    return this.db.get('updatedDate') as Date
  }

  set name (name: string) {
    this.db.set('name', name)
    this.db.set('updatedDate', new Date())
    this.addHistory('edit', 'name', name)
  }

  get name (): string {
    return this.db.get('name') as string
  }

  set preferredId (newID: string) {
    this.db.set('preferredId', newID)
    this.db.set('updatedDate', new Date())
    this.addHistory('edit', 'preferredId', newID)
  }

  get preferredId () : string {
    return this.db.get('preferredId') as string
  }

  set note (newNote: string) {
    this.db.set('note', newNote)
    this.db.set('updatedDate', new Date())
    this.addHistory('edit', 'note', newNote)
  }

  get note () : string {
    return this.db.get('note') as string
  }

  set standardCode (newStandardCode: string) {
    this.db.set('standardCode', newStandardCode)
    this.addHistory('edit', 'standardCode', newStandardCode)
  }

  get standardCode () : string {
    return this.db.get('standardCode') as string
  }

  get histories (): HistoryData[] {
    return this.#histories
  }
}
