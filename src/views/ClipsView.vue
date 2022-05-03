<script setup lang="ts">
import ClipsList from "@/components/ClipsList.vue";
</script>

<template>
  <h3>Clips</h3>
  <div class="clips">
    <ClipsList />
  </div>
</template>

<style>
.clips {
  display: flex;
  flex-direction: column;
}
</style>
