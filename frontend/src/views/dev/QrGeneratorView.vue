<template>
  <div class="qr-generator">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.qrGenerator') }}</h1>
        <p class="hero-description">快速生成高质量二维码，支持多种尺寸和格式定制</p>
      </div>
    </div>

    <!-- 配置卡片 -->
    <div class="config-card">
      <div class="config-header">
        <div class="config-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>二维码配置</h3>
        <div class="config-description">自定义二维码参数</div>
      </div>
      
      <div class="config-body">
        <!-- 内容输入 -->
        <div class="input-section">
          <label class="input-label">二维码内容</label>
          <el-input
            v-model="qrText"
            type="textarea"
            placeholder="请输入要生成二维码的内容，支持文本、链接、电话号码等..."
            :rows="4"
            class="qr-input"
            @input="generateQr"
          />
          <div class="input-tips">
            <div class="tip-items">
              <el-button size="small" @click="loadExample('url')" class="tip-btn">
                网址示例
              </el-button>
              <el-button size="small" @click="loadExample('text')" class="tip-btn">
                文本示例
              </el-button>
              <el-button size="small" @click="loadExample('phone')" class="tip-btn">
                电话示例
              </el-button>
              <el-button size="small" @click="loadExample('email')" class="tip-btn">
                邮箱示例
              </el-button>
            </div>
          </div>
        </div>

        <!-- 尺寸配置 -->
        <div class="size-section">
          <div class="size-header">
            <label class="size-label">二维码尺寸</label>
            <span class="size-value">{{ qrSize }} × {{ qrSize }} 像素</span>
          </div>
          <el-slider
            v-model="qrSize"
            :min="128"
            :max="512"
            :step="32"
            @change="generateQr"
            class="size-slider"
          />
          <div class="size-presets">
            <el-button 
              size="small" 
              @click="setSize(128)"
              :type="qrSize === 128 ? 'primary' : 'default'"
              class="preset-btn"
            >
              小 (128px)
            </el-button>
            <el-button 
              size="small" 
              @click="setSize(256)"
              :type="qrSize === 256 ? 'primary' : 'default'"
              class="preset-btn"
            >
              中 (256px)
            </el-button>
            <el-button 
              size="small" 
              @click="setSize(384)"
              :type="qrSize === 384 ? 'primary' : 'default'"
              class="preset-btn"
            >
              大 (384px)
            </el-button>
            <el-button 
              size="small" 
              @click="setSize(512)"
              :type="qrSize === 512 ? 'primary' : 'default'"
              class="preset-btn"
            >
              超大 (512px)
            </el-button>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="generateQr"
            :disabled="!qrText.trim()"
            :loading="loading"
            class="generate-button"
          >
            <el-icon><MagicStick /></el-icon>
            生成二维码
          </el-button>
          <el-button 
            size="large" 
            @click="clearAll"
            class="clear-button"
          >
            <el-icon><Delete /></el-icon>
            清空内容
          </el-button>
        </div>
      </div>
    </div>

    <!-- 结果卡片 -->
    <div v-if="qrDataUrl" class="result-card">
      <div class="result-header">
        <div class="result-icon">
          <el-icon><Picture /></el-icon>
        </div>
        <h3>生成结果</h3>
        <div class="result-description">二维码预览和下载</div>
      </div>
      
      <div class="result-body">
        <div class="qr-preview">
          <div class="qr-container">
            <img :src="qrDataUrl" :alt="qrText" class="qr-image" />
            <div class="qr-info">
              <div class="qr-size-info">{{ qrSize }} × {{ qrSize }}px</div>
              <div class="qr-content-preview">{{ qrText.length > 50 ? qrText.substring(0, 50) + '...' : qrText }}</div>
            </div>
          </div>
          
          <div class="qr-actions">
            <el-button 
              type="primary" 
              @click="downloadQr"
              class="download-btn"
            >
              <el-icon><Download /></el-icon>
              下载PNG
            </el-button>
            <el-button 
              @click="copyImageToClipboard"
              class="copy-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              复制图片
            </el-button>
          </div>
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
        <div class="usage-description">二维码生成器的功能特色</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🔗</div>
            <h4>多种内容</h4>
            <p>支持网址、文本、电话、邮箱等多种内容类型</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📏</div>
            <h4>自定义尺寸</h4>
            <p>支持128px到512px多种尺寸，满足不同需求</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>快速下载</h4>
            <p>一键下载PNG格式二维码图片</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📋</div>
            <h4>复制分享</h4>
            <p>支持直接复制图片到剪贴板，方便分享</p>
          </div>
        </div>

        <div class="examples-section">
          <h4 class="examples-title">支持的内容格式：</h4>
          <div class="examples-grid">
            <div class="example-item">
              <span class="example-type">网址：</span>
              <span class="example-text">https://example.com</span>
            </div>
            <div class="example-item">
              <span class="example-type">文本：</span>
              <span class="example-text">Hello World 你好世界</span>
            </div>
            <div class="example-item">
              <span class="example-type">电话：</span>
              <span class="example-text">tel:+86-138-0013-8000</span>
            </div>
            <div class="example-item">
              <span class="example-type">邮箱：</span>
              <span class="example-text">mailto:hello@example.com</span>
            </div>
            <div class="example-item">
              <span class="example-type">WiFi：</span>
              <span class="example-text">WIFI:T:WPA;S:MyNetwork;P:password;;</span>
            </div>
            <div class="example-item">
              <span class="example-type">地理位置：</span>
              <span class="example-text">geo:40.7128,-74.0060</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  Grid,
  Setting,
  MagicStick,
  Delete,
  Picture,
  Download,
  CopyDocument,
  InfoFilled
} from '@element-plus/icons-vue'
import { qrTool, type ToolResponse } from '../../utils/newTools'

