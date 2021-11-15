import type { IGunChainReference } from 'gun/types/chain'
import type { AppState } from '@/types/appState'
import type { UserState } from '@/types/userState'
import { LogModel } from '@/models/base'
import { IDaoUtil } from '@/dao/base'

/**
 * This is user data access object.
*/
class UserDao extends IDaoUtil {
  #gun: IGunChainReference<AppState>
  #userRef: IGunChainReference
  #user: UserState | null = null
  #userId: string | null = null
  #isLoggedIn: boolean = false

  constructor (gun: IGunChainReference<AppState>) {
    super()
    this.#gun = gun
    this.#userRef = this.#gun.user() // .recall({ sessionStorage: true })
    // @ts-ignore
    this.#gun.on('auth', (cb) => {
      console.log('auth', cb)
      this.#isLoggedIn = true
      this.#userRef.get('profile').once((user) => {
        if (user) {
          this.#user = user as UserState | null
          this.#userId = user.id
        }
      })
    })
  }

  get isLoggedIn (): boolean {
    return this.#isLoggedIn
  }

  createUser (userId: string, password: string) {
    if (this.isLoggedIn) {
      throw new Error('You are already logged in')
    }
    this.#userRef.create(userId, password, async (callback) => {
      if (!('err' in callback)) {
        await this.loginUser(userId, password)
        const createdTime = this.getCurrentUnixTime()
        const newUserProfile : UserState = {
          id: userId,
          name: userId,
          createdDateUnix: createdTime,
          updatedDateUnix: createdTime,
          histories: {},
          note: '',
          coin: 0,
          reviews: null,
          reviewCount: 0,
          borrowOrReturn: null,
          borrowCount: 0,
          returnCount: 0,
          isDeleted: false
        }
        this.#userRef.get('profile').put(
          newUserProfile,
          (callback) => {
            if (!('err' in callback)) {
              console.log('User created')
            } else {
              console.log(callback.err)
            }
          }
        )
      }
    })
  }

  loginUser (userId: string, password: string) : Promise<void> {
    if (this.isLoggedIn) {
      throw new Error('You are already logged in')
    }
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Login time-outed'))
      }, 1000)
      this.#userRef.auth(userId, password, () => {
        console.log('login success')
        resolve()
      })
    })
  }

  private __addLog (fieldName: string, logRef: IGunChainReference<Record<string, LogModel>>) {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Adding log time-outed'))
      }, 5000)
      const time = this.getCurrentUnixTime()
      this.#userRef.get('profile').get(fieldName).get(time).put(logRef, () => {
        resolve(true)
      })
    })
  }

  borrowBook (logRef: IGunChainReference<Record<string, LogModel>>) {
    return this.__addLog('borrowOrReturn', logRef)
  }

  returnBook (logRef: IGunChainReference<Record<string, LogModel>>) {
    return this.__addLog('borrowOrReturn', logRef)
  }

  getSelfProfile (): UserState | null {
    return this.#user
  }

  async getUserProfile (userId: string) : Promise<UserState | undefined> {
    const user = await this.__shootPromise<UserState>(
      this.#gun.user(userId).get('profile')
    )
    return user
  }

  async histories (): Promise<LogModel[]> {
    if (!this.#user) {
      throw new Error('UserDao must be initialized first.')
    }
    const logRef = this.#userRef.get('profile').get('histories')
    const keys = await this.__keys(logRef)
    const logs = await this.__shootPromiseMultiple<LogModel>(
      logRef.once().map(), keys
    )
    return logs
  }
}

export { UserDao }
