import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import { nanoid } from 'nanoid'
import BibliographyDao from '@/dao/bibliography'

describe('dao-bibliographiesモデルのテスト', () => {
  let ipfsInstance: any
  let orbitdbInstance: OrbitDB
  let bibliographyDao: BibliographyDao

  beforeAll(async () => {
    ipfsInstance = await IPFS.create({
    })
    orbitdbInstance = await OrbitDB.createInstance(ipfsInstance, {})
    bibliographyDao = new BibliographyDao()
    await bibliographyDao.build(orbitdbInstance, null, null)
  })

  test('add', async () => {
    const bibliography = bibliographyDao.createBibliography(
      nanoid(20),
      'ご注文はうさぎですか？ (1)',
      'Koi',
      '漫画',
      'https://m.media-amazon.com/images/P/B00IZ7R7LK.01._SCLZZZZZZZ_SX500_.jpg',
      new Date(),
      '芳文社',
      '',
      'dosugamea'
    )
    const dbPutResp = await bibliographyDao.addBibliography(bibliography)
    console.log(bibliography)
    console.log(dbPutResp)
    console.log(bibliographyDao.getBibliographyAddress())
    console.log(bibliographyDao.getBibliographyHistoryAddress())
  })
})
