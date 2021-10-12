<template>
  <b-modal :active="isThisStep" :can-cancel="false" has-modal-card>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          本棚の作成(入力)
        </p>
      </header>
      <section class="modal-card-body">
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
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button type="is-primary" :disabled="isFormInvalid" @click="goInit">
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

  get isFormInvalid () : boolean {
    return this.shelfName.length === 0 || this.shelfNote.length === 0
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
