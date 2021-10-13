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
    <LibraryConfigCard v-if="isLoaded" />
    <b-input v-model="dbAddress" placeholder="DBアドレス"/>
    <b-button @click="addElement">Test</b-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { nanoid } from 'nanoid'
import FirstStepPage from '@/components/setup/first.vue'
import SecondStepPage from '@/components/setup/second.vue'
import ThirdStepPage from '@/components/setup/third.vue'
import FourthStepPage from '@/components/setup/fourth.vue'
import LibraryConfigCard from '@/components/library-config/card.vue'
import Card from '@/components/Card.vue'
import { Wizard } from '@/types/front/wizard-const'
import { clientStore } from '@/store'

@Component({
  components: {
    Card,
    FirstStepPage,
    SecondStepPage,
    ThirdStepPage,
    FourthStepPage,
    LibraryConfigCard
  }
})
export default class IndexComponent extends Vue {
  name = 'HomePage';
  wizardStep = 1;
  shelfName: string = ''
  shelfNote: string = ''
  dbAddress: string = ''

  changeStep (newValue: number) {
    this.wizardStep = newValue
  }

  get isLoaded () : boolean {
    return this.wizardStep === Wizard.INITIALIZED
  }
  queryAndRender () {
    const libraryObjects = this.$libraryDao.list()
    console.log(libraryObjects)
    // this.shelfName = libraryObject.name
    // this.shelfNote = libraryObject.note
    console.log('replicated!')
  }
  async mounted () {
    const genesisLibraryInfo = clientStore.genesisLibraryInfo
    const libraryBookInfo = clientStore.libraryBookInfo
    if (!genesisLibraryInfo.includes('') && !libraryBookInfo.includes('')) {
      await this.$libraryDao.build(this.$orbitdb, genesisLibraryInfo[0], genesisLibraryInfo[1])
      await this.$libraryBookDao.build(this.$orbitdb, libraryBookInfo[0], libraryBookInfo[1])
      this.wizardStep = Wizard.INITIALIZED
      this.queryAndRender()
      alert('本棚の読み出しに成功しました')
      this.$libraryDao.listenUpdate(this.queryAndRender)
    }
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
