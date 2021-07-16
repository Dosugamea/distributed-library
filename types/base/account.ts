import { History } from './history'

/**
 * アカウント(Admin/User) 基底インターフェイス
 */
export interface Account {
    /** アカウントID */
    id: string
    /** アカウント名 */
    name: string
    /** アカウント情報の編集履歴 */
    histories: History[]
    /** アカウントの作成日 */
    createdDate: Date
    /** アカウントの更新日 */
    updatedDate: Date
    /** 備考欄(プロフィール等) */
    note: string
    /** 共通化コード */
    standardCode: string
    /** 共通化後に優先されるアカウントID */
    preferredId: string
  }
