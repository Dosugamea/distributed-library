import type { IPFS } from 'ipfs-core-types'
import type OrbitDB from 'orbit-db'
import type BibliographyDao from '@/dao/bibliography'
import type LibraryDao from '@/dao/library'
import type LibraryBookDao from '@/dao/library-book'
import type ReviewDao from '@/dao/review'

declare module 'vue/types/vue' {
  interface Vue {
    $ipfs: IPFS
    $orbitdb: OrbitDB
    $bibliographyDao: BibliographyDao
    $libraryDao: LibraryDao
    $libraryBookDao: LibraryBookDao
    $reviewDao: ReviewDao
  }
}
