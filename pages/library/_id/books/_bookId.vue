<template>
  <div>
    <b-loading
      v-model="isLoading"
      :is-full-page="true"
      :can-cancel="false"
    />
    <div v-if="!isLoading" class="box columns">
      <div class="column is-4 is-flex is-vcentered">
        <div class="columns is-flex is-vcentered">
          <figure class="image">
            <img :src="bibliographyImage" alt="bibliography image">
          </figure>
        </div>
      </div>
      <div class="column is-8 has-text-centered is-vcentered">
        <div class="columns is-centered is-mobile">
          <div class="column is-8">
            <p class="is-size-3">
              {{ bibliography.name }}
            </p>
            <div v-for="(value, key, index) in displayData" :key="index" class="mt-3 columns is-justify-content-space-between">
              <div class="column is-4">
                <p class="has-text-weight-bold is-size-5">
                  {{ key }}
                </p>
              </div>
              <div class="column is-4">
                <p class="is-size-5">
                  {{ value }}
                </p>
              </div>
            </div>
            <p class="is-size-4">
              {{ rentableStatus }}
            </p>
            <p v-if="rentableStatus == '所蔵中'" class="is-size-4">
              <b-button
                label="この本を借りる"
                type="is-primary is-large"
                :disabled="isLoading"
                @click="showConfirm = true"
              />
            </p>
            <p v-if="isBorrowing" class="is-size-4">
              <b-button
                label="この本を返す"
                type="is-primary is-large"
                :disabled="isLoading"
                @click="showReturnConfirm = true"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLoading" class="mt-3 box columns is-multiline is-mobile has-text-centered">
      <div class="column is-12">
        <p class="my-4 is-size-4">
          貸出/返却履歴
        </p>
        <b-table
          v-if="elements != []"
          :data="elements"
          :current-page.sync="historyPage"
          :per-page="5"
          :paginated="true"
          :pagination-simple="true"
          :pagination-rounded="false"
          pagination-position="bottom"
          default-sort-direction="asc"
          sort-icon="arrow-up"
          sort-icon-size="is-small"
          default-sort="createdDateUnix"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
        >
          <b-table-column v-slot="props" field="createdDateUnix" label="記録時刻" sortable centered>
            {{ new Date(props.row.createdDateUnix * 1000).toLocaleDateString() }}
          </b-table-column>

          <b-table-column v-slot="props" field="issuer" label="ユーザー名" sortable centered>
            {{ props.row.issuer }}
          </b-table-column>

          <b-table-column v-slot="props" field="action" label="操作内容" sortable centered>
            {{ logType(props.row.action, props.row.value) }}
          </b-table-column>
        </b-table>
        <p v-else>
          まだ履歴はありません
        </p>
      </div>
    </div>
    <b-modal v-model="showConfirm">
      <form action="">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              本を借りる
            </p>
          </header>
          <section class="modal-card-body">
            <p>
              {{ libraryName }} から
              {{ bibliographyName }} を 借りてよろしいですか?
            </p>
            <p>
              (この下の借りるを押すと 貸出記録が確定します)
            </p>
          </section>
          <footer class="modal-card-foot">
            <b-button
              label="借りる"
              type="is-primary"
              @click="rentBook"
            />
            <b-button
              label="キャンセル"
              type="is-secondary"
              @click="showConfirm = false"
            />
          </footer>
        </div>
      </form>
    </b-modal>
    <b-modal v-model="showReturnConfirm">
      <form action="">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              本を返す
            </p>
          </header>
          <section class="modal-card-body">
            <p>
              {{ libraryName }} に
              {{ bibliographyName }} を 返しましたか?
            </p>
            <p>
              (この下の返すを押すと 返却記録が確定します)
            </p>
          </section>
          <footer class="modal-card-foot">
            <b-button
              label="返す"
              type="is-primary"
              @click="returnBook"
            />
            <b-button
              label="キャンセル"
              type="is-secondary"
              @click="showReturnConfirm = false"
            />
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BibliographyModel } from '@/models/bibliography'
import { LibraryBookModel, LibraryModel } from '@/models/library'
import { LibraryBookDao } from '@/dao/libraryBook'
import { DaoLibraryBookHistoryWatcher, DaoWatcherState } from '~/dao/watcher'
import { LogModel } from '@/models/base'

@Component({})
export default class BibliographyPage extends Vue {
  isLoading = true
  showConfirm = false
  showReturnConfirm = false
  timer: NodeJS.Timeout | null = null
  displayData: { [key: string]: string } = {}
  libraryId = this.$route.params.id
  bookId = this.$route.params.bookId
  library: LibraryModel | null = null
  bibliography: BibliographyModel | null = null
  book: LibraryBookModel | null = null
  libraryBookDao: LibraryBookDao | null = null
  historyData: LogModel | null = null
  historyPage: number = 1
  watcher: DaoLibraryBookHistoryWatcher | null = null

