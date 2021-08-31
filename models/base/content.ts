import type EventStore from 'orbit-db-eventstore'
import HistoryModel from './history'

/**
 * コンテンツ系DAOの基底クラス
 */
export default class ContentModel extends HistoryModel {
  readonly id: string = ''
  readonly createdDate: Date = new Date()
  protected __updatedDate: Date = new Date()
  #name: string = ''
  #note: string = ''

  constructor (id: string, name: string, note: string, createdDate: Date, updatedDate: Date, historyDatabase: EventStore<any>, issuer: string) {
    super(historyDatabase, issuer)
    this.id = id
    this.#name = name
    this.#note = note
    this.createdDate = createdDate
    this.__updatedDate = updatedDate
  }

  get updatedDate () : Date {
    return this.updatedDate
  }

  set name (name: string) {
    this.__updatedDate = new Date()
    this.#name = name
    this.addHistory('edit', 'name', name)
  }

  get name (): string {
    return this.#name
  }

  set note (newNote: string) {
    this.__updatedDate = new Date()
    this.#note = newNote
    this.addHistory('edit', 'note', newNote)
  }

  get note () : string {
    return this.#note
  }
}
