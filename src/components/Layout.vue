<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from './Navigation.vue'

const route = useRoute()
const currentPath = computed(() => route.path)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header data-testid="layout-header" class="border-b border-gray-200 bg-white">
      <Navigation :current-path="currentPath" />
    </header>
    <main class="mx-auto max-w-screen-lg px-4 py-6">
      <div data-testid="layout-content">
        <router-view />
      </div>
    </main>
  </div>
</template>
