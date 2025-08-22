<template>
  <div id="app">
    <el-container class="layout-container">
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-content">
          <div class="logo" @click="router.push('/')">
            <el-icon :size="28" color="#409EFF">
              <Tools />
            </el-icon>
            <span class="logo-text">WG-Tools</span>
          </div>
          <div class="nav-menu" ref="navMenuRef">
            <el-menu
              :default-active="$route.path"
              mode="horizontal"
              router
              :ellipsis="false"
              background-color="transparent"
              text-color="rgba(255, 255, 255, 0.9)"
              active-text-color="#ffffff"
              class="main-menu"
            >
              <el-menu-item index="/">首页</el-menu-item>
              <el-sub-menu index="/text">
                <template #title>📝 文本处理</template>
                <el-menu-item index="/text/json" data-category="text">
                  <span class="menu-icon">📄</span>JSON工具
                </el-menu-item>
                <el-menu-item index="/text/xml" data-category="text">
                  <span class="menu-icon">📋</span>XML工具
                </el-menu-item>
                <el-menu-item index="/text/compare" data-category="text">
                  <span class="menu-icon">🔍</span>文本对比
                </el-menu-item>
                <el-menu-item index="/text/encrypt" data-category="text">
                  <span class="menu-icon">🔒</span>文本加密
                </el-menu-item>
                <el-menu-item index="/text/regex" data-category="text">
                  <span class="menu-icon">🎯</span>正则表达式
                </el-menu-item>
                <el-menu-item index="/text/stats" data-category="text">
                  <span class="menu-icon">📊</span>文本统计
                </el-menu-item>
                <el-menu-item index="/text/markdown-editor" data-category="text">
                  <span class="menu-icon">✍️</span>Markdown编辑器
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="/encoding">
                <template #title>🔄 编码转换</template>
                <el-menu-item index="/encoding/base64" data-category="encoding">
                  <span class="menu-icon">🔤</span>Base64编码
                </el-menu-item>
                <el-menu-item index="/encoding/url" data-category="encoding">
                  <span class="menu-icon">🌐</span>URL编码
                </el-menu-item>
                <el-menu-item index="/encoding/unicode" data-category="encoding">
                  <span class="menu-icon">🔣</span>Unicode编码
                </el-menu-item>
                <el-menu-item index="/encoding/html" data-category="encoding">
                  <span class="menu-icon">🏷️</span>HTML实体
                </el-menu-item>
                <el-menu-item index="/encoding/base" data-category="encoding">
                  <span class="menu-icon">🔢</span>进制转换
                </el-menu-item>
                <el-menu-item index="/converter/image-base64" data-category="encoding">
                  <span class="menu-icon">🖼️</span>图片Base64转换
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="/dev">
                <template #title>🛠️ 开发工具</template>
                <el-menu-item index="/dev/color" data-category="dev">
                  <span class="menu-icon">🎨</span>颜色工具
                </el-menu-item>
                <el-menu-item index="/dev/color-picker" data-category="dev">
                  <span class="menu-icon">🌈</span>高级颜色选择器
                </el-menu-item>
                <el-menu-item index="/dev/uuid" data-category="dev">
                  <span class="menu-icon">🆔</span>UUID生成器
                </el-menu-item>
                <el-menu-item index="/dev/qr-generator" data-category="dev">
                  <span class="menu-icon">📱</span>二维码生成器
                </el-menu-item>
                <el-menu-item index="/dev/random-data" data-category="dev">
                  <span class="menu-icon">🎲</span>随机数据生成器
                </el-menu-item>
                <el-menu-item index="/dev/code-formatter" data-category="dev">
                  <span class="menu-icon">💻</span>代码格式化
                </el-menu-item>
                <el-menu-item index="/dev/file-diff" data-category="dev">
                  <span class="menu-icon">📊</span>文件对比
                </el-menu-item>
                <el-menu-item index="/dev/icon-generator" data-category="dev">
                  <span class="menu-icon">🖼️</span>图标生成器
                </el-menu-item>
                <el-menu-item index="/dev/cron" data-category="dev">
                  <span class="menu-icon">⏰</span>Cron表达式
                </el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="/time">
                <template #title>⏰ 时间工具</template>
                <el-menu-item index="/time/timestamp" data-category="time">
                  <span class="menu-icon">🕐</span>时间戳工具
                </el-menu-item>
                <el-menu-item index="/time/calculator" data-category="time">
                  <span class="menu-icon">⏱️</span>时间计算器
                </el-menu-item>
                <el-menu-item index="/time/worldclock" data-category="time">
                  <span class="menu-icon">🌍</span>世界时钟
                </el-menu-item>
                <el-menu-item index="/converter/unit" data-category="time">
                  <span class="menu-icon">📏</span>单位转换
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="/security">
                <template #title>🔒 安全工具</template>
                <el-menu-item index="/security/password" data-category="security">
                  <span class="menu-icon">🔑</span>密码生成器
                </el-menu-item>
                <el-menu-item index="/security/hash" data-category="security">
                  <span class="menu-icon">🔐</span>哈希计算
                </el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="/docs">
                <template #title>📚 文档</template>
                <el-menu-item index="/docs/git" data-category="docs">
                  <span class="menu-icon">📝</span>Git 常用命令
                </el-menu-item>
                <el-menu-item index="/docs/linux" data-category="docs">
                  <span class="menu-icon">🐧</span>Linux 常用命令
                </el-menu-item>
                <el-menu-item index="/docs/docker" data-category="docs">
                  <span class="menu-icon">🐳</span>Docker 常用命令
                </el-menu-item>
                <el-menu-item index="/docs/mysql" data-category="docs">
                  <span class="menu-icon">🗄️</span>MySQL 常用语法
                </el-menu-item>
                <el-menu-item index="/docs/java" data-category="docs">
                  <span class="menu-icon">☕</span>Java 常用语法
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="/utility">
              <template #title>🛠️ 实用工具</template>
              <el-menu-item index="/utility/bmi-calculator" data-category="utility">
                <span class="menu-icon">⚖️</span>BMI计算器
              </el-menu-item>
              <el-menu-item index="/utility/mortgage-calculator" data-category="utility">
                <span class="menu-icon">🏡</span>房贷计算器
              </el-menu-item>
              <el-menu-item index="/utility/age-calculator" data-category="utility">
                <span class="menu-icon">🎂</span>年龄计算器
              </el-menu-item>
              <el-menu-item index="/utility/classroom-seating" data-category="utility">
                <span class="menu-icon">🏫</span>班级座次表
              </el-menu-item>
              <el-menu-item index="/utility/student-rollcall" data-category="utility">
                <span class="menu-icon">📢</span>学生点名器
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu 
              v-show="!isMobile && hiddenMenuItems.length === 0"
              index="/entertainment"
            >
              <template #title>🎮 娱乐工具</template>
              <el-menu-item index="/entertainment/piano" data-category="entertainment">
                <span class="menu-icon">🎹</span>虚拟钢琴
              </el-menu-item>
              <el-menu-item index="/entertainment/snake" data-category="entertainment">
                <span class="menu-icon">🐍</span>贪吃蛇游戏
              </el-menu-item>
              <el-menu-item index="/entertainment/quotes" data-category="entertainment">
                <span class="menu-icon">💭</span>励志语录
              </el-menu-item>
            </el-sub-menu>
            <el-menu-item 
              v-show="!isMobile && hiddenMenuItems.length < 2"
              index="/about"
            >
              关于
            </el-menu-item>
            
            <!-- 更多菜单 - 在空间不足时显示 -->
            <el-sub-menu 
              v-show="!isMobile && showMoreMenu" 
              index="/more"
              class="more-menu"
            >
              <template #title>
                <el-icon><More /></el-icon>
                更多
              </template>
              <el-menu-item 
                v-for="item in hiddenAboutItems" 
                :key="item.path"
                :index="item.path"
              >
                {{ item.title }}
              </el-menu-item>
              <el-sub-menu 
                v-for="item in hiddenEntertainmentItems" 
                :key="item.path"
                :index="item.path"
              >
                <template #title>{{ item.title }}</template>
                <el-menu-item index="/entertainment/piano">
                  <span class="menu-icon">🎹</span>虚拟钢琴
                </el-menu-item>
                <el-menu-item index="/entertainment/snake">
                  <span class="menu-icon">🐍</span>贪吃蛇游戏
                </el-menu-item>
                <el-menu-item index="/entertainment/quotes">
                  <span class="menu-icon">💭</span>励志语录
                </el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            </el-menu>
            
            <!-- 移动端汉堡菜单按钮 -->
            <div class="mobile-menu-btn" v-if="isMobile" @click="toggleMobileMenu">
              <el-icon size="24"><Menu /></el-icon>
            </div>
          </div>
        </div>
      </el-header>
      
      <!-- 移动端下拉菜单 -->
      <div 
        v-if="isMobile" 
        v-show="mobileMenuOpen"
        class="mobile-menu-dropdown"
        @click="closeMobileMenu"
      >
        <div class="mobile-menu-content" @click.stop>
          <div class="mobile-menu-item" @click="handleMobileMenuClick('/')">
            <span class="mobile-menu-icon">🏠</span>
            <span>首页</span>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">📝 文本处理</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/text/json')">
              <span class="mobile-menu-icon">📄</span>
              <span>JSON工具</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/text/xml')">
              <span class="mobile-menu-icon">📋</span>
              <span>XML工具</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/text/compare')">
              <span class="mobile-menu-icon">🔍</span>
              <span>文本对比</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/text/encrypt')">
              <span class="mobile-menu-icon">🔒</span>
              <span>文本加密</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/text/regex')">
              <span class="mobile-menu-icon">🎯</span>
              <span>正则表达式</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/text/stats')">
              <span class="mobile-menu-icon">📊</span>
              <span>文本统计</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/text/markdown-editor')">
              <span class="mobile-menu-icon">✍️</span>
              <span>Markdown编辑器</span>
            </div>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">🔄 编码转换</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/encoding/base64')">
              <span class="mobile-menu-icon">🔤</span>
              <span>Base64编码</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/encoding/url')">
              <span class="mobile-menu-icon">🌐</span>
              <span>URL编码</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/encoding/unicode')">
              <span class="mobile-menu-icon">🔣</span>
              <span>Unicode编码</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/encoding/html')">
              <span class="mobile-menu-icon">🏷️</span>
              <span>HTML实体</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/encoding/base')">
              <span class="mobile-menu-icon">🔢</span>
              <span>进制转换</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/converter/image-base64')">
              <span class="mobile-menu-icon">🖼️</span>
              <span>图片Base64转换</span>
            </div>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">🛠️ 开发工具</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/color')">
              <span class="mobile-menu-icon">🎨</span>
              <span>颜色工具</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/color-picker')">
              <span class="mobile-menu-icon">🌈</span>
              <span>高级颜色选择器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/uuid')">
              <span class="mobile-menu-icon">🆔</span>
              <span>UUID生成器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/qr-generator')">
              <span class="mobile-menu-icon">📱</span>
              <span>二维码生成器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/random-data')">
              <span class="mobile-menu-icon">🎲</span>
              <span>随机数据生成器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/code-formatter')">
              <span class="mobile-menu-icon">💻</span>
              <span>代码格式化</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/file-diff')">
              <span class="mobile-menu-icon">📊</span>
              <span>文件对比</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/icon-generator')">
              <span class="mobile-menu-icon">🖼️</span>
              <span>图标生成器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/dev/cron')">
              <span class="mobile-menu-icon">⏰</span>
              <span>Cron表达式</span>
            </div>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">⏰ 时间工具</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/time/timestamp')">
              <span class="mobile-menu-icon">🕐</span>
              <span>时间戳工具</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/time/calculator')">
              <span class="mobile-menu-icon">⏱️</span>
              <span>时间计算器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/time/worldclock')">
              <span class="mobile-menu-icon">🌍</span>
              <span>世界时钟</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/converter/unit')">
              <span class="mobile-menu-icon">📏</span>
              <span>单位转换</span>
            </div>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">🔒 安全工具</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/security/password')">
              <span class="mobile-menu-icon">🔑</span>
              <span>密码生成器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/security/hash')">
              <span class="mobile-menu-icon">🔐</span>
              <span>哈希计算</span>
            </div>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">📚 文档</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/docs/git')">
              <span class="mobile-menu-icon">📝</span>
              <span>Git 常用命令</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/docs/linux')">
              <span class="mobile-menu-icon">🐧</span>
              <span>Linux 常用命令</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/docs/docker')">
              <span class="mobile-menu-icon">🐳</span>
              <span>Docker 常用命令</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/docs/mysql')">
              <span class="mobile-menu-icon">🗄️</span>
              <span>MySQL 常用语法</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/docs/java')">
              <span class="mobile-menu-icon">☕</span>
              <span>Java 常用语法</span>
            </div>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">🛠️ 实用工具</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/utility/bmi-calculator')">
              <span class="mobile-menu-icon">⚖️</span>
              <span>BMI计算器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/utility/mortgage-calculator')">
              <span class="mobile-menu-icon">🏡</span>
              <span>房贷计算器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/utility/age-calculator')">
              <span class="mobile-menu-icon">🎂</span>
              <span>年龄计算器</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/utility/classroom-seating')">
              <span class="mobile-menu-icon">🏫</span>
              <span>班级座次表</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/utility/student-rollcall')">
              <span class="mobile-menu-icon">📢</span>
              <span>学生点名器</span>
            </div>
          </div>
          
          <div class="mobile-menu-category">
            <div class="mobile-category-title">🎮 娱乐工具</div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/entertainment/piano')">
              <span class="mobile-menu-icon">🎹</span>
              <span>虚拟钢琴</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/entertainment/snake')">
              <span class="mobile-menu-icon">🐍</span>
              <span>贪吃蛇游戏</span>
            </div>
            <div class="mobile-menu-item" @click="handleMobileMenuClick('/entertainment/quotes')">
              <span class="mobile-menu-icon">💭</span>
              <span>励志语录</span>
            </div>
          </div>
          
          <div class="mobile-menu-item" @click="handleMobileMenuClick('/about')">
            <span class="mobile-menu-icon">ℹ️</span>
            <span>关于</span>
          </div>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
      
      <!-- 底部 -->
      <el-footer class="footer">
        <div class="footer-content">
          <p>&copy; 2024 WG-Tools. 为开发者提供便捷的在线工具服务.</p>
          <p class="footer-links">
            <a href="https://github.com" target="_blank">GitHub</a>
            <span class="divider">|</span>
            <a href="/about">关于我们</a>
            <span class="divider">|</span>
            <a href="mailto:support@wgtools.com">联系我们</a>
          </p>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Tools, More, Menu } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式导航状态
