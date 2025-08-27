<template>
  <div class="uuid-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Key /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.uuidGenerator') }}</h1>
        <p class="hero-description">强大的UUID生成工具，支持单个和批量生成，符合RFC 4122标准</p>
      </div>
    </div>

    <!-- 模式选择卡片 -->
    <div class="mode-card">
      <div class="mode-header">
        <h3>生成模式</h3>
        <div class="mode-description">选择UUID生成方式</div>
      </div>
      <div class="mode-selector">
        <el-radio-group v-model="mode" @change="onModeChange" size="large">
          <el-radio-button label="single">单个生成</el-radio-button>
          <el-radio-button label="batch">批量生成</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 单个生成 -->
    <div v-if="mode === 'single'" class="generator-card">
      <div class="generator-header">
        <div class="generator-icon">
          <el-icon><MagicStick /></el-icon>
        </div>
        <h3>单个UUID生成</h3>
        <div class="generator-description">生成单个UUID并查看详细信息</div>
      </div>
      
      <div class="generator-body">
        <div class="generate-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="generateSingle"
            :loading="loading"
            class="generate-button"
          >
            <el-icon><MagicStick /></el-icon>
            生成UUID
          </el-button>
          <div class="uuid-info">
            <el-tag type="info" size="large">UUID v4 (Random)</el-tag>
            <span class="format-info">RFC 4122 标准格式</span>
          </div>
        </div>

        <div v-if="singleResult" class="result-section">
          <div class="uuid-result">
            <div class="result-header">
              <span class="result-label">生成结果</span>
              <div class="result-actions">
                <el-button @click="copyUuid(singleResult)" size="small">
                  <el-icon><CopyDocument /></el-icon>
                  复制
                </el-button>
                <el-button @click="generateSingle" size="small" type="primary" plain>
                  <el-icon><Refresh /></el-icon>
                  重新生成
                </el-button>
              </div>
            </div>
            <div class="uuid-value">{{ singleResult }}</div>
          </div>
          
          <div v-if="singleExtra" class="uuid-details">
            <div class="details-header">
              <div class="details-icon">
                <el-icon><DataAnalysis /></el-icon>
              </div>
              <h4>UUID详情</h4>
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">版本</div>
                <div class="detail-value">{{ singleExtra.version }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">变体</div>
                <div class="detail-value">{{ singleExtra.variant }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">类型</div>
                <div class="detail-value">{{ singleExtra.type }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">长度</div>
                <div class="detail-value">36 字符 (含连字符)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 批量生成 -->
    <div v-if="mode === 'batch'" class="generator-card">
      <div class="generator-header">
        <div class="generator-icon">
          <el-icon><Files /></el-icon>
        </div>
        <h3>批量UUID生成</h3>
        <div class="generator-description">批量生成多个UUID并支持自定义格式</div>
      </div>
      
      <div class="generator-body">
        <div class="batch-controls">
          <div class="control-section">
            <div class="control-item">
              <label class="control-label">生成数量</label>
              <el-input-number
                v-model="batchCount"
                :min="1"
                :max="1000"
                :step="1"
                size="large"
                class="count-input"
              />
              <span class="count-note">最多可生成1000个</span>
            </div>
            
            <div class="control-item">
              <label class="control-label">格式选项</label>
              <div class="batch-options">
                <el-checkbox v-model="includeLineNumbers" size="large">包含行号</el-checkbox>
                <el-checkbox v-model="removeDashes" size="large">去除连字符</el-checkbox>
                <el-checkbox v-model="upperCase" size="large">大写字母</el-checkbox>
              </div>
            </div>

            <div class="control-item">
              <el-button 
                type="primary" 
                size="large" 
                @click="generateBatch"
                :loading="loading"
                class="generate-button"
              >
                <el-icon><MagicStick /></el-icon>
                批量生成
              </el-button>
            </div>
          </div>
        </div>

        <div v-if="batchResult" class="batch-result-section">
          <div class="result-header">
            <div class="result-info">
              <span class="result-label">生成结果</span>
              <span class="result-count">{{ batchCount }}个UUID</span>
            </div>
            <div class="result-actions">
              <el-button @click="copyAllUuids" size="small">
                <el-icon><CopyDocument /></el-icon>
                {{ t('common.copy') }}全部
              </el-button>
              <el-button @click="downloadUuids" size="small" type="primary" plain>
                <el-icon><Download /></el-icon>
                下载文件
              </el-button>
            </div>
          </div>
          
          <div class="uuid-list">
            <pre>{{ formatBatchResult() }}</pre>
          </div>
        </div>
      </div>

      <!-- UUID格式说明 -->
      <div class="uuid-info-section">
        <h3>UUID格式说明</h3>
        <div class="info-grid">
          <div class="info-card">
            <h4>标准格式</h4>
            <div class="format-example">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</div>
            <p>包含4个连字符，总长度36字符</p>
          </div>
          
          <div class="info-card">
            <h4>无连字符格式</h4>
            <div class="format-example">xxxxxxxx xxxx 4xxx yxxx xxxxxxxxxxxx</div>
            <p>纯32位十六进制字符串</p>
          </div>
          
          <div class="info-card">
            <h4>版本标识</h4>
            <div class="format-example">第13位固定为"4"</div>
            <p>表示这是UUID版本4（随机生成）</p>
          </div>
          
          <div class="info-card">
            <h4>变体标识</h4>
            <div class="format-example">第17位为"8","9","a","b"之一</div>
            <p>表示遵循RFC 4122标准</p>
          </div>
        </div>
      </div>

      <!-- 使用场景 -->
      <div class="use-cases">
        <h3>常见使用场景</h3>
        <div class="case-grid">
          <div class="case-item">
            <el-icon><Document /></el-icon>
            <h4>数据库主键</h4>
            <p>在分布式系统中作为唯一标识符</p>
          </div>
          
          <div class="case-item">
            <el-icon><Link /></el-icon>
            <h4>API标识</h4>
            <p>REST API中的资源唯一标识</p>
          </div>
          
          <div class="case-item">
            <el-icon><Files /></el-icon>
            <h4>文件命名</h4>
            <p>确保文件名的唯一性，避免冲突</p>
          </div>
          
          <div class="case-item">
            <el-icon><UserFilled /></el-icon>
            <h4>会话标识</h4>
            <p>用户会话、事务等临时标识</p>
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
  Key,
  MagicStick,
  CopyDocument,
  Refresh,
  Download,
  Document,
  Link,
  Files,
  UserFilled,
  DataAnalysis
} from '@element-plus/icons-vue'
import { uuidTool } from '../../utils/localTools'

const { t } = useI18n()
const mode = ref<'single' | 'batch'>('single')
const loading = ref(false)

// 单个生成
const singleResult = ref('')
const singleExtra = ref<any>(null)

// 批量生成
const batchCount = ref(10)
const batchResult = ref('')
const batchUuids = ref<string[]>([])
const includeLineNumbers = ref(true)
const removeDashes = ref(false)
const upperCase = ref(false)

// 生成单个UUID
const generateSingle = () => {
  loading.value = true
  try {
    const response = uuidTool.generateV4()
    if (response.success) {
      singleResult.value = response.result
      singleExtra.value = response.extra
      ElMessage.success('UUID生成成功')
    } else {
      ElMessage.error(response.error || 'UUID生成失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'UUID生成失败')
  } finally {
    loading.value = false
  }
}

// 批量生成UUID
const generateBatch = () => {
  loading.value = true
  try {
    const response = uuidTool.generateBatch(batchCount.value)
    if (response.success) {
      batchResult.value = response.result
      batchUuids.value = response.extra?.uuids || []
      ElMessage.success(`成功生成${batchCount.value}个UUID`)
    } else {
      ElMessage.error(response.error || 'UUID批量生成失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'UUID批量生成失败')
  } finally {
    loading.value = false
  }
}

// 格式化批量结果
const formatBatchResult = (): string => {
  if (!batchUuids.value.length) return ''
  
  return batchUuids.value.map((uuid, index) => {
    let formattedUuid = uuid
    
    // 去除连字符
    if (removeDashes.value) {
      formattedUuid = formattedUuid.replace(/-/g, '')
    }
    
    // 大写
    if (upperCase.value) {
      formattedUuid = formattedUuid.toUpperCase()
    }
    
    // 添加行号
    if (includeLineNumbers.value) {
      return `${String(index + 1).padStart(3, ' ')}. ${formattedUuid}`
    }
    
    return formattedUuid
  }).join('\n')
}

// 复制单个UUID
const copyUuid = async (uuid: string) => {
  try {
    await navigator.clipboard.writeText(uuid)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 复制所有UUID
const copyAllUuids = async () => {
  try {
    const text = formatBatchResult()
    await navigator.clipboard.writeText(text)
    ElMessage.success(`已复制${batchCount.value}个UUID到剪贴板`)
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载UUID文件
const downloadUuids = () => {
  try {
    const text = formatBatchResult()
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uuids_${batchCount.value}_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success('文件下载成功')
  } catch (error) {
    ElMessage.error('文件下载失败')
  }
}

// 模式切换
const onModeChange = () => {
  singleResult.value = ''
  singleExtra.value = null
  batchResult.value = ''
  batchUuids.value = []
}
</script>

<style scoped>
.uuid-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 16px;
  color: white;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.hero-description {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

/* 模式选择卡片 */
.mode-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.mode-header {
  margin-bottom: 20px;
  text-align: center;
}

.mode-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.mode-description {
  font-size: 14px;
  color: #6b7280;
}

.mode-selector {
  display: flex;
  justify-content: center;
}

/* 生成器卡片 */
.generator-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.generator-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.generator-icon {
  margin-right: 12px;
  font-size: 24px;
  color: #6366f1;
}

.generator-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.generator-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

.generator-body {
  display: grid;
  gap: 24px;
}

/* 生成按钮区域 */
.generate-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.generate-button {
  min-width: 200px;
  height: 48px;
}

.uuid-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.format-info {
  font-size: 12px;
  color: #6b7280;
}

/* 结果区域 */
.result-section {
  display: grid;
  gap: 20px;
}

.uuid-result {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.uuid-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  font-weight: 600;
  color: #6366f1;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  text-align: center;
  word-break: break-all;
}

/* UUID详情 */
.uuid-details {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.details-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.details-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #3b82f6;
}

.details-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.detail-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 批量生成样式 */
.batch-controls {
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.control-section {
  display: grid;
  gap: 24px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.count-input {
  width: 200px;
}

.count-note {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.batch-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.batch-result-section {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-count {
  font-size: 12px;
  color: #6b7280;
}

.uuid-list {
  padding: 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  max-height: 400px;
  overflow-y: auto;
}

.uuid-list pre {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #1f2937;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 响应式设计增强 */
@media (max-width: 768px) {
  .uuid-tool {
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
  
  .generator-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .generator-description {
    margin-left: 0;
  }
  
  .mode-selector {
    justify-content: stretch;
  }
  
  .mode-selector :deep(.el-radio-group) {
    width: 100%;
  }
  
  .mode-selector :deep(.el-radio-button) {
    flex: 1;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .generate-button {
    width: 100%;
  }
  
  .batch-options {
    flex-direction: column;
    gap: 8px;
  }
  
  .count-input {
    width: 100%;
  }
}

.tool-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.icon {
  font-size: 32px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.description {
  margin: 5px 0 0 0;
  opacity: 0.9;
  font-size: 16px;
}

.mode-selector {
  padding: 20px 30px;
  border-bottom: 1px solid #f0f2f5;
}

/* 单个生成样式 */
.single-generator {
  padding: 40px 30px;
}

.generate-button-area {
  text-align: center;
  margin-bottom: 30px;
}

.uuid-info {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.format-info {
  color: #666;
  font-size: 14px;
}

.result-display {
  background: #f8f9ff;
  border: 1px solid #e1e8ff;
  border-radius: 12px;
  padding: 30px;
}

.uuid-result {
  text-align: center;
  margin-bottom: 30px;
}

.uuid-value {
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  font-size: 20px;
  font-weight: 600;
  color: #4285f4;
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  border: 2px solid #e1e8ff;
  margin-bottom: 20px;
  word-break: break-all;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.uuid-details h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.detail-item {
  background: white;
  padding: 12px 15px;
  border-radius: 6px;
  border: 1px solid #e1e8ff;
}

.detail-item label {
  display: block;
  font-weight: 500;
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.detail-item span {
  color: #333;
  font-size: 14px;
}

/* 批量生成样式 */
.batch-generator {
  padding: 30px;
}

.batch-controls {
  background: #f8f9ff;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e1e8ff;
  margin-bottom: 25px;
}

.count-input {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.count-input label {
  font-weight: 500;
  color: #333;
}

.count-note {
  color: #666;
  font-size: 14px;
}

.batch-options {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.batch-result {
  background: #f8f9ff;
  border: 1px solid #e1e8ff;
  border-radius: 12px;
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: white;
  border-bottom: 1px solid #e1e8ff;
}

.result-title {
  font-weight: 600;
  color: #333;
}

.result-actions {
  display: flex;
  gap: 10px;
}

.uuid-list {
  padding: 25px;
  max-height: 400px;
  overflow-y: auto;
}

.uuid-list pre {
  margin: 0;
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

/* 信息说明样式 */
.uuid-info-section,
.use-cases {
  padding: 30px;
  border-top: 1px solid #f0f2f5;
}

.uuid-info-section h3,
.use-cases h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-card {
  background: #f8f9ff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e1e8ff;
}

.info-card h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.format-example {
  font-family: 'Fira Code', Consolas, Monaco, monospace;
  background: white;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #4285f4;
  margin-bottom: 12px;
  border: 1px solid #e1e8ff;
  word-break: break-all;
}

.info-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.case-item {
  background: #f8f9ff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e1e8ff;
  text-align: center;
  transition: all 0.3s;
}

.case-item:hover {
  background: #e8f2ff;
  border-color: #4285f4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.15);
}

.case-item .el-icon {
  font-size: 32px;
  color: #4285f4;
  margin-bottom: 12px;
}

.case-item h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.case-item p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .count-input {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .batch-options {
    flex-direction: column;
    gap: 10px;
  }
  
  .result-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .result-actions {
    align-self: stretch;
  }
  
  .uuid-value {
    font-size: 16px;
  }
}
</style>
