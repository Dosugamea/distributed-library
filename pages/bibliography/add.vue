<template>
  <section>
    <CodeReader
      :active="isModalOpen"
      @cancel="isModalOpen = false"
      @success="model.isbn = $event.code"
    />
    <p class="title has-text-centered">
      新規書誌情報の追加
    </p>
    <form class="box mx-2 my-2 has-text-centered" @submit="onSubmit" @submit.prevent>
      <b-field label="ISBN(省略可能)" :label-position="labelPosition">
        <div class="field has-addons">
          <div class="control is-expanded">
            <b-input
              v-model="model.isbn"
              placeholder="9784832273337"
              icon="barcode"
              type="number"
              min="1000000000"
              max="9999999999999"
            />
          </div>
          <div class="control">
            <b-button type="is-info" @click="callOpenBD">
              自動取得
            </b-button>
          </div>
        </div>
      </b-field>
      <b-field label="タイトル" :label-position="labelPosition">
        <b-input
          v-model="model.name"
          icon="format-title"
          type="text"
          placeholder="ご注文はうさぎですか? 10巻"
          required
        />
      </b-field>
      <b-field label="著者" :label-position="labelPosition">
        <b-input
          v-model="model.author"
          icon="fountain-pen-tip"
          type="text"
          minlength="1"
          maxlength="50"
          placeholder="Koi"
          required
        />
      </b-field>
      <b-field label="出版社" :label-position="labelPosition">
        <b-input
          v-model="model.publisher"
          icon="domain"
          type="text"
          minlength="1"
          maxlength="50"
          placeholder="芳文社"
          required
        />
      </b-field>
      <b-field label="発売日" :label-position="labelPosition">
        <b-input
          v-model="publishDate"
          icon="calendar"
          type="date"
          min="1970-01-01"
          max="2038-01-19"
        />
      </b-field>
      <b-field label="カテゴリ" :label-position="labelPosition">
        <b-select v-model="model.category" icon="tag" placeholder="カテゴリを選択..." expanded required>
          <option value="漫画">
            漫画
          </option>
          <option value="ライトノベル">
            ライトノベル
          </option>
          <option value="実用書">
            実用書
          </option>
          <option value="技術書">
            技術書
          </option>
          <option value="同人誌">
            同人誌
          </option>
          <option value="その他">
            その他
          </option>
        </b-select>
      </b-field>
      <b-field label="表紙画像URL(任意)" :label-position="labelPosition">
        <b-input
          v-model="model.image"
          icon="image"
          type="url"
          placeholder="https://images-na.ssl-images-amazon.com/images/I/71CpkziHeSL.jpg"
          pattern="https://.*"
        />
      </b-field>
      <b-field label="補足情報(任意)" :label-position="labelPosition">
        <b-input
          v-model="model.note"
          icon="comment"
          type="text"
          placeholder="可愛い系の漫画"
          minlength="0"
          maxlength="300"
        />
      </b-field>
      <input type="submit" class="button is-primary is-large" value="書誌情報を追加する">
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BibliographyType } from '@/types/bibliography'

@Component({})
export default class BibliographyAddPage extends Vue {
  model: BibliographyType = {
    id: '',
    name: '',
    isbn: '',
    createdDateUnix: 0,
    updatedDateUnix: 0,
    histories: {},
    note: '',
    isDeleted: false,
    image: '',
    category: '漫画',
    author: '',
    publisher: '',
    publishedDateUnix: 0,
    // @ts-ignore
    reviews: {},
    // @ts-ignore
    libraries: {}
  }

  publishDate: string = new Date().toJSON().slice(0, 10)
  labelPosition = 'on-border'
  isModalOpen: boolean = false

  async onSubmit () {
    this.model.publishedDateUnix = Date.parse(this.publishDate) / 1000
    if (this.model.isbn === undefined) {
      this.model.isbn = ''
    }
    const isbnMatched = this.$db.bibliographyDao!.find(
      m => m.isbn === this.model.isbn
    )
    const titleMatched = this.$db.bibliographyDao!.find(
      m => m.name === this.model.name
    )
    if (isbnMatched.length > 0 || titleMatched.length > 0) {
      this.$buefy.snackbar.open({
        message: '既に登録されている書誌です(ISBNまたはタイトルが重複しています)',
        type: 'is-danger'
      })
      return
    }
    const newModel = this.$db.bibliographyDao!.createModel(
      this.model.name,
      this.model.note,
      this.model.image,
      this.model.category,
      this.model.author,
      this.model.publisher,
      this.model.publishedDateUnix,
      this.model.isbn
    )
    await this.$db.bibliographyDao!.add(newModel)
    this.$buefy.snackbar.open({
      message: '登録に成功しました',
      type: 'is-success'
    })
    this.$router.push('/bibliography/list')
  }

  openModal () {
    this.isModalOpen = true
  }

  async callOpenBD () {
    const resp = await this.$axios.get(
      `https://api.openbd.jp/v1/get?isbn=${this.model.isbn}`
    )
    if (resp.data[0] != null) {
      const summary = resp.data[0].summary
      this.model.name = summary.title
      this.model.author = summary.author
      this.model.publisher = summary.publisher
      if (summary.cover !== undefined) {
        this.model.image = summary.cover
      }
    }
  }
}
</script>
