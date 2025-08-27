<template>
  <div class="variable-generator">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><DocumentCopy /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.variableGenerator') }}</h1>
        <p class="hero-description">{{ t('pages.variableGenerator.description') }}</p>
      </div>
    </div>

    <!-- 配置卡片 -->
    <div class="config-card">
      <div class="config-header">
        <div class="config-icon">
          <el-icon><Edit /></el-icon>
        </div>
        <h3>{{ t('pages.variableGenerator.configTitle') }}</h3>
        <div class="config-description">{{ t('pages.variableGenerator.configDescription') }}</div>
      </div>
      
      <div class="config-body">
        <!-- 输入区域 -->
        <div class="input-section">
          <label class="input-label">{{ t('pages.variableGenerator.inputLabel') }}</label>
          <div class="input-group">
            <el-input
              v-model="inputText"
              :placeholder="t('pages.variableGenerator.placeholder')"
              class="input-field"
              size="large"
              clearable
              @keyup.enter="translateText"
            />
            <el-button 
              type="primary" 
              size="large" 
              @click="translateText"
              :loading="isTranslating"
              class="translate-btn"
            >
              {{ isTranslating ? t('pages.variableGenerator.translating') : t('pages.variableGenerator.generate') }}
            </el-button>
          </div>
          
          <div class="input-examples">
            <span class="example-label">示例：</span>
            <el-button size="small" @click="setText('学生信息')" class="example-btn">学生信息</el-button>
            <el-button size="small" @click="setText('产品信息')" class="example-btn">产品信息</el-button>
            <el-button size="small" @click="setText('用户管理')" class="example-btn">用户管理</el-button>
            <el-button size="small" @click="setText('数据分析')" class="example-btn">数据分析</el-button>
          </div>
          
          <div v-if="translatedText" class="translation-result">
            <div class="result-label">翻译结果：</div>
            <div class="result-text">{{ translatedText }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果展示卡片 -->
    <div v-if="variableResults.length > 0" class="result-card">
      <div class="result-header">
        <div class="result-icon">
          <el-icon><List /></el-icon>
        </div>
        <h3>{{ t('pages.variableGenerator.results') }}</h3>
        <div class="result-description">{{ t('pages.variableGenerator.resultDescription') }}</div>
      </div>
      
      <div class="result-body">
        <div class="variable-grid">
          <div 
            v-for="(variable, index) in variableResults" 
            :key="index"
            class="variable-item"
            @click="copyToClipboard(variable.value)"
          >
            <div class="variable-label">{{ variable.label }}</div>
            <div class="variable-value">
              <span class="variable-text">{{ variable.value }}</span>
              <el-icon class="copy-icon">
                <DocumentCopy />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明卡片 -->
    <div class="help-card">
      <div class="help-header">
        <div class="help-icon">
          <el-icon><QuestionFilled /></el-icon>
        </div>
        <h3>使用说明</h3>
      </div>
      
      <div class="help-body">
        <div class="help-grid">
          <div class="help-item">
            <div class="help-step">1</div>
            <div class="help-content">
              <div class="help-title">输入中文</div>
              <div class="help-desc">在输入框中输入中文描述</div>
            </div>
          </div>
          <div class="help-item">
            <div class="help-step">2</div>
            <div class="help-content">
              <div class="help-title">翻译生成</div>
              <div class="help-desc">点击"生成变量"按钮进行翻译</div>
            </div>
          </div>
          <div class="help-item">
            <div class="help-step">3</div>
            <div class="help-content">
              <div class="help-title">选择格式</div>
              <div class="help-desc">自动生成多种编程变量格式</div>
            </div>
          </div>
          <div class="help-item">
            <div class="help-step">4</div>
            <div class="help-content">
              <div class="help-title">复制使用</div>
              <div class="help-desc">点击变量名复制到剪贴板</div>
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
import { DocumentCopy, Edit, List, QuestionFilled } from '@element-plus/icons-vue'

const { t } = useI18n()
// 响应式数据
const inputText = ref('')
const translatedText = ref('')
const isTranslating = ref(false)

// 变量结果接口
interface VariableResult {
  label: string
  value: string
}

// 计算属性：生成的变量结果
const variableResults = computed<VariableResult[]>(() => {
  if (!translatedText.value) return []
  
  const text = translatedText.value.trim()
  const results: VariableResult[] = []
  
  // 基础处理：移除换行符，转为小写，处理特殊字符
  const cleanText = text.replace(/\n/g, ' ').toLowerCase().trim()
  
  // 分割单词
  const words = cleanText.split(/\s+/).filter(word => word.length > 0)
  
  if (words.length === 0) return results
  
  // 1. PascalCase (帕斯卡命名)
  const pascalCase = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
  results.push({
    label: 'PascalCase',
    value: pascalCase
  })
  
  // 2. snake_case (下划线连接)
  const snakeCase = words.join('_')
  results.push({
    label: 'snake_case',
    value: snakeCase
  })
  
  // 3. Original (原文)
  const original = text.replace(/\n/g, ' ').trim()
  results.push({
    label: 'Original',
    value: original
  })
  
  // 4. lowercase (全小写连接)
  const lowercase = words.join('')
  results.push({
    label: 'lowercase',
    value: lowercase
  })
  
  // 5. kebab-case (短横线连接)
  const kebabCase = words.join('-')
  results.push({
    label: 'kebab-case',
    value: kebabCase
  })
  
  // 6. KEBAB-CASE (大写短横线)
  const upperKebabCase = words.join('-').toUpperCase()
  results.push({
    label: 'KEBAB-CASE',
    value: upperKebabCase
  })
  
  // 7. camelCase (驼峰命名)
  const camelCase = words.map((word, index) => 
    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')
  results.push({
    label: 'camelCase',
    value: camelCase
  })
  
  // 8. UPPERCASE (全大写)
  const uppercase = words.join('').toUpperCase()
  results.push({
    label: 'UPPERCASE',
    value: uppercase
  })
  
  return results
})

// 翻译文本
const translateText = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要翻译的中文')
    return
  }
  
  isTranslating.value = true
  
  try {
    // 调用本地后端API代理翻译服务
    const response = await fetch('/api/translate/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: inputText.value.trim(),
        srcLang: 'auto',
        tgtLang: 'en',
        domain: 'general'
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    // 后端返回的是 ApiResponse 格式：{code, message, data, timestamp}
    // 检查响应状态码是否为200（成功）
    if (result.code === 200 && result.data) {
      // 后端返回的数据结构可能嵌套了一层
      const translationData = result.data.data || result.data
      if (translationData && translationData.translateText) {
        translatedText.value = translationData.translateText
        ElMessage.success('翻译成功！')
      } else {
        throw new Error('翻译结果格式异常')
      }
    } else {
      // 使用后端返回的错误消息
      throw new Error(result.message || '翻译失败')
    }
  } catch (error: any) {
    console.error('Translation error:', error)
    ElMessage.error('翻译失败：' + (error.message || '请检查网络连接或稍后重试'))
    
    // 备用翻译结果
    const backupTranslations: Record<string, string> = {
      '学生信息': 'Student Information',
      '用户管理': 'User Management', 
      '系统设置': 'System Settings',
      '数据分析': 'Data Analysis',
      '文件上传': 'File Upload',
      '订单管理': 'Order Management'
    }
    
    const backup = backupTranslations[inputText.value.trim()]
    if (backup) {
      translatedText.value = backup
      ElMessage.info('使用备用翻译结果')
    }
  } finally {
    isTranslating.value = false
  }
}



// 设置示例文本
const setText = (text: string) => {
  inputText.value = text
  translateText()
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`已复制: ${text}`)
  } catch (error) {
    console.error('Copy failed:', error)
    // 备用方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success(`已复制: ${text}`)
  }
}
</script>

