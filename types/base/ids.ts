/*
*   型名を付けたstring型ID 一覧
*     循環参照を防ぐため抽出
*/

/**
 * ユーザーID
 */
export type UserId = string

/**
 * ユーザー操作履歴ID
 */
export type UserHistoryId = string

/**
 * 管理者ID
 */
export type AdminId = string

/**
 * 管理者操作履歴ID
 */
export type AdminHistoryId = number

/**
 * 図書室ID
 */
export type LibraryId = string

/**
 * 図書室操作履歴ID
 */
export type LibraryHistoryId = number

/**
 * 図書室蔵書ID
 */
export type LibraryBookId = string

/**
 * 図書室蔵書編集履歴ID
 */
export type LibraryBookHistoryId = number

/**
 * 図書室蔵書貸出返却ID
 */
export type LibraryBookRentReturnId = string

/**
 * 書誌ID
 */
export type BibliographyId = string

/**
 * 書誌操作履歴ID
 */
export type BibliographyHistoryId = string

/**
 * 書誌貸出/返却履歴ID
 */
export type BibliographyLendReturnId = string

/**
 * レビューID
 */
export type BibliographyReviewId = string

/**
 * レビューいいねID
 */
export type BibliographyReviewLikeId = string
