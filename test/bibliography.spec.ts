import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import { nanoid } from 'nanoid'
import BibliographyDao from '@/dao/bibliography'
import { Bibliography as BibliographyType } from '@/types/bibliography'

describe('蔵書DAOのテスト', () => {
  let ipfsInstance: any
  let orbitdbInstance: OrbitDB
  let bibliographyDao: BibliographyDao
  const issuerId: string = 'dosugamea'
  const createBibliography = () => {
    const id = nanoid(20)
    return bibliographyDao.create(
      id,
      'ご注文はうさぎですか？ (1)',
      'Koi',
      '漫画',
      'https://m.media-amazon.com/images/P/B00IZ7R7LK.01._SCLZZZZZZZ_SX500_.jpg',
      new Date(),
      '芳文社',
      '',
      issuerId
    )
  }

  beforeAll(async () => {
    ipfsInstance = await IPFS.create()
    orbitdbInstance = await OrbitDB.createInstance(ipfsInstance, {})
    bibliographyDao = new BibliographyDao()
    await bibliographyDao.build(orbitdbInstance, null, null)
  })

  test('追加できる', async () => {
    const bibliography = createBibliography()
    await bibliographyDao.add(bibliography)
    expect(bibliographyDao.isExist(bibliography.id)).toBeTruthy()
  })

  test('同じIDのデータを追加できない', async () => {
    const bibliography = createBibliography()
    await bibliographyDao.add(bibliography)
    const erroredAdd = bibliographyDao.add(bibliography)
    await expect(erroredAdd).rejects.toThrow(`Bibliography ${bibliography.id} already exist`)
  })

  test('編集できる', async () => {
    const bibliography = createBibliography()
    bibliography.name = 'ご注文はうさぎですか？ (3)'
    await bibliographyDao.add(bibliography)
    const hitBibliography = bibliographyDao.get(bibliography.id)
    const addedBibliography = bibliographyDao.convertToModel(hitBibliography, issuerId)
    addedBibliography.name = 'ご注文はうさぎですか？ (2)'
    await bibliographyDao.edit(addedBibliography)
    const hitBibliography2 = bibliographyDao.get(bibliography.id)
    expect(addedBibliography.name).toEqual(hitBibliography2.name)
  })

  test('存在しないデータを編集できない', async () => {
    const bibliography = createBibliography()
    const erroredEdit = bibliographyDao.edit(bibliography)
    await expect(erroredEdit).rejects.toThrow(`Bibliography ${bibliography.id} doesn't exist`)
  })

  test('削除できる(未実装のためエラー)', async () => {
    const bibliography = createBibliography()
    await bibliographyDao.add(bibliography)
    expect(() => { bibliographyDao.remove(bibliography) }).toThrow('Remove bibliography is not implemented')
  })

  test('存在しないデータを削除できない', () => {
    const bibliography = createBibliography()
    expect(() => { bibliographyDao.remove(bibliography) }).toThrow(`Bibliography ${bibliography.id} doesn't exist`)
  })

  test('データを探せる(find)', async () => {
    const bibliography = createBibliography()
    await bibliographyDao.add(bibliography)
    const bibliographies = bibliographyDao.find((b: BibliographyType) => b.name.includes('ご注文はうさぎですか'))
    expect(bibliographies.length).toBeGreaterThan(0)
  })

  test('データを取得できる(get)', async () => {
    const bibliography = createBibliography()
    await bibliographyDao.add(bibliography)
    expect(bibliographyDao.get(bibliography.id).id).toEqual(bibliography.id)
  })

  test('存在しないデータを取得(get)できない', () => {
    expect(() => { bibliographyDao.get(issuerId) }).toThrow(`Bibliography ${issuerId} doesn't exist`)
  })

  test('データアドレスを取得できる', () => {
    const bibliographyAddress = bibliographyDao.getAddress()
    expect(bibliographyAddress.length).toBeGreaterThan(0)
  })

  test('履歴アドレスを取得できる', () => {
    const bibliographyHistoryAddress = bibliographyDao.getHistoryAddress()
    expect(bibliographyHistoryAddress.length).toBeGreaterThan(0)
  })
})
