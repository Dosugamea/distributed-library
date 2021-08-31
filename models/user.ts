import type OrbitDB from 'orbit-db'
import AccountModel from '@/models/base/account'
import { User as UserType, UserHistory, UserHistoryAction, UserHistoryTarget } from '@/types/user'

export class ValueError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'ValueError'
  }
}

export default class UserDao extends AccountModel implements UserType {
  read: number = 0
  review: number = 0
  #coin: number = 0

  constructor (
    orbitdb: OrbitDB,
    dbAddress: string | null
  ) {
    super(orbitdb, dbAddress, 'admin')
    this.#coin = this.__db.get('coin') as number
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
    this.histories.push(h)
  }

  addCoin (amount: number): number {
    if (!Number.isInteger(amount)) {
      throw new TypeError("You can't' add float number")
    }
    if (amount >= 10) {
      throw new RangeError("You can't add more than 10 coins at once")
    }
    if (amount <= 0) {
      throw new RangeError("You can't add minus values")
    }
    this.#coin += amount
    this.addUserHistory('get', 'coin', `${amount}`)
    return this.#coin
  }

  useCoin (amount: number) {
    if (!Number.isInteger(amount)) {
      throw new TypeError("You can't' add float number")
    }
    if (amount >= 10) {
      throw new RangeError("You can't use more than 10 coins at once")
    }
    if (amount <= 0) {
      throw new RangeError("You can't use minus values")
    }
    if (this.#coin < amount) {
      throw new ValueError("This user don't have enough coins")
    }
    this.#coin -= amount
    this.addUserHistory('use', 'coin', `${amount}`)
    return this.#coin
  }

  get histories (): UserHistory[] {
    return this.histories as UserHistory[]
  }

  get coin () {
    return this.#coin
  }
}
