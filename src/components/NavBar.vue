<script setup lang="ts">
interface NavItem {
  label: string
  path: string
}

const navItems: NavItem[] = [
  { label: '首页', path: '/' },
  { label: '自提多件', path: '/pickup' },
  { label: '原始数据', path: '/solutions' },
  { label: '大货数据', path: '/cases' },
  { label: '自提清点', path: '/news' },
  { label: '韩国一号', path: '/support' },
  { label: '韩国二号', path: '/about' }
]
</script>

<template>
  <nav class="navbar">
    <div class="logo">Nick的博客</div>

    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.path">
        <RouterLink
          :to="item.path"
          class="nav-item"
          active-class="active"
          exact-active-class="active"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 32px;
  background: white;
  box-shadow: 0 2px 12px #00000014;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  color: #2563eb;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  display: block;
  padding: 10px 14px;
  border-radius: 6px;
  color: #475569;
  text-decoration: none;
}

.nav-item:hover {
  color: #2563eb;
  background: #eff6ff;
}

.nav-item.active {
  color: white;
  background: #2563eb;
}
</style>