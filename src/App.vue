<template>
  <div class="app-container">
    <!-- 侧边栏：动态 class 控制收缩状态 -->
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <!-- 头部区域：logo + 切换按钮 -->
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-cube"></i>
          <span v-show="!isCollapsed">Vue3 Admin</span>
        </div>
        <button class="toggle-btn" @click="toggleSidebar" aria-label="切换导航栏">
          <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="nav-menu">
        <a
          v-for="item in menuItems"
          :key="item.id"
          href=" "
          class="nav-item"
          :class="{ active: activeMenu === item.id }"
          @click.prevent="handleMenuClick(item.id)"
        >
          <i :class="item.icon"></i>
          <span v-show="!isCollapsed">{{ item.label }}</span>
        </a >
      </nav>

      <!-- 底部区域 -->
      <div class="sidebar-footer">
        <i class="fas fa-user-circle"></i>
        <span v-show="!isCollapsed">管理员</span>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="main-header">
        <h1>{{ currentTitle }}</h1>
        <span class="badge">Vue3 + TypeScript 可收缩导航栏</span>
      </div>
      <p class="tip-text">
        点击侧边栏顶部的按钮可以展开或收缩导航栏，图标和文字会平滑过渡。
      </p >

      <div class="card-grid">
        <div v-for="card in cards" :key="card.title" class="card">
          <i :class="card.icon"></i>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p >
        </div>
      </div>

      <div class="info-box">
        <i class="fas fa-info-circle"></i>
        <span>
          <strong>提示：</strong> 收缩状态（宽度 80px）下只显示图标，
          鼠标悬停仍然有反馈。点击切换按钮可以恢复宽度 260px。
        </span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref, type ComputedRef } from 'vue'

// ========== 类型定义 ==========
/** 菜单项接口 */
interface MenuItem {
  /** 菜单项唯一标识 */
  id: number
  /** 菜单项显示文字 */
  label: string
  /** Font Awesome 图标类名 */
  icon: string
}

/** 卡片数据接口 */
interface CardItem {
  /** 卡片图标类名 */
  icon: string
  /** 卡片标题 */
  title: string
  /** 卡片描述文字 */
  desc: string
}

// ========== 状态 ==========
/** 侧边栏是否收缩，默认展开 */
const isCollapsed: Ref<boolean> = ref(false)
/** 当前激活的菜单 id */
const activeMenu: Ref<number> = ref(1)

// ========== 菜单数据 ==========
const menuItems: MenuItem[] = [
  { id: 1, label: '仪表盘', icon: 'fas fa-chart-pie' },
  { id: 2, label: '用户管理', icon: 'fas fa-user' },
  { id: 3, label: '系统设置', icon: 'fas fa-cog' },
  { id: 4, label: '消息中心', icon: 'fas fa-envelope' },
  { id: 5, label: '数据分析', icon: 'fas fa-chart-line' },
  { id: 6, label: '文件管理', icon: 'fas fa-folder' }
]

// ========== 卡片数据 ==========
const cards: CardItem[] = [
  { icon: 'fas fa-users', title: '用户统计', desc: '本月新增用户 1,234 人，同比增长 12%。' },
  { icon: 'fas fa-shopping-cart', title: '订单管理', desc: '待处理订单 56 个，今日已完成 128 单。' },
  { icon: 'fas fa-chart-bar', title: '数据分析', desc: '访问量较昨日提升 8%，转化率稳定。' },
  { icon: 'fas fa-bell', title: '通知中心', desc: '您有 3 条未读通知，请及时查看。' }
]

// ========== 计算属性 ==========
/** 当前激活菜单对应的标题 */
const currentTitle: ComputedRef<string> = computed(() => {
  const current = menuItems.find((item: MenuItem) => item.id === activeMenu.value)
  return current ? current.label : '仪表盘'
})

// ========== 方法 ==========
/** 切换侧边栏收缩/展开状态 */
const toggleSidebar = (): void => {
  isCollapsed.value = !isCollapsed.value
}

/** 处理菜单点击 */
const handleMenuClick = (id: number): void => {
  activeMenu.value = id
}
</script>

<style scoped>
/* 如果项目中未引入 Font Awesome，可全局引入，或在 index.html 添加 CDN */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

/* ========== 全局容器 ========== */
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f8fafc;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

/* ========== 侧边栏 ========== */
.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #1e293b;
  color: #e2e8f0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  width: 260px; /* 展开宽度 */
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

