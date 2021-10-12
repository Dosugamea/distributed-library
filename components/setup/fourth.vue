<template>
  <b-modal :active="isThisStep" :can-cancel="false" has-modal-card>
    <div class="modal-card" style="width: auto">
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
          <b-button type="is-primary" :disabled="isFormInvalid" @click="goLoad">
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

@Component
export default class FourthStepPage extends BaseStepPage {
  DISPLAY_STEP = Wizard.LOAD_LIBRARY
  libraryDatabase: string = ''
  libraryHistoryDatabase: string = ''
  libraryBookDatabase: string = ''
  libraryBookHistoryDatabase: string = ''

  get isFormInvalid () : boolean {
    return this.libraryDatabase.length === 0 || this.libraryHistoryDatabase.length === 0 ||
      this.libraryBookDatabase.length === 0 || this.libraryBookHistoryDatabase.length === 0
  }

  @Emit('change-step')
  goLoad () {
    return Wizard.INIT_LIBRARY
  }

  @Emit('change-step')
  goBack () {
    return Wizard.SELECT_CREATE_OR_LOAD
  }
}
</script>
