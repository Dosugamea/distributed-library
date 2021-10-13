<template>
  <section class="section">
    <div class="columns is-mobile">
      <card
        v-for="library in libraries"
        :key="library.id"
        :title="library.name"
        icon="github"
      >
        {{ library.note }}
      </card>
    </div>
    <FirstStepPage :wizard-step="wizardStep" @change-step="changeStep" />
    <SecondStepPage :wizard-step="wizardStep" @change-step="changeStep" />
    <ThirdStepPage :wizard-step="wizardStep" @change-step="changeStep" />
    <FourthStepPage :wizard-step="wizardStep" @change-step="changeStep" />
    <LibraryConfigCard v-if="isLoaded" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import FirstStepPage from '@/components/setup/first.vue'
import SecondStepPage from '@/components/setup/second.vue'
import ThirdStepPage from '@/components/setup/third.vue'
import FourthStepPage from '@/components/setup/fourth.vue'
import LibraryConfigCard from '@/components/library-config/card.vue'
import Card from '@/components/Card.vue'
import { Wizard } from '@/types/front/wizard-const'
import { clientStore } from '@/store'
// import { Library } from '~/types/library'

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
  libraries: object[] = []

  changeStep (newValue: number) {
    this.wizardStep = newValue
  }

  get isLoaded () : boolean {
    return this.wizardStep === Wizard.INITIALIZED
  }

  async mounted () {
    const genesisLibraryInfo = clientStore.genesisLibraryInfo
    const libraryBookInfo = clientStore.libraryBookInfo
    if (!genesisLibraryInfo.includes('') && !libraryBookInfo.includes('')) {
      await this.$libraryDao.build(this.$orbitdb, genesisLibraryInfo[0], genesisLibraryInfo[1])
      await this.$libraryBookDao.build(this.$orbitdb, libraryBookInfo[0], libraryBookInfo[1])
      this.wizardStep = Wizard.INITIALIZED
      alert('本棚の読み出しに成功しました')
      this.$libraryDao.listenReady(() => {
        console.log('ready')
        this.libraries = this.$libraryDao.list()
        console.log(this.libraries)
      })
      this.$libraryDao.listenUpdate(() => {
        console.log('replicated')
        this.libraries = this.$libraryDao.list()
        console.log(this.libraries)
      })
      this.$libraryDao.listenWrite(() => {
        console.log('write')
        this.libraries = this.$libraryDao.list()
        console.log(this.libraries)
      })
    }
  }
}
</script>
