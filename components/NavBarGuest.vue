<template>
  <b-navbar class="px-4" wrapper-class="container">
    <template #brand>
      <b-navbar-item class="has-text-weight-bold" tag="router-link" :to="{ path: '/' }">
        Distributed Library
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item href="#">
        <b-button>
          ログイン
        </b-button>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
