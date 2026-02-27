<script setup lang="ts">
import { ref } from 'vue'
import { TEXT } from '@/constants/text'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">
      {{ TEXT.demo.countButton }} {{ count }}
    </button>
    <p>
      {{ TEXT.demo.editMessage }}
      <code>{{ TEXT.demo.editFile }}</code> {{ TEXT.demo.editSuffix }}
    </p>
  </div>

  <p>
    {{ TEXT.demo.checkOut }}
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank" rel="noopener noreferrer">{{
      TEXT.demo.createVueLink
    }}</a
    >{{ TEXT.demo.createVueDescription }}
  </p>
  <p>
    {{ TEXT.demo.learnMore }}
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      rel="noopener noreferrer"
      >{{ TEXT.demo.vueDocsLink }}</a
    >.
  </p>
  <p class="read-the-docs">{{ TEXT.demo.clickLogos }}</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
