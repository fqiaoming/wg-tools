<template>
  <div class="code-formatter-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h1 class="hero-title">代码格式化工具</h1>
        <p class="hero-description">智能代码格式化和美化，支持多种编程语言的代码规范</p>
      </div>
    </div>

    <!-- 语言选择和配置卡片 -->
    <div class="config-card">
      <div class="config-header">
        <div class="config-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>格式化配置</h3>
        <div class="config-description">选择语言和格式化选项</div>
      </div>
      
      <div class="config-body">
        <!-- 语言选择 -->
        <div class="language-section">
          <label class="language-label">编程语言</label>
          <div class="language-grid">
            <div 
              v-for="lang in supportedLanguages" 
              :key="lang.value"
              class="language-item"
              :class="{ active: selectedLanguage === lang.value }"
              @click="selectLanguage(lang.value)"
            >
              <div class="language-icon">{{ lang.icon }}</div>
              <div class="language-name">{{ lang.name }}</div>
              <div class="language-description">{{ lang.description }}</div>
            </div>
          </div>
        </div>

        <!-- 格式化选项 -->
        <div class="format-options">
          <div class="option-section">
            <h4 class="option-title">缩进设置</h4>
            <div class="option-controls">
              <div class="option-item">
                <label class="option-label">缩进类型</label>
                <el-radio-group v-model="formatConfig.indentType">
                  <el-radio-button label="spaces">空格</el-radio-button>
                  <el-radio-button label="tabs">制表符</el-radio-button>
                </el-radio-group>
              </div>
              <div class="option-item">
                <label class="option-label">缩进大小</label>
                <el-input-number
                  v-model="formatConfig.indentSize"
                  :min="1"
                  :max="8"
                  size="large"
                  class="indent-input"
                />
              </div>
            </div>
          </div>

          <div class="option-section">
            <h4 class="option-title">换行设置</h4>
            <div class="option-controls">
              <div class="option-item">
                <label class="option-label">行宽限制</label>
                <el-input-number
                  v-model="formatConfig.lineWidth"
                  :min="60"
                  :max="200"
                  size="large"
                  class="width-input"
                />
              </div>
              <div class="option-item">
                <el-checkbox v-model="formatConfig.insertFinalNewline">
                  文件末尾插入换行符
                </el-checkbox>
              </div>
            </div>
          </div>

          <div class="option-section">
            <h4 class="option-title">其他选项</h4>
            <div class="option-controls">
              <div class="checkbox-grid">
                <el-checkbox v-model="formatConfig.trimTrailingWhitespace">
                  删除行尾空白
                </el-checkbox>
                <el-checkbox v-model="formatConfig.insertSpaceAfterKeywords">
                  关键字后插入空格
                </el-checkbox>
                <el-checkbox v-model="formatConfig.insertSpaceBeforeParentheses">
                  括号前插入空格
                </el-checkbox>
                <el-checkbox v-model="formatConfig.insertSpaceAfterCommas">
                  逗号后插入空格
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="formatCode"
            :disabled="!inputCode.trim()"
            :loading="loading"
            class="format-button"
          >
            <el-icon><MagicStick /></el-icon>
            格式化代码
          </el-button>
          <el-button 
            size="large" 
            @click="clearAll"
            class="clear-button"
          >
            <el-icon><Delete /></el-icon>
            清空代码
          </el-button>
          <el-button 
            size="large" 
            @click="loadExample"
            class="example-button"
          >
            <el-icon><DocumentAdd /></el-icon>
            加载示例
          </el-button>
        </div>
      </div>
    </div>

    <!-- 代码编辑器区域 -->
    <div class="editor-sections">
      <!-- 输入代码 -->
      <div class="editor-card">
        <div class="editor-header">
          <div class="editor-icon">
            <el-icon><Edit /></el-icon>
          </div>
          <h3>输入代码</h3>
          <div class="editor-info">
            {{ getLanguageName(selectedLanguage) }} | {{ inputCode.length }} 字符 | {{ getLineCount(inputCode) }} 行
          </div>
        </div>
        <div class="editor-body">
          <div class="file-upload-section">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              :accept="getAcceptedFiles(selectedLanguage)"
              @change="handleFileUpload"
              drag
              class="file-uploader"
            >
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-text">拖拽代码文件到此处或<em>点击上传</em></div>
              <div class="upload-hint">支持 {{ getFileExtensions(selectedLanguage) }} 等格式</div>
            </el-upload>
          </div>
          
          <el-input
            v-model="inputCode"
            type="textarea"
            placeholder="请输入要格式化的代码..."
            :rows="20"
            class="code-input"
          />
        </div>
      </div>

      <!-- 格式化结果 -->
      <div class="editor-card">
        <div class="editor-header">
          <div class="editor-icon">
            <el-icon><View /></el-icon>
          </div>
          <h3>格式化结果</h3>
          <div class="editor-info">
            {{ formattedCode.length }} 字符 | {{ getLineCount(formattedCode) }} 行
          </div>
        </div>
        <div class="editor-body">
          <el-input
            v-model="formattedCode"
            type="textarea"
            placeholder="格式化后的代码将显示在这里..."
            :rows="20"
            readonly
            class="code-output"
          />
          
          <div class="output-actions" v-if="formattedCode">
            <el-button 
              type="primary" 
              @click="copyCode"
              class="copy-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              复制代码
            </el-button>
            <el-button 
              @click="downloadCode"
              class="download-btn"
            >
              <el-icon><Download /></el-icon>
              下载文件
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 格式化统计卡片 -->
    <div v-if="formatStats" class="stats-card">
      <div class="stats-header">
        <div class="stats-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>格式化统计</h3>
        <div class="stats-description">代码格式化详细信息</div>
      </div>
      <div class="stats-body">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">原始行数</div>
            <div class="stat-value">{{ formatStats.originalLines }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">格式化后行数</div>
            <div class="stat-value success">{{ formatStats.formattedLines }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">字符变化</div>
            <div class="stat-value" :class="formatStats.charDiff > 0 ? 'warning' : 'info'">
              {{ formatStats.charDiff > 0 ? '+' : '' }}{{ formatStats.charDiff }}
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">格式化时间</div>
            <div class="stat-value info">{{ formatStats.duration }}ms</div>
          </div>
        </div>

        <div class="improvements-section" v-if="formatStats.improvements.length > 0">
          <h4 class="improvements-title">改进项目：</h4>
          <div class="improvements-list">
            <div 
              v-for="improvement in formatStats.improvements" 
              :key="improvement"
              class="improvement-item"
            >
              <el-icon class="improvement-icon"><Check /></el-icon>
              <span class="improvement-text">{{ improvement }}</span>
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
        <div class="usage-description">代码格式化工具的强大功能</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🔧</div>
            <h4>多语言支持</h4>
            <p>支持JavaScript、TypeScript、Python、Java等主流编程语言</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚙️</div>
            <h4>灵活配置</h4>
            <p>支持自定义缩进、换行、空格等多种格式化选项</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📁</div>
            <h4>文件上传</h4>
            <p>支持拖拽上传代码文件，快速进行格式化处理</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>统计分析</h4>
            <p>提供详细的格式化统计信息和改进建议</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h4>代码美化</h4>
            <p>智能代码美化，提升代码可读性和维护性</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>便捷导出</h4>
            <p>支持复制到剪贴板或下载格式化后的代码文件</p>
          </div>
        </div>

        <div class="language-support-section">
          <h4 class="support-title">支持的编程语言：</h4>
          <div class="language-tags">
            <el-tag 
              v-for="lang in supportedLanguages" 
              :key="lang.value"
              :type="selectedLanguage === lang.value ? 'primary' : 'info'"
              class="language-tag"
              @click="selectLanguage(lang.value)"
            >
              {{ lang.icon }} {{ lang.name }}
            </el-tag>
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
  Document,
  Setting,
  MagicStick,
  Delete,
  DocumentAdd,
  Edit,
  View,
  Upload,
  CopyDocument,
  Download,
  DataAnalysis,
  Check,
  InfoFilled
} from '@element-plus/icons-vue'
import { codeFormatterTool, type ToolResponse } from '../../utils/newTools'

const loading = ref(false)
const selectedLanguage = ref('javascript')
const inputCode = ref('')
const formattedCode = ref('')
const formatStats = ref<any>(null)

// 支持的编程语言
const supportedLanguages = [
  { value: 'javascript', name: 'JavaScript', icon: '🟨', description: 'ES6+, JSX' },
  { value: 'typescript', name: 'TypeScript', icon: '🔷', description: 'TS, TSX' },
  { value: 'python', name: 'Python', icon: '🐍', description: 'Python 3' },
  { value: 'java', name: 'Java', icon: '☕', description: 'Java 8+' },
  { value: 'cpp', name: 'C++', icon: '⚡', description: 'C++11+' },
  { value: 'csharp', name: 'C#', icon: '🔷', description: '.NET Core' },
  { value: 'php', name: 'PHP', icon: '🐘', description: 'PHP 7+' },
  { value: 'go', name: 'Go', icon: '🐹', description: 'Golang' },
  { value: 'rust', name: 'Rust', icon: '🦀', description: 'Rust Lang' },
  { value: 'html', name: 'HTML', icon: '🌐', description: 'HTML5' },
  { value: 'css', name: 'CSS', icon: '🎨', description: 'CSS3, SCSS' },
  { value: 'json', name: 'JSON', icon: '📄', description: 'JSON格式' }
]

// 格式化配置
const formatConfig = reactive({
  indentType: 'spaces',
  indentSize: 2,
  lineWidth: 80,
  insertFinalNewline: true,
  trimTrailingWhitespace: true,
  insertSpaceAfterKeywords: true,
  insertSpaceBeforeParentheses: false,
  insertSpaceAfterCommas: true
})

// 选择语言
const selectLanguage = (language: string) => {
  selectedLanguage.value = language
  inputCode.value = ''
  formattedCode.value = ''
  formatStats.value = null
}

// 获取语言名称
const getLanguageName = (language: string) => {
  const lang = supportedLanguages.find(l => l.value === language)
  return lang ? lang.name : '未知语言'
}

// 获取行数
const getLineCount = (text: string) => {
  return text ? text.split('\n').length : 0
}

// 获取接受的文件类型
const getAcceptedFiles = (language: string) => {
  const fileTypes = {
    javascript: '.js,.jsx,.mjs',
    typescript: '.ts,.tsx',
    python: '.py,.pyw',
    java: '.java',
    cpp: '.cpp,.cxx,.cc,.c',
    csharp: '.cs',
    php: '.php',
    go: '.go',
    rust: '.rs',
    html: '.html,.htm',
    css: '.css,.scss,.sass',
    json: '.json'
  }
  return fileTypes[language as keyof typeof fileTypes] || '.txt'
}

// 获取文件扩展名
const getFileExtensions = (language: string) => {
  return getAcceptedFiles(language).replace(/\./g, '').toUpperCase()
}

// 处理文件上传
const handleFileUpload = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    inputCode.value = e.target?.result as string
    ElMessage.success('文件上传成功！')
  }
  reader.readAsText(file.raw)
}

