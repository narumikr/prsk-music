<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import SignInForm from '@/components/SignInForm.vue'
import { useAuth } from '@/composables/useAuth'
import { TEXT } from '@/constants/text'

const router = useRouter()
const { isAuthenticated, isLoading, error, signIn } = useAuth()

const handleSubmit = async (password: string) => {
  await signIn(password)
}

watch(
  isAuthenticated,
  (authenticated) => {
    if (authenticated) {
      router.push('/musics')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6">
    <div class="w-full max-w-sm space-y-6">
      <h1 class="text-center text-2xl text-gray-900">
        {{ TEXT.auth.signInTitle }}
      </h1>
      <SignInForm
        :is-loading="isLoading"
        :error="error"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
