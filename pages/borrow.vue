<template>
  <section>
    <b-loading
      v-model="isLoading"
      :is-full-page="true"
      :can-cancel="false"
    />
    <p class="title has-text-centered">
      本を借りる
    </p>
    <div class="box mx-2 my-2 has-text-centered">
      <b-field type="" label="本棚の選択" :label-position="labelPosition">
        <b-select
          v-model="targets.library"
          icon="tag"
          :placeholder="libraryPlaceholder"
          :disabled="libraries.length == 0"
          expanded
          required
        >
          <option
            v-for="l in libraries"
            :key="l.id"
            :value="l"
          >
            {{ l.name }}
          </option>
        </b-select>
        <b-button
          type="is-primary"
          icon-left="refresh"
          @click="loadLibraries"
        >
          一覧読み込み
        </b-button>
      </b-field>
      <b-field type="" label="蔵書の選択" :label-position="labelPosition">
        <b-select
          v-model="targets.bibliography"
          icon="tag"
          :placeholder="bookPlaceholder"
          :disabled="filteredBibliographies.length == 0"
          expanded
          required
        >
          <option
            v-for="b in filteredBibliographies"
            :key="b.id"
            :value="b"
          >
            {{ b.name }}
          </option>
        </b-select>
        <b-button
          type="is-primary"
          icon-left="refresh"
          :disabled="targets.library === null"
          @click="loadBibliographies"
        >
          一覧読み込み
        </b-button>
        <b-input
          v-model="searchFilter"
          icon="format-title"
          type="text"
          placeholder="絞り込みワード"
        />
      </b-field>
      <b-button
        label="本を借りる"
        type="is-primary is-large"
        :disabled="targets.library === null || targets.bibliography === null"
        @click="checkBookStatus"
      />
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
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LibraryModel } from '@/models/library'
import { BibliographyModel } from '@/models/bibliography'
import { LibraryBookDao } from '@/dao/libraryBook'

@Component({})
export default class LibraryAddPage extends Vue {
  labelPosition = 'on-border'
  showConfirm = false
  isLoading = false
  libraries: LibraryModel[] = []
  bibliographies: BibliographyModel[] = []
  searchFilter: string = ''
  libraryBookDao: LibraryBookDao | null = null
  targets: {
    library: LibraryModel | null
    bibliography: BibliographyModel | null
  } = {
      library: null,
      bibliography: null
    }

  loadFailed (reason: string) {
    alert(reason)
    this.isLoading = false
  }

  mounted () {
    if (this.$db.libraryDao == null) {
      this.$router.push('/')
    }
  }

  get libraryPlaceholder () {
    if (this.libraries.length === 0) {
      return '本棚一覧を読み込んでください...'
    }
    return '本棚を選択してください...'
  }

  get bookPlaceholder () {
    if (this.targets.library === null) {
      return '本棚を選択してください...'
    }
    if (this.bibliographies.length === 0) {
      return '蔵書一覧を読み込んでください...'
    }
    if (this.targets.bibliography == null) {
      return '蔵書を選択してください...'
    }
    return 'そのワードが含まれる蔵書はありません'
  }

  loadLibraries () {
    if (this.$db.libraryDao == null) {
      return
    }
    this.libraries = this.$db.libraryDao.list()
  }

  @Watch('targets.library')
  watchLibraryChange () {
    if (this.$db.libraryDao == null || this.targets.library == null) {
      return
    }
    this.libraryBookDao = this.$db.libraryDao.getBookDao(this.targets.library)
    this.bibliographies = []
    this.targets.bibliography = null
  }

  loadBibliographies () {
    if (this.libraryBookDao == null) {
      return
    }
    this.bibliographies = this.libraryBookDao.listBookAsBibliography()
    if (this.bibliographies.length !== 0) {
      this.targets.bibliography = this.bibliographies[0]
    } else {
      this.$buefy.snackbar.open({
        message: 'この本棚には蔵書が登録されていません',
        type: 'is-warning'
      })
    }
  }

  get filteredBibliographies () {
    if (this.bibliographies.length === 0) {
      return []
    }
    if (this.searchFilter === '') {
      return this.bibliographies
    }
    return this.bibliographies.filter((b) => {
      return b.name.includes(this.searchFilter)
    })
  }

  checkBookStatus () {
    if (this.libraryBookDao == null || this.targets.library == null || this.targets.bibliography == null) {
      return
    }
    const book = this.libraryBookDao.findBookByBibliographyId(this.targets.bibliography.id)
    if (book == null) {
      alert('不正な蔵書データが指定されました')
      return
    }
    if (book.rentable === false) {
      alert('指定された蔵書は貸出中です')
      return
    }
    this.showConfirm = true
  }

  get libraryName () {
    return this.targets.library === null ? '' : this.targets.library.name
  }

  get bibliographyName () {
    return this.targets.bibliography === null ? '' : this.targets.bibliography.name
  }

  async rentBook () {
    if (this.libraryBookDao == null || this.targets.library == null || this.targets.bibliography == null) {
      return
    }
    this.isLoading = true
    const book = this.libraryBookDao.findBookByBibliographyId(this.targets.bibliography.id)
    if (book == null) {
      this.loadFailed('不正な蔵書データが指定されました')
      return
    }
    if (book.rentable === false) {
      this.loadFailed('蔵書は貸出中です')
      return
    }
    await this.libraryBookDao.borrowBook(book)
    await this.$db.userDao!.borrowBook(book, this.targets.library, this.targets.bibliography)
    this.isLoading = false
    alert(`${this.libraryName}から${this.bibliographyName}を借りました`)
    this.$router.back()
  }
}
</script>