/* 收缩状态 */
.sidebar.collapsed {
  width: 80px;
}

/* ========== 侧边栏头部 ========== */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px;
  border-bottom: 1px solid #334155;
  height: 80px;
  white-space: nowrap;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f1f5f9;
}

.logo i {
  font-size: 1.8rem;
  color: #38bdf8;
  min-width: 28px;
  text-align: center;
}

.logo span {
  transition: opacity 0.2s;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.4rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background-color: #334155;
  color: #f1f5f9;
}

/* ========== 导航菜单 ========== */
.nav-menu {
  flex: 1;
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
  cursor: pointer;
  gap: 16px;
}

.nav-item i {
  font-size: 1.3rem;
  min-width: 24px;
  text-align: center;
  color: #94a3b8;
  transition: color 0.2s;
}

.nav-item span {
  transition: opacity 0.2s;
  font-size: 1rem;
}

.nav-item:hover {
  background-color: #334155;
  color: #f1f5f9;
}

.nav-item:hover i {
  color: #38bdf8;
}

.nav-item.active {
  background-color: #0f172a;
  color: white;
  box-shadow: inset 3px 0 0 #38bdf8;
}

.nav-item.active i {
  color: #38bdf8;
}

/* 收缩状态下隐藏文字并调整间距 */
.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px 0;
  gap: 0;
}

.sidebar.collapsed .nav-item i {
  min-width: auto;
  font-size: 1.4rem;
}

/* ========== 侧边栏底部 ========== */
.sidebar-footer {
  padding: 20px 16px;
  border-top: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  font-size: 0.9rem;
  color: #94a3b8;
  flex-shrink: 0;
}

.sidebar-footer i {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.sidebar-footer span {
  transition: opacity 0.2s;
}

.sidebar.collapsed .sidebar-footer {
  justify-content: center;
  padding: 20px 0;
}

/* ========== 主内容区域 ========== */
.main-content {
  flex: 1;
  background-color: #f8fafc;
  padding: 32px 40px;
  overflow-y: auto;
  transition: padding 0.3s;
  display: flex;
  flex-direction: column;
}

.main-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.main-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #0f172a;
}

.badge {
  background-color: #38bdf8;
  color: #0f172a;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 50px;
}

.tip-text {
  color: #475569;
  margin-bottom: 24px;
  line-height: 1.6;
}

/* ========== 卡片网格 ========== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  border-color: #cbd5e1;
}

.card i {
  font-size: 2rem;
  color: #38bdf8;
  margin-bottom: 16px;
}

.card h3 {
  font-size: 1.25rem;
  margin-bottom: 8px;
  color: #0f172a;
}

.card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* ========== 提示框 ========== */
.info-box {
  margin-top: 40px;
  padding: 16px;
  background: #eef2ff;
  border-radius: 16px;
  color: #1e293b;
  border-left: 6px solid #38bdf8;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.info-box i {
  color: #38bdf8;
  margin-top: 3px;
  flex-shrink: 0;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .sidebar {
    width: 80px; /* 小屏默认收缩 */
  }

  .sidebar .logo span,
  .sidebar .nav-item span,
  .sidebar-footer span {
    opacity: 0;
    width: 0;
    display: inline-block;
    overflow: hidden;
  }

  .sidebar .nav-item {
    justify-content: center;
    padding: 12px 0;
    gap: 0;
  }

  .sidebar .nav-item i {
    min-width: auto;
    font-size: 1.4rem;
  }

  .sidebar .sidebar-footer {
    justify-content: center;
    padding: 20px 0;
  }

  /* 若用户主动展开（未添加 collapsed 类） */
  .sidebar:not(.collapsed) {
    width: 260px;
  }

  .sidebar:not(.collapsed) .logo span,
  .sidebar:not(.collapsed) .nav-item span,
  .sidebar:not(.collapsed) .sidebar-footer span {
    opacity: 1;
    width: auto;
    display: inline-block;
  }

  .sidebar:not(.collapsed) .nav-item {
    justify-content: flex-start;
    padding: 12px 16px;
    gap: 16px;
  }

  .sidebar:not(.collapsed) .nav-item i {
    min-width: 24px;
  }

  .sidebar:not(.collapsed) .sidebar-footer {
    justify-content: flex-start;
    padding: 20px 16px;
  }

  .main-content {
    padding: 24px 20px;
  }
}
</style>