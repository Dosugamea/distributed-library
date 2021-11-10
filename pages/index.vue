<template>
  <div>
    <section class="hero has-text-centered is-medium has-background-cocoa">
      <div class="hero-body">
        <p class="title">
          Distributed Library
        </p>
        <p class="subtitle">
          P2P Integrated Library System Powered by GunDB
        </p>
        <p class="subtitle">
          <b-button type="is-primary">
            ログインして 本棚を開く
          </b-button>
        </p>
      </div>
    </section>
    <section class="container mt-5">
      <b-collapse
        v-for="(collapse, index) of collapses"
        :key="index"
        class="card"
        animation="slide"
        :open="isOpen == index"
        @open="isOpen = index"
      >
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
          >
            <p class="card-header-title">
              {{ collapse.title }}
            </p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
            </a>
          </div>
        </template>
        <div class="card-content">
          <div class="content">
            {{ collapse.text }}
          </div>
        </div>
      </b-collapse>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'top'
})
export default class IndexComponent extends Vue {
  name = 'HomePage'
  isOpen = 0
  collapses = [
    {
      title: 'Title 1',
      text: 'Text 1'
    },
    {
      title: 'Title 2',
      text: 'Text 2'
    },
    {
      title: 'Title 3',
      text: 'Text 3'
    }
  ]
}
</script>
