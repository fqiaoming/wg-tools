<template>
  <div class="regex-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Search /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('pages.regex.title') }}</h1>
        <p class="hero-description">{{ t('pages.regex.description') }}</p>
      </div>
    </div>

    <!-- 模式和选项卡片 -->
    <div class="pattern-card">
      <div class="pattern-header">
        <div class="pattern-icon">
          <el-icon><Edit /></el-icon>
        </div>
        <h3>{{ t('pages.regex.pattern') }}</h3>
        <div class="pattern-description">{{ t('pages.regex.patternDescription') }}</div>
      </div>
      
      <div class="pattern-body">
        <div class="pattern-input-section">
          <div class="input-wrapper">
            <el-input
              v-model="regexPattern"
:placeholder="t('pages.regex.patternPlaceholder')"
              size="large"
              class="pattern-input"
              @input="performMatch"
            >
              <template #prepend>/</template>
              <template #append>/{{ flags }}</template>
            </el-input>
          </div>
          
          <div class="flags-section">
            <label class="flags-label">{{ t('pages.regex.flags') }}:</label>
            <div class="flags-options">
              <el-checkbox v-model="globalFlag" @change="updateFlags">{{ t('pages.regex.flagOptions.global') }}</el-checkbox>
              <el-checkbox v-model="ignoreCase" @change="updateFlags">{{ t('pages.regex.flagOptions.ignoreCase') }}</el-checkbox>
              <el-checkbox v-model="multiline" @change="updateFlags">{{ t('pages.regex.flagOptions.multiline') }}</el-checkbox>
              <el-checkbox v-model="dotAll" @change="updateFlags">{{ t('pages.regex.flagOptions.dotAll') }}</el-checkbox>
            </div>
          </div>
        </div>

        <div class="quick-patterns">
          <label class="quick-label">{{ t('pages.regex.commonPatterns') }}:</label>
          <div class="patterns-grid">
            <el-button 
              v-for="pattern in commonPatterns" 
              :key="pattern.name"
              size="small" 
              @click="usePattern(pattern.regex)"
              class="pattern-btn"
            >
              {{ pattern.name }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 测试文本卡片 -->
    <div class="test-text-card">
      <div class="test-header">
        <div class="test-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3>{{ t('pages.regex.testText') }}</h3>
        <div class="test-description">{{ t('pages.regex.testDescription') }}</div>
      </div>
      
      <div class="test-body">
        <div class="text-input-section">
          <el-input
            v-model="testText"
            type="textarea"
:placeholder="t('pages.regex.testPlaceholder')"
            :rows="8"
            class="test-textarea"
            @input="performMatch"
          />
          
          <div class="text-examples">
            <label class="examples-label">{{ t('pages.regex.exampleTexts') }}:</label>
            <div class="examples-grid">
              <el-button 
                v-for="example in textExamples" 
                :key="example.name"
                size="small" 
                @click="useExample(example.text)"
                class="example-btn"
              >
                {{ example.name }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 匹配结果卡片 -->
    <div v-if="matchResults.length > 0 || hasError" class="results-card">
      <div class="results-header">
        <div class="results-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>{{ t('pages.regex.matchResults') }}</h3>
        <div class="results-info">
          {{ hasError ? t('pages.regex.expressionError') : t('pages.regex.matchCount', { count: matchResults.length }) }}
        </div>
      </div>
      
      <div class="results-body">
        <!-- 错误信息 -->
        <div v-if="hasError" class="error-section">
          <el-alert
            :title="errorMessage"
            type="error"
            :closable="false"
          />
        </div>

        <!-- 匹配统计 -->
        <div v-else-if="matchResults.length > 0" class="match-stats">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">{{ t('pages.regex.stats.matchCount') }}</div>
              <div class="stat-value success">{{ matchResults.length }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ t('pages.regex.stats.positions') }}</div>
              <div class="stat-value info">{{ getMatchPositions() }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ t('pages.regex.stats.coverage') }}</div>
              <div class="stat-value warning">{{ getCoveragePercent() }}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">{{ t('pages.regex.stats.totalChars') }}</div>
              <div class="stat-value">{{ getTotalChars() }}</div>
            </div>
          </div>
        </div>

        <!-- 匹配详情 -->
        <div v-if="matchResults.length > 0" class="matches-list">
          <h4 class="matches-title">{{ t('pages.regex.matchDetails') }}</h4>
          <div class="matches-container">
            <div 
              v-for="(match, index) in matchResults" 
              :key="index"
              class="match-item"
            >
              <div class="match-header">
                <span class="match-index">{{ t('pages.regex.match') }} {{ index + 1 }}</span>
                <span class="match-position">{{ t('pages.regex.position') }}: {{ match.index }}-{{ match.index + match[0].length }}</span>
              </div>
              <div class="match-content">
                <div class="match-text">{{ match[0] }}</div>
                <div v-if="match.length > 1" class="match-groups">
                  <div class="groups-title">{{ t('pages.regex.captureGroups') }}:</div>
                  <div 
                    v-for="(group, groupIndex) in match.slice(1)" 
                    :key="groupIndex"
                    class="group-item"
                  >
                    <span class="group-label">{{ t('pages.regex.group') }} {{ groupIndex + 1 }}:</span>
                    <span class="group-value">{{ group || t('pages.regex.empty') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 高亮显示 -->
        <div v-if="matchResults.length > 0" class="highlighted-text">
          <h4 class="highlight-title">{{ t('pages.regex.highlighted') }}</h4>
          <div class="highlight-container">
            <div 
              class="highlighted-content" 
              v-html="highlightedText"
            ></div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div v-if="matchResults.length > 0" class="results-actions">
          <el-button 
            type="primary" 
            @click="copyMatches"
            class="action-btn"
          >
            <el-icon><CopyDocument /></el-icon>
            {{ t('pages.regex.copyMatches') }}
          </el-button>
          <el-button 
            @click="exportResults"
            class="action-btn"
          >
            <el-icon><Download /></el-icon>
            {{ t('pages.regex.exportResults') }}
          </el-button>
          <el-button 
            @click="replaceMatches"
            class="action-btn"
          >
            <el-icon><Edit /></el-icon>
            {{ t('pages.regex.batchReplace') }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 替换功能卡片 -->
    <div v-if="showReplace" class="replace-card">
      <div class="replace-header">
        <div class="replace-icon">
          <el-icon><Refresh /></el-icon>
        </div>
        <h3>{{ t('pages.regex.batchReplace') }}</h3>
        <div class="replace-description">{{ t('pages.regex.replaceDescription') }}</div>
      </div>
      
      <div class="replace-body">
        <div class="replace-input">
          <label class="replace-label">{{ t('pages.regex.replaceTo') }}:</label>
          <el-input
            v-model="replaceText"
:placeholder="t('pages.regex.replacePlaceholder')"
            size="large"
            class="replace-input-field"
          />
        </div>
        
        <div class="replace-actions">
          <el-button 
            type="primary" 
            @click="performReplace"
            class="replace-btn"
          >
            {{ t('pages.regex.executeReplace') }}
          </el-button>
          <el-button 
            @click="showReplace = false"
            class="cancel-btn"
          >
            {{ t('common.cancel') }}
          </el-button>
        </div>

        <div v-if="replaceResult" class="replace-result">
          <h4 class="replace-result-title">{{ t('pages.regex.replaceResult') }}:</h4>
          <el-input
            v-model="replaceResult"
            type="textarea"
            :rows="6"
            readonly
            class="replace-result-text"
          />
          <div class="replace-result-actions">
            <el-button 
              @click="copyReplaceResult"
              class="copy-replace-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              {{ t('pages.regex.copyResult') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习指南卡片 -->
    <div class="guide-card">
      <div class="guide-header">
        <div class="guide-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>{{ t('pages.regex.guide') }}</h3>
        <div class="guide-description">{{ t('pages.regex.guideDescription') }}</div>
      </div>
      <div class="guide-body">
        <div class="syntax-grid">
          <div class="syntax-category">
            <h4 class="category-title">{{ t('pages.regex.syntax.characters') }}</h4>
            <div class="syntax-items">
              <div class="syntax-item">
                <code>.</code>
                <span>匹配任意字符</span>
              </div>
              <div class="syntax-item">
                <code>\d</code>
                <span>匹配数字 (0-9)</span>
              </div>
              <div class="syntax-item">
                <code>\w</code>
                <span>匹配单词字符</span>
              </div>
              <div class="syntax-item">
                <code>\s</code>
                <span>匹配空白字符</span>
              </div>
            </div>
          </div>
          
          <div class="syntax-category">
            <h4 class="category-title">数量限定</h4>
            <div class="syntax-items">
              <div class="syntax-item">
                <code>*</code>
                <span>0次或多次</span>
              </div>
              <div class="syntax-item">
                <code>+</code>
                <span>1次或多次</span>
              </div>
              <div class="syntax-item">
                <code>?</code>
                <span>0次或1次</span>
              </div>
              <div class="syntax-item">
                <code>{n,m}</code>
                <span>n到m次</span>
              </div>
            </div>
          </div>
          
          <div class="syntax-category">
            <h4 class="category-title">位置锚点</h4>
            <div class="syntax-items">
              <div class="syntax-item">
                <code>^</code>
                <span>行开始</span>
              </div>
              <div class="syntax-item">
                <code>$</code>
                <span>行结束</span>
              </div>
              <div class="syntax-item">
                <code>\b</code>
                <span>单词边界</span>
              </div>
              <div class="syntax-item">
                <code>\B</code>
                <span>非单词边界</span>
              </div>
            </div>
          </div>

          <div class="syntax-category">
            <h4 class="category-title">分组和选择</h4>
            <div class="syntax-items">
              <div class="syntax-item">
                <code>()</code>
                <span>捕获组</span>
              </div>
              <div class="syntax-item">
                <code>(?:)</code>
                <span>非捕获组</span>
              </div>
              <div class="syntax-item">
                <code>|</code>
                <span>或选择</span>
              </div>
              <div class="syntax-item">
                <code>[]</code>
                <span>字符类</span>
              </div>
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
  Search,
  Edit,
  Document,
  DataAnalysis,
  CopyDocument,
  Download,
  Refresh,
  InfoFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()
const regexPattern = ref('')
const testText = ref('')
const flags = ref('')
const globalFlag = ref(true)
const ignoreCase = ref(false)
const multiline = ref(false)
const dotAll = ref(false)
const matchResults = ref<any[]>([])
const hasError = ref(false)
const errorMessage = ref('')
const showReplace = ref(false)
const replaceText = ref('')
const replaceResult = ref('')

// 常用正则模式
const commonPatterns = [
  { name: '邮箱', regex: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: '手机号', regex: '1[3-9]\\d{9}' },
  { name: 'URL', regex: 'https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}[\\w\\-\\._~:/?#[\\]@!$&\'()*+,;=]*' },
  { name: 'IP地址', regex: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b' },
  { name: '身份证', regex: '[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]' },
  { name: '日期', regex: '\\d{4}[/-]\\d{1,2}[/-]\\d{1,2}' },
  { name: '时间', regex: '([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?' },
  { name: '中文字符', regex: '[\\u4e00-\\u9fa5]+' },
  { name: '数字', regex: '-?\\d+(\\.\\d+)?' },
  { name: '英文单词', regex: '[a-zA-Z]+' }
]

// 示例文本
const textExamples = [
  {
    name: '联系信息',
    text: `张三的邮箱是 zhangsan@example.com，手机号是 13812345678。
李四的邮箱是 lisi@gmail.com，手机号是 15987654321。
王五的网站是 https://wangwu.com，IP地址是 192.168.1.100。`
  },
  {
    name: '日期时间',
    text: `今天是2024年1月15日，时间是14:30:25。
会议安排在2024/01/20 上午10:00。
项目截止日期：2024-02-28 23:59:59。`
  },
  {
    name: '混合文本',
    text: `产品编号：ABC-123-XYZ，价格：￥299.99
订单号：ORD20240115001，客服电话：400-123-4567
网址：https://shop.example.com/product/123?ref=email`
  }
]

// 更新修饰符
const updateFlags = () => {
  let newFlags = ''
  if (globalFlag.value) newFlags += 'g'
  if (ignoreCase.value) newFlags += 'i'
  if (multiline.value) newFlags += 'm'
  if (dotAll.value) newFlags += 's'
  flags.value = newFlags
  performMatch()
}

// 使用模式
const usePattern = (pattern: string) => {
  regexPattern.value = pattern
  performMatch()
}

// 使用示例
const useExample = (text: string) => {
  testText.value = text
  performMatch()
}

// 执行匹配
const performMatch = () => {
  hasError.value = false
  errorMessage.value = ''
  matchResults.value = []

  if (!regexPattern.value || !testText.value) {
    return
  }

  try {
    const regex = new RegExp(regexPattern.value, flags.value)
    const matches = []
    
    if (globalFlag.value) {
      let match
      while ((match = regex.exec(testText.value)) !== null) {
        matches.push(match)
        if (!globalFlag.value) break
      }
    } else {
      const match = regex.exec(testText.value)
      if (match) matches.push(match)
    }
    
    matchResults.value = matches
  } catch (error: any) {
    hasError.value = true
    errorMessage.value = `正则表达式语法错误: ${error.message}`
  }
}

// 高亮显示文本
const highlightedText = computed(() => {
  if (!testText.value || matchResults.value.length === 0) {
    return testText.value
  }

  let result = testText.value
  let offset = 0

  // 按位置排序匹配结果
  const sortedMatches = [...matchResults.value].sort((a, b) => a.index - b.index)

  for (const match of sortedMatches) {
    const start = match.index + offset
    const end = start + match[0].length
    const highlighted = `<mark class="regex-match">${match[0]}</mark>`
    
    result = result.slice(0, start) + highlighted + result.slice(end)
    offset += highlighted.length - match[0].length
  }

  return result
})

// 获取匹配位置
const getMatchPositions = () => {
  if (matchResults.value.length === 0) return '-'
  
  const positions = matchResults.value.map(match => `${match.index}-${match.index + match[0].length}`)
  return positions.slice(0, 3).join(', ') + (positions.length > 3 ? '...' : '')
}

// 获取覆盖率
const getCoveragePercent = () => {
  if (!testText.value || matchResults.value.length === 0) return 0
  
  const totalMatched = matchResults.value.reduce((sum, match) => sum + match[0].length, 0)
  return Math.round((totalMatched / testText.value.length) * 100)
}

// 获取总字符数
const getTotalChars = () => {
  if (matchResults.value.length === 0) return 0
  return matchResults.value.reduce((sum, match) => sum + match[0].length, 0)
}

// 复制匹配结果
const copyMatches = async () => {
  if (matchResults.value.length === 0) {
    ElMessage.warning('没有匹配结果可复制')
    return
  }

  const results = matchResults.value.map((match, index) => {
    let result = `匹配 ${index + 1}: ${match[0]} (位置: ${match.index})`
    if (match.length > 1) {
      const groups = match.slice(1).map((group: string, groupIndex: number) => 
        `组${groupIndex + 1}: ${group || '(空)'}`
      ).join(', ')
      result += ` [${groups}]`
    }
    return result
  }).join('\n')

  try {
    await navigator.clipboard.writeText(results)
    ElMessage.success('匹配结果已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 导出结果
const exportResults = () => {
  if (matchResults.value.length === 0) {
    ElMessage.warning('没有匹配结果可导出')
    return
  }

  const data = {
    pattern: regexPattern.value,
    flags: flags.value,
    testText: testText.value,
    matches: matchResults.value.map((match, index) => ({
      index: index + 1,
      text: match[0],
      position: match.index,
      groups: match.slice(1)
    })),
    statistics: {
      totalMatches: matchResults.value.length,
      coverage: getCoveragePercent(),
      totalChars: getTotalChars()
    }
  }

  const content = JSON.stringify(data, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'regex-results.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('匹配结果已导出！')
}

// 显示替换面板
const replaceMatches = () => {
  if (matchResults.value.length === 0) {
    ElMessage.warning('没有匹配结果可替换')
    return
  }
  showReplace.value = true
}

// 执行替换
const performReplace = () => {
  if (!regexPattern.value || !testText.value) {
    ElMessage.warning('请输入正则表达式和测试文本')
    return
  }

  try {
    const regex = new RegExp(regexPattern.value, flags.value)
    replaceResult.value = testText.value.replace(regex, replaceText.value)
    ElMessage.success('替换完成！')
  } catch (error: any) {
    ElMessage.error(`替换失败: ${error.message}`)
  }
}

// 复制替换结果
const copyReplaceResult = async () => {
  try {
    await navigator.clipboard.writeText(replaceResult.value)
    ElMessage.success('替换结果已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 初始化修饰符
updateFlags()
</script>

<style scoped>
.regex-tool {
  padding: 24px;
  max-width: 1400px;
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
.pattern-card,
.test-text-card,
.results-card,
.replace-card,
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
.pattern-header,
.test-header,
.results-header,
.replace-header,
.guide-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.pattern-icon,
.test-icon,
.results-icon,
.replace-icon,
.guide-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.pattern-header h3,
.test-header h3,
.results-header h3,
.replace-header h3,
.guide-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.pattern-description,
.test-description,
.results-info,
.replace-description,
.guide-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 模式输入 */
.pattern-input-section {
  margin-bottom: 20px;
}

.input-wrapper {
  margin-bottom: 16px;
}

.pattern-input :deep(.el-input-group__prepend),
.pattern-input :deep(.el-input-group__append) {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: var(--primary-color);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
}

.pattern-input :deep(.el-input__wrapper) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
}

.flags-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.flags-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.flags-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* 快速模式 */
.quick-patterns {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.quick-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 12px;
}

.patterns-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pattern-btn {
  font-size: 12px;
  padding: 4px 8px;
}

/* 测试文本 */
.test-textarea :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.test-textarea :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.text-examples {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.examples-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 12px;
}

.examples-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.example-btn {
  font-size: 12px;
  padding: 4px 8px;
}

/* 匹配统计 */
.match-stats {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.stat-value.success { color: #10b981; }
.stat-value.warning { color: #f59e0b; }
.stat-value.info { color: #06b6d4; }

/* 匹配列表 */
.matches-list {
  margin-bottom: 24px;
}

.matches-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.matches-container {
  max-height: 400px;
  overflow-y: auto;
}

.match-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 12px;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.match-index {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
}

.match-position {
  font-size: 12px;
  color: #6b7280;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.match-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.match-text {
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #1f2937;
  word-break: break-all;
}

.match-groups {
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.groups-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
}

.group-item {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 12px;
}

.group-label {
  color: #64748b;
  font-weight: 500;
  min-width: 40px;
}

.group-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #1e293b;
  word-break: break-all;
}

/* 高亮显示 */
.highlighted-text {
  margin-bottom: 24px;
}

.highlight-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.highlight-container {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-height: 300px;
  overflow-y: auto;
}

.highlighted-content {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  white-space: pre-wrap;
  word-break: break-all;
}

:deep(.regex-match) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
}

/* 操作按钮 */
.results-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 140px;
}

/* 替换功能 */
.replace-input {
  margin-bottom: 20px;
}

.replace-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 8px;
}

.replace-input-field :deep(.el-input__wrapper) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
}

.replace-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.replace-btn {
  min-width: 120px;
}

.cancel-btn {
  min-width: 80px;
}

.replace-result {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.replace-result-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.replace-result-text :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: white;
}

.replace-result-actions {
  margin-top: 12px;
  text-align: center;
}

.copy-replace-btn {
  min-width: 120px;
}

/* 学习指南 */
.syntax-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.syntax-category {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.category-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color);
  display: inline-block;
}

.syntax-items {
  display: grid;
  gap: 8px;
}

.syntax-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.syntax-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.syntax-item code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  background: #f0fdf4;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #bbf7d0;
  min-width: 60px;
  text-align: center;
}

.syntax-item span {
  font-size: 14px;
  color: #1f2937;
}

/* 错误提示 */
.error-section {
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .regex-tool {
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
  
  .pattern-card,
  .test-text-card,
  .results-card,
  .replace-card,
  .guide-card {
    padding: 20px 16px;
  }
  
  .flags-options {
    flex-direction: column;
    gap: 8px;
  }
  
  .stats-grid,
  .syntax-grid {
    grid-template-columns: 1fr;
  }
  
  .results-actions,
  .replace-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn,
  .replace-btn,
  .cancel-btn,
  .copy-replace-btn {
    width: 100%;
  }
  
  .match-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .patterns-grid,
  .examples-grid {
    flex-direction: column;
    gap: 4px;
  }
  
  .pattern-btn,
  .example-btn {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>