<template>
  <div class="image-base64-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Picture /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.imageBase64') }}</h1>
        <p class="hero-description">{{ t('pages.imageBase64.description') }}</p>
      </div>
    </div>

    <!-- 转换模式选择卡片 -->
    <div class="mode-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Switch /></el-icon>
        </div>
        <h3>{{ t('pages.imageBase64.conversionMode') }}</h3>
        <div class="selector-description">{{ t('pages.imageBase64.selectDirection') }}</div>
      </div>
      
      <div class="selector-body">
        <el-radio-group v-model="mode" @change="resetData" size="large" class="mode-group">
          <el-radio-button label="imageToBase64">图片 → Base64</el-radio-button>
          <el-radio-button label="base64ToImage">Base64 → 图片</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 图片转Base64 -->
    <div v-if="mode === 'imageToBase64'" class="image-to-base64-card">
      <div class="card-header">
        <div class="card-icon">
          <el-icon><Upload /></el-icon>
        </div>
        <h3>图片转Base64</h3>
        <div class="card-description">上传图片文件转换为Base64编码</div>
      </div>
      
      <div class="card-body">
        <!-- 文件上传区域 -->
        <div class="upload-section">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="handleImageUpload"
            drag
            class="image-uploader"
          >
            <div v-if="!imagePreview" class="upload-placeholder">
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-text">拖拽图片到此处或<em>点击上传</em></div>
              <div class="upload-hint">支持 JPG、PNG、GIF、WebP 等格式，建议小于 2MB</div>
            </div>
            <div v-else class="uploaded-image">
              <img :src="imagePreview" alt="预览图片" class="preview-image" />
              <div class="image-overlay">
                <el-button @click.stop="removeImage" class="remove-btn">
                  <el-icon><Delete /></el-icon>
                  重新选择
                </el-button>
              </div>
            </div>
          </el-upload>
        </div>

        <!-- 图片信息 -->
        <div v-if="imageInfo" class="image-info">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">文件名</div>
              <div class="info-value">{{ imageInfo.name }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">文件大小</div>
              <div class="info-value">{{ formatFileSize(imageInfo.size) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">图片类型</div>
              <div class="info-value">{{ imageInfo.type }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Base64大小</div>
              <div class="info-value">{{ formatFileSize(base64Result.length * 0.75) }}</div>
            </div>
          </div>
        </div>

        <!-- Base64结果 -->
        <div v-if="base64Result" class="result-section">
          <div class="result-header">
            <h4 class="result-title">Base64编码结果</h4>
            <div class="result-actions">
              <el-button @click="copyBase64" type="primary" size="small">
                <el-icon><CopyDocument /></el-icon>
                复制完整编码
              </el-button>
              <el-button @click="copyDataUrl" size="small">
                <el-icon><Link /></el-icon>
                复制Data URL
              </el-button>
              <el-button @click="downloadBase64" size="small">
                <el-icon><Download /></el-icon>
                下载文本文件
              </el-button>
            </div>
          </div>
          
          <div class="result-content">
            <div class="format-tabs">
              <el-radio-group v-model="displayFormat" size="small">
                <el-radio-button label="base64">纯Base64</el-radio-button>
                <el-radio-button label="dataurl">Data URL</el-radio-button>
                <el-radio-button label="css">CSS背景</el-radio-button>
                <el-radio-button label="html">HTML图片</el-radio-button>
              </el-radio-group>
            </div>
            
            <el-input
              v-model="formattedResult"
              type="textarea"
              :rows="8"
              readonly
              class="result-textarea"
              placeholder="Base64编码结果将显示在这里..."
            />
            
            <div class="result-stats">
              <span class="stat-item">字符数: {{ base64Result.length.toLocaleString() }}</span>
              <span class="stat-item">压缩比: {{ getCompressionRatio() }}%</span>
              <span class="stat-item">编码时间: {{ encodeTime }}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Base64转图片 -->
    <div v-if="mode === 'base64ToImage'" class="base64-to-image-card">
      <div class="card-header">
        <div class="card-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3>Base64转图片</h3>
        <div class="card-description">输入Base64编码转换为图片</div>
      </div>
      
      <div class="card-body">
        <!-- Base64输入 -->
        <div class="base64-input-section">
          <div class="input-header">
            <h4 class="input-title">Base64编码输入</h4>
            <div class="input-actions">
              <el-button @click="pasteFromClipboard" size="small">
                <el-icon><CopyDocument /></el-icon>
                从剪贴板粘贴
              </el-button>
              <el-button @click="clearBase64Input" size="small">
                <el-icon><Delete /></el-icon>
                清空
              </el-button>
            </div>
          </div>
          
          <el-input
            v-model="base64Input"
            type="textarea"
            :rows="6"
            placeholder="请输入Base64编码或Data URL..."
            class="base64-input"
            @input="handleBase64Input"
          />
          
          <div class="input-examples">
            <div class="examples-header">
              <span class="examples-label">示例格式：</span>
            </div>
            <div class="examples-list">
              <div class="example-item">
                <code>iVBORw0KGgoAAAANSUhEUgAA...</code>
                <span class="example-desc">纯Base64</span>
              </div>
              <div class="example-item">
                <code>data:image/png;base64,iVBORw0K...</code>
                <span class="example-desc">Data URL</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 转换结果 -->
        <div v-if="decodedImage" class="decode-result-section">
          <div class="decode-result-header">
            <h4 class="decode-result-title">转换结果</h4>
            <div class="decode-result-actions">
              <el-button @click="downloadImage" type="primary" size="small">
                <el-icon><Download /></el-icon>
                下载图片
              </el-button>
              <el-button @click="copyImageUrl" size="small">
                <el-icon><Link /></el-icon>
                复制图片链接
              </el-button>
            </div>
          </div>
          
          <div class="decode-result-content">
            <div class="decoded-image-container">
              <img :src="decodedImage" alt="解码图片" class="decoded-image" />
            </div>
            
            <div class="decode-info">
              <div class="decode-info-grid">
                <div class="decode-info-item">
                  <div class="decode-info-label">图片类型</div>
                  <div class="decode-info-value">{{ decodedImageType }}</div>
                </div>
                <div class="decode-info-item">
                  <div class="decode-info-label">原始大小</div>
                  <div class="decode-info-value">{{ formatFileSize(base64Input.length * 0.75) }}</div>
                </div>
                <div class="decode-info-item">
                  <div class="decode-info-label">解码时间</div>
                  <div class="decode-info-value">{{ decodeTime }}ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="decodeError" class="decode-error">
          <el-alert
            :title="decodeError"
            type="error"
            :closable="false"
          />
        </div>
      </div>
    </div>

    <!-- 使用说明卡片 -->
    <div class="usage-card">
      <div class="usage-header">
        <div class="usage-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>使用说明</h3>
        <div class="usage-description">Base64图片转换的详细指南</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🖼️</div>
            <h4>图片转Base64</h4>
            <p>将图片文件转换为Base64编码，支持拖拽上传和多种图片格式</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <h4>Base64转图片</h4>
            <p>将Base64编码还原为图片文件，支持Data URL格式自动识别</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📋</div>
            <h4>多种输出格式</h4>
            <p>提供纯Base64、Data URL、CSS背景、HTML图片等多种输出格式</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>详细统计</h4>
            <p>显示文件大小、压缩比、转换时间等详细统计信息</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>便捷操作</h4>
            <p>支持一键复制、下载、剪贴板粘贴等便捷操作</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <h4>客户端处理</h4>
            <p>所有转换在本地进行，保护您的图片隐私和安全</p>
          </div>
        </div>

        <div class="use-cases-section">
          <h4 class="cases-title">应用场景：</h4>
          <div class="cases-grid">
            <div class="case-item">
              <span class="case-icon">🌐</span>
              <span class="case-text">网页开发 - 内嵌小图标和背景图</span>
            </div>
            <div class="case-item">
              <span class="case-icon">📧</span>
              <span class="case-text">邮件模板 - 嵌入图片避免附件</span>
            </div>
            <div class="case-item">
              <span class="case-icon">📱</span>
              <span class="case-text">移动应用 - 减少HTTP请求次数</span>
            </div>
            <div class="case-item">
              <span class="case-icon">🔧</span>
              <span class="case-text">API接口 - 图片数据传输</span>
            </div>
            <div class="case-item">
              <span class="case-icon">📄</span>
              <span class="case-text">文档生成 - PDF、Word等文档图片</span>
            </div>
            <div class="case-item">
              <span class="case-icon">🎨</span>
              <span class="case-text">CSS样式 - 背景图片内联处理</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  Picture,
  Switch,
  Upload,
  Delete,
  Document,
  CopyDocument,
  Link,
  Download,
  InfoFilled
} from '@element-plus/icons-vue'
import { imageBase64Tool, type ToolResponse } from '../../utils/newTools'

const { t } = useI18n()
const mode = ref('imageToBase64')
const imagePreview = ref('')
const imageInfo = ref<any>(null)
const base64Result = ref('')
const base64Input = ref('')
const decodedImage = ref('')
const decodedImageType = ref('')
const decodeError = ref('')
const displayFormat = ref('base64')
const encodeTime = ref(0)
const decodeTime = ref(0)

// 重置数据
const resetData = () => {
  imagePreview.value = ''
  imageInfo.value = null
  base64Result.value = ''
  base64Input.value = ''
  decodedImage.value = ''
  decodedImageType.value = ''
  decodeError.value = ''
  encodeTime.value = 0
  decodeTime.value = 0
}

// 处理图片上传
const handleImageUpload = async (file: any) => {
  const startTime = Date.now()
  
  try {
    const response: ToolResponse = await imageBase64Tool.imageToBase64(file.raw)
    
    if (response.success) {
      imagePreview.value = URL.createObjectURL(file.raw)
      imageInfo.value = {
        name: file.name,
        size: file.size,
        type: file.raw.type
      }
      base64Result.value = response.result
      encodeTime.value = Date.now() - startTime
      ElMessage.success('图片转换成功！')
    } else {
      ElMessage.error(response.error || '转换失败')
    }
  } catch (error) {
    ElMessage.error('转换失败，请重试')
    console.error('图片转换错误:', error)
  }
}

// 移除图片
const removeImage = () => {
  imagePreview.value = ''
  imageInfo.value = null
  base64Result.value = ''
  encodeTime.value = 0
}

// 处理Base64输入
const handleBase64Input = async () => {
  decodeError.value = ''
  decodedImage.value = ''
  decodedImageType.value = ''
  
  if (!base64Input.value.trim()) {
    return
  }
  
  const startTime = Date.now()
  
  try {
    const response: ToolResponse = imageBase64Tool.base64ToImage(base64Input.value.trim())
    
    if (response.success) {
      decodedImage.value = response.result
      decodedImageType.value = getImageTypeFromDataUrl(response.result)
      decodeTime.value = Date.now() - startTime
      ElMessage.success('Base64解码成功！')
    } else {
      decodeError.value = response.error || 'Base64解码失败'
    }
  } catch (error) {
    decodeError.value = 'Base64格式错误或不是有效的图片数据'
  }
}

// 格式化结果
const formattedResult = computed(() => {
  if (!base64Result.value) return ''
  
  const mimeType = imageInfo.value?.type || 'image/png'
  
  switch (displayFormat.value) {
    case 'base64':
      return base64Result.value
    case 'dataurl':
      return `data:${mimeType};base64,${base64Result.value}`
    case 'css':
      return `background-image: url('data:${mimeType};base64,${base64Result.value}');`
    case 'html':
      return `<img src="data:${mimeType};base64,${base64Result.value}" alt="Base64 Image" />`
    default:
      return base64Result.value
  }
})

// 获取图片类型
const getImageTypeFromDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/data:image\/([^;]+)/)
  return match ? match[1].toUpperCase() : 'Unknown'
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 获取压缩比
const getCompressionRatio = () => {
  if (!imageInfo.value || !base64Result.value) return 0
  const originalSize = imageInfo.value.size
  const base64Size = base64Result.value.length * 0.75
  return Math.round((base64Size / originalSize) * 100)
}

// 复制Base64
const copyBase64 = async () => {
  try {
    await navigator.clipboard.writeText(base64Result.value)
    ElMessage.success('Base64编码已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 复制Data URL
const copyDataUrl = async () => {
  try {
    const mimeType = imageInfo.value?.type || 'image/png'
    const dataUrl = `data:${mimeType};base64,${base64Result.value}`
    await navigator.clipboard.writeText(dataUrl)
    ElMessage.success('Data URL已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载Base64文本
const downloadBase64 = () => {
  if (!base64Result.value) {
    ElMessage.warning('没有Base64数据可下载')
    return
  }

  const content = formattedResult.value
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `base64-${displayFormat.value}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('Base64文件下载成功！')
}

// 从剪贴板粘贴
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text.trim()) {
      base64Input.value = text.trim()
      handleBase64Input()
      ElMessage.success('已从剪贴板粘贴内容')
    } else {
      ElMessage.warning('剪贴板内容为空')
    }
  } catch (error) {
    ElMessage.error('读取剪贴板失败')
  }
}

// 清空Base64输入
const clearBase64Input = () => {
  base64Input.value = ''
  decodedImage.value = ''
  decodedImageType.value = ''
  decodeError.value = ''
  decodeTime.value = 0
}

// 下载图片
const downloadImage = () => {
  if (!decodedImage.value) {
    ElMessage.warning('没有图片可下载')
    return
  }

  const link = document.createElement('a')
  link.href = decodedImage.value
  link.download = `decoded-image.${decodedImageType.value.toLowerCase()}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  ElMessage.success('图片下载成功！')
}

// 复制图片链接
const copyImageUrl = async () => {
  try {
    await navigator.clipboard.writeText(decodedImage.value)
    ElMessage.success('图片链接已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.image-base64-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #8b5cf6;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
.mode-selector-card,
.image-to-base64-card,
.base64-to-image-card,
.usage-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

/* 卡片头部 */
.selector-header,
.card-header,
.usage-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.selector-icon,
.card-icon,
.usage-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.selector-header h3,
.card-header h3,
.usage-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.selector-description,
.card-description,
.usage-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 模式选择 */
.mode-group {
  justify-content: center;
}

/* 图片上传 */
.upload-section {
  margin-bottom: 24px;
}

.image-uploader {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
  position: relative;
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--primary-color);
  background: #faf5ff;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.remove-btn {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid #e2e8f0;
}

/* 图片信息 */
.image-info {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 结果区域 */
.result-section {
  margin-bottom: 24px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.result-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.result-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.result-content {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.format-tabs {
  margin-bottom: 16px;
}

.result-textarea :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.result-stats {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 12px;
  color: #6b7280;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

/* Base64输入 */
.base64-input-section {
  margin-bottom: 24px;
}

.input-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.input-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.input-actions {
  display: flex;
  gap: 8px;
}

.base64-input :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.base64-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.input-examples {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.examples-header {
  margin-bottom: 12px;
}

.examples-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.examples-list {
  display: grid;
  gap: 8px;
}

.example-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.example-item code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: var(--primary-color);
  background: #faf5ff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e9d5ff;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.example-desc {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* 解码结果 */
.decode-result-section {
  margin-bottom: 24px;
}

.decode-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.decode-result-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.decode-result-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.decode-result-content {
  display: grid;
  gap: 20px;
}

.decoded-image-container {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.decoded-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.decode-info {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.decode-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.decode-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.decode-info-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.decode-info-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 错误提示 */
.decode-error {
  margin-bottom: 20px;
}

/* 功能特色 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.feature-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-item h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.feature-item p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 应用场景 */
.use-cases-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.cases-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.case-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.case-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.case-icon {
  font-size: 18px;
}

.case-text {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-base64-tool {
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
  
  .mode-selector-card,
  .image-to-base64-card,
  .base64-to-image-card,
  .usage-card {
    padding: 20px 16px;
  }
  
  .info-grid,
  .decode-info-grid {
    grid-template-columns: 1fr;
  }
  
  .result-header,
  .input-header,
  .decode-result-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .result-actions,
  .input-actions,
  .decode-result-actions {
    justify-content: center;
  }
  
  .feature-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }
  
  .result-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .examples-list {
    gap: 4px;
  }
  
  .example-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .decode-result-content {
    gap: 16px;
  }
}
</style>