<template>
  <div class="base-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Operation /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('pages.base.title') }}</h1>
        <p class="hero-description">{{ t('pages.base.description') }}</p>
      </div>
    </div>

    <!-- 输入卡片 -->
    <div class="input-card">
      <div class="card-header">
        <div class="card-icon">
          <el-icon><Edit /></el-icon>
        </div>
        <h3>{{ t('common.input') }}数值</h3>
        <div class="card-description">{{ t('pages.base.description') }}</div>
      </div>
      
      <div class="card-body">
        <div class="base-selector">
          <label class="selector-label">{{ t('common.input') }}进制</label>
          <el-radio-group v-model="fromBase" @change="onFromBaseChange" size="large">
            <el-radio-button :label="2">{{ t('pages.base.bases.binary') }}</el-radio-button>
            <el-radio-button :label="8">{{ t('pages.base.bases.octal') }}</el-radio-button>
            <el-radio-button :label="10">{{ t('pages.base.bases.decimal') }}</el-radio-button>
            <el-radio-button :label="16">{{ t('pages.base.bases.hex') }}</el-radio-button>
          </el-radio-group>
        </div>

        <div class="input-section">
          <el-input
            v-model="inputValue"
            :placeholder="t('pages.base.inputPlaceholder')"
            clearable
            size="large"
            @input="onValueChange"
            class="number-input"
          >
            <template #prepend>
              <span class="input-prefix">{{ getBasePrefix(fromBase) }}</span>
            </template>
          </el-input>
          <div class="input-tips">
            <span class="tip-text">{{ getInputTips(fromBase) }}</span>
          </div>
        </div>

        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="convertValue"
            :disabled="!inputValue"
            class="convert-button"
          >
            <el-icon><MagicStick /></el-icon>
            {{ t('common.convert') }}
          </el-button>
          <el-button 
            size="large" 
            @click="clearAll"
            class="clear-button"
          >
            <el-icon><Delete /></el-icon>
            {{ t('common.clear') }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 结果卡片 -->
    <div v-if="results.length > 0" class="result-card">
      <div class="card-header">
        <div class="card-icon">
          <el-icon><View /></el-icon>
        </div>
        <h3>转换结果</h3>
        <div class="card-description">各进制转换结果</div>
      </div>
      
      <div class="card-body">
        <div class="result-grid">
          <div 
            v-for="result in results" 
            :key="result.base"
            class="result-item"
            :class="{ 'current': result.base === fromBase }"
          >
            <div class="result-header">
              <span class="result-base">{{ result.name }}</span>
              <el-button 
                size="small" 
                @click="copyResult(result.value)"
                class="copy-btn"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
            <div class="result-value">{{ result.prefix }}{{ result.value }}</div>
            <div class="result-description">{{ result.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明卡片 -->
    <div class="usage-card">
      <div class="card-header">
        <div class="card-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>进制说明</h3>
        <div class="card-description">各进制的特点和用途</div>
      </div>
      
      <div class="card-body">
        <div class="usage-grid">
          <div class="usage-item">
            <div class="usage-header">
              <span class="usage-title">二进制 (Binary)</span>
              <span class="usage-base">基数: 2</span>
            </div>
            <p><strong>字符:</strong> 0, 1</p>
            <p><strong>用途:</strong> 计算机底层、逻辑运算</p>
            <p><strong>示例:</strong> 1010 = 10</p>
          </div>
          
          <div class="usage-item">
            <div class="usage-header">
              <span class="usage-title">八进制 (Octal)</span>
              <span class="usage-base">基数: 8</span>
            </div>
            <p><strong>字符:</strong> 0-7</p>
            <p><strong>用途:</strong> 文件权限、早期计算机</p>
            <p><strong>示例:</strong> 12 = 10</p>
          </div>
          
          <div class="usage-item">
            <div class="usage-header">
              <span class="usage-title">十进制 (Decimal)</span>
              <span class="usage-base">基数: 10</span>
            </div>
            <p><strong>字符:</strong> 0-9</p>
            <p><strong>用途:</strong> 日常使用、数学计算</p>
            <p><strong>示例:</strong> 10 = 10</p>
          </div>
          
          <div class="usage-item">
            <div class="usage-header">
              <span class="usage-title">十六进制 (Hexadecimal)</span>
              <span class="usage-base">基数: 16</span>
            </div>
            <p><strong>字符:</strong> 0-9, A-F</p>
            <p><strong>用途:</strong> 颜色代码、内存地址</p>
            <p><strong>示例:</strong> A = 10</p>
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
  Operation,
  Delete,
  CopyDocument,
  Edit,
  View,
  InfoFilled,
  MagicStick
} from '@element-plus/icons-vue'

const { t } = useI18n()
const fromBase = ref(10)
const inputValue = ref('')
const results = ref<any[]>([])

// 获取进制前缀
const getBasePrefix = (base: number) => {
  switch (base) {
    case 2: return '0b'
    case 8: return '0o'
    case 10: return ''
    case 16: return '0x'
    default: return ''
  }
}

// 获取输入提示
const getInputTips = (base: number) => {
  switch (base) {
    case 2: return '只能输入 0 和 1'
    case 8: return '只能输入 0-7'
    case 10: return '只能输入 0-9'
    case 16: return '可输入 0-9 和 A-F'
    default: return ''
  }
}

// 进制改变时
const onFromBaseChange = () => {
  inputValue.value = ''
  results.value = []
}

// 值改变时自动转换
const onValueChange = () => {
  if (inputValue.value) {
    convertValue()
  } else {
    results.value = []
  }
}

// 转换数值
const convertValue = () => {
  if (!inputValue.value.trim()) {
    ElMessage.warning('请输入要转换的数值')
    return
  }

  try {
    // 验证输入
    const cleanValue = inputValue.value.trim().toUpperCase()
    
    // 根据进制验证输入格式
    let isValid = false
    switch (fromBase.value) {
      case 2:
        isValid = /^[01]+$/.test(cleanValue)
        break
      case 8:
        isValid = /^[0-7]+$/.test(cleanValue)
        break
      case 10:
        isValid = /^[0-9]+$/.test(cleanValue)
        break
      case 16:
        isValid = /^[0-9A-F]+$/.test(cleanValue)
        break
    }

    if (!isValid) {
      ElMessage.error(`输入格式不正确，${getInputTips(fromBase.value)}`)
      return
    }

    // 转换为十进制
    const decimalValue = parseInt(cleanValue, fromBase.value)
    
    if (isNaN(decimalValue)) {
      ElMessage.error('转换失败，请检查输入')
      return
    }

    // 生成所有进制结果
    results.value = [
      {
        base: 2,
        name: '二进制',
        prefix: '0b',
        value: decimalValue.toString(2),
        description: `Binary - 基数2，计算机底层表示`
      },
      {
        base: 8,
        name: '八进制',
        prefix: '0o',
        value: decimalValue.toString(8),
        description: `Octal - 基数8，常用于文件权限`
      },
      {
        base: 10,
        name: '十进制',
        prefix: '',
        value: decimalValue.toString(10),
        description: `Decimal - 基数10，日常使用`
      },
      {
        base: 16,
        name: '十六进制',
        prefix: '0x',
        value: decimalValue.toString(16).toUpperCase(),
        description: `Hexadecimal - 基数16，常用于颜色代码`
      }
    ]

    ElMessage.success('转换成功！')
  } catch (error) {
    ElMessage.error('转换失败，请检查输入格式')
    console.error('转换错误:', error)
  }
}

// 复制结果
const copyResult = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    ElMessage.success('复制成功！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 清空所有
const clearAll = () => {
  inputValue.value = ''
  results.value = []
  ElMessage.info('已清空所有内容')
}
</script>

<style scoped>
.base-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #84cc16;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
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
.input-card,
.result-card,
.usage-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

.input-card:hover,
.result-card:hover,
.usage-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.card-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.card-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

.card-body {
  display: grid;
  gap: 20px;
}

/* 进制选择器 */
.base-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

:deep(.el-radio-group) {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

:deep(.el-radio-button__inner) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* 输入区域 */
.input-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.number-input :deep(.el-input-group__prepend) {
  background: #f8fafc;
  border-color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-weight: 600;
  color: var(--primary-color);
}

.number-input :deep(.el-input__wrapper) {
  border-radius: 0 8px 8px 0;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.number-input :deep(.el-input__wrapper:hover) {
  border-color: var(--primary-color);
}

.number-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(132, 204, 22, 0.1);
}

.input-tips {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-text {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px 0;
}

.convert-button {
  min-width: 140px;
}

.clear-button {
  min-width: 100px;
}

/* 结果网格 */
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.result-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
}

.result-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.result-item.current {
  border-color: var(--primary-color);
  background: #f0fdf4;
}

.result-item.current::before {
  content: '输入';
  position: absolute;
  top: -8px;
  right: 12px;
  background: var(--primary-color);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-base {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.copy-btn {
  font-size: 12px;
  padding: 4px 8px;
}

.result-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
  word-break: break-all;
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.result-description {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

/* 使用说明 */
.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.usage-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.usage-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.usage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.usage-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.usage-base {
  font-size: 12px;
  color: var(--primary-color);
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.usage-item p {
  margin: 8px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.usage-item strong {
  color: #374151;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .base-tool {
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
  
  .input-card,
  .result-card,
  .usage-card {
    padding: 20px 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .card-description {
    margin-left: 0;
  }
  
  .result-grid,
  .usage-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .convert-button,
  .clear-button {
    width: 100%;
  }
  
  :deep(.el-radio-group) {
    justify-content: center;
  }
}
</style>