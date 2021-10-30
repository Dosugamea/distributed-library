import { Log } from './log'

/**
 * アカウント(Admin/User) 基底インターフェイス
 */
export interface ContentType {
    /** コンテンツID */
    id: string
    /** コンテンツ名 */
    name: string
    /** コンテンツ情報の編集履歴 */
    histories: Log[]
    /** コンテンツの作成日 */
    createdDate: Date
    /** コンテンツの更新日 */
    updatedDate: Date
    /** コンテンツ備考欄 */
    note: string
  }
