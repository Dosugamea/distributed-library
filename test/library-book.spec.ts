import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import LibraryBookDao from '@/dao/library-book'
import { Book as LibraryBookType } from '@/types/library-book'
import type { AdminId } from '@/types/base/ids'

describe('本棚蔵書DAOのテスト', () => {
  let ipfsInstance: any
  let orbitdbInstance: OrbitDB
  let libraryBookDao: LibraryBookDao
  const issuerId: AdminId = 'dosugamea'
  const createLibraryBook = () => {
    return libraryBookDao.create(
      '1',
      false,
      'テスト用のため借りれません',
      issuerId
    )
  }

  beforeAll(async () => {
    ipfsInstance = await IPFS.create()
    orbitdbInstance = await OrbitDB.createInstance(ipfsInstance, {})
    libraryBookDao = new LibraryBookDao()
    await libraryBookDao.build(orbitdbInstance, null, null)
  })

  test('追加できる', async () => {
    const libraryBook = createLibraryBook()
    await libraryBookDao.add(libraryBook)
    expect(libraryBookDao.isExist(libraryBook.id)).toBeTruthy()
  })

  test('同じIDのデータを追加できない', async () => {
    const libraryBook = createLibraryBook()
    await libraryBookDao.add(libraryBook)
    const erroredAdd = libraryBookDao.add(libraryBook)
    await expect(erroredAdd).rejects.toThrow(`LibraryBook ${libraryBook.id} already exist`)
  })

  test('編集できる', async () => {
    const libraryBook = createLibraryBook()
    libraryBook.note = 'この本はテスト用です(変更前)'
    await libraryBookDao.add(libraryBook)
    const hitLibraryBook = libraryBookDao.get(libraryBook.id)
    const addedLibraryBook = libraryBookDao.convertToModel(hitLibraryBook, issuerId)
    addedLibraryBook.note = 'この本はテスト用です(変更後)'
    await libraryBookDao.edit(addedLibraryBook)
    const hitLibraryBook2 = libraryBookDao.get(libraryBook.id)
    expect(addedLibraryBook.note).toEqual(hitLibraryBook2.note)
  })

  test('存在しないデータを編集できない', async () => {
    const libraryBook = createLibraryBook()
    const erroredEdit = libraryBookDao.edit(libraryBook)
    await expect(erroredEdit).rejects.toThrow(`LibraryBook ${libraryBook.id} doesn't exist`)
  })

  test('削除できる', async () => {
    const libraryBook = createLibraryBook()
    await libraryBookDao.add(libraryBook)
    const libraryBooksBefore = libraryBookDao.find((b: LibraryBookType) => !b.rentable).length
    await libraryBookDao.remove(libraryBook)
    const libraryBooksAfter = libraryBookDao.find((b: LibraryBookType) => !b.rentable).length
    expect(libraryBooksAfter).toEqual(libraryBooksBefore - 1)
  })

  test('存在しないデータを削除できない', () => {
    const libraryBook = createLibraryBook()
    expect(libraryBookDao.remove(libraryBook)).rejects.toThrow(`LibraryBook ${libraryBook.id} doesn't exist`)
  })

  test('データを探せる(find)', async () => {
    const libraryBook = createLibraryBook()
    await libraryBookDao.add(libraryBook)
    const libraryBooks = libraryBookDao.find((b: LibraryBookType) => !b.rentable)
    expect(libraryBooks.length).toBeGreaterThan(0)
  })

  test('データを取得できる(get)', async () => {
    const libraryBook = createLibraryBook()
    await libraryBookDao.add(libraryBook)
    expect(libraryBookDao.get(libraryBook.id).id).toEqual(libraryBook.id)
  })

  test('存在しないデータを取得(get)できない', () => {
    expect(() => { libraryBookDao.get(issuerId) }).toThrow(`LibraryBook ${issuerId} doesn't exist`)
  })

  test('データアドレスを取得できる', () => {
    const libraryAddress = libraryBookDao.getAddress()
    expect(libraryAddress.length).toBeGreaterThan(0)
  })

  test('履歴アドレスを取得できる', () => {
    const libraryHistoryAddress = libraryBookDao.getHistoryAddress()
    expect(libraryHistoryAddress.length).toBeGreaterThan(0)
  })
})
