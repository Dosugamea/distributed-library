<template>
  <section>
    <b-loading
      v-model="isLoading"
      :is-full-page="true"
      :can-cancel="false"
    />
    <p class="title has-text-centered">
      本を返す
    </p>
    <div class="box mx-2 my-2 has-text-centered">
      <b-field type="" label="返却する本の選択" :label-position="labelPosition">
        <b-select
          v-model="target"
          icon="tag"
          placeholder="返却する本を選択してください..."
          :disabled="books.length == 0"
          expanded
          required
        >
          <option
            v-for="b in books"
            :key="b.id"
            :value="b"
          >
            {{ b.bibliography.name }}
          </option>
        </b-select>
      </b-field>
      <div v-if="target != null" class="mb-3">
        <div v-for="(value, key, index) in displayData" :key="index" class="columns is-justify-content-space-between">
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
      </div>
      <b-button
        label="本を返す"
        type="is-primary is-large"
        :disabled="target === null"
        @click="showReturnConfirm = true"
      />
    </div>
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
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { LibraryBookDao } from '~/dao/libraryBook'
import { LogModel } from '~/models/base'
import { BibliographyModel } from '~/models/bibliography'
import { LibraryModel } from '~/models/library'

type BaseSimple = {
  id: string
  name: string
}

type SimpleBibliography = BaseSimple
type SimpleLibrary = BaseSimple

type SimpleLog = {
  id: string
  createdDateUnix: number
  bibliography: SimpleBibliography
  library: SimpleLibrary
}

@Component({})
export default class LibraryAddPage extends Vue {
  labelPosition = 'on-border'
  showReturnConfirm = false
  isLoading = true
  target: SimpleLog | null = null
  displayData: { [key: string]: string } = {}
  books: SimpleLog[] = []
  searchFilter: string = ''
  bibliography: BibliographyModel | null = null
  library: LibraryModel | null = null
  libraryBookDao: LibraryBookDao | null = null

  loadFailed (reason: string) {
    alert(reason)
    this.isLoading = false
  }

  mounted () {
    if (this.$db.libraryDao == null || this.$db.userDao == null) {
      this.$router.push('/')
    }
    const histories = this.$db.userDao!.borrowOrReturn().sort(
      (a, b) => b.createdDateUnix - a.createdDateUnix
    )
    const kv : { [key: string]: LogModel[] } = {}
    for (const h of histories) {
      if (!(h.target in kv)) {
        kv[h.target] = []
      }
      kv[h.target].push(h)
    }
    for (const k in kv) {
      if (kv[k][0].action === 'return') {
        delete kv[k]
      }
    }
    const books : SimpleLog[] = []
    for (const k in kv) {
      const values = String(kv[k][0].value).split('-')
      books.push({
        id: k,
        createdDateUnix: kv[k][0].createdDateUnix,
        bibliography: {
          id: values[3],
          name: values[4]
        },
        library: {
          id: values[1],
          name: values[2]
        }
      })
    }
    this.books = books
    this.isLoading = false
  }

  @Watch('target')
  async watchLibraryChange (newValue: SimpleLog) {
    this.displayData.本棚 = newValue.library.name
    this.displayData.書名 = newValue.bibliography.name
    this.displayData.日付 = new Date(newValue.createdDateUnix * 1000).toJSON().slice(0, 10)
    if (this.target == null || this.$db.libraryDao == null || this.$db.bibliographyDao == null) {
      this.loadFailed('不正な蔵書データが指定されました')
      return
    }
    this.bibliography = await this.$db.bibliographyDao.get(this.target.bibliography.id)
    this.library = await this.$db.libraryDao.get(this.target.library.id)
    this.libraryBookDao = this.$db.libraryDao.getBookDao(this.library)
  }

  get filteredBooks () {
    if (this.books.length === 0) {
      return []
    }
    if (this.searchFilter === '') {
      return this.books
    }
    return this.books.filter((b) => {
      return b.bibliography.name.includes(this.searchFilter)
    })
  }

  get libraryName () {
    return this.target === null ? '' : this.target.library.name
  }

  get bibliographyName () {
    return this.target === null ? '' : this.target.bibliography.name
  }

  async returnBook () {
    if (
      this.target == null || this.$db.libraryDao == null ||
      this.$db.bibliographyDao == null || this.libraryBookDao == null ||
      this.library == null || this.bibliography == null
    ) {
      this.loadFailed('不正な蔵書データが指定されました')
      return
    }
    const book = await this.libraryBookDao.get(this.target.id)
    await this.libraryBookDao.returnBook(book)
    await this.$db.userDao!.returnBook(book, this.library, this.bibliography)
    this.$buefy.snackbar.open({
      message: '返却に成功しました',
      type: 'is-success'
    })
    this.$router.push('/home')
  }
}
</script>