const navMenuRef = ref()
const showMoreMenu = ref(false)
const isMobile = ref(false)
const hiddenMenuItems = ref<{path: string, title: string}[]>([])
const mobileMenuOpen = ref(false)

// 计算属性：过滤隐藏的菜单项
const hiddenAboutItems = computed(() => 
  hiddenMenuItems.value.filter(item => item.path === '/about')
)

const hiddenEntertainmentItems = computed(() => 
  hiddenMenuItems.value.filter(item => item.path === '/entertainment')
)

// 菜单项配置
const menuItems = [
  { path: '/', title: '首页', priority: 1 },
  { path: '/text', title: '📝 文本处理', priority: 2 },
  { path: '/encoding', title: '🔄 编码转换', priority: 3 },
  { path: '/dev', title: '🛠️ 开发工具', priority: 4 },
  { path: '/time', title: '⏰ 时间工具', priority: 5 },
  { path: '/security', title: '🔒 安全工具', priority: 6 },
  { path: '/docs', title: '📚 文档', priority: 7 },
  { path: '/utility', title: '🛠️ 实用工具', priority: 8 },
  { path: '/entertainment', title: '🎮 娱乐工具', priority: 9 },
  { path: '/about', title: '关于', priority: 10 }
]

// 检查导航栏宽度并调整显示
const checkNavWidth = () => {
  if (!navMenuRef.value) return
  
  const windowWidth = window.innerWidth
  
  // 移动端判断
  isMobile.value = windowWidth < 768
  
  if (isMobile.value) {
    showMoreMenu.value = false
    hiddenMenuItems.value = []
    return
  }
  
  // 桌面端响应式判断
  let hideItemsCount = 0
  
  if (windowWidth < 1200) {
    // 中等屏幕：隐藏娱乐工具和关于
    hideItemsCount = 2
  } else if (windowWidth < 1400) {
    // 较大屏幕：隐藏娱乐工具
    hideItemsCount = 1
  } else {
    // 大屏幕：显示所有菜单
    hideItemsCount = 0
  }
  
  if (hideItemsCount > 0) {
    hiddenMenuItems.value = menuItems.slice(-hideItemsCount).map(item => ({
      path: item.path,
      title: item.title
    }))
    showMoreMenu.value = true
  } else {
    showMoreMenu.value = false
    hiddenMenuItems.value = []
  }
}

