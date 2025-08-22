<template>
  <div class="url-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Link /></el-icon>
        </div>
        <h1 class="hero-title">URL编码工具</h1>
        <p class="hero-description">URL编码和解码，处理特殊字符，确保URL的正确传输</p>
      </div>
    </div>

    <!-- 操作按钮卡片 -->
    <div class="action-card">
      <div class="action-buttons">
        <el-button 
          type="primary" 
          size="large" 
          @click="encodeUrl"
          :disabled="!inputText.trim()"
          class="action-button"
        >
          <el-icon><Lock /></el-icon>
          URL编码
        </el-button>
        <el-button 
          type="success" 
          size="large" 
          @click="decodeUrl"
          :disabled="!inputText.trim()"
          class="action-button"
        >
          <el-icon><Unlock /></el-icon>
          URL解码
        </el-button>
        <el-button 
          size="large" 
          @click="clearAll"
          class="action-button"
        >
          <el-icon><Delete /></el-icon>
          清空内容
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
          <h3>输入内容</h3>
          <div class="character-count">{{ inputText.length }} 字符</div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="inputText"
            type="textarea"
            placeholder="请输入要编码或解码的URL内容..."
            :rows="8"
            class="url-input"
          />
          <div class="input-examples">
            <div class="example-header">
              <span class="example-title">示例：</span>
            </div>
            <div class="example-items">
              <el-button 
                size="small" 
                @click="loadExample('encode')"
                class="example-btn"
              >
                编码示例
              </el-button>
              <el-button 
                size="small" 
                @click="loadExample('decode')"
                class="example-btn"
              >
                解码示例
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="editor-card">
        <div class="editor-header">
          <div class="editor-icon">
            <el-icon><View /></el-icon>
          </div>
          <h3>输出结果</h3>
          <div class="character-count">{{ result.length }} 字符</div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="result"
            type="textarea"
            placeholder="处理后的结果将显示在这里..."
            :rows="8"
            readonly
            class="url-output"
          />
          <div class="output-actions" v-if="result">
            <el-button 
              size="small" 
              @click="copyResult"
              class="copy-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              复制结果
            </el-button>
            <el-button 
              size="small" 
              @click="useAsInput"
              class="use-btn"
            >
              <el-icon><Refresh /></el-icon>
              用作输入
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编码对照表 -->
    <div class="reference-card">
      <div class="reference-header">
        <div class="reference-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h3>URL编码对照表</h3>
        <div class="reference-description">常见字符的URL编码对照</div>
      </div>
      <div class="reference-body">
        <div class="reference-grid">
          <div class="reference-section">
            <h4 class="section-title">特殊字符</h4>
            <div class="char-list">
              <div class="char-item" v-for="char in specialChars" :key="char.char">
                <span class="char-original">{{ char.char }}</span>
                <span class="char-arrow">→</span>
                <span class="char-encoded">{{ char.encoded }}</span>
                <span class="char-name">{{ char.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="reference-section">
            <h4 class="section-title">保留字符</h4>
            <div class="char-list">
              <div class="char-item" v-for="char in reservedChars" :key="char.char">
                <span class="char-original">{{ char.char }}</span>
                <span class="char-arrow">→</span>
                <span class="char-encoded">{{ char.encoded }}</span>
                <span class="char-name">{{ char.name }}</span>
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
        <h3>使用说明</h3>
        <div class="usage-description">URL编码工具的使用指南</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <h4>URL编码</h4>
            <p>将特殊字符转换为%XX格式，确保URL安全传输</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔓</div>
            <h4>URL解码</h4>
            <p>将%XX格式的编码还原为原始字符</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📋</div>
            <h4>对照表</h4>
            <p>提供常用字符的编码对照表，方便查询</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h4>快速操作</h4>
            <p>支持示例加载、结果复制等便捷功能</p>
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
  Link,
  Delete,
  CopyDocument,
  Edit,
  View,
  InfoFilled,
  Grid,
  Lock,
  Unlock,
  Refresh
} from '@element-plus/icons-vue'

const inputText = ref('')
const result = ref('')

// 特殊字符对照表
const specialChars = [
  { char: ' ', encoded: '%20', name: '空格' },
  { char: '!', encoded: '%21', name: '感叹号' },
  { char: '"', encoded: '%22', name: '双引号' },
  { char: '#', encoded: '%23', name: '井号' },
  { char: '$', encoded: '%24', name: '美元符' },
  { char: '%', encoded: '%25', name: '百分号' },
  { char: '&', encoded: '%26', name: '和号' },
  { char: "'", encoded: '%27', name: '单引号' },
  { char: '(', encoded: '%28', name: '左括号' },
  { char: ')', encoded: '%29', name: '右括号' },
  { char: '*', encoded: '%2A', name: '星号' },
  { char: '+', encoded: '%2B', name: '加号' },
  { char: ',', encoded: '%2C', name: '逗号' },
  { char: '/', encoded: '%2F', name: '斜杠' }
]

const reservedChars = [
  { char: ':', encoded: '%3A', name: '冒号' },
  { char: ';', encoded: '%3B', name: '分号' },
  { char: '<', encoded: '%3C', name: '小于号' },
  { char: '=', encoded: '%3D', name: '等号' },
  { char: '>', encoded: '%3E', name: '大于号' },
  { char: '?', encoded: '%3F', name: '问号' },
  { char: '@', encoded: '%40', name: '@符号' },
  { char: '[', encoded: '%5B', name: '左方括号' },
  { char: '\\', encoded: '%5C', name: '反斜杠' },
  { char: ']', encoded: '%5D', name: '右方括号' },
  { char: '^', encoded: '%5E', name: '插入符' },
  { char: '`', encoded: '%60', name: '反引号' },
  { char: '{', encoded: '%7B', name: '左花括号' },
  { char: '}', encoded: '%7D', name: '右花括号' }
]

// URL编码
const encodeUrl = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要编码的内容')
    return
  }

  try {
    result.value = encodeURIComponent(inputText.value)
    ElMessage.success('URL编码成功！')
  } catch (error) {
    ElMessage.error('编码失败，请检查输入内容')
    console.error('编码错误:', error)
  }
}

