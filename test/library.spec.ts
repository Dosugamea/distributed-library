import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import LibraryDao from '@/dao/library'
import { Library as LibraryType } from '@/types/library'
import type { AdminId } from '@/types/base/ids'

describe('本棚DAOのテスト', () => {
  let ipfsInstance: any
  let orbitdbInstance: OrbitDB
  let libraryDao: LibraryDao
  const issuerId: AdminId = 'dosugamea'
  const createLibrary = () => {
    return libraryDao.create(
      'テスト本棚',
      'テスト用の本棚',
      issuerId
    )
  }

  beforeAll(async () => {
    ipfsInstance = await IPFS.create()
    orbitdbInstance = await OrbitDB.createInstance(ipfsInstance, {})
    libraryDao = new LibraryDao()
    await libraryDao.build(orbitdbInstance, null, null)
  })

  test('追加できる', async () => {
    const library = createLibrary()
    await libraryDao.add(library)
    expect(libraryDao.isExist(library.id)).toBeTruthy()
  })

  test('同じIDのデータを追加できない', async () => {
    const library = createLibrary()
    await libraryDao.add(library)
    const erroredAdd = libraryDao.add(library)
    await expect(erroredAdd).rejects.toThrow(`Library ${library.id} already exist`)
  })

  test('編集できる', async () => {
    const library = createLibrary()
    library.name = 'ご注文はうさぎですか？ (3)'
    await libraryDao.add(library)
    const hitLibrary = libraryDao.get(library.id)
    const addedLibrary = libraryDao.convertToModel(hitLibrary, issuerId)
    addedLibrary.name = 'ご注文はうさぎですか？ (2)'
    await libraryDao.edit(addedLibrary)
    const hitLibrary2 = libraryDao.get(library.id)
    expect(addedLibrary.name).toEqual(hitLibrary2.name)
  })

  test('存在しないデータを編集できない', async () => {
    const library = createLibrary()
    const erroredEdit = libraryDao.edit(library)
    await expect(erroredEdit).rejects.toThrow(`Library ${library.id} doesn't exist`)
  })

  test('削除できる(未実装のためエラー)', async () => {
    const library = createLibrary()
    await libraryDao.add(library)
    expect(() => { libraryDao.remove(library) }).toThrow('Remove library is not implemented')
  })

  test('存在しないデータを削除できない', () => {
    const library = createLibrary()
    expect(() => { libraryDao.remove(library) }).toThrow(`Library ${library.id} doesn't exist`)
  })

  test('データを探せる(find)', async () => {
    const library = createLibrary()
    await libraryDao.add(library)
    const bibliographies = libraryDao.find((b: LibraryType) => b.name.includes('ご注文はうさぎですか'))
    expect(bibliographies.length).toBeGreaterThan(0)
  })

  test('データを取得できる(get)', async () => {
    const library = createLibrary()
    await libraryDao.add(library)
    expect(libraryDao.get(library.id).id).toEqual(library.id)
  })

  test('存在しないデータを取得(get)できない', () => {
    expect(() => { libraryDao.get(issuerId) }).toThrow(`Library ${issuerId} doesn't exist`)
  })

  test('データアドレスを取得できる', () => {
    const libraryAddress = libraryDao.getAddress()
    expect(libraryAddress.length).toBeGreaterThan(0)
  })

  test('履歴アドレスを取得できる', () => {
    const libraryHistoryAddress = libraryDao.getHistoryAddress()
    expect(libraryHistoryAddress.length).toBeGreaterThan(0)
  })
})
