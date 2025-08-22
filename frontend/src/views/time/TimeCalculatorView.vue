<template>
  <div class="time-calculator">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Timer /></el-icon>
        </div>
        <h1 class="hero-title">时间计算器</h1>
        <p class="hero-description">时间加减运算、工作日计算、时区转换等实用时间计算功能</p>
      </div>
    </div>

    <!-- 功能选择卡片 -->
    <div class="tool-card mode-card">
      <div class="card-header">
        <h3>
          <el-icon><Switch /></el-icon>
          功能选择
        </h3>
      </div>
      <div class="mode-selector">
        <el-radio-group v-model="currentMode" size="large">
          <el-radio-button label="duration">时间计算</el-radio-button>
          <el-radio-button label="workdays">工作日计算</el-radio-button>
          <el-radio-button label="timezone">时区转换</el-radio-button>
          <el-radio-button label="age">年龄计算</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 时间计算模式 -->
    <div v-if="currentMode === 'duration'" class="tool-card config-card">
      <div class="card-header">
        <h3>
          <el-icon><Clock /></el-icon>
          时间计算
        </h3>
      </div>
      <div class="calculator-section">
        <div class="datetime-inputs">
          <div class="input-group">
            <label>开始时间：</label>
            <el-date-picker
              v-model="startTime"
              type="datetime"
              placeholder="选择开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              @change="calculateDuration"
            />
          </div>
          <div class="input-group">
            <label>结束时间：</label>
            <el-date-picker
              v-model="endTime"
              type="datetime"
              placeholder="选择结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              @change="calculateDuration"
            />
          </div>
        </div>
        
        <div class="operation-buttons">
          <el-button @click="setCurrentTime('start')" type="primary" size="small">
            设为当前时间（开始）
          </el-button>
          <el-button @click="setCurrentTime('end')" type="primary" size="small">
            设为当前时间（结束）
          </el-button>
        </div>
      </div>
    </div>

    <!-- 工作日计算模式 -->
    <div v-if="currentMode === 'workdays'" class="tool-card config-card">
      <div class="card-header">
        <h3>
          <el-icon><Calendar /></el-icon>
          工作日计算
        </h3>
      </div>
      <div class="workdays-section">
        <div class="datetime-inputs">
          <div class="input-group">
            <label>开始日期：</label>
            <el-date-picker
              v-model="workStartDate"
              type="date"
              placeholder="选择开始日期"
              @change="calculateWorkdays"
            />
          </div>
          <div class="input-group">
            <label>结束日期：</label>
            <el-date-picker
              v-model="workEndDate"
              type="date"
              placeholder="选择结束日期"
              @change="calculateWorkdays"
            />
          </div>
        </div>
        
        <div class="workday-options">
          <el-checkbox-group v-model="excludeDays" @change="calculateWorkdays">
            <el-checkbox label="6">排除周六</el-checkbox>
            <el-checkbox label="0">排除周日</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>

    <!-- 时区转换模式 -->
    <div v-if="currentMode === 'timezone'" class="tool-card config-card">
      <div class="card-header">
        <h3>
          <el-icon><Monitor /></el-icon>
          时区转换
        </h3>
      </div>
      <div class="timezone-section">
        <div class="datetime-inputs">
          <div class="input-group">
            <label>时间：</label>
            <el-date-picker
              v-model="timezoneTime"
              type="datetime"
              placeholder="选择时间"
              format="YYYY-MM-DD HH:mm:ss"
              @change="convertTimezone"
            />
          </div>
          <div class="input-group">
            <label>源时区：</label>
            <el-select v-model="sourceTimezone" @change="convertTimezone">
              <el-option
                v-for="tz in timezones"
                :key="tz.value"
                :label="tz.label"
                :value="tz.value"
              />
            </el-select>
          </div>
          <div class="input-group">
            <label>目标时区：</label>
            <el-select v-model="targetTimezone" @change="convertTimezone">
              <el-option
                v-for="tz in timezones"
                :key="tz.value"
                :label="tz.label"
                :value="tz.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <!-- 年龄计算模式 -->
    <div v-if="currentMode === 'age'" class="tool-card config-card">
      <div class="card-header">
        <h3>
          <el-icon><User /></el-icon>
          年龄计算
        </h3>
      </div>
      <div class="age-section">
        <div class="datetime-inputs">
          <div class="input-group">
            <label>出生日期：</label>
            <el-date-picker
              v-model="birthDate"
              type="date"
              placeholder="选择出生日期"
              @change="calculateAge"
            />
          </div>
          <div class="input-group">
            <label>计算到日期：</label>
            <el-date-picker
              v-model="targetDate"
              type="date"
              placeholder="选择计算到的日期（默认今天）"
              @change="calculateAge"
            />
          </div>
        </div>
        
        <div class="operation-buttons">
          <el-button @click="setToday" type="primary" size="small">
            设为今天
          </el-button>
        </div>
      </div>
    </div>

    <!-- 计算结果卡片 -->
    <div v-if="result" class="tool-card result-card">
      <div class="card-header">
        <h3>
          <el-icon><DataAnalysis /></el-icon>
          计算结果
        </h3>
      </div>
      <div class="result-content">
        <div v-if="currentMode === 'duration'" class="duration-result">
          <div class="result-grid">
            <div class="result-item">
              <span class="result-label">总天数：</span>
              <span class="result-value">{{ result.days }} 天</span>
            </div>
            <div class="result-item">
              <span class="result-label">总小时数：</span>
              <span class="result-value">{{ result.hours }} 小时</span>
            </div>
            <div class="result-item">
              <span class="result-label">总分钟数：</span>
              <span class="result-value">{{ result.minutes }} 分钟</span>
            </div>
            <div class="result-item">
              <span class="result-label">总秒数：</span>
              <span class="result-value">{{ result.seconds }} 秒</span>
            </div>
            <div class="result-item">
              <span class="result-label">详细时长：</span>
              <span class="result-value">{{ result.detailed }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentMode === 'workdays'" class="workdays-result">
          <div class="result-grid">
            <div class="result-item">
              <span class="result-label">工作日：</span>
              <span class="result-value">{{ result.workdays }} 天</span>
            </div>
            <div class="result-item">
              <span class="result-label">周末：</span>
              <span class="result-value">{{ result.weekends }} 天</span>
            </div>
            <div class="result-item">
              <span class="result-label">总天数：</span>
              <span class="result-value">{{ result.totalDays }} 天</span>
            </div>
          </div>
        </div>

        <div v-if="currentMode === 'timezone'" class="timezone-result">
          <div class="result-item large">
            <span class="result-label">转换结果：</span>
            <span class="result-value">{{ result.convertedTime }}</span>
          </div>
          <div class="result-item">
            <span class="result-label">时差：</span>
            <span class="result-value">{{ result.timeDifference }}</span>
          </div>
        </div>

        <div v-if="currentMode === 'age'" class="age-result">
          <div class="result-grid">
            <div class="result-item">
              <span class="result-label">年龄：</span>
              <span class="result-value">{{ result.years }} 岁</span>
            </div>
            <div class="result-item">
              <span class="result-label">总月数：</span>
              <span class="result-value">{{ result.months }} 个月</span>
            </div>
            <div class="result-item">
              <span class="result-label">总天数：</span>
              <span class="result-value">{{ result.days }} 天</span>
            </div>
            <div class="result-item">
              <span class="result-label">详细年龄：</span>
              <span class="result-value">{{ result.detailed }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明卡片 -->
    <div class="tool-card usage-card">
      <div class="card-header">
        <h3>
          <el-icon><InfoFilled /></el-icon>
          使用说明
        </h3>
      </div>
      <div class="usage-content">
        <div class="usage-section">
          <h4>⏱️ 时间计算</h4>
          <p>计算两个时间点之间的时长，支持精确到秒的计算</p>
        </div>
        <div class="usage-section">
          <h4>📅 工作日计算</h4>
          <p>计算两个日期间的工作日天数，可排除周末</p>
        </div>
        <div class="usage-section">
          <h4>🌍 时区转换</h4>
          <p>将时间在不同时区间进行转换，支持全球主要时区</p>
        </div>
        <div class="usage-section">
          <h4>🎂 年龄计算</h4>
          <p>精确计算年龄，包括年、月、日的详细信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'
import {
  Timer,
  Switch,
  Clock,
  Calendar,
  Monitor,
  User,
  DataAnalysis,
  InfoFilled
} from '@element-plus/icons-vue'

const currentMode = ref('duration')
const result = ref<any>(null)

// 时间计算相关
const startTime = ref<Date>()
const endTime = ref<Date>()

// 工作日计算相关
const workStartDate = ref<Date>()
const workEndDate = ref<Date>()
const excludeDays = ref(['6', '0']) // 默认排除周六周日

// 时区转换相关
const timezoneTime = ref<Date>()
const sourceTimezone = ref(8) // 默认东八区
const targetTimezone = ref(0) // 默认UTC

// 年龄计算相关
const birthDate = ref<Date>()
const targetDate = ref<Date>(new Date())

// 时区列表
const timezones = [
  { label: 'UTC+0 (格林威治)', value: 0 },
  { label: 'UTC+1 (柏林)', value: 1 },
  { label: 'UTC+3 (莫斯科)', value: 3 },
  { label: 'UTC+5:30 (新德里)', value: 5.5 },
  { label: 'UTC+8 (北京)', value: 8 },
  { label: 'UTC+9 (东京)', value: 9 },
  { label: 'UTC-5 (纽约)', value: -5 },
  { label: 'UTC-8 (洛杉矶)', value: -8 },
  { label: 'UTC-3 (圣保罗)', value: -3 }
]

// 设置当前时间
const setCurrentTime = (type: 'start' | 'end') => {
  const now = new Date()
  if (type === 'start') {
    startTime.value = now
  } else {
    endTime.value = now
  }
  calculateDuration()
}

// 计算时间差
const calculateDuration = () => {
  if (!startTime.value || !endTime.value) {
    result.value = null
    return
  }

  const start = new Date(startTime.value)
  const end = new Date(endTime.value)
  const diffMs = Math.abs(end.getTime() - start.getTime())

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  // 详细时长
  const detailDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const detailHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const detailMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  const detailSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)

  result.value = {
    days,
    hours,
    minutes,
    seconds,
    detailed: `${detailDays}天 ${detailHours}小时 ${detailMinutes}分钟 ${detailSeconds}秒`
  }
}

// 计算工作日
const calculateWorkdays = () => {
  if (!workStartDate.value || !workEndDate.value) {
    result.value = null
    return
  }

  const start = new Date(workStartDate.value)
  const end = new Date(workEndDate.value)
  
  let workdays = 0
  let weekends = 0
  let current = new Date(start)

  while (current <= end) {
    const dayOfWeek = current.getDay()
    
    if (excludeDays.value.includes(dayOfWeek.toString())) {
      weekends++
    } else {
      workdays++
    }
    
    current.setDate(current.getDate() + 1)
  }

  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  result.value = {
    workdays,
    weekends,
    totalDays
  }
}

// 时区转换
const convertTimezone = () => {
  if (!timezoneTime.value) {
    result.value = null
    return
  }

  const sourceTime = new Date(timezoneTime.value)
  const sourceOffset = sourceTimezone.value * 60 // 转换为分钟
  const targetOffset = targetTimezone.value * 60 // 转换为分钟
  
  // 计算时差（分钟）
  const timeDiffMinutes = targetOffset - sourceOffset
  
  // 转换时间
  const convertedTime = new Date(sourceTime.getTime() + timeDiffMinutes * 60 * 1000)
  
  const timeDifference = timeDiffMinutes >= 0 
    ? `+${Math.floor(timeDiffMinutes / 60)}小时${timeDiffMinutes % 60}分钟`
    : `${Math.floor(timeDiffMinutes / 60)}小时${Math.abs(timeDiffMinutes % 60)}分钟`

  result.value = {
    convertedTime: convertedTime.toLocaleString(),
    timeDifference
  }
}

// 设置目标日期为今天
const setToday = () => {
  targetDate.value = new Date()
  calculateAge()
}

// 计算年龄
const calculateAge = () => {
  if (!birthDate.value) {
    result.value = null
    return
  }

  const birth = new Date(birthDate.value)
  const target = targetDate.value || new Date()
  
  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0)
    days += lastMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const totalMonths = years * 12 + months

  result.value = {
    years,
    months: totalMonths,
    days: totalDays,
    detailed: `${years}岁 ${months}个月 ${days}天`
  }
}
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.time-calculator {
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

.calculator-section,
.workdays-section,
.timezone-section,
.age-section {
  padding: 20px;
}

.datetime-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 500;
  color: #374151;
}

.operation-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.workday-options {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.result-content {
  padding: 20px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border-left: 4px solid var(--el-color-primary);
}

.result-item.large {
  grid-column: 1 / -1;
  font-size: 18px;
  font-weight: 600;
}

.result-label {
  font-weight: 500;
  color: #6b7280;
}

.result-value {
  font-weight: 600;
  color: var(--el-color-primary);
  font-size: 16px;
}

.usage-content {
  padding: 20px;
}

.usage-section {
  margin-bottom: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.usage-section h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #374151;
}

.usage-section p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .datetime-inputs {
    grid-template-columns: 1fr;
  }
  
  .result-grid {
    grid-template-columns: 1fr;
  }
  
  .operation-buttons {
    flex-direction: column;
  }
}
</style>
