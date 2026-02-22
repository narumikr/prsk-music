# TypeScript 型安全パターン

## Props の型定義

```ts
// Good: interface で明示的に型定義
interface Props {
  musicId: string
  title: string
  composer?: string
  releaseDate: Date | null
}
const props = defineProps<Props>()

// Good: API 型を shared/api から引用(@/types/apiはshared/apiを反映させた型)
import type { Music } from '@/types/api'
interface Props {
  music: Music
}
```

## ref のジェネリクス

```ts
// Good: 推論できない場合は明示
const selectedId = ref<string | null>(null)
const musicList = ref<Music[]>([])

// OK: 初期値から推論できる場合は省略可
const count = ref(0)         // number と推論される
const isOpen = ref(false)    // boolean と推論される
```

## fetch API の型付け

```ts
// Good: レスポンスを型付け
const fetchMusic = async (id: string): Promise<Music> => {
  const res = await fetch(`/api/musics/${id}`)
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
  return res.json() as Promise<Music>
}

// Bad: any を返す
const fetchMusic = async (id: string): Promise<any> => { ... }
```

## null / undefined の安全な扱い

```ts
// Good: optional chaining と nullish coalescing
const title = music.value?.title ?? '(未設定)'

// Good: 型ガード
if (music.value !== null) {
  console.log(music.value.title)  // ここでは Music 型
}

// Bad: non-null assertion の乱用
const title = music.value!.title  // null チェックを回避
```

## Enum の代替パターン（as const）

```ts
// Good: as const を使用
const MusicCategory = {
  ORIGINAL: 'original',
  COVER: 'cover',
  REMIX: 'remix',
} as const
type MusicCategory = typeof MusicCategory[keyof typeof MusicCategory]

// Avoid: TypeScript の enum（tree-shaking に不利）
enum MusicCategory { ORIGINAL, COVER, REMIX }
```

## computed の型

```ts
// computed は自動推論されるが、複雑な場合は明示
const sortedMusics = computed<Music[]>(() => {
  return [...musicList.value].sort((a, b) => a.title.localeCompare(b.title))
})
```
