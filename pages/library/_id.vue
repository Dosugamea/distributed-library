<template>
  <div>
    <b-loading
      v-model="isLoading"
      :is-full-page="true"
      :can-cancel="false"
    />
    <ElementList
      title="蔵書一覧"
      icon="book"
      :elements="elements"
    >
      <template #card="slotProps">
        <nuxt-link :to="`/library/${slotProps.element.id}`">
          <card
            :title="slotProps.element.id"
            icon="cellphone-link"
          >
            {{ slotProps.element.name }}
          </card>
        </nuxt-link>
      </template>
    </ElementList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ElementList from '~/components/ElementList.vue'
import { LibraryBookModel, LibraryModel } from '~/models/library'
import { DaoWatcher, DaoWatcherState } from '~/dao/watcher'

@Component({
  components: {
    ElementList
  }
})
export default class LibraryBooksListComponent extends Vue {
  isLoading = true
  libraryId = this.$route.params.id
  library: LibraryModel | null = null
  timer: NodeJS.Timeout | null = null
  watcher: DaoWatcher<LibraryBookModel> | null = null

  loadFailed () {
    if (this.timer != null) {
      clearTimeout(this.timer)
    }
    this.isLoading = false
    this.$router.back()
  }

  async mounted () {
    if (this.$db.libraryDao == null) {
      this.$router.push('/')
      return
    }
    this.timer = setTimeout(() => {
      alert('データ取得がタイムアウトしました')
      this.loadFailed()
    }, 5 * 1000)
    const library = await this.$db.libraryDao.get(this.libraryId)
    this.library = library
    const libraryBookDao = this.$db.libraryDao.getBookDao(library)
    this.watcher = new DaoWatcher<LibraryBookModel>(libraryBookDao)
    this.isLoading = false
    clearTimeout(this.timer)
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
