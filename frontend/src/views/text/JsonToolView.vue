<template>
  <div class="json-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h1 class="hero-title">JSON工具</h1>
        <p class="hero-description">强大的JSON格式化、压缩和验证工具，支持语法高亮和错误检测</p>
      </div>
    </div>

    <!-- 操作按钮卡片 -->
    <div class="action-card">
      <div class="action-header">
        <h3>操作工具</h3>
        <div class="action-description">选择要执行的JSON操作</div>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="formatJson" :loading="loading" size="large">
          <el-icon><Document /></el-icon>
          格式化
        </el-button>
        <el-button type="success" @click="compressJson" :loading="loading" size="large">
          <el-icon><Document /></el-icon>
          压缩
        </el-button>
        <el-button @click="clearAll" size="large">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
        <el-button @click="copyResult" v-if="result" size="large">
          <el-icon><CopyDocument /></el-icon>
          复制结果
        </el-button>
      </div>
    </div>

    <!-- 输入输出区域 -->
    <div class="editor-sections">
      <!-- 输入区域 -->
      <div class="editor-card">
        <div class="editor-header">
          <div class="editor-icon">
            <el-icon><Edit /></el-icon>
          </div>
          <h3>输入JSON</h3>
          <div class="char-count">{{ inputText.length }} 字符</div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="15"
            placeholder="请输入JSON数据..."
            class="code-editor"
          />
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="editor-card">
        <div class="editor-header">
          <div class="editor-icon">
            <el-icon><View /></el-icon>
          </div>
          <h3>输出结果</h3>
          <div class="char-count">{{ result.length }} 字符</div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="result"
            type="textarea"
            :rows="15"
            readonly
            placeholder="处理结果将显示在这里..."
            class="code-editor"
          />
        </div>
      </div>
    </div>

    <!-- 结果统计信息 -->
    <div v-if="resultInfo" class="stats-card">
      <div class="stats-header">
        <div class="stats-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>处理统计</h3>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">处理时间</div>
          <div class="stat-value primary">{{ resultInfo.processTime }}ms</div>
        </div>
        <div class="stat-item" v-if="resultInfo.extra">
          <div class="stat-label">原始长度</div>
          <div class="stat-value">{{ resultInfo.extra.originalLength }}</div>
        </div>
        <div class="stat-item" v-if="resultInfo.extra && resultInfo.extra.formattedLength">
          <div class="stat-label">格式化后长度</div>
          <div class="stat-value success">{{ resultInfo.extra.formattedLength }}</div>
        </div>
        <div class="stat-item" v-if="resultInfo.extra && resultInfo.extra.compressedLength">
          <div class="stat-label">压缩后长度</div>
          <div class="stat-value warning">{{ resultInfo.extra.compressedLength }}</div>
        </div>
        <div class="stat-item" v-if="resultInfo.extra && resultInfo.extra.compressionRatio">
          <div class="stat-label">压缩率</div>
          <div class="stat-value info">{{ resultInfo.extra.compressionRatio }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Delete,
  CopyDocument,
  Edit,
  View,
  DataAnalysis
} from '@element-plus/icons-vue'
import { jsonFormatter, type ToolResponse } from '@/utils/localTools'

const inputText = ref('')
const result = ref('')
const loading = ref(false)
const resultInfo = ref<ToolResponse | null>(null)

// JSON格式化
const formatJson = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入JSON数据')
    return
  }

  loading.value = true
  try {
    const response = jsonFormatter.format(inputText.value.trim())
    
    if (response.success) {
      result.value = response.result
      resultInfo.value = response
      ElMessage.success('JSON格式化成功')
    } else {
      ElMessage.error(response.error || 'JSON格式化失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'JSON格式化失败')
  } finally {
    loading.value = false
  }
}

// JSON压缩
const compressJson = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入JSON数据')
    return
  }

  loading.value = true
  try {
    const response = jsonFormatter.compress(inputText.value.trim())
    
    if (response.success) {
      result.value = response.result
      resultInfo.value = response
      ElMessage.success('JSON压缩成功')
    } else {
      ElMessage.error(response.error || 'JSON压缩失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'JSON压缩失败')
  } finally {
    loading.value = false
  }
}

// 清空所有内容
const clearAll = () => {
  inputText.value = ''
  result.value = ''
  resultInfo.value = null
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.json-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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

/* 操作按钮卡片 */
.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.action-header {
  margin-bottom: 20px;
  text-align: center;
}

.action-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.action-description {
  font-size: 14px;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 编辑器区域 */
.editor-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.editor-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.editor-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px 12px 0 0;
}

.editor-icon {
  margin-right: 12px;
  font-size: 20px;
  color: #22c55e;
}

.editor-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.char-count {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
}

.editor-body {
  padding: 20px 24px;
}

.code-editor {
  width: 100%;
}

.code-editor :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
  transition: border-color 0.2s ease;
}

.code-editor :deep(.el-textarea__inner:focus) {
  border-color: #22c55e;
  background: white;
}

/* 统计信息卡片 */
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.stats-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.stats-icon {
  margin-right: 12px;
  font-size: 20px;
  color: #3b82f6;
}

.stats-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.stat-value.primary {
  color: #22c55e;
}

.stat-value.success {
  color: #0ea5e9;
}

.stat-value.warning {
  color: #f59e0b;
}

.stat-value.info {
  color: #8b5cf6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .json-tool {
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
  
  .editor-sections {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .editor-header {
    padding: 16px 20px;
  }
  
  .editor-body {
    padding: 16px 20px;
  }
}
</style>
