import type EventStore from 'orbit-db-eventstore'
import HistoryDao from './history'

/**
 * コンテンツ系DAOの基底クラス
 */
export default class ContentDao extends HistoryDao {
  readonly id: string = ''
  readonly createdDate: Date = new Date()
  #updatedDate: Date = new Date()
  #name: string = ''
  #note: string = ''

  constructor (id: string, name: string, note: string, createdDate: Date, updatedDate: Date, historyDatabase: EventStore<any>, issuer: string) {
    super(historyDatabase, issuer)
    this.id = id
    this.#name = name
    this.#note = note
    this.createdDate = createdDate
    this.#updatedDate = updatedDate
  }

  get updatedDate () : Date {
    return this.#updatedDate
  }

  set name (name: string) {
    this.#updatedDate = new Date()
    this.#name = name
    this.addHistory('edit', 'name', name)
  }

  get name (): string {
    return this.#name
  }

  set note (newNote: string) {
    this.#updatedDate = new Date()
    this.#note = newNote
    this.addHistory('edit', 'note', newNote)
  }

  get note () : string {
    return this.#note
  }
}