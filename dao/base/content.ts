import KeyValueStore from 'orbit-db-kvstore'
import EventStore from 'orbit-db-eventstore'
import { History as HistoryData } from '@/types/base/history'
import { v4 as uuid4 } from 'uuid'

export default class ContentDao {
  readonly id: string = ''
  readonly createdDate: Date = new Date()
  private __updatedDate: Date = new Date()
  protected database!: KeyValueStore<any>
  private historyDatabase!: EventStore<any>

  constructor (database: KeyValueStore<any>, historyDatabase: EventStore<any>) {
    this.database = database
    this.historyDatabase = historyDatabase
  }

  private addHistory (action: string, target: string, value: string) {
    const h: HistoryData = {
      id: uuid4(),
      createdDate: new Date(),
      issuer: 'self',
      action,
      target,
      value
    }
    this.historyDatabase.add(h)
  }

  get updatedDate () : Date {
    return this.__updatedDate
  }

  set name (name: string) {
    this.__updatedDate = new Date()
    this.addHistory('edit', 'name', name)
  }

  get name (): string {
    return this.database.get('name') as string
  }

  set note (newNote: string) {
    this.database.set('note', newNote)
    this.database.set('updatedDate', new Date())
    this.addHistory('edit', 'note', newNote)
  }

  get note () : string {
    return this.database.get('note') as string
  }
}