// URL解码
const decodeUrl = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要解码的内容')
    return
  }

  try {
    result.value = decodeURIComponent(inputText.value)
    ElMessage.success('URL解码成功！')
  } catch (error) {
    ElMessage.error('解码失败，请检查输入格式')
    console.error('解码错误:', error)
  }
}

// 加载示例
const loadExample = (type: string) => {
  if (type === 'encode') {
    inputText.value = 'https://example.com/search?q=Hello World&lang=zh-CN'
  } else {
    inputText.value = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3DHello%20World%26lang%3Dzh-CN'
  }
  ElMessage.info(`已加载${type === 'encode' ? '编码' : '解码'}示例`)
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

// 将结果用作输入
const useAsInput = () => {
  if (!result.value) {
    ElMessage.warning('没有可用的结果')
    return
  }

  inputText.value = result.value
  result.value = ''
  ElMessage.info('已将结果用作输入')
}

// 清空所有
const clearAll = () => {
  inputText.value = ''
  result.value = ''
  ElMessage.info('已清空所有内容')
}
</script>

<style scoped>
.url-tool {
  padding: 24px;
  max-width: 1200px;
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
.action-card,
.editor-card,
.reference-card,
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
.reference-card:hover,
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
.reference-header,
.usage-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.editor-icon,
.reference-icon,
.usage-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.editor-header h3,
.reference-header h3,
.usage-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.character-count,
.reference-description,
.usage-description {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: auto;
}

.editor-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.url-input :deep(.el-textarea__inner),
.url-output :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.url-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
}

.url-output :deep(.el-textarea__inner) {
  background: #f8fafc;
  color: #1f2937;
}

/* 示例和操作按钮 */
.input-examples,
.output-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.example-header {
  margin-right: 8px;
}

.example-title {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.example-items {
  display: flex;
  gap: 8px;
}

.example-btn,
.copy-btn,
.use-btn {
  font-size: 12px;
  padding: 4px 8px;
}

/* 编码对照表 */
.reference-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.reference-section {
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

.char-list {
  display: grid;
  gap: 8px;
}

.char-item {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.char-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.char-original {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 24px;
  text-align: center;
}

.char-arrow {
  color: #6b7280;
  font-size: 12px;
}

.char-encoded {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
  background: #f0f9ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.char-name {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
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
  .url-tool {
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
  
  .editor-sections,
  .reference-grid {
    grid-template-columns: 1fr;
  }
  
  .action-card,
  .editor-card,
  .reference-card,
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
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .editor-header,
  .reference-header,
  .usage-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .character-count,
  .reference-description,
  .usage-description {
    margin-left: 0;
  }
  
  .input-examples,
  .output-actions {
    flex-wrap: wrap;
  }
}
</style>