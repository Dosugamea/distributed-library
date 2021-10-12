import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import ReviewDao from '@/dao/review'
import { Review as ReviewType } from '@/types/review'
import type { UserId, BibliographyId } from '@/types/base/ids'

describe('レビューDAOのテスト', () => {
  let ipfsInstance: any
  let orbitdbInstance: OrbitDB
  let reviewDao: ReviewDao
  const bibliographyId: BibliographyId = '1'
  const userId: UserId = 'dosugamea'
  const issuerId: string = 'dosugamea'
  const createReview = () => {
    return reviewDao.create(
      userId,
      bibliographyId,
      0,
      'すばらしい',
      'とってもいい本'
    )
  }

  beforeAll(async () => {
    ipfsInstance = await IPFS.create()
    orbitdbInstance = await OrbitDB.createInstance(ipfsInstance, {})
    reviewDao = new ReviewDao()
    await reviewDao.build(orbitdbInstance, null, null)
  })

  test('追加できる', async () => {
    const review = createReview()
    await reviewDao.add(review)
    expect(reviewDao.isExist(review.id)).toBeTruthy()
  })

  test('同じIDのデータを追加できない', async () => {
    const review = createReview()
    await reviewDao.add(review)
    const erroredAdd = reviewDao.add(review)
    await expect(erroredAdd).rejects.toThrow(`Review ${review.id} already exist`)
  })

  test('編集できる', async () => {
    const review = createReview()
    review.name = 'ご注文はうさぎですか？ (3)'
    await reviewDao.add(review)
    const hitReview = reviewDao.get(review.id)
    const addedReview = reviewDao.convertToModel(hitReview)
    addedReview.name = 'ご注文はうさぎですか？ (2)'
    await reviewDao.edit(addedReview)
    const hitReview2 = reviewDao.get(review.id)
    expect(addedReview.name).toEqual(hitReview2.name)
  })

  test('存在しないデータを編集できない', async () => {
    const review = createReview()
    const erroredEdit = reviewDao.edit(review)
    await expect(erroredEdit).rejects.toThrow(`Review ${review.id} doesn't exist`)
  })

  test('削除できる(未実装のためエラー)', async () => {
    const review = createReview()
    await reviewDao.add(review)
    expect(() => { reviewDao.remove(review) }).toThrow('Remove review is not implemented')
  })

  test('存在しないデータを削除できない', () => {
    const review = createReview()
    expect(() => { reviewDao.remove(review) }).toThrow(`Review ${review.id} doesn't exist`)
  })

  test('データを探せる(find)', async () => {
    const review = createReview()
    await reviewDao.add(review)
    const bibliographies = reviewDao.find((b: ReviewType) => b.name.includes('ご注文はうさぎですか'))
    expect(bibliographies.length).toBeGreaterThan(0)
  })

  test('データを取得できる(get)', async () => {
    const review = createReview()
    await reviewDao.add(review)
    expect(reviewDao.get(review.id).id).toEqual(review.id)
  })

  test('存在しないデータを取得(get)できない', () => {
    expect(() => { reviewDao.get(issuerId) }).toThrow(`Review ${issuerId} doesn't exist`)
  })

  test('データアドレスを取得できる', () => {
    const reviewAddress = reviewDao.getAddress()
    expect(reviewAddress.length).toBeGreaterThan(0)
  })

  test('履歴アドレスを取得できる', () => {
    const reviewHistoryAddress = reviewDao.getHistoryAddress()
    expect(reviewHistoryAddress.length).toBeGreaterThan(0)
  })
})
