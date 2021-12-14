import type { IGunChainReference } from 'gun/types/chain'
import type { AppState } from '@/types/appState'
import type { UserState } from '@/types/userState'
import { LogModel } from '@/models/base'
import { LibraryBookModel, LibraryModel } from '@/models/library'
import { IDaoUtil } from '@/dao/base'
import { BibliographyModel } from '~/models/bibliography'

/**
 * This is user data access object.
*/
class UserDao extends IDaoUtil {
  #gun: IGunChainReference<AppState>
  #userRef: IGunChainReference
  userRef: IGunChainReference
  #user: UserState | null = null
  #userId: string = ''
  #isLoggedIn: boolean = false
  #borrowOrReturn: LogModel[] = []
  #histories: LogModel[] = []
  #libraries: LibraryModel[] = []

  constructor (gun: IGunChainReference<AppState>) {
    super()
    this.#gun = gun
    this.#userRef = this.#gun.user()
    this.userRef = this.#userRef
    this.#userRef.recall({ sessionStorage: true })
    // @ts-ignore
    this.#gun.on('auth', (_) => {
      this.#userRef.get('profile').once((user) => {
        // 新規アカウント発行時
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
            libraries: {},
            libraryCount: 0,
            isDeleted: false
          }
          this.#userRef.get('profile').put(
            newUserProfile,
            (callback) => {
              if (!('err' in callback)) {
                console.log('User created')
              }
            }
          )
          this.#user = newUserProfile
          this.#userId = newUserProfile.id
        // 既存アカウントでのログイン時
        } else {
          this.#user = user as UserState
          this.#userId = user.id
        }
        // 貸出/返却記録の監視
        const me = this
        this.#userRef.get('profile').get('histories').map().on(function (data: LogModel, key: string) {
          if (data.id) {
            me.#histories = me.#histories.filter(data => data.id !== key)
            me.#histories.push(data)
          }
        })
        this.#userRef.get('profile').get('borrowOrReturn').map().on(function (data: LogModel, key: string) {
          if (data.id) {
            me.#borrowOrReturn = me.#borrowOrReturn.filter(data => data.id !== key)
            me.#borrowOrReturn.push(data)
          }
        })
        this.#userRef.get('profile').get('libraries').map().on(function (data: LibraryModel, key: string) {
          if (data.id) {
            me.#libraries = me.#libraries.filter(data => data.id !== key)
            me.#libraries.push(data)
          }
        })
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

  private __addHistory (
    action: string,
    target: string,
    value: string,
    fieldName: string
  ): Promise<boolean> {
    const logTime = this.getCurrentUnixTime()
    const log = new LogModel(
      this.getNewId(), this.#userId, action, target, value, logTime
    )
    const me = this
    return new Promise<boolean>((resolve, reject) => {
      try {
        me.#userRef.get('profile').get(fieldName).get(log.id).put(log)
        resolve(true)
      } catch (e) {
        reject(new Error(`Failed to add history: ${e}`))
      }
    })
  }

  private async __addCount (fieldName: string) {
    const currentCount = await this.__shootPromise<number>(
      this.#userRef.get('profile').get(fieldName)
    )
    console.log(currentCount)
    if (currentCount !== undefined) {
      // @ts-ignore
      this.#userRef.get('profile').get(fieldName).put(currentCount + 1)
    }
  }

  async createLibrary (library: LibraryModel) {
    const libraryRef = this.#gun.get('libraries').get(library.id)
    this.#userRef.get('profile').get('libraries').get(library.id).put(libraryRef)
    await this.__addCount('libraryCount')
    await this.__addHistory('add', 'library', library.id, 'histories')
  }

  async borrowBook (book: LibraryBookModel, library: LibraryModel, bibliography: BibliographyModel) {
    await this.__addCount('borrowCount')
    await this.__addHistory(
      'borrow',
      book.id,
      `${book.bibliographyId}-${library.id}-${library.name}-${bibliography.id}-${bibliography.name}`,
      'borrowOrReturn'
    )
  }

  async returnBook (book: LibraryBookModel, library: LibraryModel, bibliography: BibliographyModel) {
    await this.__addCount('returnCount')
    await this.__addHistory(
      'return',
      book.id,
      `${book.bibliographyId}-${library.id}-${library.name}-${bibliography.id}-${bibliography.name}`,
      'borrowOrReturn'
    )
  }

  getSelfProfile (): UserState | null {
    return this.#user
  }

  logout () {
    this.#userRef.leave()
  }

  async getUserProfile (userId: string) : Promise<UserState | undefined> {
    const user = await this.__shootPromise<UserState>(
      this.#gun.user(userId).get('profile')
    )
    return user
  }

  histories (): LogModel[] {
    if (!this.#user) {
      throw new Error('UserDao must be initialized first.')
    }
    return this.#histories
  }

  libraries (): LibraryModel[] {
    if (!this.#user) {
      throw new Error('UserDao must be initialized first.')
    }
    return this.#libraries
  }

  borrowOrReturn (): LogModel[] {
    if (!this.#user) {
      throw new Error('UserDao must be initialized first.')
    }
    return this.#borrowOrReturn
  }
}

export { UserDao }
