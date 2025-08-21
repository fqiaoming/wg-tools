<template>
  <div class="text-stats-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h1 class="hero-title">文本统计工具</h1>
        <p class="hero-description">智能分析文本内容，提供详细的字符、单词、行数等统计信息</p>
      </div>
    </div>

    <!-- 操作按钮卡片 -->
    <div class="action-card">
      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="large" 
          @click="analyzeText"
          :disabled="!inputText.trim()"
          class="action-button"
        >
          <el-icon><MagicStick /></el-icon>
          分析文本
        </el-button>
        <el-button 
          size="large" 
          @click="clearAll"
          class="action-button"
        >
          <el-icon><Delete /></el-icon>
          清空内容
        </el-button>
        <el-button 
          size="large" 
          @click="copyStats" 
          v-if="stats"
          class="action-button"
        >
          <el-icon><CopyDocument /></el-icon>
          复制统计
        </el-button>
      </div>
    </div>

    <!-- 编辑器区域 -->
    <div class="editor-sections">
      <!-- 输入区域 -->
      <div class="editor-card">
        <div class="editor-header">
          <div class="editor-icon">
            <el-icon><Edit /></el-icon>
          </div>
          <h3>输入文本</h3>
          <div class="character-count">{{ inputText.length }} 字符</div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="inputText"
            type="textarea"
            placeholder="请输入要分析的文本内容..."
            :rows="12"
            class="text-input"
            @input="analyzeText"
          />
        </div>
      </div>

      <!-- 统计结果区域 -->
      <div class="stats-card" v-if="stats">
        <div class="stats-header">
          <div class="stats-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <h3>统计结果</h3>
          <div class="stats-description">实时文本分析</div>
        </div>
        <div class="stats-body">
          <div class="stats-grid">
            <div class="stat-item primary-stat">
              <div class="stat-icon">📝</div>
              <div class="stat-label">总字符数</div>
              <div class="stat-value primary">{{ stats.totalChars }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🔤</div>
              <div class="stat-label">不含空格</div>
              <div class="stat-value success">{{ stats.charsNoSpaces }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">💬</div>
              <div class="stat-label">单词数</div>
              <div class="stat-value info">{{ stats.words }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📄</div>
              <div class="stat-label">行数</div>
              <div class="stat-value warning">{{ stats.lines }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📖</div>
              <div class="stat-label">段落数</div>
              <div class="stat-value danger">{{ stats.paragraphs }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📚</div>
              <div class="stat-label">句子数</div>
              <div class="stat-value purple">{{ stats.sentences }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细分析卡片 -->
    <div v-if="stats" class="analysis-card">
      <div class="analysis-header">
        <div class="analysis-icon">
          <el-icon><PieChart /></el-icon>
        </div>
        <h3>详细分析</h3>
        <div class="analysis-description">深度文本分析结果</div>
      </div>
      <div class="analysis-body">
        <div class="analysis-sections">
          <!-- 字符分析 -->
          <div class="analysis-section">
            <h4 class="section-title">字符分析</h4>
            <div class="analysis-grid">
              <div class="analysis-item">
                <span class="analysis-label">中文字符</span>
                <span class="analysis-value">{{ stats.chineseChars }}</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">英文字符</span>
                <span class="analysis-value">{{ stats.englishChars }}</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">数字字符</span>
                <span class="analysis-value">{{ stats.numbers }}</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">标点符号</span>
                <span class="analysis-value">{{ stats.punctuation }}</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">空白字符</span>
                <span class="analysis-value">{{ stats.whitespace }}</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">特殊字符</span>
                <span class="analysis-value">{{ stats.special }}</span>
              </div>
            </div>
          </div>

          <!-- 可读性分析 -->
          <div class="analysis-section">
            <h4 class="section-title">可读性分析</h4>
            <div class="analysis-grid">
              <div class="analysis-item">
                <span class="analysis-label">平均词长</span>
                <span class="analysis-value">{{ stats.avgWordLength }} 字符</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">平均句长</span>
                <span class="analysis-value">{{ stats.avgSentenceLength }} 词</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">段落密度</span>
                <span class="analysis-value">{{ stats.paragraphDensity }} 行/段</span>
              </div>
              <div class="analysis-item">
                <span class="analysis-label">阅读时长</span>
                <span class="analysis-value">{{ stats.readingTime }} 分钟</span>
              </div>
            </div>
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
        <h3>功能特色</h3>
        <div class="usage-description">文本统计工具的强大功能</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h4>实时统计</h4>
            <p>输入文本时自动进行实时统计分析</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎯</div>
            <h4>多维度分析</h4>
            <p>提供字符、单词、行数等多种统计维度</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌍</div>
            <h4>多语言支持</h4>
            <p>支持中英文混合文本的精准统计</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>可读性评估</h4>
            <p>分析文本的可读性和阅读难度</p>
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
  DataAnalysis,
  Delete,
  CopyDocument,
  Edit,
  MagicStick,
  InfoFilled,
  TrendCharts,
  PieChart
} from '@element-plus/icons-vue'

const inputText = ref('')
const stats = ref<any>(null)

// 分析文本
const analyzeText = () => {
  if (!inputText.value.trim()) {
    stats.value = null
    return
  }

  const text = inputText.value
  
  // 基础统计
  const totalChars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const lines = text.split('\n').length
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.split(/[.!?。！？]+/).filter(s => s.trim()).length

  // 字符类型分析
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length
  const numbers = (text.match(/[0-9]/g) || []).length
  const punctuation = (text.match(/[,.!?;:，。！？；：""''（）()]/g) || []).length
  const whitespace = (text.match(/\s/g) || []).length
  const special = totalChars - chineseChars - englishChars - numbers - punctuation - whitespace

  // 可读性分析
  const avgWordLength = words > 0 ? Math.round((charsNoSpaces / words) * 10) / 10 : 0
  const avgSentenceLength = sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0
  const paragraphDensity = paragraphs > 0 ? Math.round((lines / paragraphs) * 10) / 10 : 0
  const readingTime = Math.ceil(words / 200) // 假设每分钟200词

  stats.value = {
    totalChars,
    charsNoSpaces,
    words,
    lines,
    paragraphs,
    sentences,
    chineseChars,
    englishChars,
    numbers,
    punctuation,
    whitespace,
    special,
    avgWordLength,
    avgSentenceLength,
    paragraphDensity,
    readingTime
  }
}

// 复制统计结果
const copyStats = async () => {
  if (!stats.value) {
    ElMessage.warning('没有统计数据可复制')
    return
  }

  const statsText = `文本统计结果：
总字符数：${stats.value.totalChars}
不含空格：${stats.value.charsNoSpaces}
单词数：${stats.value.words}
行数：${stats.value.lines}
段落数：${stats.value.paragraphs}
句子数：${stats.value.sentences}
中文字符：${stats.value.chineseChars}
英文字符：${stats.value.englishChars}
数字字符：${stats.value.numbers}
标点符号：${stats.value.punctuation}
平均词长：${stats.value.avgWordLength} 字符
平均句长：${stats.value.avgSentenceLength} 词
阅读时长：${stats.value.readingTime} 分钟`

  try {
    await navigator.clipboard.writeText(statsText)
    ElMessage.success('统计结果复制成功！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  stats.value = null
  ElMessage.info('已清空所有内容')
}
</script>

<style scoped>
.text-stats-tool {
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
.action-card,
.editor-card,
.stats-card,
.analysis-card,
.usage-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

.action-card:hover,
.editor-card:hover,
.stats-card:hover,
.analysis-card:hover,
.usage-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  min-width: 140px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* 编辑器区域 */
.editor-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.editor-header,
.stats-header,
.analysis-header,
.usage-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.editor-icon,
.stats-icon,
.analysis-icon,
.usage-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.editor-header h3,
.stats-header h3,
.analysis-header h3,
.usage-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.character-count,
.stats-description,
.analysis-description,
.usage-description {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: auto;
}

.text-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.text-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* 统计结果 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.stat-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.primary-stat {
  border-color: var(--primary-color);
  background: #faf5ff;
}

.stat-icon {
  font-size: 24px;
  margin-bottom: 8px;
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
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.stat-value.primary { color: var(--primary-color); }
.stat-value.success { color: #10b981; }
.stat-value.warning { color: #f59e0b; }
.stat-value.danger { color: #ef4444; }
.stat-value.info { color: #06b6d4; }
.stat-value.purple { color: #8b5cf6; }

/* 详细分析 */
.analysis-sections {
  display: grid;
  gap: 24px;
}

.analysis-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
  display: inline-block;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.analysis-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analysis-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.analysis-value {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
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
@media (max-width: 768px) {
  .text-stats-tool {
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
  }
  
  .action-card,
  .editor-card,
  .stats-card,
  .analysis-card,
  .usage-card {
    padding: 20px 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-button {
    width: 100%;
  }
  
  .stats-grid,
  .analysis-grid,
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .editor-header,
  .stats-header,
  .analysis-header,
  .usage-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .character-count,
  .stats-description,
  .analysis-description,
  .usage-description {
    margin-left: 0;
  }
}
</style>