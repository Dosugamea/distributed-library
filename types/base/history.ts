/**
 * 履歴基底インターフェイス
 */
export interface History {
    /** 編集管理ID **/
    _id: string
    /** 編集実行者 */
    issuer: string
    /** 編集動作種別 */
    action: any
    /** 編集対象種別 */
    target: any
    /** 編集後の値 */
    value: string
    /** 編集時刻 */
    createdDate: Date
}
