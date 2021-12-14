import GUN from 'gun'
import type { IGunChainReference } from 'gun/types/chain'
import type { AppState } from '@/types/appState'
import { BibliographyDao } from '@/dao/bibliography'
import { BibliographyModel } from '@/models/bibliography'

describe('dao-bibliographiesクラスのテスト', () => {
  let gunInstance: IGunChainReference<AppState, any, 'pre_root'>
  let dao: BibliographyDao
  const errorHead = 'bibliography'
  const issuerId: string = 'dosugamea'
  const createModel = () => {
    return dao.createModel(
      'ごちうさ',
      '新刊待ち',
      'https://example.com',
      '漫画',
      'Koi',
      '芳文社',
      dao.getCurrentUnixTime(),
      '1'
    )
  }

  beforeAll(() => {
    gunInstance = new GUN<AppState>(['http://localhost:8765/gun'])
    dao = new BibliographyDao(gunInstance, issuerId)
  })

  test('追加できる', async () => {
    const model = createModel()
    await dao.add(model)
    expect(dao.isExist(model.id)).toBeTruthy()
  })

  test('同じIDのデータを追加できない', async () => {
    const model = createModel()
    await dao.add(model)
    const erroredAdd = dao.add(model)
    await expect(erroredAdd).rejects.toThrow(
      `${errorHead} ${model.id} already exist`
    )
  })

  test('編集できる', async () => {
    const model = createModel()
    model.name = 'ご注文はうさぎですか？ (3)'
    await dao.add(model)
    model.name = 'ご注文はうさぎですか？ (2)'
    await dao.edit(model)
    const editedModel = await dao.get(model.id)
    expect(model.name).toEqual(editedModel.name)
  })

  test('存在しないデータを編集できない', async () => {
    const model = createModel()
    const erroredEdit = dao.edit(model)
    await expect(erroredEdit).rejects.toThrow(
      `${errorHead} ${model.id} doesn't exist`
    )
  })

  test('削除できる', async () => {
    const model = createModel()
    await dao.add(model)
    expect(async () => { await dao.remove(model) }).toBeTruthy()
  })

  test('存在しないデータを削除できない', async () => {
    const model = createModel()
    const erroredRemove = dao.remove(model)
    await expect(erroredRemove).rejects.toThrow(
      `${errorHead} ${model.id} doesn't exist`
    )
  })

  test('データを探せる(find)', async () => {
    const model = createModel()
    await dao.add(model)
    const bibliographies = await dao.find(
      (b: BibliographyModel) => b.name === 'ごちうさ'
    )
    expect(bibliographies.length).toBeGreaterThan(0)
  })

  test('データを取得できる(get)', async () => {
    const model = createModel()
    await dao.add(model)
    const addedModel = await dao.get(model.id)
    expect(addedModel.id).toEqual(model.id)
  })

  test('存在しないデータを取得(get)できない', async () => {
    const erroredGet = dao.get(issuerId)
    await expect(erroredGet).rejects.toThrow(
      `${errorHead} ${issuerId} doesn't exist`
    )
  })

  test('要素をカウントできる', async () => {
    const counted = await dao.count()
    expect(counted).toBeGreaterThan(0)
  })

  test('履歴を取得できる', async () => {
    const model = createModel()
    await dao.add(model)
    const histories = await dao.histories()
    expect(histories.length).toBeGreaterThan(0)
  })

  test('一覧を取得できる', async () => {
    const models = await dao.list()
    expect(models.length).toBeGreaterThan(0)
  })

  test('全データを削除した後要素数が0になる', async () => {
    const models = await dao.list()
    console.log(models)
    for (const model of models) {
      try {
        await dao.remove(model)
      } catch (err) {
        console.log(err)
      }
    }
    const models2 = dao.list()
    expect(models2.length).toEqual(0)
  })
})
