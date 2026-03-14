<script setup lang="ts">

import { computed, ref } from 'vue'
import { TEXT } from '@/constants/text'

interface Props {
  isLoading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
})

const emit = defineEmits<{
  submit: [password: string]
}>()

const password = ref('')

const isSubmitDisabled = computed(() => {
  return password.value.trim() === '' || props.isLoading
})

const handleSubmit = () => {
  if (!isSubmitDisabled.value) {
    emit('submit', password.value)
  }
}
</script>

<template>
  <form
    class="w-full max-w-sm space-y-4"
    data-testid="signin-form"
    @submit.prevent="handleSubmit"
  >
    <div class="space-y-1">
      <label for="password" class="block text-sm text-gray-600">
        {{ TEXT.auth.passwordLabel }}
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        :placeholder="TEXT.auth.passwordPlaceholder"
        :disabled="isLoading"
        class="w-full rounded border border-gray-200 px-3 py-2 text-base text-gray-900 transition duration-150 ease-in-out placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="password-input"
      />
    </div>

    <button
      type="submit"
      :disabled="isSubmitDisabled"
      class="w-full rounded border border-primary px-3 py-2 text-base text-primary transition duration-150 ease-in-out hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      data-testid="signin-button"
    >
      <span v-if="isLoading" data-testid="loading-indicator">
        {{ TEXT.common.loading }}
      </span>
      <span v-else>
        {{ TEXT.auth.signInButton }}
      </span>
    </button>

    <p
      v-if="error"
      class="text-sm text-error"
      role="alert"
      data-testid="error-message"
    >
      {{ error }}
    </p>
  </form>
</template>
