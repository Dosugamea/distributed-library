/*
*   型名を付けたstring型アドレス 一覧
*     循環参照を防ぐため抽出
*/

/**
 * 連合全体で共通のDBアドレスを格納するDBアドレス
 */
export type UnionGenesisDatabase = string

/**
 * ユーザーの情報が入るDBアドレス
 */
export type UserInfoDatabase = string

/**
 * 管理者の情報が入るDBアドレス
 */
export type AdminInfoDatabase = string

/**
 * 図書館ノードのアドレス一覧が入るDBアドレス
 */
export type LibraryNodeDatabase = string

/**
 * 図書館ノードのアドレス一覧の編集履歴が入るDBアドレス
 */
export type LibraryNodeHistoryDatabase = string

/**
 * 書誌情報が入るDBアドレス
 */
export type BibliographyInfoDatabase = string

/**
 * 書誌情報操作履歴が入るDBアドレス
 */
export type BibliographyInfoHistoryDatabase = string

/**
 * 書誌のレビューが保存されるDBアドレス
 */
export type BibliographyReviewDatabase = string

/**
 * 書誌のレビューへの評価が保存されるDBアドレス
 */
export type BibliographyReviewLikeDatabase = string

/**
 * 図書室内で共通のDBアドレスを格納するDBアドレス
 */
export type LibraryGenesisDatabase = string

/**
  * 図書室の情報が入るDBアドレス
  */
export type LibraryInfoDatabase = string

/**
 * 図書室の情報操作履歴が入るDBアドレス
 */
export type LibraryInfoHistoryDatabase = string

/**
 * 図書室の蔵書が入ったDBアドレス
 */
export type LibraryBookInfoDatabase = string

/**
 * 図書室の蔵書操作履歴が入ったDBアドレス
 */
export type LibraryBookInfoHistoryDatabase = string

/**
 * 書誌の貸出/返却履歴が入るDBアドレス
 */
export type LibraryBookLendDatabase = string
