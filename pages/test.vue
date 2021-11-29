<template>
  <section class="section">
    <div class="columns is-multiline">
      <card
        title="Free"
        icon="github"
      >
        Now db has {{ bibliographyCount }}
      </card>

      <card
        title="Responsive"
        icon="cellphone-link"
      >
        <b class="has-text-grey">
          Every
        </b> component is responsive
        <button type="button" class="btn btn-primary" @click="addBtn">
          Click here to add!
        </button>
      </card>

      <card
        title="Modern"
        icon="alert-decagram"
      >
        Built with <a href="https://vuejs.org/">
          Vue.js
        </a> and <a href="http://bulma.io/">
          Bulma
        </a>
        <button type="button" class="btn btn-primary" @click="deleteBtn">
          Click here to delete!
        </button>
      </card>

      <card
        title="Lightweight"
        icon="arrange-bring-to-front"
      >
        <button type="button" class="btn btn-primary" @click="recall">
          Click here to run db!
        </button>
      </card>

      <div v-for="bibliography in bibliographies" :key="bibliography.id">
        <card
          :title="bibliography.id"
          icon="cellphone-link"
        >
          {{ bibliography.name }}
        </card>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BibliographyModel } from '~/models/bibliography'

@Component({})
export default class IndexComponent extends Vue {
  name = 'HomePage'
  bibliographies: BibliographyModel[] = []

  get bibliographyCount () {
    return this.bibliographies.length
  }

  async recall () {
    this.$db.initDao()
    await this.$db.userDao!.loginUser('omado333', 'omadosandesuyo')
    this.$db.startupDao()
    // 初期化が終わってストリーミングデータが貯まるまで待つ (ものすごく大雑把)
    setTimeout(async () => {
      // 本棚一覧から本棚情報の取得 TODO: この段階でもまだlibraryが無い可能性がある
      const library = this.$db.libraryDao!.list()[0]
      // 本棚内の本一覧の操作DAO生成
      const libraryBookDao = this.$db.libraryDao!.getBookDao(library)
      // 蔵書一覧から蔵書情報の取得
      const bibliography = this.$db.bibliographyDao!.list()[0]
      // 本棚内の本情報の作成
      const book = await libraryBookDao.createModel(bibliography, 'test')
      // 本棚内に本情報を登録
      await libraryBookDao.add(book)
      // すると挿入されない(resolveが発火せず進まなくなるので)この理由を調査中
      setTimeout(() => {
        console.log(libraryBookDao.list())
      }, 1500)
    }, 5000)
    setInterval(() => {
      if (this.$db.bibliographyDao != null) {
        this.bibliographies = this.$db!.bibliographyDao.list()
      }
    }, 100)
  }

  async addBtn () {
    console.log('Adding')
    if (this.$db.bibliographyDao == null) {
      return
    }
    const bibliography = this.$db.bibliographyDao.createModel(
      'ごちうさ',
      '新刊待ち',
      'https://example.com',
      '漫画',
      'Koi',
      '芳文社',
      this.$db.bibliographyDao.getCurrentUnixTime(),
      '1'
    )
    await this.$db.bibliographyDao.add(bibliography)
    console.log('Added!')
  }

  async deleteBtn () {
    console.log('Deleting')
    if (this.$db.bibliographyDao == null) {
      return
    }
    const bibliographies = this.$db.bibliographyDao.list()
    console.log('一覧取得完了:', bibliographies)
    for (const bibliography of bibliographies) {
      try {
        await this.$db.bibliographyDao.remove(bibliography)
      } catch (err) {
        console.log(err)
      }
    }
    console.log('Deleted!')
  }
}
</script>
