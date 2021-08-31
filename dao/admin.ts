import type OrbitDB from 'orbit-db'
import { AdminInfoDatabase } from '@/types/base/addresses'
import AdminModel from '@/models/admin'

export default class AdminDao {
  protected orbitdb: OrbitDB

  constructor (orbitdb: OrbitDB) {
    this.orbitdb = orbitdb
  }

  /**
   * 管理者を作成する
   */
  createAdmin () : AdminModel {
    return new AdminModel(this.orbitdb, null)
  }

  /**
   * 管理者を読み込む
   */
  loadAdmin (databaseAddress: AdminInfoDatabase): AdminModel {
    return new AdminModel(this.orbitdb, databaseAddress)
  }
}
