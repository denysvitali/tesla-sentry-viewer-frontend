<script setup lang="ts">
import ClipsList from "@/components/ClipsList.vue";
</script>

<template>
  <div class="clips-view container">
    <header class="page-header">
      <h1 class="page-title">Sentry Clips</h1>
      <p class="page-subtitle">Browse your Tesla Sentry Mode recordings</p>
    </header>
    
    <ClipsList />
  </div>
</template>

<style lang="scss" scoped>
.clips-view {
  animation: fadeIn var(--transition-base) ease-out;
}

.page-header {
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  margin-bottom: var(--spacing-sm);
}

.page-subtitle {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
