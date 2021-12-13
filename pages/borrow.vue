<template>
  <section>
    <p class="title has-text-centered">
      本を借りる
    </p>
    <form class="box mx-2 my-2 has-text-centered" @submit="onSubmit" @submit.prevent>
      <b-field type="" label="追加する書誌" :label-position="labelPosition">
        <b-select
          v-model="targetBibliographyId"
          icon="tag"
          :placeholder="selectPlaceholder"
          :disabled="filteredBibliographies.length == 0"
          expanded
          required
        >
          <option
            v-for="b in filteredBibliographies"
            :key="b.id"
            :value="b.id"
          >
            {{ b.name }}
          </option>
        </b-select>
        <b-input
          v-model="searchFilter"
          icon="format-title"
          type="text"
          placeholder="絞り込みワードを入力..."
        />
      </b-field>
      <b-field label="メモ(任意)" :label-position="labelPosition">
        <b-input
          v-model="targetNote"
          icon="comment"
          type="text"
          placeholder="傷無し問題なし"
          minlength="0"
          maxlength="300"
        />
      </b-field>
      <input type="submit" class="button is-primary is-large" value="本棚を追加する">
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { LibraryModel } from '@/models/library'
import { BibliographyModel } from '@/models/bibliography'
import { LibraryBookDao } from '@/dao/libraryBook'
import { DaoWatcher, DaoWatcherState } from '@/dao/watcher'

@Component({})
export default class LibraryAddPage extends Vue {
  labelPosition = 'on-border'
  isLoading = true
  libraryId = this.$route.params.id
  library: LibraryModel | null = null
  timer: NodeJS.Timeout | null = null
  libraryBookDao: LibraryBookDao | null = null
  watcher: DaoWatcher<BibliographyModel> | null = null
  searchFilter: string = ''
  targetBibliographyId: string | null = null
  targetNote: string = ''

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
    if (this.$db.bibliographyDao != null) {
      this.watcher = new DaoWatcher<BibliographyModel>(this.$db.bibliographyDao)
    }
    try {
      const library = await this.$db.libraryDao.get(this.libraryId)
      this.library = library
      this.libraryBookDao = this.$db.libraryDao.getBookDao(library)
      this.isLoading = false
      clearTimeout(this.timer)
    } catch (e) {
      alert('存在しない本棚が指定されました')
      this.loadFailed()
    }
  }

  async onSubmit () {
    if (this.targetBibliographyId == null) {
      return
    }
    if (this.library == null) {
      return
    }
    if (this.libraryBookDao == null) {
      return
    }
    const bibliography = await this.$db.bibliographyDao!.get(this.targetBibliographyId)
    if (bibliography == null) {
      this.$buefy.snackbar.open({
        message: '指定された書誌IDが見つかりませんでした(削除された可能性があります)',
        type: 'is-danger'
      })
      return
    }
    const newModel = this.libraryBookDao!.createModel(
      bibliography,
      this.library,
      this.targetNote
    )
    const existedBook = this.libraryBookDao!.findBookByBibliographyId(bibliography.id)
    if (existedBook != null) {
      this.$buefy.snackbar.open({
        message: 'この書誌は既に追加済みです',
        type: 'is-danger'
      })
      return
    }
    await this.libraryBookDao!.add(newModel, bibliography, this.library)
    this.$buefy.snackbar.open({
      message: '登録に成功しました',
      type: 'is-success'
    })
    this.$router.push(`/library/${this.libraryId}`)
  }

  get bibliographies () {
    return DaoWatcherState.elements
  }

  get filteredBibliographies () {
    if (this.watcher == null) {
      return []
    }
    return DaoWatcherState.elements.filter(
      e => e.name.includes(this.searchFilter)
    )
  }

  get selectPlaceholder () {
    if (this.filteredBibliographies.length > 0) {
      return '書誌を選択...'
    } else {
      return 'そのワードが含まれる書誌はありません'
    }
  }

  beforeDestroy () {
    if (this.watcher != null) {
      this.watcher.destroy()
    }
  }
}
</script>
