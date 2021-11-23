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
  #userId: string = ''
  #isLoggedIn: boolean = false
  #waitForCreate: boolean = false

  constructor (gun: IGunChainReference<AppState>) {
    super()
    this.#gun = gun
    this.#userRef = this.#gun.user() // .recall({ sessionStorage: true })
    // @ts-ignore
    this.#gun.on('auth', (cb) => {
      console.log('callback', cb)
      this.#userRef.get('profile').once((user) => {
        if (!user) {
          const createdTime = this.getCurrentUnixTime()
          const newUserProfile: UserState = {
            id: this.#userId,
            name: this.#userId,
            createdDateUnix: createdTime,
            updatedDateUnix: createdTime,
            histories: {},
            note: '',
            coin: 0,
            reviews: {},
            reviewCount: 0,
            borrowOrReturn: {},
            borrowCount: 0,
            returnCount: 0,
            isDeleted: false
          }
          console.log('start putting')
          this.#userRef.get('profile').put(
            newUserProfile,
            (callback) => {
              console.log(callback)
              if (!('err' in callback)) {
                console.log('User created')
              }
            }
          )
          this.#user = newUserProfile
          this.#userId = newUserProfile.id
        } else {
          this.#user = user as UserState
          this.#userId = user.id
        }
        this.#isLoggedIn = true
      })
    })
  }

  get isLoggedIn (): boolean {
    return this.#isLoggedIn
  }

  get userId (): string {
    return this.#userId
  }

  waitForLogin (): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const waiter = setInterval(() => {
        if (this.#isLoggedIn) {
          clearInterval(waiter)
          resolve()
        }
      }, 200)
      setTimeout(() => {
        clearInterval(waiter)
        reject(new Error('Login waiting time-outed'))
      }, 3000)
    })
  }

  createUser (userId: string, password: string): Promise<void> {
    if (this.isLoggedIn) {
      throw new Error('You are already logged in')
    }
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Create user time-outed'))
      }, 3000)
      this.#userRef.create(userId, password, (callback) => {
        if (!('err' in callback)) {
          this.#userId = userId
          resolve()
        } else {
          reject(callback.err)
        }
      })
    })
  }

  loginUser (userId: string, password: string): Promise<void> {
    if (this.isLoggedIn) {
      throw new Error('You are already logged in')
    }
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Login time-outed'))
      }, 3000)
      this.#userRef.auth(userId, password, (callback) => {
        if (!('err' in callback)) {
          this.#userId = userId
          //  this.#gun.on('auth', (_)が返ってくるまで待つ
          const waitForSuccess = setInterval(() => {
            if (this.isLoggedIn) {
              console.log('login success')
              clearInterval(waitForSuccess)
              resolve()
            }
          }, 200)
        } else {
          reject(callback.err)
        }
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
