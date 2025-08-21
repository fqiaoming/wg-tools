<template>
  <div class="quote-generator">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><ChatLineRound /></el-icon>
        </div>
        <h1 class="hero-title">随机语录生成器</h1>
        <p class="hero-description">获取每日灵感，让生活充满正能量和哲理思考</p>
      </div>
    </div>

    <!-- 语录显示区 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Star /></el-icon>
          今日语录
        </h3>
        <p class="card-description">点击生成按钮获取随机语录</p>
      </div>
      
      <div class="card-body">
        <!-- 语录类型选择 -->
        <div class="category-selector">
          <el-radio-group v-model="selectedCategory" @change="generateQuote" size="large">
            <el-radio-button
              v-for="category in categories"
              :key="category.key"
              :label="category.key"
            >
              <el-icon>
                <component :is="category.icon" />
              </el-icon>
              {{ category.name }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 语录展示区域 -->
        <div class="quote-display" :class="{ loading: isLoading }">
          <div v-if="isLoading" class="loading-animation">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>正在为您寻找最合适的语录...</p>
          </div>
          
          <div v-else-if="currentQuote" class="quote-content">
            <div class="quote-text">
              <i class="quote-mark start">"</i>
              {{ currentQuote.text }}
              <i class="quote-mark end">"</i>
            </div>
            <div class="quote-author" v-if="currentQuote.author">
              —— {{ currentQuote.author }}
            </div>
            <div class="quote-category">
              <el-tag :type="getCategoryTagType(currentQuote.category)">
                {{ getCategoryName(currentQuote.category) }}
              </el-tag>
            </div>
          </div>
          
          <div v-else class="placeholder">
            <el-icon class="placeholder-icon"><StarFilled /></el-icon>
            <p>点击下方按钮开始获取语录吧！</p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button 
            @click="generateQuote"
            type="primary"
            size="large"
            :loading="isLoading"
            class="generate-btn"
          >
            <el-icon><Refresh /></el-icon>
            {{ isLoading ? '生成中...' : '生成新语录' }}
          </el-button>
          
          <el-button 
            @click="copyQuote"
            size="large"
            :disabled="!currentQuote"
            class="copy-btn"
          >
            <el-icon><CopyDocument /></el-icon>
            复制语录
          </el-button>
          
          <el-button 
            @click="addToFavorites"
            size="large"
            :disabled="!currentQuote"
            class="favorite-btn"
          >
            <el-icon><StarFilled /></el-icon>
            收藏
          </el-button>
          
          <el-button 
            @click="shareQuote"
            size="large"
            :disabled="!currentQuote"
            class="share-btn"
          >
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>
      </div>
    </div>

    <!-- 每日推荐 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Calendar /></el-icon>
          每日推荐
        </h3>
        <p class="card-description">根据不同场景为您精选语录</p>
      </div>
      
      <div class="card-body">
        <div class="daily-recommendations">
          <div
            v-for="scene in dailyScenes"
            :key="scene.key"
            class="scene-card"
            @click="selectScene(scene)"
          >
            <div class="scene-icon">
              <el-icon>
                <component :is="scene.icon" />
              </el-icon>
            </div>
            <div class="scene-info">
              <h4>{{ scene.title }}</h4>
              <p>{{ scene.description }}</p>
            </div>
            <div class="scene-action">
              <el-button size="small" type="primary" plain>
                获取语录
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 收藏夹 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Collection /></el-icon>
          我的收藏
        </h3>
        <p class="card-description">您收藏的精彩语录</p>
      </div>
      
      <div class="card-body">
        <div v-if="favoriteQuotes.length === 0" class="no-favorites">
          <el-icon class="empty-icon"><StarFilled /></el-icon>
          <p>还没有收藏任何语录，快去发现喜欢的语录吧！</p>
        </div>
        
        <div v-else class="favorites-list">
          <div
            v-for="(quote, index) in favoriteQuotes"
            :key="index"
            class="favorite-item"
          >
            <div class="favorite-content">
              <div class="favorite-text">{{ quote.text }}</div>
              <div class="favorite-meta">
                <span class="favorite-author" v-if="quote.author">{{ quote.author }}</span>
                <el-tag size="small" :type="getCategoryTagType(quote.category)">
                  {{ getCategoryName(quote.category) }}
                </el-tag>
                <span class="favorite-date">{{ formatDate(quote.addedAt) }}</span>
              </div>
            </div>
            <div class="favorite-actions">
              <el-button 
                @click="copyFavoriteQuote(quote)"
                size="small"
                type="primary"
                plain
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
              <el-button 
                @click="removeFavorite(index)"
                size="small"
                type="danger"
                plain
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        
        <div v-if="favoriteQuotes.length > 0" class="favorites-actions">
          <el-button @click="exportFavorites" size="small">
            <el-icon><Download /></el-icon>
            导出收藏
          </el-button>
          <el-button @click="clearFavorites" size="small" type="danger">
            <el-icon><Delete /></el-icon>
            清空收藏
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatLineRound,
  Star,
  StarFilled,
  Calendar,
  Collection,
  Refresh,
  CopyDocument,
  Share,
  Delete,
  Download,
  TrendCharts,
  Briefcase,
  MagicStick,
  Coffee,
  Moon,
  Sunrise,
  Monitor
} from '@element-plus/icons-vue'

