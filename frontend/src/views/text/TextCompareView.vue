<template>
  <div class="text-compare-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Files /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.textCompare') }}</h1>
        <p class="hero-description">强大的文本差异对比工具，支持逐行对比、高亮显示和详细统计</p>
      </div>
    </div>

    <!-- 对比模式选择卡片 -->
    <div class="mode-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Switch /></el-icon>
        </div>
        <h3>对比模式</h3>
        <div class="selector-description">选择文本对比方式</div>
      </div>
      
      <div class="selector-body">
        <div class="mode-options">
          <el-radio-group v-model="compareMode" @change="performCompare" size="large" class="mode-group">
            <el-radio-button label="line">逐行对比</el-radio-button>
            <el-radio-button label="word">单词对比</el-radio-button>
            <el-radio-button label="char">字符对比</el-radio-button>
          </el-radio-group>
          
          <div class="mode-options-extra">
            <el-checkbox v-model="ignoreWhitespace" @change="performCompare">忽略空白字符</el-checkbox>
            <el-checkbox v-model="ignoreCase" @change="performCompare">忽略大小写</el-checkbox>
            <el-checkbox v-model="ignorePunctuation" @change="performCompare">忽略标点符号</el-checkbox>
          </div>
        </div>
      </div>
    </div>

    <!-- 文本输入卡片 -->
    <div class="input-card">
      <div class="input-header">
        <div class="input-icon">
          <el-icon><Edit /></el-icon>
        </div>
        <h3>文本输入</h3>
        <div class="input-description">输入要对比的两段文本</div>
      </div>
      
      <div class="input-body">
        <div class="input-sections">
          <!-- 左侧文本 -->
          <div class="text-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><DocumentAdd /></el-icon>
              </div>
              <h4>原始文本</h4>
              <div class="section-info">{{ leftText.length }} 字符 | {{ getLineCount(leftText) }} 行</div>
            </div>
            
            <el-input
              v-model="leftText"
              type="textarea"
              placeholder="请输入原始文本..."
              :rows="12"
              class="text-input left-input"
              @input="onTextChange"
            />
            
            <div class="text-actions">
              <el-button @click="pasteLeft" size="small">
                <el-icon><CopyDocument /></el-icon>
                粘贴
              </el-button>
              <el-button @click="clearLeft" size="small">
                <el-icon><Delete /></el-icon>
                清空
              </el-button>
              <el-button @click="loadSampleLeft" size="small">
                <el-icon><DocumentAdd /></el-icon>
                示例
              </el-button>
            </div>
          </div>

          <!-- 对比按钮 -->
          <div class="compare-center">
            <el-button 
              type="primary" 
              @click="performCompare"
              :loading="comparing"
              class="compare-btn"
              size="large"
            >
              <el-icon><DataAnalysis /></el-icon>
              开始对比
            </el-button>
            
            <el-button 
              @click="swapTexts"
              class="swap-btn"
              size="small"
            >
              <el-icon><Switch /></el-icon>
              交换文本
            </el-button>
          </div>

          <!-- 右侧文本 -->
          <div class="text-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><Document /></el-icon>
              </div>
              <h4>修改文本</h4>
              <div class="section-info">{{ rightText.length }} 字符 | {{ getLineCount(rightText) }} 行</div>
            </div>
            
            <el-input
              v-model="rightText"
              type="textarea"
              placeholder="请输入修改后的文本..."
              :rows="12"
              class="text-input right-input"
              @input="onTextChange"
            />
            
            <div class="text-actions">
              <el-button @click="pasteRight" size="small">
                <el-icon><CopyDocument /></el-icon>
                粘贴
              </el-button>
              <el-button @click="clearRight" size="small">
                <el-icon><Delete /></el-icon>
                清空
              </el-button>
              <el-button @click="loadSampleRight" size="small">
                <el-icon><DocumentAdd /></el-icon>
                示例
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 对比结果卡片 -->
    <div v-if="compareResult" class="result-card">
      <div class="result-header">
        <div class="result-icon">
          <el-icon><View /></el-icon>
        </div>
        <h3>对比结果</h3>
        <div class="result-info">
          相似度: {{ compareResult.similarity }}% | 处理时间: {{ compareResult.processTime }}ms
        </div>
      </div>
      
      <div class="result-body">
        <!-- 统计信息 -->
        <div class="stats-section">
          <div class="stats-grid">
            <div class="stat-item added">
              <div class="stat-icon">+</div>
              <div class="stat-content">
                <div class="stat-label">新增</div>
                <div class="stat-value">{{ compareResult.addedLines || 0 }}</div>
              </div>
            </div>
            <div class="stat-item deleted">
              <div class="stat-icon">-</div>
              <div class="stat-content">
                <div class="stat-label">删除</div>
                <div class="stat-value">{{ compareResult.deletedLines || 0 }}</div>
              </div>
            </div>
            <div class="stat-item modified">
              <div class="stat-icon">~</div>
              <div class="stat-content">
                <div class="stat-label">修改</div>
                <div class="stat-value">{{ compareResult.modifiedLines || 0 }}</div>
              </div>
            </div>
            <div class="stat-item unchanged">
              <div class="stat-icon">=</div>
              <div class="stat-content">
                <div class="stat-label">未变</div>
                <div class="stat-value">{{ compareResult.unchangedLines || 0 }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 对比视图切换 -->
        <div class="view-selector">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="unified">统一视图</el-radio-button>
            <el-radio-button label="split">分屏视图</el-radio-button>
            <el-radio-button label="inline">内联视图</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 对比结果显示 -->
        <div class="diff-container" :class="`view-${viewMode}`">
          <!-- 统一视图 -->
          <div v-if="viewMode === 'unified'" class="unified-view">
            <div class="diff-content" v-html="formatUnifiedDiff()"></div>
          </div>

          <!-- 分屏视图 -->
          <div v-if="viewMode === 'split'" class="split-view">
            <div class="split-left">
              <div class="split-header">
                <h4>原始文本</h4>
              </div>
              <div class="split-content" v-html="formatSplitDiff('left')"></div>
            </div>
            <div class="split-divider"></div>
            <div class="split-right">
              <div class="split-header">
                <h4>修改文本</h4>
              </div>
              <div class="split-content" v-html="formatSplitDiff('right')"></div>
            </div>
          </div>

          <!-- 内联视图 -->
          <div v-if="viewMode === 'inline'" class="inline-view">
            <div class="diff-content" v-html="formatInlineDiff()"></div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="result-actions">
          <el-button @click="copyDiffResult" type="primary">
            <el-icon><CopyDocument /></el-icon>
            复制对比结果
          </el-button>
          <el-button @click="exportDiffReport">
            <el-icon><Download /></el-icon>
            导出对比报告
          </el-button>
          <el-button @click="generatePatch">
            <el-icon><DocumentCopy /></el-icon>
            生成补丁文件
          </el-button>
        </div>
      </div>
    </div>

    <!-- 历史记录卡片 -->
    <div v-if="compareHistory.length > 0" class="history-card">
      <div class="history-header">
        <div class="history-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <h3>对比历史</h3>
        <div class="history-description">最近的对比记录</div>
      </div>
      
      <div class="history-body">
        <div class="history-list">
          <div 
            v-for="(record, index) in compareHistory.slice(0, 5)" 
            :key="index"
            class="history-item"
          >
            <div class="history-content">
              <div class="history-info">
                <div class="history-similarity">相似度: {{ record.similarity }}%</div>
                <div class="history-time">{{ record.timestamp }}</div>
              </div>
              <div class="history-stats">
                <span class="history-stat added">+{{ record.addedLines || 0 }}</span>
                <span class="history-stat deleted">-{{ record.deletedLines || 0 }}</span>
                <span class="history-stat modified">~{{ record.modifiedLines || 0 }}</span>
              </div>
            </div>
            <div class="history-actions">
              <el-button @click="restoreHistory(record)" size="small">
                <el-icon><Refresh /></el-icon>
                恢复
              </el-button>
              <el-button @click="removeHistory(index)" size="small">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="history-actions-global">
          <el-button @click="clearHistory">
            <el-icon><Delete /></el-icon>
            清空历史
          </el-button>
        </div>
      </div>
    </div>

    <!-- 使用指南卡片 -->
    <div class="guide-card">
      <div class="guide-header">
        <div class="guide-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>使用指南</h3>
        <div class="guide-description">文本对比工具的功能说明</div>
      </div>
      <div class="guide-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>逐行对比</h4>
            <p>按行分析文本差异，适合代码和结构化文本对比</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔤</div>
            <h4>单词对比</h4>
            <p>按单词分析差异，适合文档和段落内容对比</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔠</div>
            <h4>字符对比</h4>
            <p>按字符分析差异，提供最精确的文本变化检测</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h4>多种视图</h4>
            <p>统一视图、分屏视图、内联视图，满足不同需求</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📈</div>
            <h4>详细统计</h4>
            <p>显示相似度、新增、删除、修改行数等详细信息</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>导出功能</h4>
            <p>支持导出对比报告和生成补丁文件</p>
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
  Files,
  Switch,
  Edit,
  DocumentAdd,
  Document,
  CopyDocument,
  Delete,
  DataAnalysis,
  View,
  Download,
  DocumentCopy,
  Clock,
  Refresh,
  InfoFilled
} from '@element-plus/icons-vue'
import { fileDiffTool, type ToolResponse } from '../../utils/newTools'

