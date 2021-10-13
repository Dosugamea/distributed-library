<template>
  <section>
    <b-field label="Name">
      <b-input v-model="shelfName" type="string" maxlength="30" />
    </b-field>

    <b-field label="Note">
      <b-input v-model="shelfNote" type="string" maxlength="30" />
    </b-field>

    <b-button @click="saveDB()">
      Save
    </b-button>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class LibraryConfigCard extends Vue {
  shelfName: string = ''
  shelfNote: string = ''

  async saveDB () {
    console.log(this.shelfName)
    console.log(this.shelfNote)
    const libraryModel = this.$libraryDao.create(
      this.shelfName,
      this.shelfNote,
      'test'
    )
    console.log(await this.$libraryDao.add(libraryModel))
    alert('変更しました')
  }
}
</script>
