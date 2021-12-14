<template>
  <div>
    <header>
      <NavBar />
    </header>
    <main :class="{'section': isLoggedIn}">
      <div :class="{columns: isLoggedIn, 'is-centered': isLoggedIn}">
        <Nuxt :class="{'column is-8-desktop is-8-widescreen': isLoggedIn}" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class DefaultLayoutComponent extends Vue {
  get isLoggedIn () {
    return this.$auth.loggedIn
  }
}
</script>