const { t } = useI18n()
const compareMode = ref('line')
const viewMode = ref('unified')
const leftText = ref('')
const rightText = ref('')
const ignoreWhitespace = ref(false)
const ignoreCase = ref(false)
const ignorePunctuation = ref(false)
const comparing = ref(false)
const compareResult = ref<any>(null)
const compareHistory = ref<any[]>([])

// 示例文本
const sampleTexts = {
  left: `const user = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  address: {
    city: 'New York',
    country: 'USA'
  }
};

function getUserInfo(user) {
  return \`Name: \${user.name}, Age: \${user.age}\`;
}

console.log(getUserInfo(user));`,
  
  right: `const user = {
  name: 'Jane Smith',
  age: 25,
  email: 'jane@example.com',
  phone: '+1-555-0123',
  address: {
    city: 'Los Angeles',
    state: 'California',
    country: 'USA'
  }
};

function getUserInfo(user) {
  return \`Name: \${user.name}, Age: \${user.age}, Email: \${user.email}\`;
}

function getUserContact(user) {
  return user.phone || user.email;
}

console.log(getUserInfo(user));
console.log(getUserContact(user));`
}

// 获取行数
const getLineCount = (text: string) => {
  return text ? text.split('\n').length : 0
}

// 文本变化处理
const onTextChange = () => {
  // 文本变化时可以添加实时对比逻辑
}

