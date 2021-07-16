import { AdminId, BibliographyId, AdminHistoryId } from './base/ids'
import { History } from './base/history'
import { Account } from './base/account'

/*
* 管理者型
*
*  保存場所:
*  全インスタンスで共通で用いられる
*  管理者個別にDB(key-value)を作成し使用
*
*  NOTE:
*  履歴は 管理者本人が自分の記録を見返すためのものなので 蔵書の追加削除DBが別途ある。
*  AdminHistoryを切り出し、全インスタンス共通の編集履歴を作れば 各管理者の操作履歴を一括で見ることができるが、需要がないため不要。
*
* 編集可能なノード: 本人のみ(共通化した場合除く)
*
*/

/**
 * 管理者の操作履歴:動作 作成/追加/編集/削除
 */
export type AdminHistoryAction = 'create' | 'add' | 'remove' | 'edit'

/**
 * 管理者の操作履歴:対象 自分自身/トラスト/蔵書/自分自身の名前
 */
export type AdminHistoryTarget = 'self-account' | 'book' | 'trust' | 'self-name'

/**
 * 管理者の操作履歴
 */
export interface AdminHistory extends History {
   _id: AdminHistoryId
   issuer: AdminId
   action: AdminHistoryAction
   target: AdminHistoryTarget
   value: string | BibliographyId | AdminId
 }

/**
 * 管理者情報
 */
export interface Admin extends Account {
  /** 管理者ID */
  id: AdminId
  /** 編集履歴群(AdminHistory) */
  histories: AdminHistory[]
  /** 管理者のトラストしている管理者群 */
  trust: AdminId[]
}
