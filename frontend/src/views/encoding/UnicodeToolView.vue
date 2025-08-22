<template>
  <div class="unicode-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h1 class="hero-title">Unicode编码工具</h1>
        <p class="hero-description">强大的Unicode编码转换工具，支持多种编码格式和字符分析</p>
      </div>
    </div>

    <!-- 转换模式选择卡片 -->
    <div class="mode-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Switch /></el-icon>
        </div>
        <h3>转换模式</h3>
        <div class="selector-description">选择Unicode编码转换方式</div>
      </div>
      
      <div class="selector-body">
        <el-radio-group v-model="mode" @change="performConversion" size="large" class="mode-group">
          <el-radio-button label="encode">文本 → Unicode</el-radio-button>
          <el-radio-button label="decode">Unicode → 文本</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 编码格式选择卡片 -->
    <div class="format-card">
      <div class="format-header">
        <div class="format-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h3>编码格式</h3>
        <div class="format-description">选择Unicode编码格式</div>
      </div>
      
      <div class="format-body">
        <div class="format-grid">
          <div 
            v-for="format in unicodeFormats" 
            :key="format.value"
            class="format-item"
            :class="{ active: selectedFormat === format.value }"
            @click="selectFormat(format.value)"
          >
            <div class="format-name">{{ format.name }}</div>
            <div class="format-example">{{ format.example }}</div>
            <div class="format-description">{{ format.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 转换器卡片 -->
    <div class="converter-card">
      <div class="converter-header">
        <div class="converter-icon">
          <el-icon><Edit /></el-icon>
        </div>
        <h3>Unicode转换器</h3>
        <div class="converter-description">输入文本或Unicode编码进行转换</div>
      </div>
      
      <div class="converter-body">
        <div class="conversion-sections">
          <!-- 输入区域 -->
          <div class="input-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><Edit /></el-icon>
              </div>
              <h4>{{ mode === 'encode' ? '原始文本' : 'Unicode编码' }}</h4>
              <div class="section-info">{{ inputText.length }} 字符</div>
            </div>
            
            <el-input
              v-model="inputText"
              type="textarea"
              :placeholder="mode === 'encode' ? '请输入要编码的文本...' : '请输入Unicode编码...'"
              :rows="8"
              class="input-textarea"
              @input="performConversion"
            />
            
            <div class="input-actions">
              <el-button @click="pasteFromClipboard" size="small">
                <el-icon><CopyDocument /></el-icon>
                粘贴
              </el-button>
              <el-button @click="clearInput" size="small">
                <el-icon><Delete /></el-icon>
                清空
              </el-button>
              <el-button @click="loadExample" size="small">
                <el-icon><DocumentAdd /></el-icon>
                示例
              </el-button>
            </div>
          </div>

          <!-- 转换箭头 -->
          <div class="conversion-arrow">
            <el-button 
              @click="swapMode"
              class="swap-btn"
              :disabled="!inputText"
            >
              <el-icon><Switch /></el-icon>
            </el-button>
          </div>

          <!-- 输出区域 -->
          <div class="output-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><View /></el-icon>
              </div>
              <h4>{{ mode === 'encode' ? 'Unicode编码' : '解码文本' }}</h4>
              <div class="section-info">{{ outputText.length }} 字符</div>
            </div>
            
            <el-input
              v-model="outputText"
              type="textarea"
              :placeholder="mode === 'encode' ? 'Unicode编码结果将显示在这里...' : '解码后的文本将显示在这里...'"
              :rows="8"
              readonly
              class="output-textarea"
            />
            
            <div class="output-actions">
              <el-button 
                @click="copyOutput" 
                type="primary" 
                size="small"
                :disabled="!outputText"
              >
                <el-icon><CopyDocument /></el-icon>
                复制结果
              </el-button>
              <el-button 
                @click="downloadResult" 
                size="small"
                :disabled="!outputText"
              >
                <el-icon><Download /></el-icon>
                下载文件
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 字符分析卡片 -->
    <div v-if="inputText && mode === 'encode'" class="analysis-card">
      <div class="analysis-header">
        <div class="analysis-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>字符分析</h3>
        <div class="analysis-description">详细的字符信息分析</div>
      </div>
      
      <div class="analysis-body">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">总字符数</div>
            <div class="stat-value">{{ charStats.totalChars }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">ASCII字符</div>
            <div class="stat-value">{{ charStats.asciiChars }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">中文字符</div>
            <div class="stat-value">{{ charStats.chineseChars }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">其他Unicode</div>
            <div class="stat-value">{{ charStats.unicodeChars }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">字节大小</div>
            <div class="stat-value">{{ charStats.byteSize }} B</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">编码后大小</div>
            <div class="stat-value">{{ outputText.length }} 字符</div>
          </div>
        </div>

        <!-- 字符详情列表 -->
        <div v-if="charDetails.length > 0" class="char-details">
          <h4 class="details-title">字符详情 (前20个字符)</h4>
          <div class="char-list">
            <div 
              v-for="(char, index) in charDetails.slice(0, 20)" 
              :key="index"
              class="char-item"
            >
              <div class="char-display">{{ char.char }}</div>
              <div class="char-info">
                <div class="char-unicode">U+{{ char.codePoint.toString(16).toUpperCase().padStart(4, '0') }}</div>
                <div class="char-decimal">{{ char.codePoint }}</div>
                <div class="char-name">{{ char.name }}</div>
              </div>
            </div>
          </div>
          
          <div v-if="charDetails.length > 20" class="more-chars">
            还有 {{ charDetails.length - 20 }} 个字符未显示...
          </div>
        </div>
      </div>
    </div>

    <!-- 批量处理卡片 -->
    <div class="batch-card">
      <div class="batch-header">
        <div class="batch-icon">
          <el-icon><Files /></el-icon>
        </div>
        <h3>批量处理</h3>
        <div class="batch-description">批量处理多行文本或编码</div>
      </div>
      
      <div class="batch-body">
        <div class="batch-input-section">
          <div class="batch-input-header">
            <h4>批量输入 (每行一个)</h4>
            <el-button @click="clearBatchInput" size="small">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
          
          <el-input
            v-model="batchInput"
            type="textarea"
            placeholder="请输入多行文本，每行一个要转换的内容..."
            :rows="6"
            class="batch-input-textarea"
          />
        </div>

        <div class="batch-actions">
          <el-button 
            type="primary" 
            @click="processBatch"
            :disabled="!batchInput.trim()"
            :loading="batchProcessing"
          >
            <el-icon><MagicStick /></el-icon>
            批量{{ mode === 'encode' ? '编码' : '解码' }}
          </el-button>
        </div>

        <div v-if="batchResults.length > 0" class="batch-results">
          <div class="batch-results-header">
            <h4>批量处理结果 ({{ batchResults.length }}项)</h4>
            <div class="batch-results-actions">
              <el-button @click="copyBatchResults" size="small">
                <el-icon><CopyDocument /></el-icon>
                复制全部
              </el-button>
              <el-button @click="downloadBatchResults" size="small">
                <el-icon><Download /></el-icon>
                下载结果
              </el-button>
            </div>
          </div>
          
          <div class="batch-results-list">
            <div 
              v-for="(result, index) in batchResults" 
              :key="index"
              class="batch-result-item"
            >
              <div class="result-index">{{ index + 1 }}</div>
              <div class="result-content">
                <div class="result-input">{{ result.input }}</div>
                <div class="result-arrow">→</div>
                <div class="result-output">{{ result.output }}</div>
              </div>
              <div class="result-actions">
                <el-button 
                  @click="copyBatchResult(result.output)" 
                  size="small"
                  class="copy-single-btn"
                >
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用指南卡片 -->
    <div class="guide-card">
      <div class="guide-header">
        <div class="guide-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>Unicode编码指南</h3>
        <div class="guide-description">Unicode编码的详细说明</div>
      </div>
      <div class="guide-body">
        <div class="format-descriptions">
          <div 
            v-for="format in unicodeFormats" 
            :key="format.value"
            class="format-desc-item"
          >
            <h4 class="format-desc-title">{{ format.name }}</h4>
            <div class="format-desc-content">
              <p class="format-desc-text">{{ format.fullDescription }}</p>
              <div class="format-desc-example">
                <strong>示例：</strong>
                <code>{{ format.example }}</code>
              </div>
              <div class="format-desc-usage">
                <strong>用途：</strong>
                {{ format.usage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Switch,
  Grid,
  Edit,
  View,
  CopyDocument,
  Delete,
  DocumentAdd,
  Download,
  DataAnalysis,
  Files,
  MagicStick,
  InfoFilled
} from '@element-plus/icons-vue'

const mode = ref('encode')
const selectedFormat = ref('unicode')
const inputText = ref('')
const outputText = ref('')
const batchInput = ref('')
const batchResults = ref<any[]>([])
const batchProcessing = ref(false)

// Unicode格式定义
const unicodeFormats = [
  {
    value: 'unicode',
    name: '\\uXXXX格式',
    example: '\\u4e2d\\u6587',
    description: 'JavaScript风格',
    fullDescription: '最常用的Unicode转义序列格式，广泛用于JavaScript、Java、C#等编程语言中。',
    usage: 'JavaScript代码、JSON数据、配置文件'
  },
  {
    value: 'unicode16',
    name: 'U+XXXX格式',
    example: 'U+4E2D U+6587',
    description: '标准Unicode表示',
    fullDescription: 'Unicode标准官方表示法，常用于Unicode规范文档和字符集描述。',
    usage: 'Unicode规范、字符集文档、技术说明'
  },
  {
    value: 'hex',
    name: '十六进制',
    example: '4e2d 6587',
    description: '纯十六进制码点',
    fullDescription: '直接使用十六进制数值表示Unicode码点，简洁明了。',
    usage: '底层编程、数据分析、调试'
  },
  {
    value: 'decimal',
    name: '十进制',
    example: '20013 25991',
    description: '十进制码点',
    fullDescription: '使用十进制数值表示Unicode码点，便于数学计算。',
    usage: '数学计算、算法处理、数据统计'
  },
  {
    value: 'html',
    name: 'HTML实体',
    example: '&#20013;&#25991;',
    description: 'HTML数字实体',
    fullDescription: 'HTML/XML中使用的数字字符引用格式，确保在网页中正确显示。',
    usage: 'HTML页面、XML文档、网页开发'
  },
  {
    value: 'css',
    name: 'CSS转义',
    example: '\\4e2d \\6587',
    description: 'CSS Unicode转义',
    fullDescription: 'CSS中使用的Unicode转义序列，用于在样式表中表示特殊字符。',
    usage: 'CSS样式表、网页设计、字体处理'
  }
]

// 字符统计
const charStats = computed(() => {
  if (!inputText.value) {
    return { totalChars: 0, asciiChars: 0, chineseChars: 0, unicodeChars: 0, byteSize: 0 }
  }

  const text = inputText.value
  let asciiChars = 0
  let chineseChars = 0
  let unicodeChars = 0

  for (const char of text) {
    const code = char.codePointAt(0) || 0
    if (code <= 127) {
      asciiChars++
    } else if (code >= 0x4e00 && code <= 0x9fff) {
      chineseChars++
    } else {
      unicodeChars++
    }
  }

  return {
    totalChars: text.length,
    asciiChars,
    chineseChars,
    unicodeChars,
    byteSize: new Blob([text]).size
  }
})

// 字符详情
const charDetails = computed(() => {
  if (!inputText.value || mode.value !== 'encode') return []
  
  return Array.from(inputText.value).map(char => {
    const codePoint = char.codePointAt(0) || 0
    return {
      char,
      codePoint,
      name: getCharacterName(codePoint)
    }
  })
})

// 选择格式
const selectFormat = (format: string) => {
  selectedFormat.value = format
  performConversion()
}

// 执行转换
const performConversion = () => {
  if (!inputText.value.trim()) {
    outputText.value = ''
    return
  }

  try {
    if (mode.value === 'encode') {
      outputText.value = encodeToUnicode(inputText.value, selectedFormat.value)
    } else {
      outputText.value = decodeFromUnicode(inputText.value, selectedFormat.value)
    }
  } catch (error: any) {
    ElMessage.error(`转换失败: ${error.message}`)
    outputText.value = ''
  }
}

// 编码为Unicode
const encodeToUnicode = (text: string, format: string): string => {
  const chars = Array.from(text)
  
  switch (format) {
    case 'unicode':
      return chars.map(char => `\\u${char.codePointAt(0)!.toString(16).padStart(4, '0')}`).join('')
    
    case 'unicode16':
      return chars.map(char => `U+${char.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`).join(' ')
    
    case 'hex':
      return chars.map(char => char.codePointAt(0)!.toString(16)).join(' ')
    
    case 'decimal':
      return chars.map(char => char.codePointAt(0)!.toString()).join(' ')
    
    case 'html':
      return chars.map(char => `&#${char.codePointAt(0)!};`).join('')
    
    case 'css':
      return chars.map(char => `\\${char.codePointAt(0)!.toString(16)} `).join('')
    
    default:
      throw new Error('不支持的编码格式')
  }
}

// 从Unicode解码
const decodeFromUnicode = (encoded: string, format: string): string => {
  try {
    switch (format) {
      case 'unicode':
        return encoded.replace(/\\u([0-9a-fA-F]{4})/g, (_match, hex) => 
          String.fromCodePoint(parseInt(hex, 16))
        )
      
      case 'unicode16':
        return encoded.replace(/U\+([0-9a-fA-F]+)/g, (_match, hex) => 
          String.fromCodePoint(parseInt(hex, 16))
        )
      
      case 'hex':
        return encoded.split(/\s+/).filter(Boolean).map(hex => 
          String.fromCodePoint(parseInt(hex, 16))
        ).join('')
      
      case 'decimal':
        return encoded.split(/\s+/).filter(Boolean).map(dec => 
          String.fromCodePoint(parseInt(dec, 10))
        ).join('')
      
      case 'html':
        return encoded.replace(/&#(\d+);/g, (_match, dec) => 
          String.fromCodePoint(parseInt(dec, 10))
        )
      
      case 'css':
        return encoded.replace(/\\([0-9a-fA-F]+)\s?/g, (_match, hex) => 
          String.fromCodePoint(parseInt(hex, 16))
        )
      
      default:
        throw new Error('不支持的解码格式')
    }
  } catch (error) {
    throw new Error('解码失败，请检查输入格式')
  }
}

// 获取字符名称
const getCharacterName = (codePoint: number): string => {
  if (codePoint <= 127) {
    return 'ASCII字符'
  } else if (codePoint >= 0x4e00 && codePoint <= 0x9fff) {
    return '中日韩统一表意文字'
  } else if (codePoint >= 0x3400 && codePoint <= 0x4dbf) {
    return '中日韩统一表意文字扩展A'
  } else if (codePoint >= 0x20000 && codePoint <= 0x2a6df) {
    return '中日韩统一表意文字扩展B'
  } else if (codePoint >= 0x0080 && codePoint <= 0x00ff) {
    return 'Latin-1补充'
  } else if (codePoint >= 0x0100 && codePoint <= 0x017f) {
    return '拉丁字母扩展A'
  } else {
    return `Unicode字符 (U+${codePoint.toString(16).toUpperCase()})`
  }
}

// 交换模式
const swapMode = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
  
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
  performConversion()
}

// 粘贴剪贴板
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    performConversion()
    ElMessage.success('已从剪贴板粘贴内容')
  } catch (error) {
    ElMessage.error('读取剪贴板失败')
  }
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
}

// 加载示例
const loadExample = () => {
  if (mode.value === 'encode') {
    inputText.value = '你好，世界！Hello, World! 🌍'
  } else {
    inputText.value = selectedFormat.value === 'unicode' 
      ? '\\u4f60\\u597d\\uff0c\\u4e16\\u754c\\uff01Hello, World! \\ud83c\\udf0d'
      : 'U+4F60 U+597D U+FF0C U+4E16 U+754C U+FF01'
  }
  performConversion()
  ElMessage.info('已加载示例文本')
}

// 复制输出
const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    ElMessage.success('结果已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载结果
const downloadResult = () => {
  const content = `输入 (${mode.value === 'encode' ? '原文' : 'Unicode'}):\n${inputText.value}\n\n输出 (${mode.value === 'encode' ? 'Unicode' : '原文'}):\n${outputText.value}`
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `unicode-${mode.value}-result.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('文件下载成功！')
}

// 清空批量输入
const clearBatchInput = () => {
  batchInput.value = ''
  batchResults.value = []
}

// 批量处理
const processBatch = async () => {
  if (!batchInput.value.trim()) {
    ElMessage.warning('请输入批量处理内容')
    return
  }

  batchProcessing.value = true
  batchResults.value = []

  try {
    const lines = batchInput.value.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      try {
        const result = mode.value === 'encode' 
          ? encodeToUnicode(line.trim(), selectedFormat.value)
          : decodeFromUnicode(line.trim(), selectedFormat.value)
        
        batchResults.value.push({
          input: line.trim(),
          output: result
        })
      } catch (error: any) {
        batchResults.value.push({
          input: line.trim(),
          output: `错误: ${error.message}`
        })
      }
    }

    ElMessage.success(`批量处理完成，共处理 ${batchResults.value.length} 项`)
  } catch (error) {
    ElMessage.error('批量处理失败')
  } finally {
    batchProcessing.value = false
  }
}

// 复制批量结果
const copyBatchResults = async () => {
  const content = batchResults.value.map(result => 
    `${result.input} → ${result.output}`
  ).join('\n')
  
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('批量结果已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载批量结果
const downloadBatchResults = () => {
  const content = `Unicode批量${mode.value === 'encode' ? '编码' : '解码'}结果\n` +
    `格式: ${selectedFormat.value}\n` +
    `时间: ${new Date().toLocaleString()}\n\n` +
    batchResults.value.map((result, index) => 
      `${index + 1}. ${result.input} → ${result.output}`
    ).join('\n')
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `unicode-batch-${mode.value}-results.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('批量结果文件下载成功！')
}

// 复制单个批量结果
const copyBatchResult = async (output: string) => {
  try {
    await navigator.clipboard.writeText(output)
    ElMessage.success('结果已复制！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 监听模式变化
watch(mode, () => {
  performConversion()
})

// 监听格式变化
watch(selectedFormat, () => {
  performConversion()
})
</script>

<style scoped>
.unicode-tool {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  --primary-color: #f59e0b;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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
.format-card,
.converter-card,
.analysis-card,
.batch-card,
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
.format-header,
.converter-header,
.analysis-header,
.batch-header,
.guide-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.selector-icon,
.format-icon,
.converter-icon,
.analysis-icon,
.batch-icon,
.guide-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.selector-header h3,
.format-header h3,
.converter-header h3,
.analysis-header h3,
.batch-header h3,
.guide-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.selector-description,
.format-description,
.converter-description,
.analysis-description,
.batch-description,
.guide-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 模式选择 */
.mode-group {
  justify-content: center;
}

/* 格式选择 */
.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.format-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.format-item:hover {
  border-color: var(--primary-color);
  background: #fefbf2;
  transform: translateY(-2px);
}

.format-item.active {
  border-color: var(--primary-color);
  background: #fefbf2;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.format-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.format-example {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: var(--primary-color);
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #fde68a;
  margin-bottom: 8px;
  word-break: break-all;
}

.format-item .format-description {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* 转换器 */
.conversion-sections {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: start;
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
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

.input-textarea :deep(.el-textarea__inner),
.output-textarea :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.input-textarea :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.output-textarea :deep(.el-textarea__inner) {
  background-color: #f8fafc;
  color: var(--primary-color);
  font-weight: 500;
}

.input-actions,
.output-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.conversion-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
}

.swap-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  background: white;
  color: var(--primary-color);
  font-size: 18px;
  transition: all 0.3s ease;
}

.swap-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  transform: rotate(180deg);
}

/* 字符分析 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
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
  color: var(--primary-color);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 字符详情 */
.char-details {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.details-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.char-list {
  display: grid;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.char-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.char-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.char-display {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  min-width: 40px;
  text-align: center;
  background: #fef3c7;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #fde68a;
}

.char-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.char-unicode {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
}

.char-decimal {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #6b7280;
}

.char-name {
  font-size: 12px;
  color: #374151;
}

.more-chars {
  text-align: center;
  padding: 12px;
  color: #6b7280;
  font-style: italic;
}

/* 批量处理 */
.batch-input-section {
  margin-bottom: 20px;
}

.batch-input-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.batch-input-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.batch-input-textarea :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.batch-input-textarea :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.batch-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.batch-results {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.batch-results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.batch-results-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.batch-results-actions {
  display: flex;
  gap: 8px;
}

.batch-results-list {
  max-height: 400px;
  overflow-y: auto;
}

.batch-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.batch-result-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-index {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
  background: #f3f4f6;
  border-radius: 4px;
  padding: 4px;
}

.result-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.result-input {
  color: #374151;
  word-break: break-all;
}

.result-arrow {
  color: var(--primary-color);
  font-weight: 600;
}

.result-output {
  color: var(--primary-color);
  word-break: break-all;
}

.result-actions {
  display: flex;
  gap: 4px;
}

.copy-single-btn {
  font-size: 12px;
  padding: 4px 6px;
}

/* 格式描述 */
.format-descriptions {
  display: grid;
  gap: 24px;
}

.format-desc-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.format-desc-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 8px;
  display: inline-block;
}

.format-desc-content {
  display: grid;
  gap: 12px;
}

.format-desc-text {
  margin: 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.format-desc-example,
.format-desc-usage {
  font-size: 14px;
  color: #374151;
}

.format-desc-example code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: var(--primary-color);
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #fde68a;
  margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .unicode-tool {
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
  .format-card,
  .converter-card,
  .analysis-card,
  .batch-card,
  .guide-card {
    padding: 20px 16px;
  }
  
  .format-grid {
    grid-template-columns: 1fr;
  }
  
  .conversion-sections {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .conversion-arrow {
    margin-top: 0;
    transform: rotate(90deg);
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .char-item {
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }
  
  .char-info {
    align-items: center;
  }
  
  .batch-results-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .batch-result-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .result-content {
    flex-direction: column;
    gap: 4px;
  }
  
  .input-actions,
  .output-actions,
  .batch-results-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>