// 粘贴文本
const pasteLeft = async () => {
  try {
    const text = await navigator.clipboard.readText()
    leftText.value = text
    ElMessage.success('已粘贴到左侧文本框')
  } catch (error) {
    ElMessage.error('读取剪贴板失败')
  }
}

const pasteRight = async () => {
  try {
    const text = await navigator.clipboard.readText()
    rightText.value = text
    ElMessage.success('已粘贴到右侧文本框')
  } catch (error) {
    ElMessage.error('读取剪贴板失败')
  }
}

// 清空文本
const clearLeft = () => {
  leftText.value = ''
  compareResult.value = null
}

const clearRight = () => {
  rightText.value = ''
  compareResult.value = null
}

// 加载示例
const loadSampleLeft = () => {
  leftText.value = sampleTexts.left
  ElMessage.info('已加载示例文本')
}

const loadSampleRight = () => {
  rightText.value = sampleTexts.right
  ElMessage.info('已加载示例文本')
}

// 交换文本
const swapTexts = () => {
  const temp = leftText.value
  leftText.value = rightText.value
  rightText.value = temp
  ElMessage.info('已交换文本内容')
}

// 执行对比
const performCompare = async () => {
  if (!leftText.value && !rightText.value) {
    ElMessage.warning('请输入要对比的文本')
    return
  }

  comparing.value = true
  
  try {
    const response: ToolResponse = await fileDiffTool.compare(
      leftText.value,
      rightText.value,
      '原始文本',
      '修改文本'
    )
    
    if (response.success) {
      compareResult.value = {
        result: response.result,
        similarity: response.extra?.similarity || 0,
        addedLines: response.extra?.addedLines || 0,
        deletedLines: response.extra?.deletedLines || 0,
        modifiedLines: response.extra?.modifiedLines || 0,
        unchangedLines: response.extra?.unchangedLines || 0,
        processTime: response.processTime
      }
      
      // 添加到历史记录
      addToHistory()
      
      ElMessage.success('文本对比完成！')
    } else {
      ElMessage.error(response.error || '对比失败')
    }
  } catch (error) {
    ElMessage.error('对比过程中发生错误')
    console.error('对比错误:', error)
  } finally {
    comparing.value = false
  }
}

