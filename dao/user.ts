import type { IGunChainReference } from 'gun/types/chain'
import type { AppState } from '@/types/appState'
import { LogModel } from '@/models/base'
import { LibraryBookModel } from '@/models/library'
import { IDaoUtil } from '@/dao/base'

/**
 * This is user data access object.
*/
class UserDao extends IDaoUtil {
  #gun: IGunChainReference<AppState>

  constructor (gun: IGunChainReference<AppState>) {
    super()
    this.#gun = gun
  }

  borrowBook (book: LibraryBookModel) {
    return null
  }

  returnBook (book: LibraryBookModel) {
    return null
  }

  getSelfProfile () {
    return null
  }

  getUserProfile (userId: string) {
    return null
  }

  async histories (): Promise<LogModel[]> {
    const logRef = this.#gun.get('histories')
    const keys = await this.__keys(logRef)
    const logs = await this.__shootPromiseMultiple<LogModel>(
      logRef.once().map(), keys
    )
    return logs
  }
}

export { UserDao }