// 语录数据类型
interface Quote {
  text: string
  author?: string
  category: string
  addedAt?: number
}

// 响应式数据
const selectedCategory = ref('inspire')
const currentQuote = ref<Quote | null>(null)
const isLoading = ref(false)
const favoriteQuotes = ref<Quote[]>([])

// 语录类别配置
const categories = [
  { key: 'inspire', name: '励志', icon: 'TrendCharts' },
  { key: 'work', name: '工作', icon: 'Briefcase' },
  { key: 'life', name: '生活', icon: 'Coffee' },
  { key: 'philosophy', name: '哲理', icon: 'Star' },
  { key: 'funny', name: '搞笑', icon: 'MagicStick' },
  { key: 'moyu', name: '摸鱼', icon: 'Monitor' }
]

// 每日场景推荐
const dailyScenes = [
  {
    key: 'morning',
    title: '晨间激励',
    description: '开启美好一天的正能量',
    icon: 'Sunrise'
  },
  {
    key: 'work',
    title: '工作加油',
    description: '提升工作效率和动力',
    icon: 'Briefcase'
  },
  {
    key: 'break',
    title: '休息时光',
    description: '放松心情的温暖话语',
    icon: 'Coffee'
  },
  {
    key: 'evening',
    title: '夜晚思考',
    description: '深度思考人生的智慧',
    icon: 'Moon'
  }
]

