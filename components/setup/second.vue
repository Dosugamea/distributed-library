<template>
  <b-modal :active="isThisStep" :can-cancel="false" has-modal-card>
    <div class="modal-card" style="width: 700px;">
      <header class="modal-card-head">
        <p class="modal-card-title">
          本棚の作成(入力)
        </p>
      </header>
      <section v-if="!isLibraryCreated" class="modal-card-body">
        <b-field label="本棚の名称">
          <b-input
            v-model="shelfName"
            type="text"
            placeholder="ex. マイ本棚"
            required
          />
        </b-field>
        <b-field label="本棚の説明文">
          <b-input
            v-model="shelfNote"
            type="text"
            placeholder="ex. 漫画多めの本棚"
            required
          />
        </b-field>
      </section>
      <section v-if="isLibraryCreated" class="modal-card-body">
        <p>本棚の作成が完了しました! アドレスをコピーして、別のタブで開いて続行しましょう。</p>
        <b-field label="本棚のメインDB">
          <b-input
            v-model="libraryDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            disabled
          />
        </b-field>
        <b-field label="本棚の履歴DB">
          <b-input
            v-model="libraryHistoryDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            disabled
          />
        </b-field>
        <b-field label="本棚の蔵書メインDB">
          <b-input
            v-model="libraryBookDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            disabled
          />
        </b-field>
        <b-field label="本棚の蔵書履歴DB">
          <b-input
            v-model="libraryBookHistoryDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            disabled
          />
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button v-if="!isLibraryCreated" type="is-primary" :disabled="isFormInvalid" @click="createDatabase">
            作成する
          </b-button>
          <b-button type="is-secondary" @click="goBack">
            戻る
          </b-button>
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Emit } from 'nuxt-property-decorator'
import { Wizard } from '@/types/front/wizard-const'
import BaseStepPage from '@/components/setup/base.vue'

@Component
export default class SecondStepPage extends BaseStepPage {
  DISPLAY_STEP = Wizard.CREATE_LIBRARY
  shelfName: string = ''
  shelfNote: string = ''
  isLibraryCreated = false
  libraryDatabase: string = ''
  libraryHistoryDatabase: string = ''
  libraryBookDatabase: string = ''
  libraryBookHistoryDatabase: string = ''

  get isFormInvalid () : boolean {
    return this.shelfName.length === 0 || this.shelfNote.length === 0
  }

  async createDatabase () {
    // @ts-ignore
    const issuer = this.$orbitdb.identity.publicKey
    await this.$libraryDao.build(this.$orbitdb, null, null)
    await this.$libraryBookDao.build(this.$orbitdb, null, null)
    // 連合を作成して登録
    const newLibrary = this.$libraryDao.create(this.shelfName, this.shelfNote, issuer)
    await this.$libraryDao.add(newLibrary)
    // Daoからアドレスを取り出して代入
    this.libraryDatabase = this.$libraryDao.getAddress()
    this.libraryHistoryDatabase = this.$libraryDao.getHistoryAddress()
    this.libraryBookDatabase = this.$libraryBookDao.getAddress()
    this.libraryBookHistoryDatabase = this.$libraryBookDao.getHistoryAddress()
    this.isLibraryCreated = true
  }

  @Emit('change-step')
  goInit () {
    return Wizard.INIT_LIBRARY
  }

  @Emit('change-step')
  goBack () {
    return Wizard.SELECT_CREATE_OR_LOAD
  }
}
</script>
