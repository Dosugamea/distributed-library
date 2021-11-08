<template>
  <section class="section">
    <div class="columns is-mobile">
      <card
        title="Free"
        icon="github"
      >
        Open source on <a href="https://github.com/buefy/buefy">
          GitHub
        </a>
      </card>

      <card
        title="Responsive"
        icon="cellphone-link"
      >
        <b class="has-text-grey">
          Every
        </b> component is responsive
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
      </card>

      <card
        title="Lightweight"
        icon="arrange-bring-to-front"
      >
        No other internal dependency
      </card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class IndexComponent extends Vue {
  name = 'HomePage'

  async mounted () {
    // const user = this.$db.user().recall({ sessionStorage: true })
    const newModel = this.$bibliographyDao.createModel(
      '名前',
      '説明文',
      '画像URL',
      'カテゴリ名',
      '筆者',
      '出版社'
    )
    console.log(newModel)
    console.log('追加中')
    await this.$bibliographyDao.add(newModel)
    console.log('追加完了')

    console.log('登録済みのモデル数取得')
    const bibliographyCount = await this.$bibliographyDao.count()
    console.log('取得完了:', bibliographyCount)
  }
}
</script>