// 移动端菜单切换
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 移动端菜单项点击处理
const handleMobileMenuClick = (path: string) => {
  router.push(path)
  closeMobileMenu()
}

// 窗口大小变化监听
const handleResize = () => {
  nextTick(() => {
    checkNavWidth()
    // 窗口大小变化时关闭移动端菜单
    if (mobileMenuOpen.value) {
      closeMobileMenu()
    }
  })
}

// 监听路由变化，关闭移动端菜单
watch(() => route.path, () => {
  if (mobileMenuOpen.value) {
    closeMobileMenu()
  }
})

onMounted(() => {
  nextTick(() => {
    checkNavWidth()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>

.layout-container {
  min-height: 100vh;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  padding: 0;
  height: 70px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.8;
  z-index: -1;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 30px;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 22px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 160px;
  margin-right: 30px;
}

.logo:hover {
  transform: translateY(-2px);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.logo-text {
  margin-left: 8px;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
  position: relative;
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.more-menu {
  margin-left: auto;
}

.main-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 130px);
  padding: 30px;
  padding-top: 100px;
  position: relative;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+') repeat;
  opacity: 0.3;
  pointer-events: none;
}

.footer {
  background: #fff;
  border-top: 1px solid #e4e7ed;
  height: 60px !important;
  display: flex;
  align-items: center;
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: #909399;
  font-size: 12px;
}

.footer-links {
  margin-top: 4px;
}

.footer-links a {
  color: #909399;
  text-decoration: none;
}

.footer-links a:hover {
  color: #409EFF;
}

.divider {
  margin: 0 8px;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  border-bottom: 2px solid transparent;
}

:deep(.el-menu--horizontal > .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff !important;
}

:deep(.el-sub-menu) {
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

:deep(.el-menu--popup) {
  background: #ffffff !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  padding: 12px 0;
  overflow: hidden;
  position: relative;
}

:deep(.el-menu--popup::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

:deep(.el-menu--popup .el-menu-item) {
  color: #1f2937 !important;
  font-weight: 500;
  padding: 14px 24px;
  margin: 3px 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.el-menu--popup .el-menu-item::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
  border-radius: 0 2px 2px 0;
}

:deep(.el-menu--popup .el-menu-item::after) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

:deep(.el-menu--popup .el-menu-item:hover) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff !important;
  transform: translateX(8px) scale(1.02);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

:deep(.el-menu--popup .el-menu-item:hover::before) {
  transform: scaleY(1);
}

:deep(.el-menu--popup .el-menu-item:hover::after) {
  opacity: 1;
}

/* 为特定菜单项添加图标样式 */
:deep(.el-menu--popup .el-menu-item[data-category="dev"]) {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="dev"]:hover) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="convert"]) {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="convert"]:hover) {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="time"]) {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(2, 132, 199, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="time"]:hover) {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="security"]) {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="security"]:hover) {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="docs"]) {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="docs"]:hover) {
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="text"]) {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="text"]:hover) {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="encoding"]) {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="encoding"]:hover) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="utility"]) {
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="utility"]:hover) {
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%) !important;
}

