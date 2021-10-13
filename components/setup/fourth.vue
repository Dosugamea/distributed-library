<template>
  <b-modal :active="isThisStep" :can-cancel="false" has-modal-card>
    <div class="modal-card" style="width: 700px;">
      <header class="modal-card-head">
        <p class="modal-card-title">
          本棚の読み込み(入力)
        </p>
      </header>
      <section class="modal-card-body">
        <b-field label="本棚のメインDB">
          <b-input
            v-model="libraryDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            required
          />
        </b-field>
        <b-field label="本棚の履歴DB">
          <b-input
            v-model="libraryHistoryDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            required
          />
        </b-field>
        <b-field label="本棚の蔵書メインDB">
          <b-input
            v-model="libraryBookDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            required
          />
        </b-field>
        <b-field label="本棚の蔵書履歴DB">
          <b-input
            v-model="libraryBookHistoryDatabase"
            type="text"
            placeholder="ex. DBアドレス"
            required
          />
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button v-if="loadStatus == 0" type="is-primary" :disabled="isFormInvalid" @click="loadDatabase">
            読み込む
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
import { clientStore } from '@/store'

@Component
export default class FourthStepPage extends BaseStepPage {
  DISPLAY_STEP = Wizard.LOAD_LIBRARY
  loadStatus: number = 0
  libraryDatabase: string = ''
  libraryHistoryDatabase: string = ''
  libraryBookDatabase: string = ''
  libraryBookHistoryDatabase: string = ''

  get isFormInvalid () : boolean {
    return this.libraryDatabase.length === 0 || this.libraryHistoryDatabase.length === 0 ||
      this.libraryBookDatabase.length === 0 || this.libraryBookHistoryDatabase.length === 0
  }

  async loadDatabase () {
    this.loadStatus += 1
    // 連合を読み出し
    await this.$libraryDao.build(this.$orbitdb, '/orbitdb/' + this.libraryDatabase + '/library', '/orbitdb/' + this.libraryHistoryDatabase + '/libraryHistory')
    await this.$libraryBookDao.build(this.$orbitdb, '/orbitdb/' + this.libraryBookDatabase + '/libraryBooks', '/orbitdb/' + this.libraryBookHistoryDatabase + '/libraryBooksHistory')
    // 連合読み出し完了
    this.loadStatus += 1
    alert('本棚の読み出しに成功しました')
    clientStore.setGenesisLibrary(
      ['/orbitdb/' + this.libraryDatabase + '/library', '/orbitdb/' + this.libraryHistoryDatabase + '/libraryHistory']
    )
    clientStore.setLibraryBooks(
      ['/orbitdb/' + this.libraryBookDatabase + '/libraryBooks', '/orbitdb/' + this.libraryBookHistoryDatabase + '/libraryBooksHistory']
    )
    this.goMain()
  }

  @Emit('change-step')
  goMain () {
    return Wizard.INITIALIZED
  }

  @Emit('change-step')
  goBack () {
    return Wizard.SELECT_CREATE_OR_LOAD
  }
}
</script>
