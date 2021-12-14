<template>
  <div>
    <b-loading
      v-model="isLoading"
      :is-full-page="true"
      :can-cancel="false"
    />
    <div class="box">
      <div class="columns is-vcentered is-justify-content-space-around has-text-centered">
        <div class="is-4 has-text-centered">
          <b-icon
            icon="bookshelf"
            size="is-large"
          />
        </div>
        <div class="is-4 has-text-centered">
          <p class="title">
            {{ libraryName }}
          </p>
          <p class="subtitle">
            {{ libraryNote }}
          </p>
        </div>
        <div class="mt-1 is-4 has-text-centered">
          <p class="subtitle">
            作成者: {{ libraryOwner }}
          </p>
        </div>
        <b-button
          v-if="isOwner"
          class="is-primary mt-1"
          size="is-medium"
          label="蔵書を追加"
          @click="jumpAddBook"
        />
      </div>
    </div>
    <ElementList
      title="蔵書一覧"
      icon="book"
      :elements="elements"
    >
      <template #card="slotProps">
        <div @click="findLibraryBook(slotProps.element.id)">
          <card
            :title="slotProps.element.id"
            icon="book"
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
    try {
      const library = await this.$db.libraryDao.get(this.libraryId)
      this.library = library
      this.libraryBookDao = this.$db.libraryDao.getBookDao(library)
      this.watcher = new DaoLibraryBookWatcher(this.libraryBookDao)
      this.isLoading = false
      clearTimeout(this.timer)
    } catch {
      alert('指定された本棚は存在しません')
      this.loadFailed()
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

  get libraryName () {
    return this.library != null ? this.library.name : ''
  }

  get libraryNote () {
    return this.library != null ? this.library.note : ''
  }

  get libraryOwner () {
    return this.library != null ? this.library.owner : ''
  }

  get isOwner () {
    return this.$db.userDao?.userId === this.library?.owner
  }

  jumpAddBook () {
    this.$router.push(`/library/${this.libraryId}/books/add`)
  }

  findLibraryBook (bibliographyId: string) {
    const book = this.libraryBookDao?.findBookByBibliographyId(bibliographyId)
    if (book == null) { return }
    this.$router.push(`/library/${this.libraryId}/books/${book.id}`)
  }
}
</script>
