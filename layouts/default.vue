<template>
  <div>
    <header>
      <NavBar />
    </header>
    <main :class="{section: $auth.loggedIn, columns: $auth.loggedIn, 'is-centered': $auth.loggedIn}">
      <Nuxt :class="{'column is-8-desktop is-8-widescreen': $auth.loggedIn}" />
    </main>
  </div>
</template>
