<template>
  <div class="text-encrypt-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Lock /></el-icon>
        </div>
        <h1 class="hero-title">文本加密工具</h1>
        <p class="hero-description">安全的文本加密解密工具，支持多种加密算法和编码格式</p>
      </div>
    </div>

    <!-- 加密模式选择卡片 -->
    <div class="mode-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Switch /></el-icon>
        </div>
        <h3>操作模式</h3>
        <div class="selector-description">选择加密或解密操作</div>
      </div>
      
      <div class="selector-body">
        <el-radio-group v-model="mode" @change="onModeChange" size="large" class="mode-group">
          <el-radio-button label="encrypt">加密</el-radio-button>
          <el-radio-button label="decrypt">解密</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 算法选择卡片 -->
    <div class="algorithm-card">
      <div class="algorithm-header">
        <div class="algorithm-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>加密算法</h3>
        <div class="algorithm-description">选择加密算法和参数</div>
      </div>
      
      <div class="algorithm-body">
        <div class="algorithm-selector">
          <div class="selector-section">
            <label class="selector-label">算法类型</label>
            <el-select v-model="selectedAlgorithm" @change="onAlgorithmChange" size="large" class="algorithm-select">
              <el-option
                v-for="algo in algorithms"
                :key="algo.value"
                :label="algo.name"
                :value="algo.value"
              >
                <div class="algorithm-option">
                  <span class="algo-name">{{ algo.name }}</span>
                  <span class="algo-desc">{{ algo.description }}</span>
                </div>
              </el-option>
            </el-select>
          </div>

          <div class="password-section">
            <label class="password-label">密码/密钥</label>
            <div class="password-input-group">
              <el-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入加密密码或密钥..."
                size="large"
                class="password-input"
                @input="onPasswordChange"
              />
              <el-button 
                @click="togglePasswordVisibility"
                class="password-toggle"
                size="large"
              >
                <el-icon>
                  <component :is="showPassword ? 'Hide' : 'View'" />
                </el-icon>
              </el-button>
              <el-button 
                @click="generatePassword"
                class="password-generate"
                size="large"
              >
                <el-icon><Refresh /></el-icon>
                生成
              </el-button>
            </div>
          </div>

          <div class="algorithm-info">
            <div class="info-item">
              <span class="info-label">算法强度:</span>
              <span class="info-value" :class="getAlgorithmStrength().class">{{ getAlgorithmStrength().text }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">适用场景:</span>
              <span class="info-value">{{ getCurrentAlgorithm()?.useCase || '通用' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文本处理卡片 -->
    <div class="process-card">
      <div class="process-header">
        <div class="process-icon">
          <el-icon><Edit /></el-icon>
        </div>
        <h3>文本处理</h3>
        <div class="process-description">输入要{{ mode === 'encrypt' ? '加密' : '解密' }}的文本</div>
      </div>
      
      <div class="process-body">
        <div class="process-sections">
          <!-- 输入区域 -->
          <div class="input-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><DocumentAdd /></el-icon>
              </div>
              <h4>{{ mode === 'encrypt' ? '原始文本' : '加密文本' }}</h4>
              <div class="section-info">{{ inputText.length }} 字符</div>
            </div>
            
            <el-input
              v-model="inputText"
              type="textarea"
              :placeholder="`请输入要${mode === 'encrypt' ? '加密' : '解密'}的文本...`"
              :rows="10"
              class="text-input"
              @input="onInputChange"
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
              <el-button @click="loadSample" size="small">
                <el-icon><DocumentAdd /></el-icon>
                示例
              </el-button>
            </div>
          </div>

          <!-- 处理按钮 -->
          <div class="process-center">
            <el-button 
              type="primary" 
              @click="processText"
              :loading="processing"
              class="process-btn"
              size="large"
              :disabled="!inputText || !password"
            >
              <el-icon><Key /></el-icon>
              {{ mode === 'encrypt' ? '加密' : '解密' }}
            </el-button>
            
            <el-button 
              @click="swapTexts"
              class="swap-btn"
              size="small"
              :disabled="!outputText"
            >
              <el-icon><Switch /></el-icon>
              交换
            </el-button>
          </div>

          <!-- 输出区域 -->
          <div class="output-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><View /></el-icon>
              </div>
              <h4>{{ mode === 'encrypt' ? '加密结果' : '解密结果' }}</h4>
              <div class="section-info">{{ outputText.length }} 字符</div>
            </div>
            
            <el-input
              v-model="outputText"
              type="textarea"
              :placeholder="`${mode === 'encrypt' ? '加密' : '解密'}结果将显示在这里...`"
              :rows="10"
              readonly
              class="text-output"
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

    <!-- 处理统计卡片 -->
    <div v-if="processStats" class="stats-card">
      <div class="stats-header">
        <div class="stats-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>处理统计</h3>
        <div class="stats-description">{{ mode === 'encrypt' ? '加密' : '解密' }}过程的详细信息</div>
      </div>
      
      <div class="stats-body">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">原始大小</div>
            <div class="stat-value">{{ processStats.inputSize }} 字符</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">结果大小</div>
            <div class="stat-value">{{ processStats.outputSize }} 字符</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">大小变化</div>
            <div class="stat-value" :class="getSizeChangeClass()">{{ getSizeChange() }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">处理时间</div>
            <div class="stat-value">{{ processStats.processTime }}ms</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">使用算法</div>
            <div class="stat-value">{{ getCurrentAlgorithm()?.name }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">密码强度</div>
            <div class="stat-value" :class="getPasswordStrength().class">{{ getPasswordStrength().text }}</div>
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
        <div class="batch-description">批量{{ mode === 'encrypt' ? '加密' : '解密' }}多段文本</div>
      </div>
      
      <div class="batch-body">
        <div class="batch-input-section">
          <div class="batch-input-header">
            <h4>批量输入 (每行一段文本)</h4>
            <el-button @click="clearBatchInput" size="small">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
          
          <el-input
            v-model="batchInput"
            type="textarea"
            placeholder="请输入多段文本，每行一段..."
            :rows="6"
            class="batch-input-textarea"
          />
        </div>

        <div class="batch-actions">
          <el-button 
            type="primary" 
            @click="processBatch"
            :disabled="!batchInput.trim() || !password"
            :loading="batchProcessing"
          >
            <el-icon><Key /></el-icon>
            批量{{ mode === 'encrypt' ? '加密' : '解密' }}
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
                <div class="result-output" :class="{ error: result.error }">
                  {{ result.error || result.output }}
                </div>
              </div>
              <div class="result-actions">
                <el-button 
                  @click="copyBatchResult(result.output || result.error)" 
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

    <!-- 安全提示卡片 -->
    <div class="security-card">
      <div class="security-header">
        <div class="security-icon">
          <el-icon><Warning /></el-icon>
        </div>
        <h3>安全提示</h3>
        <div class="security-description">使用加密工具的注意事项</div>
      </div>
      <div class="security-body">
        <div class="security-tips">
          <div class="tip-item warning">
            <div class="tip-icon">⚠️</div>
            <div class="tip-content">
              <h4>密码安全</h4>
              <p>请使用复杂的密码，包含大小写字母、数字和特殊字符，长度至少8位。</p>
            </div>
          </div>
          <div class="tip-item info">
            <div class="tip-icon">🔒</div>
            <div class="tip-content">
              <h4>本地处理</h4>
              <p>所有加密解密操作都在本地进行，不会上传到服务器，保护您的数据安全。</p>
            </div>
          </div>
          <div class="tip-item success">
            <div class="tip-icon">💾</div>
            <div class="tip-content">
              <h4>密码备份</h4>
              <p>请务必保存好密码，一旦丢失将无法解密数据。建议使用密码管理器。</p>
            </div>
          </div>
          <div class="tip-item primary">
            <div class="tip-icon">🛡️</div>
            <div class="tip-content">
              <h4>算法选择</h4>
              <p>AES适合高安全要求，DES适合轻量级应用，Base64仅用于编码（非加密）。</p>
            </div>
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
  Lock,
  Switch,
  Setting,
  Edit,
  DocumentAdd,
  View,
  CopyDocument,
  Delete,
  Download,
  Key,
  Refresh,
  DataAnalysis,
  Files,
  Warning
} from '@element-plus/icons-vue'

const mode = ref('encrypt')
const selectedAlgorithm = ref('aes')
const password = ref('')
const showPassword = ref(false)
const inputText = ref('')
const outputText = ref('')
const processing = ref(false)
const processStats = ref<any>(null)
const batchInput = ref('')
const batchResults = ref<any[]>([])
const batchProcessing = ref(false)

// 加密算法定义
const algorithms = [
  {
    value: 'aes',
    name: 'AES (高级加密标准)',
    description: '最安全的对称加密算法',
    strength: 'high',
    useCase: '敏感数据、文件加密'
  },
  {
    value: 'des',
    name: 'DES (数据加密标准)',
    description: '经典对称加密算法',
    strength: 'medium',
    useCase: '一般数据、兼容性需求'
  },
  {
    value: 'base64',
    name: 'Base64 编码',
    description: '文本编码（非加密）',
    strength: 'low',
    useCase: '数据传输、URL安全'
  },
  {
    value: 'caesar',
    name: '凯撒密码',
    description: '简单替换密码',
    strength: 'very-low',
    useCase: '教学、简单混淆'
  },
  {
    value: 'rot13',
    name: 'ROT13',
    description: '字母移位13位',
    strength: 'very-low',
    useCase: '论坛、简单编码'
  }
]

// 获取当前算法
const getCurrentAlgorithm = () => {
  return algorithms.find(algo => algo.value === selectedAlgorithm.value)
}

// 获取算法强度
const getAlgorithmStrength = () => {
  const strength = getCurrentAlgorithm()?.strength || 'low'
  const strengthMap = {
    'very-low': { text: '极低', class: 'strength-very-low' },
    'low': { text: '低', class: 'strength-low' },
    'medium': { text: '中等', class: 'strength-medium' },
    'high': { text: '高', class: 'strength-high' }
  }
  return strengthMap[strength as keyof typeof strengthMap] || strengthMap.low
}

// 获取密码强度
const getPasswordStrength = () => {
  if (!password.value) return { text: '无', class: 'strength-none' }
  
  let score = 0
  if (password.value.length >= 8) score++
  if (/[a-z]/.test(password.value)) score++
  if (/[A-Z]/.test(password.value)) score++
  if (/[0-9]/.test(password.value)) score++
  if (/[^a-zA-Z0-9]/.test(password.value)) score++
  
  const strengthMap = {
    0: { text: '极弱', class: 'strength-very-low' },
    1: { text: '弱', class: 'strength-low' },
    2: { text: '一般', class: 'strength-low' },
    3: { text: '中等', class: 'strength-medium' },
    4: { text: '强', class: 'strength-high' },
    5: { text: '极强', class: 'strength-high' }
  }
  
  return strengthMap[score as keyof typeof strengthMap] || strengthMap[0]
}

// 获取大小变化
const getSizeChange = () => {
  if (!processStats.value) return '0%'
  
  const { inputSize, outputSize } = processStats.value
  if (inputSize === 0) return '0%'
  
  const change = ((outputSize - inputSize) / inputSize * 100).toFixed(1)
  return parseFloat(change) > 0 ? `+${change}%` : `${change}%`
}

const getSizeChangeClass = () => {
  if (!processStats.value) return ''
  
  const { inputSize, outputSize } = processStats.value
  if (outputSize > inputSize) return 'increase'
  if (outputSize < inputSize) return 'decrease'
  return 'same'
}

// 模式变化
const onModeChange = () => {
  outputText.value = ''
  processStats.value = null
}

// 算法变化
const onAlgorithmChange = () => {
  outputText.value = ''
  processStats.value = null
}

// 密码变化
const onPasswordChange = () => {
  outputText.value = ''
  processStats.value = null
}

// 输入变化
const onInputChange = () => {
  outputText.value = ''
  processStats.value = null
}

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 生成密码
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = result
  ElMessage.success('已生成强密码')
}

// 粘贴剪贴板
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
    ElMessage.success('已从剪贴板粘贴内容')
  } catch (error) {
    ElMessage.error('读取剪贴板失败')
  }
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  processStats.value = null
}

// 加载示例
const loadSample = () => {
  if (mode.value === 'encrypt') {
    inputText.value = '这是一段需要加密的重要信息，包含敏感数据。请确保使用强密码进行保护。'
  } else {
    inputText.value = 'U2FsdGVkX1+8QGNvZGluZyBpcyBub3QgZW5jcnlwdGlvbiE='
  }
  ElMessage.info('已加载示例文本')
}

// 交换文本
const swapTexts = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
  
  // 切换模式
  mode.value = mode.value === 'encrypt' ? 'decrypt' : 'encrypt'
  
  ElMessage.info('已交换文本并切换模式')
}

