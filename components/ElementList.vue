<template>
  <div>
    <ElementFilter
      :title="title"
      :icon="icon"
      :hits="searchResult.length"
      :query.sync="searchQuery"
      :sort.sync="searchSort"
    />
    <div class="columns is-multiline">
      <div v-for="element in pageResult" :key="element.id">
        <slot :element="element" name="card" />
      </div>
      <div class="column is-12">
        <b-pagination
          v-model="currentPage"
          :per-page="perPage"
          :total="searchResult.length"
          range-before="3"
          range-after="3"
          order="is-centered"
          size="is-medium"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ContentType } from '~/types/base/content'

@Component({})
export default class ElementListComponent extends Vue {
  @Prop({ type: String, required: true })
    title!: string

  @Prop({ type: String, required: true })
    icon!: string

  @Prop({ type: Array, required: true })
    elements!: Array<ContentType>

  searchQuery: string = ''
  searchSort: string = 'date'
  currentPage: number = 1
  perPage: number = 10

  get searchResult () {
    return this.elements.filter(element => element.name.includes(this.searchQuery)).sort((a, b) => {
      if (this.searchSort === 'date') {
        return a.updatedDateUnix - b.updatedDateUnix
      } else {
        return a.name.localeCompare(b.name)
      }
    })
  }

  get pageResult () {
    return this.searchResult.slice(
      (this.currentPage - 1) * this.perPage,
      this.currentPage * this.perPage
    )
  }
}
</script>
