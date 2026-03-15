<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables'
import { TEXT } from '@/constants/text'
import Navigation from './Navigation.vue'

const route = useRoute()
const router = useRouter()
const currentPath = computed(() => route.path)

const { isAuthenticated, signOut } = useAuth()

const handleSignOut = () => {
  signOut()
  router.push('/signin')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header data-testid="layout-header" class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4">
        <div class="flex-1">
          <Navigation :current-path="currentPath" />
        </div>
        <button
          v-if="isAuthenticated"
          data-testid="sign-out-button"
          type="button"
          class="ml-4 inline-flex items-center border border-gray-200 rounded px-3 py-2 text-sm font-medium text-gray-600 transition duration-150 ease-in-out hover:border-primary hover:text-gray-900 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          @click="handleSignOut"
        >
          {{ TEXT.auth.signOutButton }}
        </button>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-6">
      <div data-testid="layout-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>
