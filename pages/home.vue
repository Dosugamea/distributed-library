<template>
  <div>
    <div class="box mx-3">
      <div class="columns has-text-centered">
        <div class="column is-4-desktop">
          <p class="is-size-4">
            {{ $auth.user.name }}
          </p>
        </div>
        <div class="column is-4-desktop">
          <p>レビュー数: {{ $auth.user.reviewCount }}</p>
          <p>借りた冊数: {{ $auth.user.borrowCount }}</p>
          <p>返した冊数: {{ $auth.user.returnCount }}</p>
        </div>
        <div class="column is-4-desktop">
          <p>
            連合内の本棚数: {{ counts.libraries }}
          </p>
          <p>
            連合内の蔵書数: {{ counts.bibliographies }}
          </p>
        </div>
      </div>
    </div>
    <div class="columns is-multiline is-mobile">
      <div
        v-for="card in cards_list"
        :key="card.title"
        class="column is-3-desktop is-6-touch"
      >
        <HomeCard
          :title="card.title"
          :subtitle="card.subtitle"
          :icon="card.icon"
          :to="card.to"
        />
      </div>
      <div
        v-for="card in cards_add"
        :key="card.title"
        class="column is-6-desktop is-12-touch"
      >
        <HomeCard
          :title="card.title"
          :subtitle="card.subtitle"
          :icon="card.icon"
          :to="card.to"
        />
      </div>
      <div
        class="column is-12"
        @click="logout"
      >
        <card
          title="ログアウトする"
          icon="logout"
        >
          現在のアカウントからログアウトします
        </card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class IndexComponent extends Vue {
  name = 'HomePage'
  timer : NodeJS.Timer | null = null
  counts = {
    libraries: 0,
    bibliographies: 0
  }

  cards_list = [
    {
      title: '本棚 一覧',
      subtitle: '連合に登録された本棚 全てを一覧表示します',
      icon: 'bookshelf',
      to: '/library/list'
    },
    {
      title: '蔵書 一覧',
      subtitle: '連合に登録された蔵書 全てを一覧表示します',
      icon: 'book',
      to: '/bibliography/list'
    },
    {
      title: '貸し出し履歴 一覧',
      subtitle: '連合に登録された貸出履歴 全てを一覧表示します',
      icon: 'history',
      to: '/borrow/list'
    },
    {
      title: 'レビュー 一覧',
      subtitle: '連合に登録されたレビュー 全てを一覧表示します',
      icon: 'star',
      to: '/review/list'
    }
  ]

  cards_add = [
    {
      title: '本棚 登録',
      subtitle: '連合に 新しい本棚を追加します',
      icon: 'bookshelf',
      to: '/library/add'
    },
    {
      title: '書誌 登録',
      subtitle: '連合に 書誌を追加します',
      icon: 'book',
      to: '/bibliography/add'
    }
  ]

  mounted () {
    this.timer = setInterval(() => {
      if (!this.$db) { return }
      if (!this.$db.libraryDao || !this.$db.bibliographyDao) { return }
      this.counts.bibliographies = this.$db.bibliographyDao.count()
      this.counts.libraries = this.$db.libraryDao.count()
    }, 500)
  }

  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  logout () {
    localStorage.clear()
    sessionStorage.clear()
    document.cookie = 'name=; expires=0'
    this.$db.userDao!.logout()
    location.reload()
  }
}
</script>