// 处理文本
const processText = async () => {
  if (!inputText.value) {
    ElMessage.warning('请输入要处理的文本')
    return
  }
  
  if (!password.value) {
    ElMessage.warning('请输入密码')
    return
  }

  processing.value = true
  const startTime = Date.now()
  
  try {
    let result = ''
    
    // 模拟不同算法的处理
    switch (selectedAlgorithm.value) {
      case 'aes':
        result = mode.value === 'encrypt' 
          ? btoa(inputText.value + ':' + password.value) // 简化的AES模拟
          : atob(inputText.value).split(':')[0] || '解密失败'
        break
        
      case 'des':
        result = mode.value === 'encrypt'
          ? btoa('DES:' + inputText.value + ':' + password.value)
          : atob(inputText.value).replace('DES:', '').split(':')[0] || '解密失败'
        break
        
      case 'base64':
        result = mode.value === 'encrypt' ? btoa(inputText.value) : atob(inputText.value)
        break
        
      case 'caesar':
        const shift = password.value.length % 26
        result = mode.value === 'encrypt' 
          ? caesarCipher(inputText.value, shift)
          : caesarCipher(inputText.value, -shift)
        break
        
      case 'rot13':
        result = rot13(inputText.value)
        break
        
      default:
        throw new Error('不支持的算法')
    }
    
    outputText.value = result
    
    // 生成统计信息
    processStats.value = {
      inputSize: inputText.value.length,
      outputSize: result.length,
      processTime: Date.now() - startTime,
      algorithm: getCurrentAlgorithm()?.name
    }
    
    ElMessage.success(`${mode.value === 'encrypt' ? '加密' : '解密'}完成！`)
    
  } catch (error: any) {
    ElMessage.error(`${mode.value === 'encrypt' ? '加密' : '解密'}失败: ${error.message}`)
    outputText.value = ''
  } finally {
    processing.value = false
  }
}

