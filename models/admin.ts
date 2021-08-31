import type OrbitDB from 'orbit-db'
import AccountModel from '@/models/base/account'
import { Admin as AdminType, AdminHistory, AdminHistoryAction, AdminHistoryTarget } from '@/types/admin'
import { AdminId } from '~/types/base/ids'

export default class AdminModel extends AccountModel implements AdminType {
  #trust: AdminId[] = []

  constructor (
    orbitdb: OrbitDB,
    dbAddress: string | null
  ) {
    super(orbitdb, dbAddress, 'admin')
    this.#trust = this.__db.get('trust') as AdminId[]
  }

  private addAdminHistory (action: AdminHistoryAction, target: AdminHistoryTarget, value: string) {
    const h: AdminHistory = {
      id: this.getNewHistoryId(),
      createdDate: new Date(),
      issuer: 'self',
      action,
      target,
      value
    }
    this.histories.push(h)
  }

  /**
   * 管理者をトラストする
   */
  addTrust (adminId: AdminId) {
    if (this.trust.includes(adminId)) {
      throw new Error('You already trusted the admin')
    }
    this.trust.push(adminId)
    this.addAdminHistory('add', 'trust', adminId)
  }

  /**
   * 管理者のトラストを無くす
   */
  removeTrust (adminId: AdminId) {
    if (!this.trust.includes(adminId)) {
      throw new Error('You already un-trusted the admin')
    }
    this.#trust = this.trust.filter(trustAdminId => trustAdminId !== adminId)
    this.addAdminHistory('remove', 'trust', adminId)
  }

  get trust () : AdminId[] {
    return this.#trust
  }

  get histories (): AdminHistory[] {
    return this.histories as AdminHistory[]
  }
}
