<script setup lang="ts">
import { TEXT } from '@/constants/text'
import type { Artist } from '@/types'
import LoadingSpinner from './LoadingSpinner.vue'

interface ArtistTableProps {
  data: Artist[]
  loading: boolean
}

interface ArtistTableEmits {
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
}

const props = defineProps<ArtistTableProps>()
const emit = defineEmits<ArtistTableEmits>()

const handleEdit = (id: number) => {
  emit('edit', id)
}

const handleDelete = (id: number) => {
  emit('delete', id)
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
      {{ TEXT.artistTable.noData }}
    </div>

    <!-- テーブル表示 -->
    <div v-else class="overflow-x-auto">
      <table data-testid="artist-table" class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.artistTable.id }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.artistTable.artistName }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.artistTable.unitName }}
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-900">
              {{ TEXT.artistTable.content }}
            </th>
            <th class="px-4 py-3 text-center text-sm font-medium text-gray-900">
              {{ TEXT.artistTable.actions }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="artist in data"
            :key="artist.id"
            class="hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ artist.id }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-900">
              {{ artist.artistName }}
            </td>
            <td data-testid="artist-unitName" class="px-4 py-3 text-sm text-gray-600">
              {{ artist.unitName ?? '-' }}
            </td>
            <td data-testid="artist-content" class="px-4 py-3 text-sm text-gray-600">
              {{ artist.content ?? '-' }}
            </td>
            <td class="px-4 py-3 text-sm text-center">
              <div class="flex justify-center gap-2">
                <button
                  :data-testid="`edit-button-${artist.id}`"
                  type="button"
                  class="px-3 py-1 text-sm border border-gray-200 rounded text-gray-900 hover:border-primary hover:text-primary transition duration-150 ease-in-out"
                  @click="handleEdit(artist.id)"
                >
                  {{ TEXT.common.edit }}
                </button>
                <button
                  :data-testid="`delete-button-${artist.id}`"
                  type="button"
                  class="px-3 py-1 text-sm border border-gray-200 rounded text-gray-900 hover:border-error hover:text-error transition duration-150 ease-in-out"
                  @click="handleDelete(artist.id)"
                >
                  {{ TEXT.common.delete }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
