<template>
  <div>
    <header>
      <NavBarUser />
    </header>
    <main class="main-content columns">
      <div class="container column is-10">
        <Nuxt />
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
