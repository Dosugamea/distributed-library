import type OrbitDB from 'orbit-db'
import { UserInfoDatabase } from '@/types/base/addresses'
import UserModel from '@/models/user'

export default class UserDao {
  protected orbitdb: OrbitDB

  constructor (orbitdb: OrbitDB) {
    this.orbitdb = orbitdb
  }

  /**
   * ユーザーを作成する
   */
  createUser () : UserModel {
    return new UserModel(this.orbitdb, null)
  }

  /**
   * ユーザーを読み込む
   */
  loadUser (databaseAddress: UserInfoDatabase): UserModel {
    return new UserModel(this.orbitdb, databaseAddress)
  }
}
