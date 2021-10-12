import {
  LibraryNodeDatabase, LibraryNodeHistoryDatabase,
  BibliographyInfoDatabase, BibliographyInfoHistoryDatabase,
  BibliographyReviewDatabase, BibliographyReviewLikeDatabase
} from './base/addresses'

/*
* 連合定義型
*  全インスタンスの共通のDBアドレスを保管する
*
* 編集可能なノード: 作成者(神)のみ
*/

/**
 * 連合情報
 */
export type GenesisUnion = {
  /** 図書室のノードのアドレス群 */
  library: LibraryNodeDatabase[]
  /** 図書室のノードの編集履歴DBアドレス */
  libraryHistory: LibraryNodeHistoryDatabase
  /** 蔵書のDBアドレス */
  bibliography: BibliographyInfoDatabase
  /** 蔵書の編集履歴DBアドレス */
  bibliographyHistory: BibliographyInfoHistoryDatabase
  /** レビューのDBアドレス */
  review: BibliographyReviewDatabase
  /** レビューへの評価のDBアドレス */
  reviewLike: BibliographyReviewLikeDatabase
}
