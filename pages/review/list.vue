<template>
  <ElementList
    title="レビュー一覧"
    icon="star"
    :elements="elements"
  >
    <template #card="slotProps">
      <card
        :title="slotProps.element.id"
        icon="star"
      >
        {{ slotProps.element.name }}
      </card>
    </template>
  </ElementList>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ElementList from '~/components/ElementList.vue'
import { ReviewModel } from '~/models/review'
import { DaoWatcher, DaoWatcherState } from '~/dao/watcher'

@Component({
  components: {
    ElementList
  }
})
export default class ReviewListComponent extends Vue {
  daoWatcher: DaoWatcher<ReviewModel> | null = null

  mounted () {
    if (this.$db.reviewDao != null) {
      this.daoWatcher = new DaoWatcher<ReviewModel>(this.$db.reviewDao)
    }
  }

  beforeDestroy () {
    if (this.daoWatcher != null) {
      this.daoWatcher.destroy()
    }
  }

  get elements () {
    return DaoWatcherState.elements
  }
}
</script>
