<template>
  <div class="html-entity-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h1 class="hero-title">HTML实体编码工具</h1>
        <p class="hero-description">专业的HTML实体编码解码工具，确保网页内容正确显示</p>
      </div>
    </div>

    <!-- 模式选择 -->
    <div class="tool-card mode-card">
      <div class="card-header">
        <h3>
          <el-icon><Switch /></el-icon>
          模式选择
        </h3>
      </div>
      <div class="mode-selector">
        <el-radio-group v-model="mode" size="large">
          <el-radio-button label="encode">编码</el-radio-button>
          <el-radio-button label="decode">解码</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 编码选项 -->
    <div v-if="mode === 'encode'" class="tool-card config-card">
      <div class="card-header">
        <h3>
          <el-icon><Setting /></el-icon>
          编码选项
        </h3>
      </div>
      <div class="config-options">
        <div class="option-row">
          <label>编码类型：</label>
          <el-radio-group v-model="encodeType">
            <el-radio label="named">命名实体</el-radio>
            <el-radio label="numeric">数字实体</el-radio>
            <el-radio label="hex">十六进制实体</el-radio>
          </el-radio-group>
        </div>
        <div class="option-row">
          <el-checkbox v-model="encodeBasic">编码基本字符 (&lt;&gt;&amp;"')</el-checkbox>
          <el-checkbox v-model="encodeExtended">编码扩展字符 (©®™等)</el-checkbox>
        </div>
      </div>
    </div>

    <!-- 输入输出区域 -->
    <div class="editor-sections">
      <div class="editor-card">
        <div class="card-header">
          <h3>
            <el-icon><Edit /></el-icon>
            {{ mode === 'encode' ? '原始文本' : 'HTML实体文本' }}
          </h3>
          <span class="char-count">{{ inputText.length }} 字符</span>
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="10"
          :placeholder="mode === 'encode' ? '请输入需要编码的文本...' : '请输入需要解码的HTML实体...'"
          @input="processText"
        />
        <div class="input-actions">
          <el-button @click="inputText = ''" :icon="Delete" size="small">清空</el-button>
          <el-button @click="loadSampleText" :icon="DocumentAdd" size="small">示例</el-button>
        </div>
      </div>

      <div class="editor-card">
        <div class="card-header">
          <h3>
            <el-icon><View /></el-icon>
            {{ mode === 'encode' ? 'HTML实体' : '解码结果' }}
          </h3>
          <span class="char-count">{{ outputText.length }} 字符</span>
        </div>
        <el-input
          v-model="outputText"
          type="textarea"
          :rows="10"
          readonly
          placeholder="转换结果将显示在这里..."
        />
        <div class="output-actions">
          <el-button @click="copyResult" :icon="CopyDocument" type="primary" size="small">
            复制结果
          </el-button>
          <el-button @click="downloadResult" :icon="Download" size="small">下载</el-button>
        </div>
      </div>
    </div>

    <!-- 转换统计 -->
    <div v-if="conversionStats" class="tool-card stats-card">
      <div class="card-header">
        <h3>
          <el-icon><DataAnalysis /></el-icon>
          转换统计
        </h3>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">原始长度:</span>
          <span class="stat-value">{{ conversionStats.originalLength }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">转换长度:</span>
          <span class="stat-value">{{ conversionStats.convertedLength }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">转换字符:</span>
          <span class="stat-value">{{ conversionStats.convertedCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">变化率:</span>
          <span class="stat-value">{{ conversionStats.changeRate }}%</span>
        </div>
      </div>
    </div>

    <!-- HTML实体参考 -->
    <div class="tool-card usage-card">
      <div class="card-header">
        <h3>
          <el-icon><InfoFilled /></el-icon>
          HTML实体参考
        </h3>
      </div>
      <div class="entity-reference">
        <div v-for="category in htmlEntities" :key="category.name" class="entity-category">
          <h4>{{ category.name }}</h4>
          <div class="entity-grid">
            <div v-for="entity in category.entities" :key="entity.code" class="entity-item">
              <span class="entity-char">{{ entity.char }}</span>
              <span class="entity-name">{{ entity.name }}</span>
              <span class="entity-code" @click="copyToClipboard(entity.code)">{{ entity.code }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览模式 -->
    <div v-if="outputText && mode === 'decode'" class="tool-card result-card">
      <div class="card-header">
        <h3>
          <el-icon><Monitor /></el-icon>
          预览效果
        </h3>
        <el-radio-group v-model="previewMode" size="small">
          <el-radio-button label="rendered">渲染效果</el-radio-button>
          <el-radio-button label="source">源码</el-radio-button>
        </el-radio-group>
      </div>
      <div class="preview-content">
        <div v-if="previewMode === 'rendered'" class="rendered-preview" v-html="outputText"></div>
        <pre v-else class="source-preview">{{ outputText }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Switch,
  Setting,
  Edit,
  DocumentAdd,
  View,
  CopyDocument,
  Delete,
  Download,
  Monitor,
  DataAnalysis,
  InfoFilled
} from '@element-plus/icons-vue'

const mode = ref('encode')
const encodeType = ref('named')
const encodeBasic = ref(true)
const encodeExtended = ref(true)
const inputText = ref('')
const outputText = ref('')
const previewMode = ref('rendered')
const conversionStats = ref<any>(null)

// HTML实体映射
const namedEntities: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
  ' ': '&nbsp;',
  '©': '&copy;',
  '®': '&reg;',
  '™': '&trade;',
  '€': '&euro;',
  '¥': '&yen;',
  '£': '&pound;',
  '¢': '&cent;',
  '§': '&sect;',
  '¶': '&para;',
  '†': '&dagger;',
  '‡': '&Dagger;',
  '…': '&hellip;',
  '–': '&ndash;',
  '—': '&mdash;',
  '\u2018': '&lsquo;',
  '\u2019': '&rsquo;',
  '\u201C': '&ldquo;',
  '\u201D': '&rdquo;'
}

// 反向映射用于解码
const entityToChar: Record<string, string> = {}
Object.entries(namedEntities).forEach(([char, entity]) => {
  entityToChar[entity] = char
})

// 常用HTML实体参考
const htmlEntities = [
  {
    name: '基础字符',
    entities: [
      { char: '<', name: '小于号', code: '&lt;' },
      { char: '>', name: '大于号', code: '&gt;' },
      { char: '&', name: '和号', code: '&amp;' },
      { char: '"', name: '双引号', code: '&quot;' },
      { char: "'", name: '单引号', code: '&#39;' },
      { char: ' ', name: '不间断空格', code: '&nbsp;' }
    ]
  },
  {
    name: '特殊符号',
    entities: [
      { char: '©', name: '版权符号', code: '&copy;' },
      { char: '®', name: '注册商标', code: '&reg;' },
      { char: '™', name: '商标', code: '&trade;' },
      { char: '€', name: '欧元', code: '&euro;' },
      { char: '¥', name: '日元', code: '&yen;' },
      { char: '£', name: '英镑', code: '&pound;' }
    ]
  },
  {
    name: '标点符号',
    entities: [
      { char: '…', name: '省略号', code: '&hellip;' },
      { char: '–', name: '短破折号', code: '&ndash;' },
      { char: '—', name: '长破折号', code: '&mdash;' },
      { char: '\u2018', name: '左单引号', code: '&lsquo;' },
      { char: '\u2019', name: '右单引号', code: '&rsquo;' },
      { char: '\u201C', name: '左双引号', code: '&ldquo;' },
      { char: '\u201D', name: '右双引号', code: '&rdquo;' }
    ]
  }
]

// 基础字符集
const basicChars = ['<', '>', '&', '"', "'", ' ']

// 扩展字符集
const extendedChars = ['©', '®', '™', '€', '¥', '£', '¢', '§', '¶', '†', '‡', '…', '–', '—', '\u2018', '\u2019', '\u201C', '\u201D']

// 编码函数
const encodeToHtml = (text: string): string => {
  let result = text
  let convertedCount = 0

  const charsToEncode = [
    ...(encodeBasic.value ? basicChars : []),
    ...(encodeExtended.value ? extendedChars : [])
  ]

  charsToEncode.forEach(char => {
    if (result.includes(char)) {
      const regex = new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      const matches = result.match(regex)
      if (matches) {
        convertedCount += matches.length
        
        if (encodeType.value === 'named' && namedEntities[char]) {
          result = result.replace(regex, namedEntities[char])
        } else if (encodeType.value === 'numeric') {
          result = result.replace(regex, `&#${char.charCodeAt(0)};`)
        } else if (encodeType.value === 'hex') {
          result = result.replace(regex, `&#x${char.charCodeAt(0).toString(16)};`)
        }
      }
    }
  })

  // 更新统计信息
  updateStats(text, result, convertedCount)
  
  return result
}

// 解码函数
const decodeFromHtml = (text: string): string => {
  let result = text
  let convertedCount = 0

  // 解码命名实体
  Object.entries(entityToChar).forEach(([entity, char]) => {
    const regex = new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    const matches = result.match(regex)
    if (matches) {
      convertedCount += matches.length
      result = result.replace(regex, char)
    }
  })

  // 解码数字实体
  result = result.replace(/&#(\d+);/g, (_, num) => {
    convertedCount++
    return String.fromCharCode(parseInt(num))
  })

  // 解码十六进制实体
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    convertedCount++
    return String.fromCharCode(parseInt(hex, 16))
  })

  // 更新统计信息
  updateStats(text, result, convertedCount)
  
  return result
}

// 更新统计信息
const updateStats = (original: string, converted: string, convertedCount: number) => {
  const originalLength = original.length
  const convertedLength = converted.length
  const changeRate = originalLength > 0 ? 
    ((convertedLength - originalLength) / originalLength * 100).toFixed(1) : '0'

  conversionStats.value = {
    originalLength,
    convertedLength,
    convertedCount,
    changeRate
  }
}

// 处理文本转换
const processText = () => {
  if (!inputText.value.trim()) {
    outputText.value = ''
    conversionStats.value = null
    return
  }

  try {
    if (mode.value === 'encode') {
      outputText.value = encodeToHtml(inputText.value)
    } else {
      outputText.value = decodeFromHtml(inputText.value)
    }
  } catch (error) {
    ElMessage.error('转换过程中发生错误')
    console.error(error)
  }
}

// 复制结果
const copyResult = async () => {
  if (!outputText.value) {
    ElMessage.warning('没有内容可复制')
    return
  }
  
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载结果
const downloadResult = () => {
  if (!outputText.value) {
    ElMessage.warning('没有内容可下载')
    return
  }
  
  const blob = new Blob([outputText.value], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `html-entity-${mode.value}-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('文件已下载')
}

// 加载示例文本
const loadSampleText = () => {
  if (mode.value === 'encode') {
    inputText.value = '<h1>HTML实体编码示例</h1>\n<p>这里包含一些特殊字符：</p>\n<ul>\n  <li>"双引号" & \'单引号\'</li>\n  <li>版权符号©，注册商标®</li>\n  <li>货币符号：€ ¥ £</li>\n  <li>标点符号：… – —</li>\n</ul>\n<p>HTML标签会被转义：&lt;script&gt;alert(\'test\')&lt;/script&gt;</p>'
  } else {
    inputText.value = '&lt;h1&gt;HTML实体解码示例&lt;/h1&gt;\n&lt;p&gt;&quot;双引号&quot; &amp; &#39;单引号&#39;&lt;/p&gt;\n&lt;p&gt;版权符号&copy;，注册商标&reg;&lt;/p&gt;\n&lt;p&gt;货币符号：&euro; &yen; &pound;&lt;/p&gt;\n&lt;p&gt;标点符号：&hellip; &ndash; &mdash;&lt;/p&gt;'
  }
  processText()
}

// 复制实体代码
const copyToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.html-entity-tool {
  --tool-color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mode-selector {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.config-options {
  padding: 20px;
}

.option-row {
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.option-row label {
  font-weight: 500;
  min-width: 80px;
}

.editor-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-end;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.stat-label {
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: var(--el-color-primary);
}

.entity-reference {
  padding: 20px;
}

.entity-category {
  margin-bottom: 24px;
}

.entity-category h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.entity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 8px;
}

.entity-item {
  display: grid;
  grid-template-columns: 40px 1fr 100px;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  font-size: 14px;
}

.entity-char {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.entity-name {
  color: #666;
}

.entity-code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.entity-code:hover {
  background: rgba(0, 0, 0, 0.2);
}

.preview-content {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 12px;
}

.rendered-preview {
  min-height: 100px;
}

.source-preview {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 768px) {
  .editor-sections {
    grid-template-columns: 1fr;
  }
  
  .option-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .entity-grid {
    grid-template-columns: 1fr;
  }
  
  .entity-item {
    grid-template-columns: 30px 1fr 80px;
  }
}
</style>