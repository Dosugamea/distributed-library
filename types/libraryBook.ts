import type { IGunChainReference } from 'gun/types/chain'
import { ContentType } from './base/content'
import { BibliographyType } from './bibliography'
import type { LibraryType } from './library'

/**
 * 図書室の蔵書情報
 */
export type LibraryBookType = ContentType & {
    /** 貸出可能な状態か */
    rentable: boolean
    /** 書誌ID(識別用) */
    bibliographyId: string
    /** 書誌(Link) */
    bibliography: IGunChainReference<BibliographyType>
    /** 本棚ID(識別用) */
    libraryId: string
    /** 本棚(Link) */
    library: IGunChainReference<LibraryType>
}
