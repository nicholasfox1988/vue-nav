<script setup lang="ts">
import { ref } from 'vue'
import type { NavLink } from '../types/nav'

// 四个跳转链接（强类型数组）
const navLinks = ref<NavLink[]>([
  { name: 'pickup', path: '/pickup', icon: '📦'},
  { name: 'yun',    path: '/yun',    icon: '📦'},
  { name: 'k1',     path: '/k1',     icon: '🔑'},
  { name: 'k2',     path: '/k2',     icon: '🔑'}
])

</script>

<template>
  <div class="home">
    <h1>🏠 Nick的主页</h1>
    <div class="nav-grid">
      <!-- 声明式导航：router-link -->
      <router-link
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="nav-card"
      >
        <span class="icon">{{ link.icon }}   {{ link.name }}</span>
        <span class="arrow">↗</span>
      </router-link>
    </div>

  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  text-align: center;
}
h1 { font-size: 2.2rem; margin-bottom: .5rem; }

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.nav-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  background: #fff;
  border-radius: 1.2rem;
  text-decoration: none;
  color: #0f172a;
  box-shadow: 0 8px 20px -10px rgba(0,0,0,.15);
  border: 1px solid #e5e7eb;
  transition: transform .2s, box-shadow .2s;
  position: relative;
}
.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 28px -12px rgba(0,0,0,.25);
}
.icon { font-size: 2rem; margin-bottom: .5rem; }
.nav-card h2 { font-size: 1.4rem; margin: 0 0 .3rem; text-transform: capitalize; }
.nav-card p { font-size: .9rem; color: #64748b; margin: 0; }
.arrow {
  position: absolute; top: 1rem; right: 1.2rem;
  color: #3b82f6; font-size: 1.1rem; opacity: .6;
  transition: opacity .2s, transform .2s;
}
.nav-card:hover .arrow { opacity: 1; transform: translateX(3px); }
</style>