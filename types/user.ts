import { ContentType } from './base/content'
import { LogType } from './base/log'

/*
* ユーザー情報型
*  全インスタンスで共通で用いられる
*  ユーザー個別にDB(key-value)を作成し使用
*
* 編集可能なノード: 本人のみ(共通化した場合除く)
*/

/**
 * ユーザー情報
 */
export type UserType = ContentType & {
  /** アカウントID */
  readonly id: string
  /** アカウント名 */
  name: string
  /** アカウント情報の編集履歴 */
  histories: LogType[]
  /** アカウントの作成日 */
  readonly createdDate: Date
  /** アカウントの更新日 */
  updatedDate: Date
  /** 備考欄(プロフィール等) */
  note: string
  /** ユーザー所持コイン */
  coin: number
  /** 読んだ冊数 */
  read: number
  /** レビューした回数 */
  review: number
}
