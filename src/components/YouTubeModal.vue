<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { TEXT } from '@/constants/text'

interface YouTubeModalProps {
  open: boolean
  videoUrl: string
}

type YouTubeModalEmits = (e: 'close') => void

const props = defineProps<YouTubeModalProps>()
const emit = defineEmits<YouTubeModalEmits>()

// YouTube動画IDを抽出する関数
const extractVideoId = (url: string): string | null => {
  try {
    // 標準形式: https://www.youtube.com/watch?v=VIDEO_ID
    const standardMatch = url.match(/[?&]v=([^&]+)/)
    if (standardMatch) {
      return standardMatch[1]
    }

    // 短縮形式: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?]+)/)
    if (shortMatch) {
      return shortMatch[1]
    }

    // 埋め込み形式: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/)
    if (embedMatch) {
      return embedMatch[1]
    }

    return null
  } catch {
    return null
  }
}

const embedUrl = computed(() => {
  const videoId = extractVideoId(props.videoUrl)
  if (!videoId) {
    return ''
  }
  return `https://www.youtube.com/embed/${videoId}`
})

// モーダルを閉じる
const handleClose = () => {
  emit('close')
}

// Escapeキーでモーダルを閉じる
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

// モーダルが開いているときにEscapeキーリスナーを追加
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
  { immediate: true }
)

// コンポーネントがアンマウントされるときにリスナーを削除
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="open"
    data-testid="youtube-modal"
    role="dialog"
    aria-modal="true"
    class="fixed inset-0 z-50 flex items-center justify-center"
    @keydown.escape.stop="handleClose"
  >
    <!-- 背景オーバーレイ -->
    <div
      data-testid="modal-overlay"
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="handleClose"
    ></div>

    <!-- モーダルコンテンツ -->
    <div class="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg">
      <!-- ヘッダー -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">{{ TEXT.youtubeModal.title }}</h2>
        <button
          data-testid="close-button"
          type="button"
          class="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
          @click="handleClose"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- 動画埋め込みエリア -->
      <div class="relative w-full aspect-video">
        <iframe
          v-if="embedUrl"
          data-testid="youtube-iframe"
          :src="embedUrl"
          :title="TEXT.youtubeModal.title"
          class="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <div
          v-if="!embedUrl"
          class="absolute inset-0 flex items-center justify-center bg-gray-100"
        >
          <p class="text-gray-600">{{ TEXT.youtubeModal.loadError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