:deep(.el-menu--popup .el-menu-item[data-category="entertainment"]) {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%);
}

:deep(.el-menu--popup .el-menu-item[data-category="entertainment"]:hover) {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%) !important;
}

/* 菜单图标样式 */
.menu-icon {
  display: inline-block;
  margin-right: 8px;
  font-size: 16px;
  width: 20px;
  text-align: center;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom-color: #409EFF;
}


.el-menu--horizontal .el-menu .el-menu-item, .el-menu--horizontal .el-menu .el-sub-menu__title{
  color: #000;
}

/* 页面切换动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(1.02);
}

.page-fade-enter-to,
.page-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 增强整体动画效果 */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  scroll-behavior: smooth;
}

/* 优化滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

/* 增强卡片悬停效果 */
.tool-card,
.hero-section,
.card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
}

/* 按钮增强效果 */
.el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 响应式导航 */
@media (max-width: 1200px) {
  .header-content {
    max-width: 100%;
    padding: 0 20px;
  }
  
  .logo {
    min-width: 140px;
    margin-right: 20px;
  }
}

@media (max-width: 992px) {
  .header-content {
    padding: 0 15px;
  }
  
  .logo {
    min-width: 120px;
    margin-right: 15px;
    font-size: 20px;
  }
  
  :deep(.el-menu--horizontal .el-menu-item) {
    padding: 0 12px;
    font-size: 14px;
  }
  
  :deep(.el-sub-menu__title) {
    padding: 0 12px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    justify-content: flex-end;
  }
  
  .main-menu {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .header-content {
    padding: 0 15px;
  }
  
  .logo {
    min-width: 100px;
    margin-right: 10px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 10px;
  }
  
  .logo {
    min-width: 80px;
    font-size: 16px;
  }
  
  .logo-text {
    margin-left: 6px;
  }
}

/* 移动端下拉菜单样式 */
.mobile-menu-dropdown {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

.mobile-menu-content {
  background: #ffffff;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #ffffff;
}

.mobile-menu-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.mobile-menu-item:active {
  background: #e2e8f0;
}

.mobile-menu-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.mobile-menu-category {
  border-bottom: 2px solid #e2e8f0;
}

.mobile-category-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.mobile-menu-category .mobile-menu-item {
  padding-left: 32px;
  border-bottom: 1px solid #f8fafc;
}

.mobile-menu-category .mobile-menu-item:last-child {
  border-bottom: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
