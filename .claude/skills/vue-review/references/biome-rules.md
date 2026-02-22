# Biome ルールと設定

## プロジェクトの Biome 設定

プロジェクトの `biome.json` が存在する場合はその設定を優先する。
未存在の場合は Biome のデフォルト設定（recommended）を基準とする。

## 主要な Linting ルール

### 未使用コードの検出

```ts
// Bad: 未使用 import（noUnusedImports）
import { ref, computed } from 'vue'  // computed が未使用
const name = ref('')

// Good
import { ref } from 'vue'
const name = ref('')

// Bad: 未使用変数（noUnusedVariables）
const unusedVar = 'hello'
```

### console.log の禁止

```ts
// Bad: 本番コードに console.log（noConsole）
const fetchData = async () => {
  const data = await api.getMusics()
  console.log('data:', data)  // 本番コードに残さない
  return data
}

// Good: デバッグ時のみ使用し、コミット前に削除
```

### 比較演算子

```ts
// Bad: 型強制が起きる == の使用（noDoubleEquals）
if (value == null) { }

// Good: 厳密な比較
if (value === null || value === undefined) { }
// または
if (value == null) { }  // null チェックには == null が慣習的に許容される場合も

// Biome の設定によるため、プロジェクトの biome.json を確認すること
```

### 条件式への代入禁止

```ts
// Bad: 条件式に代入（noAssignInExpressions）
while (chunk = readChunk()) { }

// Good
let chunk = readChunk()
while (chunk !== null) {
  chunk = readChunk()
}
```

## Formatting 規約

### インデント

```ts
// Good: 2 スペース
function example() {
  const x = 1
  if (x) {
    return x
  }
}

// Bad: 4 スペースまたは tab
function example() {
    const x = 1
}
```

### セミコロン

Biome のデフォルトはセミコロンあり。
プロジェクトの `biome.json` で `formatter.semicolons` を確認する。

```ts
// Biome デフォルト（semicolons: "always"）
const name = 'hello';
const greet = () => `Hello, ${name}`;

// semicolons: "asNeeded" の場合
const name = 'hello'
const greet = () => `Hello, ${name}`
```

### import の整列

Biome は import を自動整列する（`organizeImports: true` のとき）。

```ts
// Good: 整列済み
import { computed, ref, watch } from 'vue'
import type { Music } from '@/types/api'
import MusicCard from '@/components/MusicCard.vue'

// Bad: 未整列
import MusicCard from '@/components/MusicCard.vue'
import { ref, computed, watch } from 'vue'
import type { Music } from '@/types/api'
```

## Vue SFC での注意点

Biome は現時点で `.vue` ファイルの `<script>` ブロックを直接 lint できない場合がある。
その場合は VS Code の Biome 拡張機能または `vite-plugin-biome` 等のプラグインを使用する。
