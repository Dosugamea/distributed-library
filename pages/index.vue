<template>
  <div>
    <section class="hero has-text-centered is-medium" style="background: linear-gradient(30deg, #5c3d31, #734c3a, #8a5b43, #a26c4c, #b97d54, #d18f5c, #e8a264, #ffb56b);">
      <div class="hero-body">
        <p class="title has-text-white">
          Distributed Library
        </p>
        <p class="subtitle has-text-white">
          P2P Integrated Library System Powered by GunDB
        </p>
        <p v-if="!user" class="subtitle">
          <b-button type="is-secondary" size="is-large" @click="openLoginForm = !openLoginForm">
            ログインして 本棚を開く
          </b-button>
        </p>
      </div>
    </section>
    <section class="container mt-5">
      <card
        v-if="user"
        title="Modern"
        icon="account"
      >
        ログイン成功
        {{ user }}
      </card>
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
    <b-modal v-model="openLoginForm">
      <form action="">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">
              ユーザーログイン
            </p>
            <button
              type="button"
              class="delete"
              @click="$emit('close')"
            />
          </header>
          <section class="modal-card-body">
            <b-field label="ユーザー名">
              <b-input
                v-model="username"
                type="text"
                placeholder="Your username"
                required
              />
            </b-field>

            <b-field label="パスワード">
              <b-input
                v-model="password"
                type="password"
                password-reveal
                placeholder="Your password"
                required
              />
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button
              label="ログイン"
              type="is-primary"
              @click="loginUser"
            />
            <b-button
              label="アカウント作成"
              type="is-secondary"
              @click="createUser"
            />
          </footer>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import type { UserState } from '@/types/userState'

@Component({
  layout: 'top'
})
export default class IndexComponent extends Vue {
  auth = false
  name = 'HomePage'
  username = ''
  password = ''
  openLoginForm = false
  isOpen = 0
  user : UserState | null = null
  collapses = [
    {
      title: 'Distributed Library とは?',
      text: 'みんなの本棚をシェアする本のシェアリングコミュニティです。'
    },
    {
      title: 'どうやって使うの?',
      text: '(後で書く)'
    },
    {
      title: 'どうやって本棚をシェアするの?',
      text: '(後で書く)'
    }
  ]

  mounted () {
    this.$db.initDao()
    setTimeout(() => {
      if (this.$db.userDao!.isLoggedIn) {
        this.$db.startupDao()
        this.openLoginForm = false
        this.user = this.$db.userDao!.getSelfProfile()
        this.$auth.loginWith('gun', this.user)
      }
    }, 1500)
  }

  processLoggedIn () {
    this.$db.startupDao()
    this.openLoginForm = false
    this.user = this.$db.userDao!.getSelfProfile()
    this.$auth.loginWith('gun', this.user)
  }

  async loginUser () {
    this.$db.initDao()
    try {
      await this.$db.userDao!.loginUser(this.username, this.password)
      this.processLoggedIn()
    } catch (e) {
      console.error(e)
    }
  }

  async createUser () {
    this.$db.initDao()
    try {
      await this.$db.userDao!.createUser(this.username, this.password)
      await this.$db.userDao!.loginUser(this.username, this.password)
      this.processLoggedIn()
    } catch (e) {
      console.error(e)
    }
  }
}
</script>
