import { ReviewModel } from '@/models/review'
import { LibraryModel } from '@/models/library'
import { BibliographyModel } from '@/models/bibliography'

/**
 * GunDBインスタンスが持てるデータ
 * (ユーザー領域のデータは残念ながら定義できない)
 */
export type AppState = {
    reviews: Record<string, ReviewModel>
    libraries: Record<string, LibraryModel>
    bibliographies: Record<string, BibliographyModel>
}
