/**
 * 履歴基底インターフェイス
 */
export type LogType = {
    /** 編集実行者 */
    issuer: string
    /** 編集動作種別 */
    action: string
    /** 編集対象種別 */
    target: string
    /** 編集後の値 */
    value: string | number
    /** 編集時刻 */
    createdDate: Date
}
