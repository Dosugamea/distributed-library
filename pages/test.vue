<template>
  <section class="section">
    <div class="columns is-multiline">
      <card
        title="Free"
        icon="github"
      >
        Now db has {{ bibliographyCount }}
      </card>

      <card
        title="Responsive"
        icon="cellphone-link"
      >
        <b class="has-text-grey">
          Every
        </b> component is responsive
        <button type="button" class="btn btn-primary" @click="addBtn">
          Click here to add!
        </button>
      </card>

      <card
        title="Modern"
        icon="alert-decagram"
      >
        Built with <a href="https://vuejs.org/">
          Vue.js
        </a> and <a href="http://bulma.io/">
          Bulma
        </a>
        <button type="button" class="btn btn-primary" @click="deleteBtn">
          Click here to delete!
        </button>
      </card>

      <card
        title="Lightweight"
        icon="arrange-bring-to-front"
      >
        <button type="button" class="btn btn-primary" @click="recall">
          Click here to run db!
        </button>
      </card>

      <div v-for="bibliography in bibliographies" :key="bibliography.id">
        <card
          :title="bibliography.id"
          icon="cellphone-link"
        >
          {{ bibliography.name }}
        </card>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { BibliographyModel } from '~/models/bibliography'

@Component({})
export default class IndexComponent extends Vue {
  name = 'HomePage'
  bibliographies: BibliographyModel[] = []

  get bibliographyCount () {
    return this.bibliographies.length
  }

  async recall () {
    this.$db.initDao()
    await this.$db.userDao!.loginUser('dosugamea', 'thisistestaccount')
    this.$db.startupDao()
    setInterval(() => {
      if (this.$db.bibliographyDao != null) {
        this.bibliographies = this.$db!.bibliographyDao.list()
      }
    }, 100)
  }

  async addBtn () {
    console.log('Adding')
    if (this.$db.bibliographyDao == null) {
      return
    }
    const bibliography = this.$db.bibliographyDao.createModel(
      'ごちうさ',
      '新刊待ち',
      'https://example.com',
      '漫画',
      'Koi',
      '芳文社',
      this.$db.bibliographyDao.getCurrentUnixTime(),
      '1'
    )
    await this.$db.bibliographyDao.add(bibliography)
    console.log('Added!')
  }

  async deleteBtn () {
    console.log('Deleting')
    if (this.$db.bibliographyDao == null) {
      return
    }
    const bibliographies = this.$db.bibliographyDao.list()
    console.log('一覧取得完了:', bibliographies)
    for (const bibliography of bibliographies) {
      try {
        await this.$db.bibliographyDao.remove(bibliography)
      } catch (err) {
        console.log(err)
      }
    }
    console.log('Deleted!')
  }
}
</script>
