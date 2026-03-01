<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { TEXT } from '@/constants/text'

interface NavigationProps {
  currentPath: string
}

const props = defineProps<NavigationProps>()

// 現在のパスがアクティブかどうかを判定
const isActive = (path: string) => {
  return props.currentPath === path
}
</script>

<template>
  <nav data-testid="navigation" class="border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-screen-lg px-4">
      <div class="flex space-x-8">
        <!-- 楽曲管理リンク -->
        <RouterLink
          to="/musics"
          data-testid="nav-link-musics"
          :aria-current="isActive('/musics') ? 'page' : undefined"
          :class="[
            'inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium transition duration-150 ease-in-out',
            isActive('/musics')
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900',
          ]"
        >
          {{ TEXT.navigation.musics }}
        </RouterLink>

        <!-- アーティスト管理リンク -->
        <RouterLink
          to="/artists"
          data-testid="nav-link-artists"
          :aria-current="isActive('/artists') ? 'page' : undefined"
          :class="[
            'inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium transition duration-150 ease-in-out',
            isActive('/artists')
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900',
          ]"
        >
          {{ TEXT.navigation.artists }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
