import AccountDao from '@/dao/base/account'
import { AdminInfoDatabase } from '@/types/base/addresses'
import { Admin, AdminHistory, AdminHistoryAction, AdminHistoryTarget } from '@/types/admin'
import OrbitDB from 'orbit-db'
import { AdminId } from '~/types/base/ids'

export default class AdminDao extends AccountDao implements Admin {
  trust: AdminId[] = []
  #histories: AdminHistory[] = []

  constructor (orbitdb: OrbitDB, dbAddress: AdminInfoDatabase | null) {
    super(orbitdb, dbAddress, 'admin')
    this.db.get('trust').then(
      (trust: AdminId[]) => {
        this.trust = trust
      }
    )
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
    this.#histories.push(h)
    this.db.set('histories', this.#histories)
  }

  /**
   * 管理者をトラストする
   */
  addTrust (adminId: AdminId) {
    if (this.trust.includes(adminId)) {
      throw new Error('You already trusted the admin')
    }
    this.trust.push(adminId)
    this.db.set('trust', this.trust)
    this.addAdminHistory('add', 'trust', adminId)
  }

  /**
   * 管理者のトラストを無くす
   */
  removeTrust (adminId: AdminId) {
    if (!this.trust.includes(adminId)) {
      throw new Error('You already un-trusted the admin')
    }
    this.trust = this.trust.filter(trustAdminId => trustAdminId !== adminId)
    this.db.set('trust', this.trust)
    this.addAdminHistory('remove', 'trust', adminId)
  }

  get histories (): AdminHistory[] {
    return this.#histories as AdminHistory[]
  }
}
