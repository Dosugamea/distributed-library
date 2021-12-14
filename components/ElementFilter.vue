<template>
  <div class="box">
    <div class="columns is-vcentered is-mobile is-justify-content-space-around">
      <div class="is-2">
        <b-icon
          :icon="icon"
          size="is-large"
        />
      </div>
      <div class="is-4">
        <p class="title">
          {{ title }}
        </p>
      </div>
      <div class="is-4">
        <p class="is-size-6">
          ヒット数: {{ hits }}
        </p>
      </div>
    </div>
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <input v-model="queryInternal" class="input" type="text" placeholder="検索ワード">
        <select v-model="sortInternal" class="input">
          <option value="date" selected>
            登録が新しい順
          </option>
          <option value="title">
            名称順(A→Z)
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component({})
export default class ElementFilterComponent extends Vue {
  @Prop({ type: String, required: true })
    title!: string

  @Prop({ type: String, required: true })
    icon!: string

  @Prop({ type: Number, required: true })
    hits!: number

  @PropSync('query', { type: String })
    queryInternal!: string

  @PropSync('sort', { type: String })
    sortInternal!: string
}
</script>