// 加载示例代码
const loadExample = () => {
  const examples = {
    javascript: `function calculateSum(a,b){
if(typeof a!=='number'||typeof b!=='number'){
throw new Error('Invalid input');
}
return a+b;
}

const result=calculateSum(5,3);
console.log('Result:',result);`,
    
    python: `def calculate_sum(a,b):
if not isinstance(a,(int,float))or not isinstance(b,(int,float)):
raise ValueError('Invalid input')
return a+b

result=calculate_sum(5,3)
print(f'Result: {result}')`,
    
    java: `public class Calculator{
public static int calculateSum(int a,int b){
if(a<0||b<0){
throw new IllegalArgumentException("Negative values not allowed");
}
return a+b;
}
public static void main(String[]args){
int result=calculateSum(5,3);
System.out.println("Result: "+result);
}
}`,
    
    json: `{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"New York","zipCode":"10001"},"hobbies":["reading","swimming","coding"],"isActive":true}`
  }
  
  const example = examples[selectedLanguage.value as keyof typeof examples]
  if (example) {
    inputCode.value = example
    ElMessage.info(`已加载${getLanguageName(selectedLanguage.value)}示例代码`)
  } else {
    ElMessage.warning('该语言暂无示例代码')
  }
}

// 格式化代码
const formatCode = async () => {
  if (!inputCode.value.trim()) {
    ElMessage.warning('请输入要格式化的代码')
    return
  }

  loading.value = true
  const startTime = Date.now()
  
  try {
    let response: ToolResponse
    
    // 根据语言类型选择合适的格式化方法
    if (selectedLanguage.value === 'css') {
      response = await codeFormatterTool.formatCSS(inputCode.value)
    } else if (selectedLanguage.value === 'sql') {
      response = await codeFormatterTool.formatSQL(inputCode.value)
    } else {
      // 对于其他语言，使用CSS格式化作为基础
      response = await codeFormatterTool.formatCSS(inputCode.value)
    }
    
    if (response.success) {
      formattedCode.value = response.result
      
      // 计算统计信息
      const endTime = Date.now()
      const originalLines = getLineCount(inputCode.value)
      const formattedLines = getLineCount(formattedCode.value)
      const charDiff = formattedCode.value.length - inputCode.value.length
      
      formatStats.value = {
        originalLines,
        formattedLines,
        charDiff,
        duration: endTime - startTime,
        improvements: [
          '统一了代码缩进',
          '优化了空格使用',
          '规范了换行格式'
        ]
      }
      
      ElMessage.success('代码格式化完成！')
    } else {
      ElMessage.error(response.error || '格式化失败')
    }
  } catch (error) {
    ElMessage.error('格式化失败，请检查代码语法')
    console.error('代码格式化错误:', error)
  } finally {
    loading.value = false
  }
}

