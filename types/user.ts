import { BibliographyId, BibliographyReviewId } from './base/ids'
import { Account } from './base/account'
import { History } from './base/history'

/*
* ユーザー情報型
*  全インスタンスで共通で用いられる
*  ユーザー個別にDB(key-value)を作成し使用
*
* 編集可能なノード: 本人のみ(共通化した場合除く)
*/

/**
 * ユーザーID
 */
export type UserId = string

/**
 * ユーザー操作履歴ID
 */
export type UserHistoryId = number

/**
 * ユーザーの操作履歴:動作
 */
export type UserHistoryAction = 'create' | 'edit' | 'remove' | 'lend' | 'return' | 'get' | 'use'

/**
  * ユーザーの操作履歴:対象
  */
export type UserHistoryTarget = 'name' | 'note' | 'book' | 'coin' | 'review'

/**
* ユーザーの操作履歴
*/
export interface UserHistory extends History{
   id: UserHistoryId
   issuer: UserId
   action: UserHistoryAction
   target: UserHistoryTarget
   value: string | BibliographyId | number | BibliographyReviewId
   createdDate: Date
}

/**
 * ユーザー情報
 */
export interface User extends Account {
  /** ユーザーID */
  id: UserId
  /** ユーザー情報の編集履歴 */
  histories: UserHistory[]
  /** ユーザー所持コイン */
  coin: number
  /** 読んだ冊数 */
  read: number
  /** レビューした回数 */
  review: number
}
