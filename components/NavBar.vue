<template>
  <b-navbar class="px-4" wrapper-class="container">
    <template #brand>
      <b-navbar-item class="has-text-weight-bold" tag="router-link" :to="{ path: '/' }">
        {{ $config.SITE_NAME }}
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item href="#">
        本の貸出
      </b-navbar-item>
      <b-navbar-item href="#">
        本の返却
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item href="#">
        <b-button>
          ユーザー名
        </b-button>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