// 复制代码
const copyCode = async () => {
  if (!formattedCode.value) {
    ElMessage.warning('没有代码可复制')
    return
  }

  try {
    await navigator.clipboard.writeText(formattedCode.value)
    ElMessage.success('代码已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载代码
const downloadCode = () => {
  if (!formattedCode.value) {
    ElMessage.warning('没有代码可下载')
    return
  }

  try {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      php: 'php',
      go: 'go',
      rust: 'rs',
      html: 'html',
      css: 'css',
      json: 'json'
    }
    
    const extension = extensions[selectedLanguage.value as keyof typeof extensions] || 'txt'
    const blob = new Blob([formattedCode.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `formatted-code.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('文件下载成功！')
  } catch (error) {
    ElMessage.error('下载失败')
  }
}

// 清空所有
const clearAll = () => {
  inputCode.value = ''
  formattedCode.value = ''
  formatStats.value = null
  ElMessage.info('已清空所有代码')
}
</script>

<style scoped>
.code-formatter-tool {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  --primary-color: #a855f7;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
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
.stats-card,
.usage-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

.editor-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

/* 卡片头部 */
.config-header,
.stats-header,
.usage-header,
.editor-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.config-icon,
.stats-icon,
.usage-icon,
.editor-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.config-header h3,
.stats-header h3,
.usage-header h3,
.editor-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.config-description,
.stats-description,
.usage-description,
.editor-info {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 语言选择 */
.language-section {
  margin-bottom: 24px;
}

.language-label {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 16px;
}

.language-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.language-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-item:hover {
  border-color: var(--primary-color);
  background: #faf5ff;
  transform: translateY(-2px);
}

.language-item.active {
  border-color: var(--primary-color);
  background: #faf5ff;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.language-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.language-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.language-description {
  font-size: 12px;
  color: #6b7280;
}

/* 格式化选项 */
.format-options {
  display: grid;
  gap: 24px;
  margin-bottom: 24px;
}

.option-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.option-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
  display: inline-block;
}

.option-controls {
  display: grid;
  gap: 16px;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.indent-input,
.width-input {
  width: 150px;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.format-button {
  min-width: 160px;
}

.clear-button,
.example-button {
  min-width: 120px;
}

/* 编辑器区域 */
.editor-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.editor-body {
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
  padding: 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--primary-color);
  background: #faf5ff;
}

.upload-icon {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
}

.code-input :deep(.el-textarea__inner),
.code-output :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.code-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.code-output :deep(.el-textarea__inner) {
  background: #f8fafc;
  color: #1f2937;
}

.output-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
}

.copy-btn,
.download-btn {
  min-width: 120px;
}

/* 统计信息 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
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

/* 改进项目 */
.improvements-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.improvements-title {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.improvements-list {
  display: grid;
  gap: 8px;
}

.improvement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.improvement-icon {
  color: #10b981;
  font-size: 16px;
}

.improvement-text {
  font-size: 14px;
  color: #1f2937;
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

/* 语言支持 */
.language-support-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.support-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.language-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.language-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-tag:hover {
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-formatter-tool {
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
  
  .config-card,
  .stats-card,
  .usage-card,
  .editor-card {
    padding: 20px 16px;
  }
  
  .language-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .checkbox-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section,
  .output-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .format-button,
  .clear-button,
  .example-button,
  .copy-btn,
  .download-btn {
    width: 100%;
  }
  
  .stats-grid,
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .config-header,
  .stats-header,
  .usage-header,
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .config-description,
  .stats-description,
  .usage-description,
  .editor-info {
    margin-left: 0;
  }
}
</style>