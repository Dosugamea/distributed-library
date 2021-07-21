import AccountDao from '@/dao/base/account'
import { UserInfoDatabase } from '@/types/base/addresses'
import { User, UserHistory, UserHistoryAction, UserHistoryTarget } from '@/types/user'
import OrbitDB from 'orbit-db'

export default class UserDao extends AccountDao implements User {
  read: number = 0
  review: number = 0
  #histories: UserHistory[] = []

  constructor (orbitdb: OrbitDB, dbAddress: UserInfoDatabase | null) {
    super(orbitdb, dbAddress, 'user')
  }

  private addUserHistory (action: UserHistoryAction, target: UserHistoryTarget, value: string) {
    const h: UserHistory = {
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

  addCoin (amount: number): number {
    const newCoins = this.db.get('coin') + amount
    this.db.set('coin', newCoins)
    return newCoins
  }

  useCoin (amount: number) {
    const newCoins = this.db.get('coin') - amount
    this.db.set('coin', newCoins)
    return newCoins
  }

  get histories (): UserHistory[] {
    return this.#histories as UserHistory[]
  }

  set coin (_: number) {
    throw new Error("You can't set coin directly!")
  }

  get coin () {
    return this.db.get('coin') as number
  }
}
