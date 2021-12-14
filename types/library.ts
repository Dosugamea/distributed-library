import { ContentType } from './base/content'
import { AdminId } from './base/ids'
import type { LibraryBookType } from './libraryBook'

/**
 * 図書室情報
 */
export type LibraryType = ContentType & {
  /** 図書室名 */
  name: string
  /** 図書室の作者ID */
  readonly owner: AdminId
  /** 図書室の管理者配列 */
  admins: Record<string, AdminId>
  /** 図書室の作成日 */
  readonly createdDateUnix: number
  /** 図書室の更新日 */
  updatedDateUnix: number
  /** 備考欄(図書室の扱う本/ポリシー等) */
  note: string
  /** 所蔵する本 */
  books: Record<string, LibraryBookType>
}
