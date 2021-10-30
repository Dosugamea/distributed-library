import { LogType } from './log'

/**
 * アカウント(Admin/User) 基底インターフェイス
 */
export type ContentType = {
    /** コンテンツID */
    id: string
    /** コンテンツ名 */
    name: string
    /** コンテンツ情報の編集履歴 */
    histories: LogType[]
    /** コンテンツの作成日 */
    createdDate: Date
    /** コンテンツの更新日 */
    updatedDate: Date
    /** コンテンツ備考欄 */
    note: string
  }