// 语录数据库
const quotesDatabase = {
  inspire: [
    { text: '成功不是终点，失败不是终结，继续前进的勇气才是最重要的', author: '温斯顿·丘吉尔' },
    { text: '你只有努力奔跑，才能看起来毫不费力', author: '' },
    { text: '世界上最快乐的事，莫过于为理想而奋斗', author: '苏格拉底' },
    { text: '不要等待机会，而要创造机会', author: '' },
    { text: '成功的秘诀在于坚持自己的目标和信念', author: '本杰明·迪斯雷利' },
    { text: '每一个不曾起舞的日子，都是对生命的辜负', author: '尼采' },
    { text: '征服畏惧、建立自信的最快最确实的方法，就是去做你害怕的事', author: '' },
    { text: '路是脚踏出来的，历史是人写出来的', author: '吉鸿昌' }
  ],
  work: [
    { text: '工作不仅是为了生存，更是为了给人生赋予意义', author: '' },
    { text: '每一份努力都不会被辜负，每一分坚持都将成就更好的自己', author: '' },
    { text: '工作是一种乐趣时，生活是一种享受', author: '高尔基' },
    { text: '天才就是无止境刻苦勤奋的能力', author: '卡莱尔' },
    { text: '做对的事情比把事情做对重要', author: '彼得·德鲁克' },
    { text: '今天不努力工作，明天努力找工作', author: '' },
    { text: '业精于勤，荒于嬉；行成于思，毁于随', author: '韩愈' },
    { text: '工作是人生的价值，人生的欢乐，也是幸福之所在', author: '罗丹' }
  ],
  life: [
    { text: '生活就像一盒巧克力，你永远不知道下一颗是什么味道', author: '《阿甘正传》' },
    { text: '生活不是等待暴风雨过去，而是要学会在雨中起舞', author: '' },
    { text: '人生如茶，静心以对，浮生若梦，品茗论道', author: '' },
    { text: '简单的生活之所以很不容易，是因为要活得简单，你必须不去想太多', author: '' },
    { text: '生活的理想，就是为了理想的生活', author: '张闻天' },
    { text: '生活中最重要的不是你站在哪里，而是你朝哪个方向走', author: '' },
    { text: '热爱生活的人，生活也会忠实地爱他', author: '' },
    { text: '生活是一面镜子，你对它笑，它就对你笑', author: '' }
  ],
  philosophy: [
    { text: '我思故我在', author: '笛卡尔' },
    { text: '人不能两次踏进同一条河流', author: '赫拉克利特' },
    { text: '知己知彼，百战不殆', author: '孙子' },
    { text: '存在即合理', author: '黑格尔' },
    { text: '一个人的价值，应该看他贡献什么，而不应当看他取得什么', author: '爱因斯坦' },
    { text: '智者千虑，必有一失；愚者千虑，必有一得', author: '《史记》' },
    { text: '道可道，非常道；名可名，非常名', author: '老子' },
    { text: '人生如逆旅，我亦是行人', author: '苏轼' }
  ],
  funny: [
    { text: '不要和我比懒，我懒得和你比', author: '佚名网友' },
    { text: '我曾经跟一个人无数次擦肩而过，衣服都擦破了，也没擦出火花', author: '网络段子' },
    { text: '人生就像愤怒的小鸟，当你失败时，总有几只猪在笑', author: '网络段子' },
    { text: '早起的鸟儿有虫吃，早起的虫儿被鸟吃', author: '网络段子' },
    { text: '钱不是万能的，没有钱是万万不能的', author: '网络金句' },
    { text: '别人都在假装正经，那我就只好假装不正经了', author: '王朔' },
    { text: '人生就像超级玛丽，在你没有吃蘑菇之前，一个小小的乌龟就能把你干掉', author: '网络段子' },
    { text: '不是我不想减肥，而是敌人太狡猾了', author: '美食爱好者' }
  ],
  moyu: [
    { text: '摸鱼不是目的，快乐才是真谛', author: '摸鱼学导师' },
    { text: '今天的风真好，适合摸鱼', author: '办公室哲学家' },
    { text: '工作使我快乐，所以我快乐地摸鱼', author: '快乐打工人' },
    { text: '摸鱼一小时，快乐一整天', author: '时间管理大师' },
    { text: '只要我摸鱼足够快，deadline就追不上我', author: '拖延症患者' },
    { text: '适度摸鱼有益身心健康', author: '养生专家' },
    { text: '人生苦短，我选择摸鱼', author: '生活哲学家' },
    { text: '摸鱼使我冷静，冷静使我思考，思考使我摸鱼', author: '循环论证大师' }
  ]
}

// 获取类别名称
const getCategoryName = (key: string) => {
  const category = categories.find(c => c.key === key)
  return category ? category.name : key
}

