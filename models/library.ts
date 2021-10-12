import EventStore from 'orbit-db-eventstore'
import { v4 as uuid4 } from 'uuid'
import { Library as LibraryType } from '@/types/library'
import { LibraryHistory } from '@/types/library-history'
import { LibraryId, LibraryHistoryId, AdminId } from '@/types/base/ids'
import { History as HistoryData } from '@/types/base/history'
import ContentModel from '@/models/base/content'

/**
 * Library model instance
*/
export default class LibraryModel extends ContentModel implements LibraryType {
    #historyDatabase!: EventStore<LibraryHistory>
    #histories: LibraryHistoryId[] = []
    #admins: AdminId[] = []

    constructor (
      id: LibraryId,
      name: string,
      createdDate: Date,
      updatedDate: Date,
      histories: LibraryHistoryId[],
      admins: AdminId[],
      note: string,
      historyDatabase: EventStore<LibraryHistory>,
      issuer: string
    ) {
      super(id, name, note, createdDate, updatedDate, historyDatabase, issuer)
      this.#histories = histories
      this.#admins = admins
    }

    async addAdmin (id: AdminId) {
      const historyId: LibraryHistoryId = await this.addHistory('add', 'admin', id)
      this.#histories.push(historyId)
      this.#admins.push(historyId)
    }

    async removeAdmin (id: AdminId) {
      const historyId: LibraryHistoryId = await this.addHistory('remove', 'admin', id)
      this.#histories.push(historyId)
      this.#admins = this.#admins.filter(admin => admin !== id)
    }

    protected async addBookHistory (action: string, target: string, value: string, issuer: string): Promise<string> {
      const h: HistoryData = {
        id: uuid4(),
        createdDate: new Date(),
        issuer,
        action,
        target,
        value
      }
      return await this.#historyDatabase.add(h)
    }

    get admins () {
      return this.#admins
    }

    get histories () {
      return this.#histories
    }

    get _id (): string {
      return this.id
    }
}
