<template>
  <div class="timestamp-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <h1 class="hero-title">时间戳工具</h1>
        <p class="hero-description">精确的时间戳与日期格式转换，支持多种时间格式和时区</p>
      </div>
    </div>

    <!-- 当前时间显示卡片 -->
    <div class="current-time-section">
      <div class="current-time-card">
        <div class="time-card-header">
          <h3>实时时间戳</h3>
          <el-button @click="refreshCurrentTime" type="primary" size="small" plain>
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        
        <div class="time-display-grid">
          <div class="time-item">
            <div class="time-label">当前时间戳 (秒)</div>
            <div class="time-value timestamp-sec">{{ currentTimestamp }}</div>
          </div>
          <div class="time-item">
            <div class="time-label">当前时间戳 (毫秒)</div>
            <div class="time-value timestamp-ms">{{ currentTimestampMs }}</div>
          </div>
          <div class="time-item full-width">
            <div class="time-label">本地时间</div>
            <div class="time-value current-date">{{ currentDate }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 转换工具区域 -->
    <div class="converter-sections">
      <!-- 时间戳转日期 -->
      <div class="converter-card">
        <div class="converter-header">
          <div class="converter-icon">
            <el-icon><ArrowRight /></el-icon>
          </div>
          <h3>时间戳转日期</h3>
        </div>
        
        <div class="converter-body">
          <div class="input-section">
            <label class="input-label">输入时间戳</label>
            <div class="input-group">
              <el-input
                v-model="timestampInput"
                placeholder="输入时间戳 (如: 1755567685)"
                size="large"
                @input="onTimestampChange"
                class="timestamp-input"
              >
                <template #append>
                  <el-select v-model="timestampType" @change="onTimestampChange" style="width: 80px">
                    <el-option label="秒" value="seconds" />
                    <el-option label="毫秒" value="milliseconds" />
                  </el-select>
                </template>
              </el-input>
              <el-button @click="setCurrentTimestamp" type="primary" size="large">
                <el-icon><Clock /></el-icon>
                当前时间
              </el-button>
            </div>
          </div>
          
          <div class="format-section">
            <label class="input-label">输出格式</label>
            <el-radio-group v-model="dateFormat" @change="onTimestampChange" class="format-options">
              <el-radio-button label="YYYY-MM-DD HH:mm:ss">标准格式</el-radio-button>
              <el-radio-button label="YYYY/MM/DD HH:mm:ss">斜杠格式</el-radio-button>
              <el-radio-button label="MM/DD/YYYY HH:mm:ss">美式格式</el-radio-button>
            </el-radio-group>
          </div>

          <div v-if="timestampResult" class="result-panel">
            <div class="main-result">
              <label class="result-label">转换结果</label>
              <div class="result-value primary">{{ timestampResult }}</div>
            </div>
            <div v-if="timestampExtra" class="additional-results">
              <div class="result-row">
                <span class="result-type">ISO 8601:</span>
                <span class="result-content">{{ timestampExtra.iso }}</span>
              </div>
              <div class="result-row">
                <span class="result-type">UTC:</span>
                <span class="result-content">{{ timestampExtra.utc }}</span>
              </div>
              <div class="result-row">
                <span class="result-type">本地时间:</span>
                <span class="result-content">{{ timestampExtra.local }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 日期转时间戳 -->
      <div class="converter-card">
        <div class="converter-header">
          <div class="converter-icon">
            <el-icon><ArrowLeft /></el-icon>
          </div>
          <h3>日期转时间戳</h3>
        </div>
        
        <div class="converter-body">
          <div class="date-input-methods">
            <el-radio-group v-model="dateInputMethod" @change="onDateMethodChange">
              <el-radio-button label="picker">日期选择器</el-radio-button>
              <el-radio-button label="text">文本输入</el-radio-button>
            </el-radio-group>
          </div>

          <div v-if="dateInputMethod === 'picker'" class="date-picker-group">
            <el-date-picker
              v-model="datePickerValue"
              type="datetime"
              placeholder="选择日期时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              @change="onDatePickerChange"
              style="width: 100%"
            />
          </div>

          <div v-else class="date-input-group">
            <el-input
              v-model="dateInput"
              placeholder="输入日期 (如: 2024-01-01 12:00:00)"
              @input="onDateInputChange"
            />
            <div class="date-formats">
              <span>支持格式:</span>
              <el-tag size="small" v-for="format in supportedFormats" :key="format">
                {{ format }}
              </el-tag>
            </div>
          </div>

          <div v-if="dateResult" class="result-display">
            <div class="result-item">
              <label>时间戳 (秒):</label>
              <div class="result-value">{{ dateResult }}</div>
            </div>
            <div v-if="dateExtra" class="extra-info">
              <div class="result-item">
                <label>时间戳 (毫秒):</label>
                <div class="result-value">{{ dateExtra.timestampMs }}</div>
              </div>
              <div class="result-item">
                <label>ISO格式:</label>
                <div class="result-value">{{ dateExtra.iso }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常用时间戳 -->
    <div class="common-timestamps">
      <h3>常用时间戳</h3>
      <div class="timestamp-grid">
        <div
          v-for="common in commonTimestamps"
          :key="common.name"
          class="timestamp-item"
          @click="selectTimestamp(common.timestamp)"
        >
          <div class="timestamp-name">{{ common.name }}</div>
          <div class="timestamp-value">{{ common.timestamp }}</div>
          <div class="timestamp-date">{{ common.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Clock,
  Refresh,
  ArrowRight,
  ArrowLeft
} from '@element-plus/icons-vue'
import { timeTool } from '../../utils/localTools'

// 当前时间戳
const currentTimestamp = ref('')
const currentTimestampMs = ref('')
const currentDate = ref('')

// 时间戳转日期
const timestampInput = ref('')
const timestampType = ref('seconds')
const dateFormat = ref('YYYY-MM-DD HH:mm:ss')
const timestampResult = ref('')
const timestampExtra = ref<any>(null)

// 日期转时间戳
const dateInputMethod = ref('picker')
const datePickerValue = ref('')
const dateInput = ref('')
const dateResult = ref('')
const dateExtra = ref<any>(null)

// 支持的日期格式
const supportedFormats = ref([
  'YYYY-MM-DD HH:mm:ss',
  'YYYY/MM/DD HH:mm:ss',
  'MM/DD/YYYY HH:mm:ss',
  'YYYY-MM-DD',
  'MM/DD/YYYY'
])

// 常用时间戳
const commonTimestamps = ref([
  {
    name: '当前时间',
    timestamp: 0,
    date: ''
  },
  {
    name: '今天 00:00',
    timestamp: 0,
    date: ''
  },
  {
    name: '昨天 00:00',
    timestamp: 0,
    date: ''
  },
  {
    name: '一周前',
    timestamp: 0,
    date: ''
  },
  {
    name: '一个月前',
    timestamp: 0,
    date: ''
  },
  {
    name: 'Unix 元年',
    timestamp: 0,
    date: '1970-01-01 08:00:00'
  }
])

let timer: number | null = null

// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date()
  const timestamp = Math.floor(now.getTime() / 1000)
  const timestampMs = now.getTime()
  
  currentTimestamp.value = timestamp.toString()
  currentTimestampMs.value = timestampMs.toString()
  currentDate.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  // 更新常用时间戳
  updateCommonTimestamps()
}

// 更新常用时间戳
const updateCommonTimestamps = () => {
  const now = new Date()
  const currentTs = Math.floor(now.getTime() / 1000)
  
  // 今天 00:00
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayTs = Math.floor(today.getTime() / 1000)
  
  // 昨天 00:00
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const yesterdayTs = Math.floor(yesterday.getTime() / 1000)
  
  // 一周前
  const weekAgo = currentTs - 7 * 24 * 60 * 60
  
  // 一个月前
  const monthAgo = currentTs - 30 * 24 * 60 * 60
  
  commonTimestamps.value = [
    {
      name: '当前时间',
      timestamp: currentTs,
      date: now.toLocaleString('zh-CN')
    },
    {
      name: '今天 00:00',
      timestamp: todayTs,
      date: today.toLocaleString('zh-CN')
    },
    {
      name: '昨天 00:00',
      timestamp: yesterdayTs,
      date: yesterday.toLocaleString('zh-CN')
    },
    {
      name: '一周前',
      timestamp: weekAgo,
      date: new Date(weekAgo * 1000).toLocaleString('zh-CN')
    },
    {
      name: '一个月前',
      timestamp: monthAgo,
      date: new Date(monthAgo * 1000).toLocaleString('zh-CN')
    },
    {
      name: 'Unix 元年',
      timestamp: 0,
      date: '1970-01-01 08:00:00'
    }
  ]
}

// 手动刷新当前时间
const refreshCurrentTime = () => {
  updateCurrentTime()
  ElMessage.success('时间已刷新')
}

// 时间戳输入变化
const onTimestampChange = () => {
  if (!timestampInput.value.trim()) {
    timestampResult.value = ''
    timestampExtra.value = null
    return
  }
  
  try {
    let timestamp = parseInt(timestampInput.value)
    
    // 如果是毫秒时间戳，转换为秒
    if (timestampType.value === 'milliseconds') {
      timestamp = Math.floor(timestamp / 1000)
    }
    
    const response = timeTool.timestampToDate(timestamp, dateFormat.value)
    
    if (response.success) {
      timestampResult.value = response.result
      timestampExtra.value = response.extra
    } else {
      timestampResult.value = ''
      timestampExtra.value = null
      ElMessage.error(response.error || '时间戳转换失败')
    }
  } catch (error: any) {
    timestampResult.value = ''
    timestampExtra.value = null
  }
}

// 设置当前时间戳
const setCurrentTimestamp = () => {
  const now = new Date()
  if (timestampType.value === 'milliseconds') {
    timestampInput.value = now.getTime().toString()
  } else {
    timestampInput.value = Math.floor(now.getTime() / 1000).toString()
  }
  onTimestampChange()
}

// 日期输入方式变化
const onDateMethodChange = () => {
  dateResult.value = ''
  dateExtra.value = null
  datePickerValue.value = ''
  dateInput.value = ''
}

// 日期选择器变化
const onDatePickerChange = () => {
  if (!datePickerValue.value) {
    dateResult.value = ''
    dateExtra.value = null
    return
  }
  
  try {
    const response = timeTool.dateToTimestamp(datePickerValue.value)
    
    if (response.success) {
      dateResult.value = response.result
      dateExtra.value = response.extra
    } else {
      dateResult.value = ''
      dateExtra.value = null
      ElMessage.error(response.error || '日期转换失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '日期转换失败')
  }
}

// 文本日期输入变化
const onDateInputChange = () => {
  if (!dateInput.value.trim()) {
    dateResult.value = ''
    dateExtra.value = null
    return
  }
  
  try {
    const response = timeTool.dateToTimestamp(dateInput.value.trim())
    
    if (response.success) {
      dateResult.value = response.result
      dateExtra.value = response.extra
    } else {
      dateResult.value = ''
      dateExtra.value = null
      ElMessage.error(response.error || '日期转换失败')
    }
  } catch (error: any) {
    dateResult.value = ''
    dateExtra.value = null
  }
}

// 选择常用时间戳
const selectTimestamp = (timestamp: number) => {
  timestampInput.value = timestamp.toString()
  timestampType.value = 'seconds'
  onTimestampChange()
  ElMessage.success('已选择时间戳')
}

// 生命周期
onMounted(() => {
  updateCurrentTime()
  // 每秒更新一次当前时间
  timer = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.timestamp-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.hero-description {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

/* 当前时间显示卡片 */
.current-time-section {
  margin-bottom: 32px;
}

.current-time-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.time-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.time-card-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.time-display-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.time-item {
  text-align: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.time-item.full-width {
  grid-column: 1 / -1;
}

.time-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.time-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.timestamp-sec {
  color: #0ea5e9;
}

.timestamp-ms {
  color: #8b5cf6;
}

.current-date {
  color: #059669;
}

/* 转换工具区域 */
.converter-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.converter-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.converter-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.converter-icon {
  margin-right: 12px;
  font-size: 20px;
  color: #3b82f6;
}

.converter-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.converter-body > * + * {
  margin-top: 16px;
}

.input-section,
.format-section {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input-group {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.timestamp-input {
  flex: 1;
}

.format-options {
  width: 100%;
}

.result-panel {
  margin-top: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.main-result {
  margin-bottom: 16px;
}

.result-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.result-value {
  font-size: 16px;
  font-weight: 600;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.result-value.primary {
  color: #0ea5e9;
  border-color: #0ea5e9;
  background: #f0f9ff;
}

.additional-results > * + * {
  margin-top: 8px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.result-type {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.result-content {
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #1f2937;
}

.date-input-methods {
  margin-bottom: 16px;
}

.date-picker-group,
.date-input-group {
  margin-bottom: 16px;
}

.date-formats {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.date-formats span {
  font-size: 12px;
  color: #6b7280;
}

.result-display {
  margin-top: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.extra-info {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

/* 常用时间戳 */
.common-timestamps {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.common-timestamps h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.timestamp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.timestamp-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timestamp-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.timestamp-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.timestamp-value {
  font-size: 16px;
  font-weight: 600;
  color: #0ea5e9;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  margin-bottom: 4px;
}

.timestamp-date {
  font-size: 12px;
  color: #6b7280;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timestamp-tool {
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
  
  .converter-sections {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .time-display-grid {
    grid-template-columns: 1fr;
  }
  
  .timestamp-grid {
    grid-template-columns: 1fr;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .format-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>