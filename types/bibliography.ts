import { ContentType } from './base/content'
import { ReviewType } from './review'

/*
* 書誌情報型
*  全インスタンス共通の書誌情報DB(docs)で使用
*
*  NOTE:
*  編集履歴は、別途編集履歴だけを確認するページを作れるようにするために分けている
*
* 編集可能なノード: 各インスタンスの(全インスタンスの過半数以上にtrustされている)管理者
*
*/

/**
 * 書誌情報
 */
export type BibliographyType = ContentType & {
  /** 書誌名 */
  name: string
  /** 書籍プレビュー画像アドレス **/
  image: string
  /** 書誌カテゴリ */
  category: string
  /** 書誌の作者 */
  author: string
  /** 書誌の出版社 */
  publisher: string
  /** 書誌の発売日 */
  publishedDateUnix: number
  /** 書誌情報の作成日 */
  createdDateUnix: number
  /** 書誌情報の更新日 */
  updatedDateUnix: number
  /** 備考欄(その他の追加情報等) */
  note: string
  /** レビュー一覧 */
  reviews: Record<string, ReviewType>
}
