<template>
  <section class="section">
    <div class="columns is-mobile">
      <card
        title="Free"
        icon="github"
      >
        Open source on <a href="https://github.com/buefy/buefy">
          GitHub
        </a>
      </card>

      <card
        title="Responsive"
        icon="cellphone-link"
      >
        <b class="has-text-grey">
          Every
        </b> component is responsive
      </card>

      <card
        title="Modern"
        icon="alert-decagram"
      >
        Built with <a href="https://vuejs.org/">
          Vue.js
        </a> and <a href="http://bulma.io/">
          Bulma
        </a>
      </card>

      <card
        title="Lightweight"
        icon="arrange-bring-to-front"
      >
        No other internal dependency
      </card>
    </div>
    <FirstStepPage :wizard-step="wizardStep" @change-step="changeStep" />
    <SecondStepPage :wizard-step="wizardStep" @change-step="changeStep" />
    <ThirdStepPage :wizard-step="wizardStep" @change-step="changeStep" />
    <FourthStepPage :wizard-step="wizardStep" @change-step="changeStep" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FirstStepPage from '@/components/setup/first.vue'
import SecondStepPage from '@/components/setup/second.vue'
import ThirdStepPage from '@/components/setup/third.vue'
import FourthStepPage from '@/components/setup/fourth.vue'
import Card from '@/components/Card.vue'

@Component({
  components: {
    Card,
    FirstStepPage,
    SecondStepPage,
    ThirdStepPage,
    FourthStepPage
  }
})
export default class IndexComponent extends Vue {
  name = 'HomePage';
  age = 21;
  wizardStep = 1;

  changeStep (newValue: number) {
    this.wizardStep = newValue
  }

  /*
  async mounted () {
    console.log(this.$ipfs)
    console.log(this.$orbitdb)
    const tdb = await this.$orbitdb.docstore('hogehage12345')
    await tdb.put({ _id: 'hogehoge', doc: 'all the things' })
    let value = await tdb.get('hogehoge')
    console.log(value)
    await tdb.put({ _id: 'hogehoge', doc: 'other things' })
    value = await tdb.get('hogehoge')
    console.log(value)
    value = await tdb.get('h')
    console.log(value)
    value = await tdb.get('o')
    console.log(value)
  }
  */
}
</script>
