<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { computed, onUnmounted, watch } from 'vue'
import { z } from 'zod'
import { TEXT } from '@/constants/text'
import type { Artist, MusicFormData, PrskMusic } from '@/types'

interface MusicFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialData?: PrskMusic
  artists: Artist[]
}

interface MusicFormModalEmits {
  (e: 'close'): void
  (e: 'submit', data: MusicFormData): void
  (e: 'create-artist'): void
}

const props = defineProps<MusicFormModalProps>()
const emit = defineEmits<MusicFormModalEmits>()

// Zodバリデーションスキーマ
const musicFormSchema = toTypedSchema(
  z.object({
    title: z
      .string()
      .min(1, { message: TEXT.musicForm.titleRequired })
      .refine((val) => val.trim().length > 0, {
        message: TEXT.musicForm.titleRequired,
      }),
    artistId: z.number().min(1, { message: TEXT.musicForm.artistRequired }),
    musicType: z.union([z.literal(0), z.literal(1), z.literal(2)], {
      errorMap: () => ({ message: TEXT.musicForm.musicTypeRequired }),
    }),
    specially: z.boolean().nullable(),
    lyricsName: z.string().nullable(),
    musicName: z.string().nullable(),
    featuring: z.string().nullable(),
    youtubeLink: z
      .string()
      .url({ message: TEXT.musicForm.youtubeLinkInvalid })
      .min(1, { message: TEXT.musicForm.youtubeLinkRequired })
      .refine((val) => val.trim().length > 0, {
        message: TEXT.musicForm.youtubeLinkRequired,
      }),
  })
)

// VeeValidateによるフォーム管理
const { handleSubmit, errors, resetForm, values, setFieldValue } = useForm({
  validationSchema: musicFormSchema,
  initialValues: {
    title: '',
    artistId: 0,
    musicType: 0 as 0 | 1 | 2,
    specially: false,
    lyricsName: '',
    musicName: '',
    featuring: '',
    youtubeLink: '',
  },
  validateOnMount: false,
})

// モーダルタイトル
const modalTitle = computed(() => {
  return props.mode === 'create' ? TEXT.musicForm.createTitle : TEXT.musicForm.editTitle
})

// 送信ボタンの有効/無効
const isSubmitDisabled = computed(() => {
  // 必須フィールドが空の場合は無効
  if (!values.title || values.title.trim() === '') {
    return true
  }
  if (!values.artistId || values.artistId === 0) {
    return true
  }
  if (!values.youtubeLink || values.youtubeLink.trim() === '') {
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
  const formData: MusicFormData = {
    title: formValues.title.trim(),
    artistId: formValues.artistId,
    musicType: formValues.musicType,
    specially: formValues.specially,
    lyricsName: formValues.lyricsName?.trim() || null,
    musicName: formValues.musicName?.trim() || null,
    featuring: formValues.featuring?.trim() || null,
    youtubeLink: formValues.youtubeLink.trim(),
  }
  emit('submit', formData)
})

// モーダルを閉じる
const handleClose = () => {
  emit('close')
}

// アーティスト新規追加ボタンクリック
const handleCreateArtist = () => {
  emit('create-artist')
}

// Escapeキーでモーダルを閉じる
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

// アーティストIDからアーティストを検索
const findArtistIdByName = (artistName: string): number => {
  const artist = props.artists.find((a) => a.artistName === artistName)
  return artist?.id || 0
}

// モーダルの開閉を監視してEscapeキーリスナーを管理
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleEscapeKey)
      // 編集モードの場合は初期データをセット
      if (props.mode === 'edit' && props.initialData) {
        const artistId = findArtistIdByName(props.initialData.artistName)
        resetForm({
          values: {
            title: props.initialData.title,
            artistId: artistId,
            musicType: props.initialData.musicType,
            specially: props.initialData.specially || false,
            lyricsName: props.initialData.lyricsName || '',
            musicName: props.initialData.musicName || '',
            featuring: props.initialData.featuring || '',
            youtubeLink: props.initialData.youtubeLink,
          },
        })
      } else {
        // 作成モードの場合はフォームをリセット
        resetForm({
          values: {
            title: '',
            artistId: 0,
            musicType: 0,
            specially: false,
            lyricsName: '',
            musicName: '',
            featuring: '',
            youtubeLink: '',
          },
        })
      }
    } else {
      window.removeEventListener('keydown', handleEscapeKey)
    }
  },
  { immediate: true }
)

