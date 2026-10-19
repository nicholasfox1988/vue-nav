<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const back = (): void => {
  router.push('/')
}
</script>

<template>
  <div class="page">
    <h1>🔑 K2 页面</h1>
    <p>这里是 K2 功能模块页面。</p >
    <button @click="back">← 返回主页</button>
  </div>
</template>