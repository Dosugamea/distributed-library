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
          </div>
        </div>
        <div v-for="(value, key, index) in displayData" :key="index" class="columns is-justify-content-space-between">
          <div class="column is-4">
            <p class="is-size-5">
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
    </div>
    <div v-if="!isLoading" class="mt-3 box columns is-multiline is-mobile has-text-centered">
      <div class="column is-12">
        <p class="my-4 is-size-4">
          所蔵状態
        </p>
        <b-table
          v-if="tables.having.data.length > 0"
          :data="tables.having.data"
          :current-page.sync="tables.having.page"
          :per-page="5"
          :paginated="true"
          :pagination-simple="true"
          :pagination-rounded="false"
          pagination-position="bottom"
          default-sort-direction="asc"
          sort-icon="arrow-up"
          sort-icon-size="is-small"
          default-sort="updatedDateUnix"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
        >
          <b-table-column v-slot="props" field="updatedTimeUnix" label="記録時刻" sortable centered>
            {{ new Date(props.row.updatedTimeUnix).toLocaleDateString() }}
          </b-table-column>

          <b-table-column v-slot="props" field="issuer" label="本棚名" sortable centered>
            {{ props.row.issuer }}
          </b-table-column>

          <b-table-column v-slot="props" field="issuer" label="状態" sortable centered>
            {{ props.row.status }}
          </b-table-column>
        </b-table>
        <p v-else>
          まだ所蔵している本棚はありません
        </p>
      </div>
      <div class="column is-12">
        <p class="my-4 is-size-4">
          貸出/返却履歴
        </p>
        <b-table
          v-if="tables.history.data.length > 0"
          :data="tables.history.data"
          :current-page.sync="tables.history.page"
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

          <b-table-column v-slot="props" field="issuer" label="操作内容" sortable centered>
            {{ props.row.action }}
          </b-table-column>
        </b-table>
        <p v-else>
          まだ履歴はありません
        </p>
      </div>
      <div class="column is-12">
        <p class="my-4 is-size-4">
          レビュー一覧
        </p>
        <b-table
          v-if="tables.review.data.length > 0"
          :data="tables.review.data"
          :current-page.sync="tables.review.page"
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

          <b-table-column v-slot="props" field="issuer" label="操作内容" sortable centered>
            {{ props.row.action }}
          </b-table-column>
        </b-table>
        <p v-else>
          まだレビューはありません
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BibliographyModel } from '@/models/bibliography'

@Component({})
export default class BibliographyPage extends Vue {
  isLoading = true
  bibliographyId = this.$route.params.id
  bibliography: BibliographyModel | null = null
  timer: NodeJS.Timeout | null = null
  displayData: { [key: string]: string } = {}
  tables = {
    having: {
      page: 1,
      data: []
    },
    history: {
      page: 1,
      data: []
    },
    review: {
      page: 1,
      data: []
    }
  }

  loadFailed () {
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

  async mounted () {
    this.timer = setTimeout(() => {
      alert('データ取得がタイムアウトしました')
      this.loadFailed()
    }, 5 * 1000)
    if (this.$db.bibliographyDao == null) {
      this.loadFailed()
      return
    }
    const bibliography = await this.$db.bibliographyDao.get(this.bibliographyId)
    if (bibliography == null) {
      this.loadFailed()
      return
    }
    this.bibliography = bibliography
    this.displayData.カテゴリ = bibliography.category
    this.displayData.著者 = bibliography.author
    this.displayData.出版社 = bibliography.publisher
    this.displayData.発売日 = new Date(bibliography.publishedDateUnix * 1000).toJSON().slice(0, 10)
    this.displayData.ISBN = String(bibliography.isbn)
    this.displayData.メモ = bibliography.note
    this.displayData.総読者数 = String(0)
    this.displayData.総レビュー数 = String(0)
    this.isLoading = false
    clearTimeout(this.timer)
  }
}
</script>
