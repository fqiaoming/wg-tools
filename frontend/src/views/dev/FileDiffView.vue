<template>
  <div class="file-diff-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><DocumentCopy /></el-icon>
        </div>
        <h1 class="hero-title">文件对比工具</h1>
        <p class="hero-description">智能文件内容对比，高亮显示差异，支持多种对比模式</p>
      </div>
    </div>

    <!-- 操作配置卡片 -->
    <div class="config-card">
      <div class="config-header">
        <div class="config-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>对比配置</h3>
        <div class="config-description">设置对比选项和模式</div>
      </div>
      
      <div class="config-body">
        <div class="config-options">
          <div class="option-group">
            <label class="option-label">对比模式</label>
            <el-radio-group v-model="diffConfig.mode" @change="performDiff">
              <el-radio-button label="line">按行对比</el-radio-button>
              <el-radio-button label="word">按词对比</el-radio-button>
              <el-radio-button label="char">按字符对比</el-radio-button>
            </el-radio-group>
          </div>
          
          <div class="option-group">
            <label class="option-label">对比选项</label>
            <div class="checkbox-group">
              <el-checkbox v-model="diffConfig.ignoreCase" @change="performDiff">
                忽略大小写
              </el-checkbox>
              <el-checkbox v-model="diffConfig.ignoreWhitespace" @change="performDiff">
                忽略空白字符
              </el-checkbox>
              <el-checkbox v-model="diffConfig.showLineNumbers" @change="performDiff">
                显示行号
              </el-checkbox>
            </div>
          </div>
        </div>

        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="performDiff"
            :disabled="!leftText.trim() || !rightText.trim()"
            :loading="loading"
            class="diff-button"
          >
            <el-icon><Search /></el-icon>
            开始对比
          </el-button>
          <el-button 
            size="large" 
            @click="clearAll"
            class="clear-button"
          >
            <el-icon><Delete /></el-icon>
            清空内容
          </el-button>
          <el-button 
            size="large" 
            @click="swapContent"
            :disabled="!leftText.trim() || !rightText.trim()"
            class="swap-button"
          >
            <el-icon><Switch /></el-icon>
            交换内容
          </el-button>
        </div>
      </div>
    </div>

    <!-- 文件输入区域 -->
    <div class="input-sections">
      <!-- 左侧文件 -->
      <div class="input-card">
        <div class="input-header">
          <div class="input-icon">
            <el-icon><DocumentAdd /></el-icon>
          </div>
          <h3>原始文件</h3>
          <div class="input-info">{{ leftText.length }} 字符，{{ getLineCount(leftText) }} 行</div>
        </div>
        <div class="input-body">
          <div class="file-upload-section">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept=".txt,.js,.ts,.json,.xml,.html,.css,.py,.java,.cpp,.c,.php"
              @change="handleFileUpload($event, 'left')"
              drag
              class="file-uploader"
            >
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-text">拖拽文件到此处或<em>点击上传</em></div>
              <div class="upload-hint">支持 txt、js、ts、json、xml、html、css 等格式</div>
            </el-upload>
          </div>
          
          <el-input
            v-model="leftText"
            type="textarea"
            placeholder="请输入或上传第一个文件的内容..."
            :rows="15"
            class="file-input"
            @input="performDiff"
          />
          
          <div class="input-examples">
            <span class="example-label">示例：</span>
            <el-button 
              size="small" 
              @click="loadExample('left', 'js')"
              class="example-btn"
            >
              JavaScript代码
            </el-button>
            <el-button 
              size="small" 
              @click="loadExample('left', 'json')"
              class="example-btn"
            >
              JSON数据
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧文件 -->
      <div class="input-card">
        <div class="input-header">
          <div class="input-icon">
            <el-icon><DocumentAdd /></el-icon>
          </div>
          <h3>修改文件</h3>
          <div class="input-info">{{ rightText.length }} 字符，{{ getLineCount(rightText) }} 行</div>
        </div>
        <div class="input-body">
          <div class="file-upload-section">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              accept=".txt,.js,.ts,.json,.xml,.html,.css,.py,.java,.cpp,.c,.php"
              @change="handleFileUpload($event, 'right')"
              drag
              class="file-uploader"
            >
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-text">拖拽文件到此处或<em>点击上传</em></div>
              <div class="upload-hint">支持 txt、js、ts、json、xml、html、css 等格式</div>
            </el-upload>
          </div>
          
          <el-input
            v-model="rightText"
            type="textarea"
            placeholder="请输入或上传第二个文件的内容..."
            :rows="15"
            class="file-input"
            @input="performDiff"
          />
          
          <div class="input-examples">
            <span class="example-label">示例：</span>
            <el-button 
              size="small" 
              @click="loadExample('right', 'js')"
              class="example-btn"
            >
              JavaScript代码
            </el-button>
            <el-button 
              size="small" 
              @click="loadExample('right', 'json')"
              class="example-btn"
            >
              JSON数据
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 对比结果卡片 -->
    <div v-if="diffResult" class="result-card">
      <div class="result-header">
        <div class="result-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>对比结果</h3>
        <div class="result-description">文件差异分析报告</div>
      </div>
      
      <div class="result-body">
        <!-- 统计信息 -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-item added">
              <div class="stat-icon">➕</div>
              <div class="stat-label">新增</div>
              <div class="stat-value">{{ diffStats.added }}</div>
            </div>
            <div class="stat-item deleted">
              <div class="stat-icon">➖</div>
              <div class="stat-label">删除</div>
              <div class="stat-value">{{ diffStats.deleted }}</div>
            </div>
            <div class="stat-item modified">
              <div class="stat-icon">📝</div>
              <div class="stat-label">修改</div>
              <div class="stat-value">{{ diffStats.modified }}</div>
            </div>
            <div class="stat-item similarity">
              <div class="stat-icon">📊</div>
              <div class="stat-label">相似度</div>
              <div class="stat-value">{{ diffStats.similarity }}%</div>
            </div>
          </div>
        </div>

        <!-- 差异展示 -->
        <div class="diff-display">
          <div class="diff-content" v-html="diffResult"></div>
        </div>

        <!-- 导出操作 -->
        <div class="export-section">
          <el-button 
            type="primary" 
            @click="exportDiff('html')"
            class="export-btn"
          >
            <el-icon><Download /></el-icon>
            导出HTML报告
          </el-button>
          <el-button 
            @click="exportDiff('txt')"
            class="export-btn"
          >
            <el-icon><Document /></el-icon>
            导出文本报告
          </el-button>
          <el-button 
            @click="copyDiffResult"
            class="export-btn"
          >
            <el-icon><CopyDocument /></el-icon>
            复制结果
          </el-button>
        </div>
      </div>
    </div>

    <!-- 使用说明卡片 -->
    <div class="usage-card">
      <div class="usage-header">
        <div class="usage-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>功能特色</h3>
        <div class="usage-description">文件对比工具的强大功能</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🔍</div>
            <h4>智能对比</h4>
            <p>支持按行、按词、按字符三种对比模式</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📁</div>
            <h4>文件上传</h4>
            <p>支持拖拽上传多种格式的文件进行对比</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h4>高亮显示</h4>
            <p>差异内容用不同颜色高亮显示，清晰直观</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>统计分析</h4>
            <p>提供详细的差异统计和相似度分析</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚙️</div>
            <h4>灵活配置</h4>
            <p>可配置忽略大小写、空白字符等选项</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>多格式导出</h4>
            <p>支持导出HTML、文本等多种格式的对比报告</p>
          </div>
        </div>

        <div class="tips-section">
          <h4 class="tips-title">使用技巧：</h4>
          <div class="tips-list">
            <div class="tip-item">
              <span class="tip-icon">💡</span>
              <span class="tip-text">选择合适的对比模式：代码文件建议按行对比，文档建议按词对比</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              <span class="tip-text">使用"忽略空白字符"选项可以忽略格式差异，专注内容变化</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">📋</span>
              <span class="tip-text">支持直接拖拽文件上传，也可以粘贴文本内容进行对比</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🔄</span>
              <span class="tip-text">使用"交换内容"功能可以快速调换两个文件的位置</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  DocumentCopy,
  Setting,
  Search,
  Delete,
  Switch,
  DocumentAdd,
  Upload,
  DataAnalysis,
  Download,
  Document,
  CopyDocument,
  InfoFilled
} from '@element-plus/icons-vue'
import { fileDiffTool, type ToolResponse } from '../../utils/newTools'