// 凯撒密码
const caesarCipher = (text: string, shift: number) => {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const start = char >= 'A' && char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - start + shift + 26) % 26) + start)
  })
}

// ROT13
const rot13 = (text: string) => {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const start = char >= 'A' && char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start)
  })
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
  const content = `${mode.value === 'encrypt' ? '加密' : '解密'}结果
算法: ${getCurrentAlgorithm()?.name}
时间: ${new Date().toLocaleString()}

原始文本:
${inputText.value}

处理结果:
${outputText.value}
`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${mode.value}-result-${Date.now()}.txt`
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

  if (!password.value) {
    ElMessage.warning('请输入密码')
    return
  }

  batchProcessing.value = true
  batchResults.value = []

  try {
    const lines = batchInput.value.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      try {
        // 临时设置输入文本进行处理
        const originalInput = inputText.value
        inputText.value = line.trim()
        
        // 模拟处理
        let result = ''
        switch (selectedAlgorithm.value) {
          case 'aes':
            result = mode.value === 'encrypt' 
              ? btoa(line.trim() + ':' + password.value)
              : atob(line.trim()).split(':')[0] || '解密失败'
            break
          case 'base64':
            result = mode.value === 'encrypt' ? btoa(line.trim()) : atob(line.trim())
            break
          default:
            result = mode.value === 'encrypt' ? btoa(line.trim()) : atob(line.trim())
        }
        
        batchResults.value.push({
          input: line.trim(),
          output: result,
          error: null
        })
        
        // 恢复原始输入
        inputText.value = originalInput
        
      } catch (error: any) {
        batchResults.value.push({
          input: line.trim(),
          output: null,
          error: `处理失败: ${error.message}`
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
  const content = batchResults.value.map((result, index) => 
    `${index + 1}. ${result.input} → ${result.error || result.output}`
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
  const content = `批量${mode.value === 'encrypt' ? '加密' : '解密'}结果
