<template>
  <div>
    <header>
      <NavBarUser />
    </header>
    <main class="section">
      <div class="columns is-centered">
        <div class="column is-10-desktop">
          <Nuxt />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        }
      ]
    }
  }
}
</script>