const loading = ref(false)
const leftText = ref('')
const rightText = ref('')
const diffResult = ref('')

const diffConfig = reactive({
  mode: 'line',
  ignoreCase: false,
  ignoreWhitespace: false,
  showLineNumbers: true
})

const diffStats = reactive({
  added: 0,
  deleted: 0,
  modified: 0,
  similarity: 0
})

// 执行对比
const performDiff = async () => {
  if (!leftText.value.trim() || !rightText.value.trim()) {
    diffResult.value = ''
    return
  }

  loading.value = true
  
  try {
    const response: ToolResponse = await fileDiffTool.compare(
      leftText.value,
      rightText.value,
      '原始文件',
      '修改文件'
    )
    
    if (response.success) {
      diffResult.value = response.result
      
      // 更新统计信息
      diffStats.added = response.extra?.addedLines || 0
      diffStats.deleted = response.extra?.deletedLines || 0
      diffStats.modified = response.extra?.modifiedLines || 0
      diffStats.similarity = response.extra?.similarity || 0
      
      ElMessage.success('文件对比完成！')
    } else {
      ElMessage.error(response.error || '对比失败')
    }
  } catch (error) {
    ElMessage.error('对比失败，请重试')
    console.error('文件对比错误:', error)
  } finally {
    loading.value = false
  }
}

