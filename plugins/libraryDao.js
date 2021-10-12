import BibliographyDao from '@/dao/bibliography'
import LibraryDao from '@/dao/library'
import LibraryBookDao from '@/dao/library-book'
import ReviewDao from '@/dao/review'

function libraryDaoPlugin (_, inject) {
  inject('bibliographyDao', new BibliographyDao())
  inject('libraryDao', new LibraryDao())
  inject('libraryBookDao', new LibraryBookDao())
  inject('reviewDao', new ReviewDao())
}

export default libraryDaoPlugin
