<template>
  <div class="icon-generator">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Picture /></el-icon>
        </div>
        <h1 class="hero-title">图标生成器</h1>
        <p class="hero-description">快速生成各种风格的图标，支持多种尺寸和格式导出</p>
      </div>
    </div>

    <!-- 配置卡片 -->
    <div class="config-card">
      <div class="config-header">
        <div class="config-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>图标配置</h3>
        <div class="config-description">自定义图标样式和参数</div>
      </div>
      
      <div class="config-body">
        <!-- 图标类型选择 -->
        <div class="type-section">
          <label class="type-label">图标类型</label>
          <div class="type-grid">
            <div 
              v-for="type in iconTypes" 
              :key="type.value"
              class="type-item"
              :class="{ active: iconConfig.type === type.value }"
              @click="selectType(type.value)"
            >
              <div class="type-icon">{{ type.icon }}</div>
              <div class="type-name">{{ type.name }}</div>
            </div>
          </div>
        </div>

        <!-- 文本输入 -->
        <div class="text-section">
          <label class="text-label">图标文本</label>
          <el-input
            v-model="iconConfig.text"
            placeholder="输入要生成图标的文本（支持emoji和中英文）"
            maxlength="10"
            show-word-limit
            size="large"
            class="text-input"
            @input="generateIcon"
          />
          <div class="text-examples">
            <span class="example-label">示例：</span>
            <el-button 
              size="small" 
              @click="setText('🚀')"
              class="example-btn"
            >
              🚀
            </el-button>
            <el-button 
              size="small" 
              @click="setText('💡')"
              class="example-btn"
            >
              💡
            </el-button>
            <el-button 
              size="small" 
              @click="setText('WG')"
              class="example-btn"
            >
              WG
            </el-button>
            <el-button 
              size="small" 
              @click="setText('A')"
              class="example-btn"
            >
              A
            </el-button>
          </div>
        </div>

        <!-- 颜色配置 -->
        <div class="color-section">
          <div class="color-row">
            <div class="color-item">
              <label class="color-label">背景颜色</label>
              <el-color-picker 
                v-model="iconConfig.backgroundColor" 
                @change="generateIcon"
                show-alpha
                size="large"
              />
            </div>
            <div class="color-item">
              <label class="color-label">文字颜色</label>
              <el-color-picker 
                v-model="iconConfig.textColor" 
                @change="generateIcon"
                show-alpha
                size="large"
              />
            </div>
          </div>
          
          <div class="color-presets">
            <span class="preset-label">预设配色：</span>
            <div class="preset-buttons">
              <el-button 
                size="small" 
                @click="applyColorScheme('blue')"
                class="preset-btn"
                style="background: #3b82f6; color: white;"
              >
                蓝色
              </el-button>
              <el-button 
                size="small" 
                @click="applyColorScheme('green')"
                class="preset-btn"
                style="background: #10b981; color: white;"
              >
                绿色
              </el-button>
              <el-button 
                size="small" 
                @click="applyColorScheme('purple')"
                class="preset-btn"
                style="background: #8b5cf6; color: white;"
              >
                紫色
              </el-button>
              <el-button 
                size="small" 
                @click="applyColorScheme('orange')"
                class="preset-btn"
                style="background: #f59e0b; color: white;"
              >
                橙色
              </el-button>
            </div>
          </div>
        </div>

        <!-- 尺寸配置 -->
        <div class="size-section">
          <label class="size-label">图标尺寸：{{ iconConfig.size }}px</label>
          <el-slider
            v-model="iconConfig.size"
            :min="64"
            :max="512"
            :step="32"
            @change="generateIcon"
            class="size-slider"
          />
          <div class="size-presets">
            <el-button 
              size="small" 
              @click="setSize(64)"
              :type="iconConfig.size === 64 ? 'primary' : 'default'"
              class="preset-btn"
            >
              64px
            </el-button>
            <el-button 
              size="small" 
              @click="setSize(128)"
              :type="iconConfig.size === 128 ? 'primary' : 'default'"
              class="preset-btn"
            >
              128px
            </el-button>
            <el-button 
              size="small" 
              @click="setSize(256)"
              :type="iconConfig.size === 256 ? 'primary' : 'default'"
              class="preset-btn"
            >
              256px
            </el-button>
            <el-button 
              size="small" 
              @click="setSize(512)"
              :type="iconConfig.size === 512 ? 'primary' : 'default'"
              class="preset-btn"
            >
              512px
            </el-button>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="generateIcon"
            :disabled="!iconConfig.text.trim()"
            :loading="loading"
            class="generate-button"
          >
            <el-icon><MagicStick /></el-icon>
            生成图标
          </el-button>
          <el-button 
            size="large" 
            @click="randomize"
            class="random-button"
          >
            <el-icon><Refresh /></el-icon>
            随机生成
          </el-button>
        </div>
      </div>
    </div>

    <!-- 预览和下载卡片 -->
    <div v-if="iconDataUrl" class="result-card">
      <div class="result-header">
        <div class="result-icon">
          <el-icon><View /></el-icon>
        </div>
        <h3>图标预览</h3>
        <div class="result-description">预览和下载生成的图标</div>
      </div>
      
      <div class="result-body">
        <div class="preview-section">
          <div class="icon-preview">
            <img :src="iconDataUrl" :alt="iconConfig.text" class="preview-image" />
            <div class="preview-info">
              <div class="preview-text">{{ iconConfig.text }}</div>
              <div class="preview-size">{{ iconConfig.size }} × {{ iconConfig.size }}px</div>
              <div class="preview-type">{{ getTypeName(iconConfig.type) }}</div>
            </div>
          </div>
          
          <div class="size-variants">
            <div class="variant-label">不同尺寸预览：</div>
            <div class="variant-grid">
              <div 
                v-for="size in [32, 64, 128]" 
                :key="size"
                class="variant-item"
              >
                <img 
                  :src="iconDataUrl" 
                  :alt="iconConfig.text" 
                  :style="{ width: size + 'px', height: size + 'px' }"
                  class="variant-image"
                />
                <span class="variant-size">{{ size }}px</span>
              </div>
            </div>
          </div>
        </div>

        <div class="download-section">
          <div class="download-buttons">
            <el-button 
              type="primary" 
              @click="downloadIcon('png')"
              class="download-btn"
            >
              <el-icon><Download /></el-icon>
              下载PNG
            </el-button>
            <el-button 
              @click="downloadIcon('jpg')"
              class="download-btn"
            >
              <el-icon><Download /></el-icon>
              下载JPG
            </el-button>
            <el-button 
              @click="copyIcon"
              class="download-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              复制图片
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用场景卡片 -->
    <div class="usage-card">
      <div class="usage-header">
        <div class="usage-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>使用场景</h3>
        <div class="usage-description">图标生成器的应用场景</div>
      </div>
      <div class="usage-body">
        <div class="scene-grid">
          <div class="scene-item">
            <div class="scene-icon">📱</div>
            <h4>应用图标</h4>
            <p>生成移动应用、桌面应用的图标</p>
          </div>
          <div class="scene-item">
            <div class="scene-icon">🌐</div>
            <h4>网站图标</h4>
            <p>制作网站favicon、logo等标识</p>
          </div>
          <div class="scene-item">
            <div class="scene-icon">👤</div>
            <h4>头像生成</h4>
            <p>创建个性化用户头像、占位图</p>
          </div>
          <div class="scene-item">
            <div class="scene-icon">🎨</div>
            <h4>UI设计</h4>
            <p>快速生成UI界面所需的图标元素</p>
          </div>
        </div>

        <div class="tips-section">
          <h4 class="tips-title">设计建议：</h4>
          <div class="tips-list">
            <div class="tip-item">
              <span class="tip-icon">💡</span>
              <span class="tip-text">使用简洁的文字或符号，避免过于复杂</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              <span class="tip-text">选择对比度高的颜色组合，确保清晰可见</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">📐</span>
              <span class="tip-text">根据使用场景选择合适的尺寸规格</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🌈</span>
              <span class="tip-text">保持风格统一，建议使用品牌色彩</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Picture,
  Setting,
  MagicStick,
  Refresh,
  View,
  Download,
  CopyDocument,
  InfoFilled
} from '@element-plus/icons-vue'
import { iconGeneratorTool, type ToolResponse } from '../../utils/newTools'