<style scoped>
/* 引用公共样式 */
@import '@/styles/modern-tool.css';

.variable-generator {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  margin-bottom: 2rem;
  color: white;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hero-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

/* 卡片通用样式 */
.config-card, .result-card, .help-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  overflow: hidden;
}

/* 卡片头部 */
.config-header, .result-header, .help-header {
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.config-icon, .result-icon, .help-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.config-header h3, .result-header h3, .help-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.config-description, .result-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: auto;
}

/* 配置卡片内容 */
.config-body, .result-body, .help-body {
  padding: 2rem;
}

/* 输入区域 */
.input-section {
  margin-bottom: 0;
}

.input-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-field {
  flex: 1;
}

.translate-btn {
  min-width: 120px;
}

.input-examples {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.example-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-right: 0.5rem;
}

.example-btn {
  font-size: 0.875rem;
}

.translation-result {
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  margin-top: 1rem;
}

.result-label {
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 0.5rem;
}

.result-text {
  font-size: 1.1rem;
  color: #1e40af;
  font-weight: 500;
}

/* 变量结果网格 */
.variable-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.variable-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}

.variable-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.variable-label {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #667eea;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.variable-value {
  padding: 1rem;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
}

.variable-item:hover .variable-value {
  background: #f8fafc;
}

.variable-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 1rem;
  color: #1f2937;
  word-break: break-all;
}

.copy-icon {
  color: #667eea;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  font-size: 1.1rem;
}

.variable-item:hover .copy-icon {
  opacity: 1;
}

/* 帮助说明 */
.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.help-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.help-step {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.help-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.help-desc {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .variable-generator {
    padding: 1rem;
    max-width: none;
  }
  
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .config-body, .result-body, .help-body {
    padding: 1.5rem;
  }
  
  .input-group {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .variable-grid {
    grid-template-columns: 1fr;
  }
  
  .help-grid {
    grid-template-columns: 1fr;
  }
  
  .input-examples {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
