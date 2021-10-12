<template>
  <b-modal :active="isThisStep" :can-cancel="false" has-modal-card>
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Welcome to Distributed Library!
        </p>
      </header>
      <section class="modal-card-body">
        <p>
          これは、セットアッププロセスの最初のステップです。
          既存のライブラリをロードしますか、それとも新しいライブラリを作成しますか？
        </p>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <b-button type="is-primary" @click="goCreate">
            新規作成
          </b-button>
          <b-button type="is-secondary" @click="goLoad">
            読み込む
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
export default class FirstStepPage extends BaseStepPage {
  DISPLAY_STEP = Wizard.SELECT_CREATE_OR_LOAD

  @Emit('change-step')
  goCreate () {
    return Wizard.CREATE_LIBRARY
  }

  @Emit('change-step')
  goLoad () {
    return Wizard.LOAD_LIBRARY
  }
}
</script>
