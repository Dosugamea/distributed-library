<template>
  <ElementList
    title="本棚一覧"
    icon="bookshelf"
    :elements="elements"
  >
    <template #card="slotProps">
      <nuxt-link :to="`/library/${slotProps.element.id}`">
        <card
          :title="slotProps.element.id"
          icon="bookshelf"
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
import { LibraryModel } from '~/models/library'
import { DaoWatcher, DaoWatcherState } from '~/dao/watcher'

@Component({
  components: {
    ElementList
  }
})
export default class LibraryListComponent extends Vue {
  daoWatcher: DaoWatcher<LibraryModel> | null = null

  mounted () {
    if (this.$db.libraryDao != null) {
      this.daoWatcher = new DaoWatcher<LibraryModel>(this.$db.libraryDao)
    }
  }

  beforeDestroy () {
    if (this.daoWatcher != null) {
      this.daoWatcher.destroy()
    }
  }

  get elements () {
    return DaoWatcherState.elements
  }
}
</script>
