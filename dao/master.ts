import GUN from 'gun'
import type { AppState } from '@/types/appState'
import { BibliographyDao } from '@/dao/bibliography'
import { LibraryDao } from '@/dao/library'
import { ReviewDao } from '@/dao/review'

class MasterDao {
  bibliographyDao: BibliographyDao | null = null
  libraryDao: LibraryDao | null = null
  reviewDao: ReviewDao | null = null

  initDao (peers: string[] = ['http://localhost:8765/gun'], issuer: string = 'kafuuchino') {
    const gun = new GUN<AppState>(peers)
    this.bibliographyDao = new BibliographyDao(gun, issuer)
    this.libraryDao = new LibraryDao(gun, issuer)
    this.reviewDao = new ReviewDao(gun, issuer)
  }
}

export { MasterDao }
