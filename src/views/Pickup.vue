<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const back = (): void => {
  router.push('/')
}
</script>

<template>
  <div class="page">
    <h1>📦 Pickup 页面</h1>
    <p>这里是 pickup 提货 / 取件功能页面。</p >
    <button @click="back">← 返回主页</button>
  </div>
</template>