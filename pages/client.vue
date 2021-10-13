<template>
  <section class="section">
    <b-input v-model="dbAddress" placeholder="DBアドレス" />
    <b-button @click="loadElement">
      Test
    </b-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class IndexComponent extends Vue {
  dbAddress: string = ''
  tdb: any = null

  async loadElement () {
    this.tdb = await this.$orbitdb.docstore(this.dbAddress)
    // When a database is ready read data
    this.tdb.events.on('ready', () => {
      console.log('ready')
      console.log(this.tdb.get(''))
    })
    // When a remote peer updated the todos, refresh our data model
    this.tdb.events.on('replicated', () => {
      console.log('replicated')
      console.log(this.tdb.get(''))
    })
    // Watch for load progress and update the model state with the progress
    this.tdb.events.on('load.progress', (_ :any, __: any, ___ : any, progress: any, total :any) => {
      console.log('load progress ', progress, total)
    })
  }
}
</script>