// 获取标签类型
const getCategoryTagType = (category: string) => {
  const types: Record<string, string> = {
    inspire: 'danger',
    work: 'primary',
    life: 'success',
    philosophy: 'warning',
    funny: 'info',
    moyu: ''
  }
  return types[category] || ''
}

// 生成语录
const generateQuote = async () => {
  isLoading.value = true
  
  // 模拟加载时间
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
  
  const quotes = quotesDatabase[selectedCategory.value as keyof typeof quotesDatabase] || []
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    currentQuote.value = {
      ...quotes[randomIndex],
      category: selectedCategory.value
    }
  }
  
  isLoading.value = false
}

// 复制语录
const copyQuote = async () => {
  if (!currentQuote.value) return
  
  const text = currentQuote.value.author 
    ? `"${currentQuote.value.text}" —— ${currentQuote.value.author}`
    : `"${currentQuote.value.text}"`
  
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('语录已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 添加到收藏
const addToFavorites = () => {
  if (!currentQuote.value) return
  
  // 检查是否已收藏
  const isAlreadyFavorited = favoriteQuotes.value.some(
    quote => quote.text === currentQuote.value?.text
  )
  
  if (isAlreadyFavorited) {
    ElMessage.warning('该语录已在收藏夹中')
    return
  }
  
  favoriteQuotes.value.unshift({
    ...currentQuote.value,
    addedAt: Date.now()
  })
  
  // 限制收藏数量
  if (favoriteQuotes.value.length > 100) {
    favoriteQuotes.value = favoriteQuotes.value.slice(0, 100)
  }
  
  saveFavorites()
  ElMessage.success('已添加到收藏夹')
}

// 分享语录
const shareQuote = () => {
  if (!currentQuote.value) return
  
  const text = currentQuote.value.author 
    ? `"${currentQuote.value.text}" —— ${currentQuote.value.author}`
    : `"${currentQuote.value.text}"`
  
  if (navigator.share) {
    navigator.share({
      title: '分享语录',
      text: text,
      url: location.href
    }).catch(() => {
      // 如果分享失败，降级到复制
      copyQuote()
    })
  } else {
    // 降级到复制
    copyQuote()
  }
}

// 选择场景
const selectScene = (scene: any) => {
  // 根据场景选择对应的类别
  const sceneMapping: Record<string, string> = {
    morning: 'inspire',
    work: 'work',
    break: 'life',
    evening: 'philosophy'
  }
  
  selectedCategory.value = sceneMapping[scene.key] || 'inspire'
  generateQuote()
}

// 复制收藏的语录
const copyFavoriteQuote = async (quote: Quote) => {
  const text = quote.author 
    ? `"${quote.text}" —— ${quote.author}`
    : `"${quote.text}"`
  
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('语录已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 移除收藏
const removeFavorite = (index: number) => {
  favoriteQuotes.value.splice(index, 1)
  saveFavorites()
  ElMessage.success('已从收藏夹移除')
}

// 清空收藏
const clearFavorites = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有收藏吗？', '确认操作', {
      type: 'warning'
    })
    favoriteQuotes.value = []
    saveFavorites()
    ElMessage.success('收藏夹已清空')
  } catch {
    // 用户取消操作
  }
}

