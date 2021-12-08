<template>
  <div>
    <b-loading
      v-model="isLoading"
      :is-full-page="true"
      :can-cancel="false"
    />
    <ElementList
      title="本棚の蔵書一覧"
      icon="book"
      :elements="elements"
    >
      <template #card="slotProps">
        <div @click="findLibraryBook(slotProps.element.id)">
          <card
            :title="slotProps.element.id"
            icon="cellphone-link"
          >
            {{ slotProps.element.name }}
          </card>
        </div>
      </template>
    </ElementList>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ElementList from '~/components/ElementList.vue'
import { LibraryModel } from '~/models/library'
import { DaoLibraryBookWatcher, DaoWatcherState } from '~/dao/watcher'
import { LibraryBookDao } from '~/dao/libraryBook'

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
  watcher: DaoLibraryBookWatcher | null = null
  libraryBookDao: LibraryBookDao | null = null

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
    this.libraryBookDao = this.$db.libraryDao.getBookDao(library)
    this.watcher = new DaoLibraryBookWatcher(this.libraryBookDao)
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

  findLibraryBook (bibliographyId: string) {
    const resp = this.libraryBookDao?.findBookByBibliographyId(bibliographyId)
    return resp
  }
}
</script>
