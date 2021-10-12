<template>
  <b-modal :active="isThisStep" :can-cancel="false" has-modal-card>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          本棚の読み込み中
        </p>
      </header>
      <section class="modal-card-body">
        <p>作成中です...</p>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button type="is-primary" :disabled="notInitialized" @click="goMain">
            OK
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
export default class ThirdStepPage extends BaseStepPage {
  DISPLAY_STEP = Wizard.INIT_LIBRARY
  notInitialized = true

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
