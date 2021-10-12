import type OrbitDB from 'orbit-db'
import Instance from '@/models/instance'
import LibraryDao from '@/dao/library'
import LibraryBookDao from '@/dao/library-book'

export default class InstanceDao {
  #orbitdb!: OrbitDB

  constructor (orbitdb: OrbitDB) {
    this.#orbitdb = orbitdb
  }

  /**
   * 図書室アドレス群保管インスタンスを作成する
   */
  async createInstance (): Promise<Instance> {
    // 新規図書室データベースを生成
    const library = new LibraryDao()
    await library.build(this.#orbitdb, null, null)
    const libraryAddress = library.getAddress()
    const libraryHistoryAddress = library.getHistoryAddress()
    // 新規図書室蔵書データベースを生成
    const libraryBook = new LibraryBookDao()
    await libraryBook.build(this.#orbitdb, null, null)
    const libraryBookAddress = libraryBook.getAddress()
    const libraryBookHistoryAddress = libraryBook.getHistoryAddress()
    // 新規インスタンスを作成
    const instance = new Instance()
    await instance.build(this.#orbitdb, null)
    await instance.create(
      libraryAddress, libraryHistoryAddress,
      libraryBookAddress, libraryBookHistoryAddress
    )
    return instance
  }

  /**
   * 図書室情報を読み込む
   */
  async loadInstance (databaseAddress: string): Promise<Instance> {
    const i = new Instance()
    await i.build(this.#orbitdb, databaseAddress)
    return i
  }
}
