<template>
  <nuxt-link :to="to">
    <card
      :title="title"
      :icon="icon"
    >
      <small>{{ subtitle }}</small>
    </card>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HomeCardComponent extends Vue {
  @Prop({ type: String, required: true })
    title!: string

  @Prop({ type: String, required: true })
    subtitle!: string

  @Prop({ type: String, required: true })
    to!: string

  @Prop({ type: String, required: true })
    icon!: string
}
</script>
