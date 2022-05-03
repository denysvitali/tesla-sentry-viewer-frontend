<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/clips">Clips</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style lang="scss">
@import '@/assets/base.css';

#app {
  font-weight: normal;
}

header {
  margin-top: 1em;
  margin-bottom: 1em;
  nav {
    display: flex;
    width: 100%;
    flex-direction: row;
    column-gap: 2rem;
    justify-content: center;
    width: 100%;
    font-size: 1.2em;
  }
}
</style>
