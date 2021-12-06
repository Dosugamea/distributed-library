<template>
  <section>
    <p class="title has-text-centered">
      新規本棚の追加
    </p>
    <form class="box mx-2 my-2 has-text-centered" @submit="onSubmit" @submit.prevent>
      <b-field label="タイトル" :label-position="labelPosition">
        <b-input
          v-model="model.name"
          icon="format-title"
          type="text"
          placeholder="お窓のおうち"
          required
        />
      </b-field>
      <b-field label="キャプション" :label-position="labelPosition">
        <b-input
          v-model="model.note"
          icon="comment"
          type="text"
          placeholder="可愛い系の漫画保存してます"
          minlength="0"
          maxlength="300"
          required
        />
      </b-field>
      <input type="submit" class="button is-primary is-large" value="本棚を追加する">
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { LibraryType } from '@/types/library'

@Component({})
export default class LibraryAddPage extends Vue {
  model: LibraryType = {
    id: '',
    name: '',
    createdDateUnix: 0,
    updatedDateUnix: 0,
    histories: {},
    note: '',
    isDeleted: false,
    owner: '',
    admins: {},
    books: {}
  }

  publishDate: string = new Date().toJSON().slice(0, 10)
  labelPosition = 'on-border'

  async onSubmit () {
    const titleMatched = this.$db.libraryDao!.find(
      m => m.name.startsWith(this.model.name)
    )
    if (titleMatched.length > 0) {
      this.$buefy.snackbar.open({
        message: '既に登録されている本棚です(よく似た本棚が存在します)',
        type: 'is-danger'
      })
      return
    }
    const newModel = this.$db.libraryDao!.createModel(
      this.model.name,
      this.model.note,
      this.$db.userDao!.userId
    )
    await this.$db.libraryDao!.add(newModel)
    this.$buefy.snackbar.open({
      message: '登録に成功しました',
      type: 'is-success'
    })
    this.$router.push('/library/list')
  }
}
</script>
