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
          v-if="historyData != null"
          :data="historyData"
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
          <b-table-column v-slot="props" field="createdTimeUnix" label="記録時刻" sortable centered>
            {{ new Date(props.row.createdTimeUnix).toLocaleDateString() }}
          </b-table-column>

          <b-table-column v-slot="props" field="issuer" label="ユーザー名" sortable centered>
            {{ props.row.issuer }}
          </b-table-column>

          <b-table-column v-slot="props" field="action" label="操作内容" sortable centered>
            {{ props.row.action }}
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BibliographyModel } from '@/models/bibliography'
import { LibraryBookModel, LibraryModel } from '@/models/library'
import { LibraryBookDao } from '@/dao/libraryBook'
import { LogModel } from '@/models/base'

@Component({})
export default class BibliographyPage extends Vue {
  isLoading = true
  showConfirm = false
  timer: NodeJS.Timeout | null = null
  libraryId = this.$route.params.id
  bookId = this.$route.params.bookId
  library: LibraryModel | null = null
  bibliography: BibliographyModel | null = null
  book: LibraryBookModel | null = null
  libraryBookDao: LibraryBookDao | null = null
  historyData: LogModel | null = null
  historyPage: number = 1

  loadFailed (reason: string) {
    alert(reason)
    if (this.timer != null) {
      clearTimeout(this.timer)
    }
    this.isLoading = false
    this.$router.back()
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
    // 読み込み完了
    this.isLoading = false
    clearTimeout(this.timer)
  }

  async rentBook () {
    this.isLoading = true
    this.showConfirm = false
    if (this.book == null || this.libraryBookDao == null) {
      return
    }
    await this.libraryBookDao.rent(this.book)
    this.book.rentable = false
    this.isLoading = false
  }
}
</script>
