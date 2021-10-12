import {
  LibraryInfoDatabase, LibraryInfoHistoryDatabase,
  LibraryBookInfoDatabase, LibraryBookInfoHistoryDatabase
} from './base/addresses'

/*
* 図書室定義型
*  図書室の共通のDBアドレスを保管する
*
* 編集可能なノード: 図書室の作成者(神)のみ
*/

/**
 * 図書室情報
 */
export type GenesisLibrary = {
  /** 図書室の情報DBアドレス */
  library: LibraryInfoDatabase
  /** 図書室の情報編集履歴DBアドレス */
  libraryHistory: LibraryInfoHistoryDatabase
  /** 図書室の蔵書DBアドレス */
  book: LibraryBookInfoDatabase
  /** 図書室の蔵書編集履歴DBアドレス */
  bookHistory: LibraryBookInfoHistoryDatabase
}
