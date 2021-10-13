<template>
  <section class="section">
    <b-input v-model="dbAddress" placeholder="DBアドレス" />
    <b-button @click="addElement">Test</b-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { nanoid } from 'nanoid'

@Component({})
export default class IndexComponent extends Vue {
  dbAddress: string = ''
  tdb: any = null

  async mounted () {
    this.tdb = await this.$orbitdb.docstore('hogehage12345')
    await this.tdb.put({
      _id: nanoid(),
      name: 'hoge',
      age: 20
    })
    this.dbAddress = this.tdb.address.toString()
  }

  async addElement () {
    const id = nanoid(20)
    await this.tdb.put({ _id: 'hogehoge_' + id, doc: 'other things ' + id })
    console.log(this.tdb.get(''))
  }
}
</script>