// 格式化统一视图差异
const formatUnifiedDiff = () => {
  if (!compareResult.value?.result) return ''
  
  // 这里应该解析diff结果并格式化为HTML
  // 简化示例，实际需要更复杂的diff解析
  const lines = compareResult.value.result.split('\n')
  return lines.map((line: string) => {
    if (line.startsWith('+')) {
      return `<div class="diff-line added">${escapeHtml(line)}</div>`
    } else if (line.startsWith('-')) {
      return `<div class="diff-line deleted">${escapeHtml(line)}</div>`
    } else if (line.startsWith('@@')) {
      return `<div class="diff-line header">${escapeHtml(line)}</div>`
    } else {
      return `<div class="diff-line unchanged">${escapeHtml(line)}</div>`
    }
  }).join('')
}

// 格式化分屏视图差异
const formatSplitDiff = (side: 'left' | 'right') => {
  if (!compareResult.value?.result) return ''
  
  const lines = compareResult.value.result.split('\n')
  const leftLines: string[] = []
  const rightLines: string[] = []
  
  lines.forEach((line: string) => {
    if (line.startsWith('-') && side === 'left') {
      leftLines.push(`<div class="diff-line deleted">${escapeHtml(line.substring(1))}</div>`)
    } else if (line.startsWith('+') && side === 'right') {
      rightLines.push(`<div class="diff-line added">${escapeHtml(line.substring(1))}</div>`)
    } else if (!line.startsWith('@@') && !line.startsWith('+') && !line.startsWith('-')) {
      const content = `<div class="diff-line unchanged">${escapeHtml(line)}</div>`
      leftLines.push(content)
      rightLines.push(content)
    }
  })
  
  return side === 'left' ? leftLines.join('') : rightLines.join('')
}

// 格式化内联视图差异
const formatInlineDiff = () => {
  if (!compareResult.value?.result) return ''
  
  const lines = compareResult.value.result.split('\n')
  return lines.map((line: string) => {
    if (line.startsWith('+')) {
      return `<div class="diff-line added-inline">+ ${escapeHtml(line.substring(1))}</div>`
    } else if (line.startsWith('-')) {
      return `<div class="diff-line deleted-inline">- ${escapeHtml(line.substring(1))}</div>`
    } else if (line.startsWith('@@')) {
      return `<div class="diff-line header">${escapeHtml(line)}</div>`
    } else {
      return `<div class="diff-line unchanged">  ${escapeHtml(line)}</div>`
    }
  }).join('')
}