// 导出收藏
const exportFavorites = () => {
  if (favoriteQuotes.value.length === 0) {
    ElMessage.warning('收藏夹为空')
    return
  }
  
  const content = favoriteQuotes.value.map((quote, index) => {
    const text = quote.author 
      ? `${index + 1}. "${quote.text}" —— ${quote.author}`
      : `${index + 1}. "${quote.text}"`
    return text
  }).join('\n\n')
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `我的语录收藏_${new Date().toLocaleDateString()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('收藏夹已导出')
}

// 保存收藏到本地存储
const saveFavorites = () => {
  localStorage.setItem('quote_favorites', JSON.stringify(favoriteQuotes.value))
}

// 加载收藏
const loadFavorites = () => {
  const saved = localStorage.getItem('quote_favorites')
  if (saved) {
    try {
      favoriteQuotes.value = JSON.parse(saved)
    } catch (error) {
      favoriteQuotes.value = []
    }
  }
}

// 格式化日期
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

// 生命周期
onMounted(() => {
  loadFavorites()
  generateQuote()
})
</script>

<style scoped>
.quote-generator {
  --tool-color: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 引用公共样式 */
@import '@/styles/modern-tool.css';

/* 类别选择器 */
.category-selector {
  margin-bottom: 30px;
  text-align: center;
}

.category-selector .el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.category-selector .el-radio-button {
  margin: 0;
}

/* 语录显示区域 */
.quote-display {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  padding: 40px;
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border-radius: 16px;
  border: 1px solid #fed7aa;
  position: relative;
  overflow: hidden;
}

.quote-display::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="80" opacity="0.1">💭</text></svg>') no-repeat center;
  background-size: 120px;
  pointer-events: none;
}

/* 加载动画 */
.loading-animation {
  text-align: center;
  color: #d97706;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background: #f59e0b;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1);
  }
}

/* 语录内容 */
.quote-content {
  text-align: center;
  max-width: 800px;
  position: relative;
  z-index: 1;
}

.quote-text {
  font-size: 24px;
  line-height: 1.6;
  color: #92400e;
  margin-bottom: 20px;
  font-weight: 500;
  position: relative;
}

.quote-mark {
  font-size: 48px;
  font-family: serif;
  color: #f59e0b;
  opacity: 0.7;
  position: absolute;
}

.quote-mark.start {
  left: -30px;
  top: -10px;
}

.quote-mark.end {
  right: -30px;
  bottom: -20px;
}

.quote-author {
  font-size: 16px;
  color: #a16207;
  font-style: italic;
  margin-bottom: 15px;
}

.quote-category {
  display: flex;
  justify-content: center;
}

/* 占位符 */
.placeholder {
  text-align: center;
  color: #a16207;
}

.placeholder-icon {
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 16px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 30px;
}

.generate-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border: none;
  color: white;
  font-weight: 600;
  padding: 12px 30px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

/* 每日推荐场景 */
.daily-recommendations {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.scene-card {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.scene-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
}

.scene-icon {
  font-size: 32px;
  color: #f59e0b;
  flex-shrink: 0;
}

.scene-info {
  flex: 1;
}

.scene-info h4 {
  margin: 0 0 8px 0;
  color: #92400e;
  font-size: 16px;
}

.scene-info p {
  margin: 0;
  color: #a16207;
  font-size: 14px;
}

.scene-action {
  flex-shrink: 0;
}

/* 收藏夹 */
.no-favorites {
  text-align: center;
  padding: 40px 0;
  color: #a16207;
}

.empty-icon {
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 16px;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
}

.favorite-content {
  flex: 1;
}

.favorite-text {
  font-size: 16px;
  color: #92400e;
  margin-bottom: 12px;
  line-height: 1.5;
}

.favorite-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.favorite-author {
  font-style: italic;
  color: #a16207;
  font-size: 14px;
}

.favorite-date {
  font-size: 12px;
  color: #a16207;
}

.favorite-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.favorites-actions {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #fed7aa;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .quote-text {
    font-size: 20px;
  }
  
  .quote-mark.start {
    left: -20px;
  }
  
  .quote-mark.end {
    right: -20px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .el-button {
    width: 100%;
    max-width: 280px;
  }
  
  .scene-card {
    flex-direction: column;
    text-align: center;
  }
  
  .favorite-item {
    flex-direction: column;
  }
  
  .favorite-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .favorites-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .category-selector .el-radio-group {
    flex-direction: column;
    align-items: center;
  }
  
  .quote-display {
    padding: 20px;
  }
  
  .quote-text {
    font-size: 18px;
  }
  
  .daily-recommendations {
    grid-template-columns: 1fr;
  }
}
</style>
