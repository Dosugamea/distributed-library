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
    histories: Record<string, LogType>
    /** コンテンツの作成日 */
    createdDateUnix: number
    /** コンテンツの更新日 */
    updatedDateUnix: number
    /** コンテンツ備考欄 */
    note: string
  }