const loading = ref(false)
const iconDataUrl = ref('')

const iconConfig = reactive({
  text: 'WG',
  type: 'square',
  backgroundColor: '#3b82f6',
  textColor: '#ffffff',
  size: 256
})

// 图标类型
const iconTypes = [
  { value: 'square', name: '方形', icon: '⬜' },
  { value: 'circle', name: '圆形', icon: '⭕' },
  { value: 'rounded', name: '圆角', icon: '🔲' },
  { value: 'hexagon', name: '六边形', icon: '⬡' }
]

// 选择类型
const selectType = (type: string) => {
  iconConfig.type = type
  generateIcon()
}

// 设置文本
const setText = (text: string) => {
  iconConfig.text = text
  generateIcon()
}

// 应用配色方案
const applyColorScheme = (scheme: string) => {
  const schemes = {
    blue: { bg: '#3b82f6', text: '#ffffff' },
    green: { bg: '#10b981', text: '#ffffff' },
    purple: { bg: '#8b5cf6', text: '#ffffff' },
    orange: { bg: '#f59e0b', text: '#ffffff' }
  }
  
  const colors = schemes[scheme as keyof typeof schemes]
  if (colors) {
    iconConfig.backgroundColor = colors.bg
    iconConfig.textColor = colors.text
    generateIcon()
  }
}