  loadFailed (reason: string) {
    alert(reason)
    if (this.timer != null) {
      clearTimeout(this.timer)
    }
    this.isLoading = false
    this.$router.back()
  }

  beforeDestroy () {
    if (this.watcher != null) {
      this.watcher.destroy()
    }
  }

  get elements () {
    return DaoWatcherState.elements
  }

  get bibliographyImage () {
    if (this.bibliography == null) {
      return 'http://placehold.jp/800x1200.png?text=?'
    }
    if (this.bibliography.image === '') {
      return 'http://placehold.jp/800x1200.png?text=?'
    }
    return this.bibliography.image
  }

  get rentableStatus () {
    if (this.book == null) {
      return '読み込み中'
    }
    if (this.book.rentable === true) {
      return '所蔵中'
    }
    return '貸出中'
  }

  get isBorrowing () {
    if (this.$db.userDao == null) {
      return false
    }
    const histories = this.$db.userDao.borrowOrReturn().filter(
      log => log.target === this.bookId
    ).sort(
      (a, b) => b.createdDateUnix - a.createdDateUnix
    )
    if (histories.length === 0) {
      return false
    }
    return histories[0].action === 'borrow'
  }

  logType (status: string, value: any) {
    switch (status) {
      case 'add':
        return '蔵書登録'
      case 'remove':
        return '蔵書消去'
      case 'edit':
        return value === 'false' ? '本の貸出' : '本の返却'
      default:
        return '不明'
    }
  }

  get libraryName () {
    return this.library === null ? '' : this.library.name
  }

  get bibliographyName () {
    return this.bibliography === null ? '' : this.bibliography.name
  }

  async mounted () {
    // 取得できない可能性があるため強制終了タイマー
    this.timer = setTimeout(() => {
      this.loadFailed('データ取得がタイムアウトしました')
    }, 5 * 1000)
    // 一応NULLの可能性があるため(たぶん発生しない?)
    if (this.$db.libraryDao == null || this.$db.bibliographyDao == null) {
      this.loadFailed('DBが初期化されていません')
      return
    }
    // 本棚 / 蔵書 / 書誌 をそれぞれ取得
    const library = await this.$db.libraryDao.get(this.libraryId)
    if (library == null) {
      this.loadFailed('存在しない本棚が指定されました')
      return
    }
    this.libraryBookDao = this.$db.libraryDao.getBookDao(library)
    const book = await this.libraryBookDao.get(this.bookId)
    if (book == null) {
      this.loadFailed('存在しない蔵書が指定されました')
      return
    }
    const bibliography = await this.$db.bibliographyDao.get(book.bibliographyId)
    // 自分自身に代入
    this.library = library
    this.bibliography = bibliography
    this.book = book
    this.libraryBookDao.initWatcher(this.book)
    this.watcher = new DaoLibraryBookHistoryWatcher(this.libraryBookDao)
    this.displayData.カテゴリ = bibliography.category
    this.displayData.著者 = bibliography.author
    this.displayData.出版社 = bibliography.publisher
    this.displayData.発売日 = new Date(bibliography.publishedDateUnix * 1000).toJSON().slice(0, 10)
    this.displayData.ISBN = bibliography.isbn ? String(bibliography.isbn) : '無し'
    this.displayData.書誌メモ = bibliography.note ? bibliography.note : '無し'
    this.displayData.蔵書メモ = book.note ? book.note : '無し'
    // 読み込み完了
    this.isLoading = false
    clearTimeout(this.timer)
  }

  initBookChange () {
    this.isLoading = true
    this.showConfirm = false
    this.showReturnConfirm = false
  }

  endBookChange () {
    this.isLoading = false
  }

  async rentBook () {
    this.initBookChange()
    if (this.book == null || this.libraryBookDao == null || this.library == null || this.bibliography == null) {
      return
    }
    await this.libraryBookDao.borrowBook(this.book)
    await this.$db.userDao!.borrowBook(this.book, this.library, this.bibliography)
    this.book.rentable = false
    this.endBookChange()
  }

  async returnBook () {
    this.initBookChange()
    if (this.book == null || this.libraryBookDao == null || this.library == null || this.bibliography == null) {
      return
    }
    await this.libraryBookDao.returnBook(this.book)
    await this.$db.userDao!.returnBook(this.book, this.library, this.bibliography)
    this.book.rentable = true
    this.endBookChange()
  }
}
</script>