const { t } = useI18n()
const loading = ref(false)
const qrText = ref('')
const qrSize = ref(256)
const qrDataUrl = ref('')

// 生成二维码
const generateQr = async () => {
  if (!qrText.value.trim()) {
    qrDataUrl.value = ''
    return
  }

  loading.value = true
  
  try {
    const response: ToolResponse = await qrTool.generate(qrText.value, qrSize.value)
    
    if (response.success && response.result) {
      qrDataUrl.value = response.result
      ElMessage.success('二维码生成成功！')
    } else {
      ElMessage.error(response.error || '生成失败')
    }
  } catch (error) {
    ElMessage.error('生成失败，请重试')
    console.error('QR生成错误:', error)
  } finally {
    loading.value = false
  }
}

// 设置尺寸
const setSize = (size: number) => {
  qrSize.value = size
  if (qrText.value.trim()) {
    generateQr()
  }
}

// 加载示例
const loadExample = (type: string) => {
  const examples = {
    url: 'https://github.com/microsoft/vscode',
    text: 'Hello World! 你好世界！\n这是一个二维码测试文本。',
    phone: 'tel:+86-138-0013-8000',
    email: 'mailto:hello@example.com?subject=Hello&body=这是通过二维码发送的邮件'
  }
  
  qrText.value = examples[type as keyof typeof examples] || ''
  generateQr()
  ElMessage.info(`已加载${type === 'url' ? '网址' : type === 'text' ? '文本' : type === 'phone' ? '电话' : '邮箱'}示例`)
}

// 下载二维码
const downloadQr = () => {
  if (!qrDataUrl.value) {
    ElMessage.warning('请先生成二维码')
    return
  }

  try {
    const link = document.createElement('a')
    link.download = `qrcode-${qrSize.value}x${qrSize.value}.png`
    link.href = qrDataUrl.value
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    ElMessage.success('下载成功！')
  } catch (error) {
    ElMessage.error('下载失败')
    console.error('下载错误:', error)
  }
}

// 复制图片到剪贴板
const copyImageToClipboard = async () => {
  if (!qrDataUrl.value) {
    ElMessage.warning('请先生成二维码')
    return
  }

  try {
    const response = await fetch(qrDataUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    ElMessage.success('图片已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败，请使用下载功能')
    console.error('复制错误:', error)
  }
}

// 清空所有
const clearAll = () => {
  qrText.value = ''
  qrDataUrl.value = ''
  ElMessage.info('已清空所有内容')
}
</script>

<style scoped>
.qr-generator {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #10b981;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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

/* 输入配置 */
.input-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.qr-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.qr-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.input-tips {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-items {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tip-btn {
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

.size-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.size-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.size-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
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

.preset-btn {
  font-size: 12px;
  padding: 6px 12px;
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

.clear-button {
  min-width: 120px;
}

/* 结果展示 */
.qr-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.qr-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: white;
  padding: 8px;
}

.qr-info {
  text-align: center;
}

.qr-size-info {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.qr-content-preview {
  font-size: 12px;
  color: #6b7280;
  max-width: 300px;
  word-break: break-all;
}

.qr-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.download-btn,
.copy-btn {
  min-width: 120px;
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

/* 示例说明 */
.examples-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.examples-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.examples-grid {
  display: grid;
  gap: 12px;
}

.example-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.example-type {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  min-width: 60px;
}

.example-text {
  font-size: 13px;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .qr-generator {
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
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .generate-button,
  .clear-button {
    width: 100%;
  }
  
  .size-presets {
    justify-content: stretch;
  }
  
  .preset-btn {
    flex: 1;
  }
  
  .qr-actions {
    justify-content: center;
    width: 100%;
  }
  
  .download-btn,
  .copy-btn {
    flex: 1;
  }
  
  .tip-items {
    justify-content: center;
  }
}
</style>