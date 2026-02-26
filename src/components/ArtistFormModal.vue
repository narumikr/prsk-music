<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { computed, onUnmounted, watch } from 'vue'
import { z } from 'zod'
import { TEXT } from '@/constants/text'
import type { Artist, ArtistFormData } from '@/types'

interface ArtistFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialData?: Artist
}

interface ArtistFormModalEmits {
  (e: 'close'): void
  (e: 'submit', data: ArtistFormData): void
}

const props = defineProps<ArtistFormModalProps>()
const emit = defineEmits<ArtistFormModalEmits>()

// Zodバリデーションスキーマ
const artistFormSchema = toTypedSchema(
  z.object({
    artistName: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z
          .string()
          .min(1, { message: TEXT.artistForm.artistNameRequired })
          .max(50, { message: TEXT.artistForm.artistNameMaxLength })
      ),
    unitName: z
      .string()
      .transform((val) => val.trim())
      .pipe(z.string().max(25, { message: TEXT.artistForm.unitNameMaxLength }).optional())
      .transform((val) => (val === '' ? null : val)),
    content: z
      .string()
      .transform((val) => val.trim())
      .pipe(z.string().max(20, { message: TEXT.artistForm.contentMaxLength }).optional())
      .transform((val) => (val === '' ? null : val)),
  })
)

// VeeValidateによるフォーム管理
const { handleSubmit, errors, resetForm, values } = useForm({
  validationSchema: artistFormSchema,
  initialValues: {
    artistName: '',
    unitName: '',
    content: '',
  },
  validateOnMount: false,
})

// モーダルタイトル
const modalTitle = computed(() => {
  return props.mode === 'create' ? TEXT.artistForm.createTitle : TEXT.artistForm.editTitle
})

// 送信ボタンの有効/無効
const isSubmitDisabled = computed(() => {
  // 必須フィールド（artistName）が空の場合は無効
  if (!values.artistName || values.artistName.trim() === '') {
    return true
  }
  // バリデーションエラーがある場合は無効
  if (Object.keys(errors.value).length > 0) {
    return true
  }
  return false
})

// フォーム送信
const onSubmit = handleSubmit((formValues) => {
  const formData: ArtistFormData = {
    artistName: formValues.artistName,
    unitName: formValues.unitName || null,
    content: formValues.content || null,
  }
  emit('submit', formData)
})

// モーダルを閉じる
const handleClose = () => {
  emit('close')
}

// Escapeキーでモーダルを閉じる
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

// モーダルの開閉を監視してEscapeキーリスナーを管理
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscapeKey)
      // 編集モードの場合は初期データをセット
      if (props.mode === 'edit' && props.initialData) {
        resetForm({
          values: {
            artistName: props.initialData.artistName,
            unitName: props.initialData.unitName || '',
            content: props.initialData.content || '',
          },
        })
      } else {
        // 作成モードの場合はフォームをリセット
        resetForm({
          values: {
            artistName: '',
            unitName: '',
            content: '',
          },
        })
      }
    } else {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }
)

// コンポーネントのアンマウント時にリスナーをクリーンアップ
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center" data-testid="artist-form-modal">
    <!-- 背景オーバーレイ -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="handleClose" data-testid="modal-overlay"></div>

    <!-- モーダルコンテンツ -->
    <div class="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 z-10" role="dialog" aria-modal="true">
      <!-- ヘッダー -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900" data-testid="modal-title">
          {{ modalTitle }}
        </h2>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
          @click="handleClose"
          data-testid="close-button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- フォーム -->
      <form @submit.prevent="onSubmit" class="px-6 py-4">
        <!-- アーティスト名フィールド -->
        <div class="mb-4">
          <label for="artistName" class="block text-sm font-medium text-gray-700 mb-1" data-testid="artistName-label">
            {{ TEXT.artistForm.artistName }}
            <span class="text-red-500">*</span>
          </label>
          <Field
            id="artistName"
            name="artistName"
            as="input"
            type="text"
            :placeholder="TEXT.artistForm.artistNamePlaceholder"
            :class="['w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#33ccba] focus:ring-offset-2 transition duration-150 ease-in-out', errors.artistName ? 'border-red-500' : 'border-gray-200']"
            data-testid="artistName-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage name="artistName" as="p" class="mt-1 text-sm text-red-500" data-testid="artistName-error" />
        </div>

        <!-- ユニット名フィールド -->
        <div class="mb-4">
          <label for="unitName" class="block text-sm font-medium text-gray-700 mb-1" data-testid="unitName-label">
            {{ TEXT.artistForm.unitName }}
          </label>
          <Field
            id="unitName"
            name="unitName"
            as="input"
            type="text"
            :placeholder="TEXT.artistForm.unitNamePlaceholder"
            :class="['w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#33ccba] focus:ring-offset-2 transition duration-150 ease-in-out', errors.unitName ? 'border-red-500' : 'border-gray-200']"
            data-testid="unitName-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage name="unitName" as="p" class="mt-1 text-sm text-red-500" data-testid="unitName-error" />
        </div>

        <!-- コンテンツフィールド -->
        <div class="mb-6">
          <label for="content" class="block text-sm font-medium text-gray-700 mb-1" data-testid="content-label">
            {{ TEXT.artistForm.content }}
          </label>
          <Field
            id="content"
            name="content"
            as="input"
            type="text"
            :placeholder="TEXT.artistForm.contentPlaceholder"
            :class="['w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#33ccba] focus:ring-offset-2 transition duration-150 ease-in-out', errors.content ? 'border-red-500' : 'border-gray-200']"
            data-testid="content-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage name="content" as="p" class="mt-1 text-sm text-red-500" data-testid="content-error" />
        </div>

        <!-- フッター（ボタン） -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="px-4 py-2 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition duration-150 ease-in-out"
            @click="handleClose"
            data-testid="cancel-button"
          >
            {{ TEXT.artistForm.cancel }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitDisabled"
            class="px-4 py-2 border border-[#33ccba] text-[#33ccba] rounded hover:bg-[#33ccba] hover:bg-opacity-10 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-button"
          >
            {{ TEXT.artistForm.submit }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
