import GUN from 'gun'
import type { IGunChainReference } from 'gun/types/chain'
import type { AppState } from '@/types/appState'
import { BibliographyDao } from '@/dao/bibliography'
import { LibraryDao } from '@/dao/library'
import { ReviewDao } from '@/dao/review'
import { UserDao } from '@/dao/user'
require('gun/sea')

class MasterDao {
  gun: IGunChainReference<AppState> | null = null
  #gun: IGunChainReference<AppState> | null = null
  bibliographyDao: BibliographyDao | null = null
  libraryDao: LibraryDao | null = null
  reviewDao: ReviewDao | null = null
  userDao: UserDao | null = null

  initDao (peers: string[] = ['http://localhost:8765/gun']) {
    if (!this.#gun) {
      this.#gun = new GUN<AppState>(peers)
      this.userDao = new UserDao(this.#gun)
      if (process.env.NODE_ENV === 'development') {
        this.gun = this.#gun
      }
    }
  }

  startupDao () {
    if (!this.#gun) {
      throw new Error('You must init first')
    }
    if (!this.userDao!.isLoggedIn) {
      throw new Error('You must login first')
    }
    const issuer = this.userDao!.userId
    this.bibliographyDao = new BibliographyDao(this.#gun, issuer)
    this.libraryDao = new LibraryDao(this.#gun, issuer)
    this.reviewDao = new ReviewDao(this.#gun, issuer)
  }
}

export { MasterDao }
