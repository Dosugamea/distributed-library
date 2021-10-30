import { Review } from './review'
import { Library } from './library'
import { Bibliography } from './bibliography'

/**
 * GunDBインスタンスが持てるデータ
 * (ユーザー領域のデータは残念ながら定義できない)
 */
export type AppState = {
    reviews: Review[]
    libraries: Library[]
    bibliographies: Bibliography[]
}
