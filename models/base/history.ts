import { History as HistoryData } from '@/types/base/history'
import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'

export default class HistoryModel {
    #historyDatabase!: EventStore<any>
    #issuer!: string

    constructor (historyDatabase: EventStore<any>, issuer: string) {
      this.#historyDatabase = historyDatabase
      this.#issuer = issuer
    }

    protected async addHistory (action: string, target: string, value: string) : Promise<string> {
      const h: HistoryData = {
        id: uuid4(),
        createdDate: new Date(),
        issuer: this.#issuer,
        action,
        target,
        value
      }
      return await this.#historyDatabase.add(h)
    }
}
