<script setup lang="ts">
import { computed } from 'vue'
// biome-ignore lint/correctness/noUnusedImports: used in template :aria-label binding
import { TEXT } from '@/constants/text'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 'medium',
})

// biome-ignore lint/correctness/noUnusedVariables: used in template :class binding
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-4 h-4 border-2'
    case 'large':
      return 'w-12 h-12 border-4'
    default:
      return 'w-8 h-8 border-2'
  }
})
</script>

<template>
  <div
    data-testid="loading-spinner"
    :class="[
      'inline-block rounded-full border-solid border-gray-200 border-t-primary animate-spin',
      sizeClasses,
    ]"
    role="status"
    :aria-label="TEXT.common.loading"
  />
</template>