// コンポーネントのアンマウント時にリスナーをクリーンアップ
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey)
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center"
    data-testid="music-form-modal"
  >
    <!-- 背景オーバーレイ -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50"
      @click="handleClose"
      data-testid="modal-overlay"
    ></div>

    <!-- モーダルコンテンツ -->
    <div
      class="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 z-10 max-h-[90vh] overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="music-modal-title"
    >
      <!-- ヘッダー -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h2
          id="music-modal-title"
          class="text-xl font-semibold text-gray-900"
          data-testid="modal-title"
        >
          {{ modalTitle }}
        </h2>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
          :aria-label="TEXT.musicForm.close"
          @click="handleClose"
          data-testid="close-button"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- フォーム -->
      <form @submit.prevent="onSubmit" class="px-6 py-4">
        <!-- タイトルフィールド -->
        <div class="mb-4">
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
            data-testid="title-label"
          >
            {{ TEXT.musicForm.title }}
            <span class="text-red-500">*</span>
          </label>
          <Field
            id="title"
            name="title"
            as="input"
            type="text"
            :placeholder="TEXT.musicForm.titlePlaceholder"
            :class="[
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150 ease-in-out',
              errors.title ? 'border-red-500' : 'border-gray-200',
            ]"
            data-testid="title-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage
            name="title"
            as="p"
            class="mt-1 text-sm text-red-500"
            data-testid="title-error"
          />
        </div>

        <!-- アーティスト選択フィールド -->
        <div class="mb-4">
          <label
            for="artistId"
            class="block text-sm font-medium text-gray-700 mb-1"
            data-testid="artist-label"
          >
            {{ TEXT.musicForm.artist }}
            <span class="text-red-500">*</span>
          </label>
          <div class="flex gap-2">
            <Field
              id="artistId"
              name="artistId"
              as="select"
              :class="[
                'flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150 ease-in-out',
                errors.artistId ? 'border-red-500' : 'border-gray-200',
              ]"
              data-testid="artist-select"
              :validateOnBlur="true"
              :validateOnChange="true"
              :validateOnInput="false"
              :validateOnModelUpdate="true"
            >
              <option value="0" disabled>{{ TEXT.musicForm.artistPlaceholder }}</option>
              <option v-for="artist in artists" :key="artist.id" :value="artist.id">
                {{ artist.artistName }}
              </option>
            </Field>
            <button
              type="button"
              class="px-4 py-2 border border-secondary text-secondary rounded hover:bg-secondary hover:bg-opacity-10 transition duration-150 ease-in-out whitespace-nowrap"
              @click="handleCreateArtist"
              data-testid="create-artist-button"
            >
              {{ TEXT.musicForm.createArtist }}
            </button>
          </div>
          <ErrorMessage
            name="artistId"
            as="p"
            class="mt-1 text-sm text-red-500"
            data-testid="artist-error"
          />
        </div>

        <!-- 楽曲タイプフィールド -->
        <div class="mb-4">
          <label
            for="musicType"
            class="block text-sm font-medium text-gray-700 mb-1"
            data-testid="musicType-label"
          >
            {{ TEXT.musicForm.musicType }}
            <span class="text-red-500">*</span>
          </label>
          <Field
            id="musicType"
            name="musicType"
            as="select"
            :class="[
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150 ease-in-out',
              errors.musicType ? 'border-red-500' : 'border-gray-200',
            ]"
            data-testid="musicType-select"
            :validateOnBlur="true"
            :validateOnChange="true"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          >
            <option value="0">{{ TEXT.musicType.original }}</option>
            <option value="1">{{ TEXT.musicType.mv3d }}</option>
            <option value="2">{{ TEXT.musicType.mv2d }}</option>
          </Field>
          <ErrorMessage
            name="musicType"
            as="p"
            class="mt-1 text-sm text-red-500"
            data-testid="musicType-error"
          />
        </div>

        <!-- スペシャルチェックボックス -->
        <div class="mb-4">
          <label class="flex items-center gap-2" data-testid="specially-label">
            <Field
              id="specially"
              name="specially"
              type="checkbox"
              :value="true"
              :unchecked-value="false"
              class="w-4 h-4 text-primary border-gray-200 rounded focus:ring-2 focus:ring-primary focus:ring-offset-2"
              data-testid="specially-checkbox"
            />
            <span class="text-sm font-medium text-gray-700">{{ TEXT.musicForm.specially }}</span>
          </label>
        </div>

        <!-- 作詞フィールド -->
        <div class="mb-4">
          <label
            for="lyricsName"
            class="block text-sm font-medium text-gray-700 mb-1"
            data-testid="lyricsName-label"
          >
            {{ TEXT.musicForm.lyricsName }}
          </label>
          <Field
            id="lyricsName"
            name="lyricsName"
            as="input"
            type="text"
            :placeholder="TEXT.musicForm.lyricsNamePlaceholder"
            :class="[
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150 ease-in-out',
              errors.lyricsName ? 'border-red-500' : 'border-gray-200',
            ]"
            data-testid="lyricsName-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage
            name="lyricsName"
            as="p"
            class="mt-1 text-sm text-red-500"
            data-testid="lyricsName-error"
          />
        </div>

        <!-- 作曲フィールド -->
        <div class="mb-4">
          <label
            for="musicName"
            class="block text-sm font-medium text-gray-700 mb-1"
            data-testid="musicName-label"
          >
            {{ TEXT.musicForm.musicName }}
          </label>
          <Field
            id="musicName"
            name="musicName"
            as="input"
            type="text"
            :placeholder="TEXT.musicForm.musicNamePlaceholder"
            :class="[
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150 ease-in-out',
              errors.musicName ? 'border-red-500' : 'border-gray-200',
            ]"
            data-testid="musicName-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage
            name="musicName"
            as="p"
            class="mt-1 text-sm text-red-500"
            data-testid="musicName-error"
          />
        </div>

        <!-- フィーチャリングフィールド -->
        <div class="mb-4">
          <label
            for="featuring"
            class="block text-sm font-medium text-gray-700 mb-1"
            data-testid="featuring-label"
          >
            {{ TEXT.musicForm.featuring }}
          </label>
          <Field
            id="featuring"
            name="featuring"
            as="input"
            type="text"
            :placeholder="TEXT.musicForm.featuringPlaceholder"
            :class="[
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150 ease-in-out',
              errors.featuring ? 'border-red-500' : 'border-gray-200',
            ]"
            data-testid="featuring-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage
            name="featuring"
            as="p"
            class="mt-1 text-sm text-red-500"
            data-testid="featuring-error"
          />
        </div>

        <!-- YouTubeリンクフィールド -->
        <div class="mb-6">
          <label
            for="youtubeLink"
            class="block text-sm font-medium text-gray-700 mb-1"
            data-testid="youtubeLink-label"
          >
            {{ TEXT.musicForm.youtubeLink }}
            <span class="text-red-500">*</span>
          </label>
          <Field
            id="youtubeLink"
            name="youtubeLink"
            as="input"
            type="text"
            :placeholder="TEXT.musicForm.youtubeLinkPlaceholder"
            :class="[
              'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition duration-150 ease-in-out',
              errors.youtubeLink ? 'border-red-500' : 'border-gray-200',
            ]"
            data-testid="youtubeLink-input"
            :validateOnBlur="true"
            :validateOnChange="false"
            :validateOnInput="false"
            :validateOnModelUpdate="true"
          />
          <ErrorMessage
            name="youtubeLink"
            as="p"
            class="mt-1 text-sm text-red-500"
            data-testid="youtubeLink-error"
          />
        </div>

        <!-- フッター（ボタン） -->
        <div class="flex justify-end gap-3 sticky bottom-0 bg-white pt-4 border-t border-gray-200">
          <button
            type="button"
            class="px-4 py-2 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition duration-150 ease-in-out"
            @click="handleClose"
            data-testid="cancel-button"
          >
            {{ TEXT.musicForm.cancel }}
          </button>
          <button
            type="submit"
            :disabled="isSubmitDisabled"
            class="px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:bg-opacity-10 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-button"
          >
            {{ TEXT.musicForm.submit }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