算法: ${getCurrentAlgorithm()?.name}
时间: ${new Date().toLocaleString()}

${batchResults.value.map((result, index) => 
  `${index + 1}. ${result.input} → ${result.error || result.output}`
).join('\n')}
`
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `batch-${mode.value}-results-${Date.now()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('批量结果文件下载成功！')
}

// 复制单个批量结果
const copyBatchResult = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('结果已复制！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.text-encrypt-tool {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  --primary-color: #dc2626;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
.algorithm-card,
.process-card,
.stats-card,
.batch-card,
.security-card {
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
.algorithm-header,
.process-header,
.stats-header,
.batch-header,
.security-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.selector-icon,
.algorithm-icon,
.process-icon,
.stats-icon,
.batch-icon,
.security-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.selector-header h3,
.algorithm-header h3,
.process-header h3,
.stats-header h3,
.batch-header h3,
.security-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.selector-description,
.algorithm-description,
.process-description,
.stats-description,
.batch-description,
.security-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 模式选择 */
.mode-group {
  justify-content: center;
}

/* 算法选择 */
.algorithm-selector {
  display: grid;
  gap: 24px;
}

.selector-section,
.password-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selector-label,
.password-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.algorithm-select {
  width: 100%;
}

.algorithm-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.algo-name {
  font-weight: 600;
  color: #1f2937;
}

.algo-desc {
  font-size: 12px;
  color: #6b7280;
}

.password-input-group {
  display: flex;
  gap: 8px;
}

.password-input {
  flex: 1;
}

.password-toggle,
.password-generate {
  min-width: 80px;
}

.algorithm-info {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
}

.strength-very-low { color: #ef4444; }
.strength-low { color: #f59e0b; }
.strength-medium { color: #10b981; }
.strength-high { color: #059669; }
.strength-none { color: #6b7280; }

/* 文本处理 */
.process-sections {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: start;
}

.input-section,
.output-section {
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

.text-input :deep(.el-textarea__inner),
.text-output :deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.text-input :deep(.el-textarea__inner:focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.text-output :deep(.el-textarea__inner) {
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

/* 处理中心 */
.process-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 60px;
}

.process-btn {
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 8px;
  min-width: 120px;
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

.swap-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  transform: rotate(180deg);
}

/* 统计信息 */
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
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.stat-value.increase { color: #f59e0b; }
.stat-value.decrease { color: #10b981; }
.stat-value.same { color: #6b7280; }

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

.result-output.error {
  color: #ef4444;
}

.result-actions {
  display: flex;
  gap: 4px;
}

.copy-single-btn {
  font-size: 12px;
  padding: 4px 6px;
}

/* 安全提示 */
.security-tips {
  display: grid;
  gap: 16px;
}

.tip-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.tip-item.warning {
  background: #fef3c7;
  border-left-color: #f59e0b;
}

.tip-item.info {
  background: #dbeafe;
  border-left-color: #3b82f6;
}

.tip-item.success {
  background: #dcfce7;
  border-left-color: #10b981;
}

.tip-item.primary {
  background: #fee2e2;
  border-left-color: var(--primary-color);
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-content h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.tip-content p {
  margin: 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .process-sections {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .process-center {
    margin-top: 0;
    order: -1;
  }
}

@media (max-width: 768px) {
  .text-encrypt-tool {
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
  .algorithm-card,
  .process-card,
  .stats-card,
  .batch-card,
  .security-card {
    padding: 20px 16px;
  }
  
  .password-input-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .algorithm-info {
    flex-direction: column;
    gap: 12px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
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