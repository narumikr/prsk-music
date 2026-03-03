<script setup lang="ts">
import { ref } from 'vue'
import { TEXT } from '@/constants/text'
import { MUSIC_TYPE_LABELS, type PrskMusic } from '@/types'
import LoadingSpinner from './LoadingSpinner.vue'
import YouTubeModal from './YouTubeModal.vue'

interface MusicTableProps {
  data: PrskMusic[]
  loading: boolean
}

interface MusicTableEmits {
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}

const props = defineProps<MusicTableProps>()
const emit = defineEmits<MusicTableEmits>()

// YouTubeモーダルの状態管理
const youtubeModalOpen = ref(false)
const selectedYoutubeUrl = ref('')

const handleEdit = (id: number) => {
  emit('edit', id)
}

const handleDelete = (id: number) => {
  emit('delete', id)
}

const handleYoutubeLinkClick = (url: string) => {
  selectedYoutubeUrl.value = url
  youtubeModalOpen.value = true
}

const handleYoutubeModalClose = () => {
  youtubeModalOpen.value = false
  selectedYoutubeUrl.value = ''
}
</script>

<template>
  <div>
    <!-- ローディング表示 -->
    <div v-if="loading" class="flex justify-center py-8">
      <LoadingSpinner size="large" />
    </div>

    <!-- データなし表示 -->
    <div v-else-if="data.length === 0" class="text-center py-8 text-gray-600">
      {{ TEXT.musicTable.noData }}
    </div>

    <!-- テーブル表示 -->
    <div v-else class="overflow-x-auto">
      <table data-testid="music-table" class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.id }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.title }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.artistName }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.unitName }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.content }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.musicType }}
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.specially }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.lyricsName }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.musicName }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.featuring }}
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.youtubeLink }}
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-900">
              {{ TEXT.musicTable.actions }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="music in data"
            :key="music.id"
            class="hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ music.id }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ music.title }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ music.artistName }}
            </td>
            <td data-testid="music-unitName" class="px-4 py-3 text-sm text-gray-600">
              {{ music.unitName ?? '-' }}
            </td>
            <td data-testid="music-content" class="px-4 py-3 text-sm text-gray-600">
              {{ music.content ?? '-' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ MUSIC_TYPE_LABELS[music.musicType] }}
            </td>
            <td :data-testid="`music-specially-${music.id}`" class="px-4 py-3 text-sm text-center text-gray-900">
              {{ music.specially ? '✓' : '' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ music.lyricsName ?? '-' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ music.musicName ?? '-' }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ music.featuring ?? '-' }}
            </td>
            <td class="px-4 py-3 text-sm text-center">
              <button
                :data-testid="`youtube-link-${music.id}`"
                type="button"
                class="text-sm text-secondary hover:text-primary transition duration-150 ease-in-out underline"
                @click="handleYoutubeLinkClick(music.youtubeLink)"
              >
                {{ TEXT.musicTable.watchOnYoutube }}
              </button>
            </td>
            <td class="px-4 py-3 text-sm text-center">
              <div class="flex justify-center gap-2">
                <button
                  :data-testid="`edit-button-${music.id}`"
                  type="button"
                  class="px-3 py-1 text-sm border border-gray-200 rounded text-gray-900 hover:border-primary hover:text-primary transition duration-150 ease-in-out"
                  @click="handleEdit(music.id)"
                >
                  {{ TEXT.common.edit }}
                </button>
                <button
                  :data-testid="`delete-button-${music.id}`"
                  type="button"
                  class="px-3 py-1 text-sm border border-gray-200 rounded text-gray-900 hover:border-error hover:text-error transition duration-150 ease-in-out"
                  @click="handleDelete(music.id)"
                >
                  {{ TEXT.common.delete }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- YouTubeモーダル -->
    <YouTubeModal
      data-testid="youtube-modal"
      :open="youtubeModalOpen"
      :video-url="selectedYoutubeUrl"
      @close="handleYoutubeModalClose"
    />
  </div>
</template>
