/**
 * 履歴基底インターフェイス
 */
export type LogType = {
    /** 編集実行者 */
    readonly issuer: string
    /** 編集動作種別 */
    readonly action: string
    /** 編集対象種別 */
    readonly target: string
    /** 編集後の値 */
    readonly value: string | number
    /** 編集時刻 */
    readonly createdDateUnix: number
}
