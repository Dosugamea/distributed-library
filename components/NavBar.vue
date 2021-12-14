<template>
  <b-navbar class="px-4" wrapper-class="container">
    <template #brand>
      <b-navbar-item class="has-text-weight-bold" tag="router-link" :to="{ path: '/' }">
        {{ $config.SITE_NAME }}
      </b-navbar-item>
    </template>
    <template v-if="isLoggedIn" #start>
      <b-navbar-item tag="router-link" to="/borrow">
        本の貸出
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="/return">
        本の返却
      </b-navbar-item>
    </template>
    <template v-if="isLoggedIn" #end>
      <b-navbar-item tag="router-link" to="/home">
        <b-button>
          {{ username }}
        </b-button>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class NavBarComponent extends Vue {
  get isLoggedIn () {
    return this.$auth.loggedIn
  }

  get username () {
    if (this.$auth.user === null) {
      return ''
    }
    return this.$auth.user.name
  }
}
</script>