// 处理文件上传
const handleFileUpload = (file: any, side: string) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (side === 'left') {
      leftText.value = content
    } else {
      rightText.value = content
    }
    performDiff()
    ElMessage.success('文件上传成功！')
  }
  reader.readAsText(file.raw)
}

// 加载示例
const loadExample = (side: string, type: string) => {
  const examples = {
    js: {
      left: `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log('Result:', result);`,
      right: `function calculateSum(a, b, c = 0) {
  return a + b + c;
}

const result = calculateSum(5, 3, 2);
console.log('计算结果:', result);`
    },
    json: {
      left: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming"]
}`,
      right: `{
  "name": "John Doe",
  "age": 31,
  "city": "San Francisco",
  "hobbies": ["reading", "swimming", "coding"],
  "email": "john@example.com"
}`
    }
  }
  
  const example = examples[type as keyof typeof examples]
  if (example) {
    if (side === 'left') {
      leftText.value = example.left
    } else {
      rightText.value = example.right
    }
    performDiff()
    ElMessage.info(`已加载${type.toUpperCase()}示例`)
  }
}

// 交换内容
const swapContent = () => {
  const temp = leftText.value
  leftText.value = rightText.value
  rightText.value = temp
  performDiff()
  ElMessage.info('内容已交换')
}

// 清空所有
const clearAll = () => {
  leftText.value = ''
  rightText.value = ''
  diffResult.value = ''
  
  diffStats.added = 0
  diffStats.deleted = 0
  diffStats.modified = 0
  diffStats.similarity = 0
  
  ElMessage.info('已清空所有内容')
}

// 获取行数
const getLineCount = (text: string) => {
  return text ? text.split('\n').length : 0
}

// 导出对比结果
const exportDiff = (format: string) => {
  if (!diffResult.value) {
    ElMessage.warning('没有对比结果可导出')
    return
  }

  try {
    let content = ''
    let filename = ''
    let mimeType = ''

    if (format === 'html') {
      content = `<!DOCTYPE html>
<html>
<head>
  <title>文件对比报告</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .stats { margin-bottom: 20px; }
    .added { background-color: #d4edda; }
    .deleted { background-color: #f8d7da; }
    .modified { background-color: #fff3cd; }
  </style>
</head>
<body>
  <h1>文件对比报告</h1>
  <div class="stats">
    <p>新增: ${diffStats.added} | 删除: ${diffStats.deleted} | 修改: ${diffStats.modified} | 相似度: ${diffStats.similarity}%</p>
  </div>
  ${diffResult.value}
</body>
</html>`
      filename = 'diff-report.html'
      mimeType = 'text/html'
    } else {
      content = `文件对比报告
==================
新增: ${diffStats.added}
删除: ${diffStats.deleted}
修改: ${diffStats.modified}
相似度: ${diffStats.similarity}%

对比结果:
${diffResult.value.replace(/<[^>]*>/g, '')}`
      filename = 'diff-report.txt'
      mimeType = 'text/plain'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success(`${format.toUpperCase()}报告导出成功！`)
  } catch (error) {
    ElMessage.error('导出失败')
    console.error('导出错误:', error)
  }
}

// 复制对比结果
const copyDiffResult = async () => {
  if (!diffResult.value) {
    ElMessage.warning('没有对比结果可复制')
    return
  }

  try {
    const textContent = diffResult.value.replace(/<[^>]*>/g, '')
    await navigator.clipboard.writeText(textContent)
    ElMessage.success('对比结果已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.file-diff-tool {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  --primary-color: #06b6d4;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
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

.input-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

/* 卡片头部 */
.config-header,
.result-header,
.usage-header,
.input-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.config-icon,
.result-icon,
.usage-icon,
.input-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.config-header h3,
.result-header h3,
.usage-header h3,
.input-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.config-description,
.result-description,
.usage-description,
.input-info {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 配置选项 */
.config-options {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.checkbox-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.diff-button {
  min-width: 140px;
}

.clear-button,
.swap-button {
  min-width: 120px;
}

/* 输入区域 */
.input-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.input-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-upload-section {
  margin-bottom: 12px;
}

.file-uploader {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  padding: 20px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--primary-color);
  background: #f0f9ff;
}

.upload-icon {
  font-size: 32px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 16px;
  color: #374151;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
}

.file-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.file-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.input-examples {
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

/* 统计信息 */
.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item.added {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
}

.stat-item.deleted {
  background: #fee2e2;
  border: 1px solid #fecaca;
}

.stat-item.modified {
  background: #fef3c7;
  border: 1px solid #fde68a;
}

.stat-item.similarity {
  background: #dbeafe;
  border: 1px solid #bfdbfe;
}

.stat-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 差异展示 */
.diff-display {
  margin-bottom: 24px;
}

.diff-content {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  max-height: 500px;
  overflow-y: auto;
}

/* 导出操作 */
.export-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.export-btn {
  min-width: 140px;
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

/* 使用技巧 */
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
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tip-icon {
  font-size: 18px;
  margin-top: 2px;
}

.tip-text {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-diff-tool {
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
  
  .input-sections {
    grid-template-columns: 1fr;
  }
  
  .config-card,
  .result-card,
  .usage-card,
  .input-card {
    padding: 20px 16px;
  }
  
  .checkbox-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-section,
  .export-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .diff-button,
  .clear-button,
  .swap-button,
  .export-btn {
    width: 100%;
  }
  
  .stats-grid,
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .config-header,
  .result-header,
  .usage-header,
  .input-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .config-description,
  .result-description,
  .usage-description,
  .input-info {
    margin-left: 0;
  }
}
</style>