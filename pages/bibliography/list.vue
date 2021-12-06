<template>
  <ElementList
    title="蔵書一覧"
    icon="book"
    :elements="elements"
  >
    <template #card="slotProps">
      <nuxt-link :to="`/bibliography/${slotProps.element.id}`">
        <card
          :title="slotProps.element.id"
          icon="cellphone-link"
        >
          {{ slotProps.element.name }}
        </card>
      </nuxt-link>
    </template>
  </ElementList>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ElementList from '~/components/ElementList.vue'
import { BibliographyModel } from '~/models/bibliography'
import { DaoWatcher, DaoWatcherState } from '~/dao/watcher'

@Component({
  components: {
    ElementList
  }
})
export default class BibliographyListComponent extends Vue {
  watcher: DaoWatcher<BibliographyModel> | null = null

  mounted () {
    if (this.$db.bibliographyDao != null) {
      this.watcher = new DaoWatcher<BibliographyModel>(this.$db.bibliographyDao)
    }
  }

  beforeDestroy () {
    if (this.watcher != null) {
      this.watcher.destroy()
    }
  }

  get elements () {
    return DaoWatcherState.elements
  }
}
</script>
