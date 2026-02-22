# Vue 3 Composition API パターン集

## script setup の基本構造

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// Props（デフォルト値なし）
const props = defineProps<{
  title: string
  count?: number
}>()

// Emits
const emit = defineEmits<{
  update: [value: string]
  close: []
}>()

// リアクティブ状態
const name = ref('')
const items = ref<string[]>([])

// computed
const displayName = computed(() => `Hello, ${name.value}`)

// watch（依存を明示）
watch(() => props.count, (newVal, oldVal) => {
  // 処理
})

// ライフサイクル
onMounted(() => {
  // DOM 操作など
})
</script>
```

## withDefaults でデフォルト値を設定

```vue
<script setup lang="ts">
// withDefaults でオプションの Props にデフォルト値を設定
const props = withDefaults(defineProps<{
  title: string
  count?: number
}>(), {
  count: 0,
})
</script>
```

## ref vs reactive の使い分け

| 用途 | 推奨 |
|------|------|
| プリミティブ（string, number, boolean） | `ref` |
| オブジェクト（フォーム状態など） | `reactive` または `ref` |
| 配列 | `ref<T[]>` |
| 深いネストが不要な場合 | `reactive` は避け `ref` を優先 |

```ts
// Good: プリミティブは ref
const count = ref(0)

// Good: オブジェクトは reactive でも可
const form = reactive({ name: '', email: '' })

// Bad: reactive でプリミティブをラップ
const count = reactive({ value: 0 }) // 不要な複雑性
```

## コンポーザブル（Composable）

```ts
// useMusic.ts
export function useMusic(id: Ref<string>) {
  const music = ref<Music | null>(null)
  const isLoading = ref(false)

  const fetchMusic = async () => {
    isLoading.value = true
    try {
      music.value = await api.getMusic(id.value)
    } finally {
      isLoading.value = false
    }
  }

  watch(id, fetchMusic, { immediate: true })

  return { music, isLoading }
}
```

## テンプレートのベストプラクティス

```vue
<template>
  <!-- Good: key に一意識別子を使用 -->
  <li v-for="song in songs" :key="song.id">{{ song.title }}</li>

  <!-- Bad: key に index を使用 -->
  <li v-for="(song, i) in songs" :key="i">{{ song.title }}</li>

  <!-- Bad: v-if と v-for の併用 -->
  <!-- <li v-for="song in songs" v-if="song.active" :key="song.id"> -->

  <!-- Good: computed でフィルタリング -->
  <li v-for="song in activeSongs" :key="song.id">{{ song.title }}</li>

  <!-- Good: イベントハンドラは method 参照 -->
  <button @click="handleClick">Click</button>

  <!-- Bad: テンプレート内 inline arrow function -->
  <!-- <button @click="() => count++">Click</button> -->
</template>
```

## defineExpose の使用

`<script setup>` のコンポーネントはデフォルトで閉じているため、
親から参照させたいものだけを明示的に公開する。

```vue
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({ focus: () => inputRef.value?.focus() })
</script>
```
