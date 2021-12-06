<template>
  <b-navbar class="px-4" wrapper-class="container">
    <template #brand>
      <b-navbar-item class="has-text-weight-bold" tag="router-link" :to="{ path: '/' }">
        {{ $config.SITE_NAME }}
      </b-navbar-item>
    </template>
    <template v-if="$auth.loggedIn" #start>
      <b-navbar-item href="#">
        本の貸出
      </b-navbar-item>
      <b-navbar-item href="#">
        本の返却
      </b-navbar-item>
    </template>
    <template v-if="$auth.loggedIn" #end>
      <b-navbar-item tag="router-link" to="/home">
        <b-button>
          {{ $auth.user.name }}
        </b-button>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
