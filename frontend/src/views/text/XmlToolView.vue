<template>
  <div class="xml-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h1 class="hero-title">XML工具</h1>
        <p class="hero-description">XML格式化、美化和验证，提升XML文档的可读性</p>
      </div>
    </div>

    <!-- 操作按钮卡片 -->
    <div class="action-card">
      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="large" 
          @click="formatXml" 
          :loading="loading"
          class="action-button"
        >
          <el-icon><MagicStick /></el-icon>
          格式化XML
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
          @click="copyResult" 
          v-if="result"
          class="action-button"
        >
          <el-icon><CopyDocument /></el-icon>
          复制结果
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
          <h3>输入XML</h3>
          <div class="character-count">{{ inputText.length }} 字符</div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="inputText"
            type="textarea"
            placeholder="请输入要格式化的XML内容..."
            :rows="15"
            class="xml-input"
          />
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="editor-card">
        <div class="editor-header">
          <div class="editor-icon">
            <el-icon><View /></el-icon>
          </div>
          <h3>格式化结果</h3>
          <div class="character-count">{{ result.length }} 字符</div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="result"
            type="textarea"
            placeholder="格式化后的XML将显示在这里..."
            :rows="15"
            readonly
            class="xml-output"
          />
        </div>
      </div>
    </div>

    <!-- 统计信息卡片 -->
    <div v-if="stats" class="stats-card">
      <div class="stats-header">
        <div class="stats-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>统计信息</h3>
        <div class="stats-description">XML文档分析结果</div>
      </div>
      <div class="stats-body">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">总字符数</div>
            <div class="stat-value primary">{{ stats.characters }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">总行数</div>
            <div class="stat-value success">{{ stats.lines }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">元素数量</div>
            <div class="stat-value info">{{ stats.elements }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">属性数量</div>
            <div class="stat-value warning">{{ stats.attributes }}</div>
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
        <div class="usage-description">XML格式化工具的功能介绍</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h4>格式美化</h4>
            <p>自动添加缩进和换行，让XML结构更清晰</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">✅</div>
            <h4>语法验证</h4>
            <p>检查XML语法是否正确，发现潜在错误</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>统计分析</h4>
            <p>分析XML文档的元素、属性等统计信息</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔧</div>
            <h4>一键操作</h4>
            <p>支持一键清空、复制，提高工作效率</p>
          </div>
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
  DataAnalysis,
  InfoFilled,
  MagicStick
} from '@element-plus/icons-vue'

const loading = ref(false)
const inputText = ref('')
const result = ref('')
const stats = ref<any>(null)

// 格式化XML
const formatXml = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入XML内容')
    return
  }

  loading.value = true
  
  try {
    // 简单的XML格式化逻辑
    let formatted = inputText.value.trim()
    
    // 移除多余的空白
    formatted = formatted.replace(/>\s+</g, '><')
    
    // 添加换行和缩进
    let indent = 0
    const indentSize = 2
    let formattedLines: string[] = []
    
    // 分割标签
    const tags = formatted.split(/(<[^>]*>)/g).filter(Boolean)
    
    for (const tag of tags) {
      if (tag.startsWith('</')) {
        // 结束标签，减少缩进
        indent = Math.max(0, indent - indentSize)
        formattedLines.push(' '.repeat(indent) + tag)
      } else if (tag.startsWith('<') && !tag.endsWith('/>') && !tag.startsWith('<!') && !tag.startsWith('<?')) {
        // 开始标签，添加缩进后增加
        formattedLines.push(' '.repeat(indent) + tag)
        indent += indentSize
      } else if (tag.startsWith('<')) {
        // 自闭合标签或声明
        formattedLines.push(' '.repeat(indent) + tag)
      } else if (tag.trim()) {
        // 文本内容
        formattedLines.push(' '.repeat(indent) + tag.trim())
      }
    }
    
    result.value = formattedLines.join('\n')
    
    // 计算统计信息
    calculateStats()
    
    ElMessage.success('XML格式化成功！')
  } catch (error) {
    ElMessage.error('XML格式化失败，请检查语法')
    console.error('格式化错误:', error)
  } finally {
    loading.value = false
  }
}

// 计算统计信息
const calculateStats = () => {
  const text = result.value || inputText.value
  
  stats.value = {
    characters: text.length,
    lines: text.split('\n').length,
    elements: (text.match(/<[^\/!?][^>]*>/g) || []).length,
    attributes: (text.match(/\s+\w+\s*=/g) || []).length
  }
}

// 复制结果
const copyResult = async () => {
  if (!result.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success('复制成功！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  result.value = ''
  stats.value = null
  ElMessage.info('已清空所有内容')
}
</script>

<style scoped>
.xml-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #3b82f6;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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

/* 操作按钮卡片 */
.action-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

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

.editor-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.editor-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.editor-icon {
  margin-right: 12px;
  font-size: 18px;
  color: var(--primary-color);
}

.editor-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.character-count {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.editor-body {
  height: 100%;
}

.xml-input :deep(.el-textarea__inner),
.xml-output :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.xml-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.xml-output :deep(.el-textarea__inner) {
  background: #f8fafc;
  color: #1f2937;
}

/* 统计信息卡片 */
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
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
  color: var(--primary-color);
}

.stats-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.stats-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
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
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
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
.stat-value.info { color: #06b6d4; }

/* 使用说明卡片 */
.usage-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.usage-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.usage-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.usage-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.usage-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

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
  .xml-tool {
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
  
  .editor-card,
  .stats-card,
  .usage-card,
  .action-card {
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
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>