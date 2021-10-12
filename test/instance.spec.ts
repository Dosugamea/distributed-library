import IPFS from 'ipfs-core'
import OrbitDB from 'orbit-db'
import InstanceDao from '@/dao/instance'
import InstanceModel from '@/models/instance'

describe('インスタンスDAOのテスト', () => {
  let ipfsInstance: any
  let orbitdbInstance: OrbitDB
  let instanceDao: InstanceDao
  let instance: InstanceModel

  beforeAll(async () => {
    ipfsInstance = await IPFS.create()
    orbitdbInstance = await OrbitDB.createInstance(ipfsInstance, {})
    instanceDao = new InstanceDao(orbitdbInstance)
    instance = await instanceDao.createInstance()
  })

  test('インスタンスを作成できる', () => {
    expect(
      instance.getAddress() !== undefined &&
      instance.library !== undefined &&
      instance.libraryHistory !== undefined &&
      instance.book !== undefined &&
      instance.bookHistory !== undefined
    ).toBeTruthy()
  })
})