// 设置尺寸
const setSize = (size: number) => {
  iconConfig.size = size
  generateIcon()
}

// 生成图标
const generateIcon = async () => {
  if (!iconConfig.text.trim()) {
    iconDataUrl.value = ''
    return
  }

  loading.value = true
  
  try {
    // 直接在前端生成图标，不依赖工具函数
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('无法创建Canvas上下文')
    }
    
    // 设置画布大小
    const size = iconConfig.size
    canvas.width = size
    canvas.height = size
    
    // 绘制背景
    ctx.fillStyle = iconConfig.backgroundColor
    
    if (iconConfig.type === 'circle') {
      // 圆形背景
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
      ctx.fill()
    } else if (iconConfig.type === 'rounded') {
      // 圆角矩形背景
      const radius = size * 0.15
      ctx.beginPath()
      
      // 手动绘制圆角矩形（兼容性更好）
      ctx.moveTo(radius, 0)
      ctx.lineTo(size - radius, 0)
      ctx.quadraticCurveTo(size, 0, size, radius)
      ctx.lineTo(size, size - radius)
      ctx.quadraticCurveTo(size, size, size - radius, size)
      ctx.lineTo(radius, size)
      ctx.quadraticCurveTo(0, size, 0, size - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
      ctx.closePath()
      ctx.fill()
    } else if (iconConfig.type === 'hexagon') {
      // 六边形背景
      const centerX = size / 2
      const centerY = size / 2
      const radius = size * 0.4
      
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()
    } else {
      // 矩形背景
      ctx.fillRect(0, 0, size, size)
    }
    
    // 绘制文字
    ctx.fillStyle = iconConfig.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 动态计算字体大小
    let fontSize = size * 0.4
    if (iconConfig.text.length > 1) {
      fontSize = size * (0.6 / iconConfig.text.length)
    }
    fontSize = Math.max(fontSize, size * 0.2) // 最小字体大小
    
    ctx.font = `bold ${fontSize}px Arial, "Microsoft YaHei", sans-serif`
    
    // 绘制文字
    ctx.fillText(iconConfig.text, size / 2, size / 2)
    
    // 转换为DataURL
    iconDataUrl.value = canvas.toDataURL('image/png')
    ElMessage.success('图标生成成功！')
    
  } catch (error) {
    ElMessage.error('生成过程中发生错误')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 随机生成
const randomize = () => {
  const emojis = ['🚀', '💡', '⭐', '🎯', '🔥', '💎', '🌟', '⚡', '🎨', '🌈', '📱', '💻', '🖥️', '⌚', '🎮', '🔧', '⚙️', '🛠️']
  const letters = ['A', 'B', 'C', 'WG', 'UI', 'AI', 'JS', 'TS', 'VUE', 'GO', 'PY', 'APP']
  const chinese = ['工', '具', '码', '前', '端', '开', '发', '设', '计', '创', '新', '技', '术', '智']
  const symbols = ['@', '#', '$', '%', '&', '*', '+', '=', '?', '!']
  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316']
  const textColors = ['#ffffff', '#000000', '#1f2937', '#374151']
  const types = ['square', 'circle', 'rounded', 'hexagon']
  
  const allTexts = [...emojis, ...letters, ...chinese, ...symbols]
  iconConfig.text = allTexts[Math.floor(Math.random() * allTexts.length)]
  iconConfig.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  iconConfig.textColor = textColors[Math.floor(Math.random() * textColors.length)]
  iconConfig.type = types[Math.floor(Math.random() * types.length)]
  
  generateIcon()
  ElMessage.info('已随机生成图标配置')
}



// 获取类型名称
const getTypeName = (type: string) => {
  const typeObj = iconTypes.find(t => t.value === type)
  return typeObj ? typeObj.name : '方形'
}

// 下载图标
const downloadIcon = (format: string) => {
  if (!iconDataUrl.value) {
    ElMessage.warning('请先生成图标')
    return
  }

  try {
    const link = document.createElement('a')
    link.download = `icon-${iconConfig.text}-${iconConfig.size}x${iconConfig.size}.${format}`
    
    if (format === 'jpg') {
      // 转换为JPG格式
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        canvas.width = iconConfig.size
        canvas.height = iconConfig.size
        ctx!.fillStyle = '#ffffff'
        ctx!.fillRect(0, 0, iconConfig.size, iconConfig.size)
        ctx!.drawImage(img, 0, 0)
        
        link.href = canvas.toDataURL('image/jpeg', 0.9)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      img.src = iconDataUrl.value
    } else {
      link.href = iconDataUrl.value
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    
    ElMessage.success(`${format.toUpperCase()}格式下载成功！`)
  } catch (error) {
    ElMessage.error('下载失败')
    console.error('下载错误:', error)
  }
}

// 复制图标
const copyIcon = async () => {
  if (!iconDataUrl.value) {
    ElMessage.warning('请先生成图标')
    return
  }

  try {
    const response = await fetch(iconDataUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    ElMessage.success('图标已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败，请使用下载功能')
    console.error('复制错误:', error)
  }
}
</script>

<style scoped>
.icon-generator {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #ec4899;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  border-radius: 16px;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-icon {
  font-size: 48px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.hero-description {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

/* 通用卡片样式 */
.config-card,
.result-card,
.usage-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

.config-card:hover,
.result-card:hover,
.usage-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 卡片头部 */
.config-header,
.result-header,
.usage-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.config-icon,
.result-icon,
.usage-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.config-header h3,
.result-header h3,
.usage-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.config-description,
.result-description,
.usage-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

.config-body,
.result-body,
.usage-body {
  display: grid;
  gap: 24px;
}

/* 图标类型选择 */
.type-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.type-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-item:hover {
  border-color: var(--primary-color);
  background: #fdf2f8;
}

.type-item.active {
  border-color: var(--primary-color);
  background: #fdf2f8;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.type-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.type-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* 文本输入 */
.text-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.text-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.text-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-color);
}

.text-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.text-examples {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.example-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.example-btn {
  font-size: 12px;
  padding: 4px 8px;
}

/* 颜色配置 */
.color-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-row {
  display: flex;
  gap: 24px;
  align-items: flex-end;
}

.color-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.color-presets {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.preset-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-btn {
  font-size: 12px;
  padding: 4px 8px;
}

/* 尺寸配置 */
.size-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.size-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
  display: block;
}

.size-slider {
  margin-bottom: 16px;
}

.size-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px 0;
}

.generate-button {
  min-width: 160px;
}

.random-button {
  min-width: 120px;
}

/* 预览和下载 */
.preview-section {
  display: grid;
  gap: 24px;
}

.icon-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.preview-image {
  max-width: 256px;
  max-height: 256px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-info {
  text-align: center;
}

.preview-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.preview-size {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin-bottom: 4px;
}

.preview-type {
  font-size: 12px;
  color: #6b7280;
}

.size-variants {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.variant-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.variant-grid {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
}

.variant-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.variant-image {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.variant-size {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.download-section {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.download-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.download-btn {
  min-width: 120px;
}

/* 使用场景 */
.scene-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.scene-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.3s ease;
}

.scene-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.scene-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.scene-item h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.scene-item p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.tips-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tips-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.tips-list {
  display: grid;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tip-icon {
  font-size: 18px;
}

.tip-text {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .icon-generator {
    padding: 16px;
  }
  
  .hero-section {
    margin-bottom: 24px;
    padding: 24px 16px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .config-card,
  .result-card,
  .usage-card {
    padding: 20px 16px;
  }
  
  .type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .color-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .scene-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .generate-button,
  .random-button {
    width: 100%;
  }
  
  .download-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .download-btn {
    width: 100%;
  }
  
  .variant-grid {
    flex-wrap: wrap;
  }
  
  .config-header,
  .result-header,
  .usage-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .config-description,
  .result-description,
  .usage-description {
    margin-left: 0;
  }
}
</style>