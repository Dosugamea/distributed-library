<template>
  <section>
    <b-field label="Name">
      <b-input v-model="shelfNameProp" type="string" maxlength="30" />
    </b-field>

    <b-field label="Note">
      <b-input v-model="shelfNoteProp" type="string" maxlength="30" />
    </b-field>

    <b-button @click="saveDB()">
      Save
    </b-button>
  </section>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'

@Component
export default class LibraryConfigCard extends Vue {
  @PropSync('shelfName', { type: String })
  shelfNameProp!: string

  @PropSync('shelfNote', { type: String })
  shelfNoteProp!: string

  async saveDB () {
    const libraryModel = this.$libraryDao.create(
      this.shelfNameProp,
      this.shelfNoteProp,
      'test'
    )
    console.log(await this.$libraryDao.add(libraryModel))
    alert('変更しました')
  }
}
</script>