// HTML转义
const escapeHtml = (text: string) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// 复制对比结果
const copyDiffResult = async () => {
  if (!compareResult.value?.result) {
    ElMessage.warning('没有对比结果可复制')
    return
  }

  try {
    await navigator.clipboard.writeText(compareResult.value.result)
    ElMessage.success('对比结果已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 导出对比报告
const exportDiffReport = () => {
  if (!compareResult.value) {
    ElMessage.warning('没有对比结果可导出')
    return
  }

  const report = `文本对比报告
================

对比时间: ${new Date().toLocaleString()}
对比模式: ${compareMode.value}
相似度: ${compareResult.value.similarity}%

统计信息:
- 新增行数: ${compareResult.value.addedLines}
- 删除行数: ${compareResult.value.deletedLines}
- 修改行数: ${compareResult.value.modifiedLines}
- 未变行数: ${compareResult.value.unchangedLines}

详细差异:
${compareResult.value.result}
`

  const blob = new Blob([report], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `text-diff-report-${Date.now()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('对比报告已导出！')
}

// 生成补丁文件
const generatePatch = () => {
  if (!compareResult.value?.result) {
    ElMessage.warning('没有对比结果可生成补丁')
    return
  }

  const patch = `--- 原始文本
+++ 修改文本
${compareResult.value.result}
`

  const blob = new Blob([patch], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `text-diff-${Date.now()}.patch`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('补丁文件已生成！')
}

// 添加到历史记录
const addToHistory = () => {
  if (!compareResult.value) return
  
  const record = {
    leftText: leftText.value,
    rightText: rightText.value,
    mode: compareMode.value,
    similarity: compareResult.value.similarity,
    addedLines: compareResult.value.addedLines,
    deletedLines: compareResult.value.deletedLines,
    modifiedLines: compareResult.value.modifiedLines,
    timestamp: new Date().toLocaleString()
  }
  
  compareHistory.value.unshift(record)
  
  // 限制历史记录数量
  if (compareHistory.value.length > 10) {
    compareHistory.value = compareHistory.value.slice(0, 10)
  }
}

// 恢复历史记录
const restoreHistory = (record: any) => {
  leftText.value = record.leftText
  rightText.value = record.rightText
  compareMode.value = record.mode
  ElMessage.success('已恢复历史记录')
}

// 删除历史记录
const removeHistory = (index: number) => {
  compareHistory.value.splice(index, 1)
  ElMessage.info('已删除历史记录')
}

// 清空历史记录
const clearHistory = () => {
  compareHistory.value = []
  ElMessage.info('已清空对比历史')
}
</script>

<style scoped>
.text-compare-tool {
  padding: 24px;
  max-width: 1600px;
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
.mode-selector-card,
.input-card,
.result-card,
.history-card,
.guide-card {
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
.input-header,
.result-header,
.history-header,
.guide-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.selector-icon,
.input-icon,
.result-icon,
.history-icon,
.guide-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.selector-header h3,
.input-header h3,
.result-header h3,
.history-header h3,
.guide-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.selector-description,
.input-description,
.history-description,
.guide-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

.result-info {
  font-size: 14px;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin-left: auto;
}

/* 模式选择 */
.mode-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.mode-group {
  justify-content: center;
}

.mode-options-extra {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 文本输入 */
.input-sections {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: start;
}

.text-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.section-icon {
  font-size: 16px;
  color: var(--primary-color);
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  flex: 1;
}

.section-info {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.text-input :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.text-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.text-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* 对比中心 */
.compare-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 60px;
}

.compare-btn {
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  min-width: 140px;
}

.swap-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  background: white;
  transition: all 0.3s ease;
}

.swap-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: rotate(180deg);
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
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: white;
}

.stat-item.added .stat-icon { background: #10b981; }
.stat-item.deleted .stat-icon { background: #ef4444; }
.stat-item.modified .stat-icon { background: #f59e0b; }
.stat-item.unchanged .stat-icon { background: #6b7280; }

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 视图选择 */
.view-selector {
  margin-bottom: 20px;
  text-align: center;
}

/* 差异显示 */
.diff-container {
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  margin-bottom: 24px;
  overflow: hidden;
}

.unified-view,
.inline-view {
  max-height: 400px;
  overflow-y: auto;
}

.split-view {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 0;
  max-height: 400px;
}

.split-left,
.split-right {
  overflow-y: auto;
}

.split-header {
  padding: 12px 16px;
  background: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
  position: sticky;
  top: 0;
  z-index: 1;
}

.split-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.split-divider {
  background: #e2e8f0;
}

.split-content,
.diff-content {
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
}

/* 差异行样式 */
:deep(.diff-line) {
  padding: 2px 8px;
  margin: 1px 0;
  border-radius: 3px;
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.diff-line.added) {
  background: #dcfce7;
  border-left: 3px solid #10b981;
  color: #065f46;
}

:deep(.diff-line.deleted) {
  background: #fee2e2;
  border-left: 3px solid #ef4444;
  color: #991b1b;
}

:deep(.diff-line.modified) {
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
  color: #92400e;
}

:deep(.diff-line.unchanged) {
  background: transparent;
  color: #374151;
}

:deep(.diff-line.header) {
  background: #e2e8f0;
  color: #475569;
  font-weight: 600;
  border-left: 3px solid #64748b;
}

:deep(.diff-line.added-inline) {
  background: #dcfce7;
  color: #065f46;
}

:deep(.diff-line.deleted-inline) {
  background: #fee2e2;
  color: #991b1b;
}

/* 结果操作 */
.result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 历史记录 */
.history-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-content {
  flex: 1;
}

.history-info {
  margin-bottom: 8px;
}

.history-similarity {
  font-weight: 600;
  color: var(--primary-color);
  font-size: 14px;
}

.history-time {
  font-size: 12px;
  color: #6b7280;
}

.history-stats {
  display: flex;
  gap: 8px;
}

.history-stat {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.history-stat.added {
  background: #dcfce7;
  color: #065f46;
}

.history-stat.deleted {
  background: #fee2e2;
  color: #991b1b;
}

.history-stat.modified {
  background: #fef3c7;
  color: #92400e;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.history-actions-global {
  text-align: center;
}

/* 功能特色 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .input-sections {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .compare-center {
    margin-top: 0;
    order: -1;
  }
}

@media (max-width: 768px) {
  .text-compare-tool {
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
  .input-card,
  .result-card,
  .history-card,
  .guide-card {
    padding: 20px 16px;
  }
  
  .mode-options-extra {
    flex-direction: column;
    gap: 12px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .split-view {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .split-divider {
    display: none;
  }
  
  .result-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .history-actions {
    justify-content: center;
  }
  
  .text-actions {
    flex-wrap: wrap;
  }
}
</style>