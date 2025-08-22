<template>
  <div class="world-clock">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <h1 class="hero-title">世界时钟</h1>
        <p class="hero-description">实时显示全球主要城市时间，支持自定义时区和时间格式</p>
      </div>
    </div>

    <!-- 当前时间卡片 -->
    <div class="tool-card current-time-card">
      <div class="card-header">
        <h3>
          <el-icon><Location /></el-icon>
          本地时间
        </h3>
        <div class="live-indicator">
          <span class="live-dot"></span>
          实时更新
        </div>
      </div>
      <div class="current-time-display">
        <div class="main-time">{{ currentTime.time }}</div>
        <div class="time-details">
          <span class="date">{{ currentTime.date }}</span>
          <span class="timezone">{{ currentTime.timezone }}</span>
          <span class="week">{{ currentTime.week }}</span>
        </div>
      </div>
    </div>

    <!-- 时区管理 -->
    <div class="tool-card config-card">
      <div class="card-header">
        <h3>
          <el-icon><Setting /></el-icon>
          时区管理
        </h3>
      </div>
      <div class="timezone-controls">
        <div class="add-timezone">
          <el-select
            v-model="selectedCity"
            placeholder="选择城市添加到世界时钟"
            filterable
            style="width: 300px; margin-right: 12px;"
          >
            <el-option-group
              v-for="region in timezoneRegions"
              :key="region.label"
              :label="region.label"
            >
              <el-option
                v-for="city in region.cities"
                :key="city.value"
                :label="city.label"
                :value="city.value"
              />
            </el-option-group>
          </el-select>
          <el-button @click="addTimezone" type="primary" :disabled="!selectedCity">
            <el-icon><Plus /></el-icon>
            添加时区
          </el-button>
        </div>

        <div class="display-options">
          <el-checkbox v-model="show24Hour">24小时制</el-checkbox>
          <el-checkbox v-model="showSeconds">显示秒</el-checkbox>
          <el-checkbox v-model="showDate">显示日期</el-checkbox>
        </div>
      </div>
    </div>

    <!-- 世界时钟网格 -->
    <div class="clocks-grid">
      <div
        v-for="(clock, index) in worldClocks"
        :key="clock.id"
        class="clock-card"
        :class="{ 'is-night': clock.isNight }"
      >
        <div class="clock-header">
          <div class="city-info">
            <h4 class="city-name">{{ clock.cityName }}</h4>
            <span class="country">{{ clock.country }}</span>
          </div>
          <div class="clock-actions">
            <el-button @click="removeTimezone(index)" type="danger" size="small" circle>
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>

        <div class="clock-display">
          <div class="time">{{ clock.time }}</div>
          <div class="time-info">
            <span v-if="showDate" class="date">{{ clock.date }}</span>
            <span class="offset">{{ clock.offset }}</span>
            <span class="period">{{ clock.period }}</span>
          </div>
        </div>

        <div class="time-comparison">
          <span class="comparison-text">{{ clock.comparison }}</span>
        </div>
      </div>
    </div>

    <!-- 快速添加预设 -->
    <div class="tool-card presets-card">
      <div class="card-header">
        <h3>
          <el-icon><Star /></el-icon>
          快速添加
        </h3>
      </div>
      <div class="preset-buttons">
        <el-button
          v-for="preset in popularCities"
          :key="preset.value"
          @click="addPresetTimezone(preset)"
          size="small"
          :disabled="isTimezoneAdded(preset.value)"
        >
          {{ preset.label }}
        </el-button>
      </div>
    </div>

    <!-- 时区信息卡片 -->
    <div class="tool-card usage-card">
      <div class="card-header">
        <h3>
          <el-icon><InfoFilled /></el-icon>
          时区信息
        </h3>
      </div>
      <div class="timezone-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">协调世界时：</span>
            <span class="info-value">{{ utcTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">UNIX时间戳：</span>
            <span class="info-value">{{ unixTimestamp }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">儒略日：</span>
            <span class="info-value">{{ julianDay }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">ISO 8601：</span>
            <span class="info-value">{{ isoTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Clock,
  Location,
  Setting,
  Plus,
  Close,
  Star,
  InfoFilled
} from '@element-plus/icons-vue'

// 响应式数据
const currentTime = reactive({
  time: '',
  date: '',
  timezone: '',
  week: ''
})

const selectedCity = ref('')
const show24Hour = ref(true)
const showSeconds = ref(true)
const showDate = ref(true)
const worldClocks = ref<any[]>([])
const utcTime = ref('')
const unixTimestamp = ref(0)
const julianDay = ref(0)
const isoTime = ref('')

let timeInterval: number | null = null

// 时区数据
const timezoneRegions = [
  {
    label: '亚洲',
    cities: [
      { label: '北京 (中国)', value: 'Asia/Shanghai', country: '中国' },
      { label: '东京 (日本)', value: 'Asia/Tokyo', country: '日本' },
      { label: '首尔 (韩国)', value: 'Asia/Seoul', country: '韩国' },
      { label: '新德里 (印度)', value: 'Asia/Kolkata', country: '印度' },
      { label: '曼谷 (泰国)', value: 'Asia/Bangkok', country: '泰国' },
      { label: '新加坡', value: 'Asia/Singapore', country: '新加坡' },
      { label: '香港', value: 'Asia/Hong_Kong', country: '香港' },
      { label: '台北 (台湾)', value: 'Asia/Taipei', country: '台湾' }
    ]
  },
  {
    label: '欧洲',
    cities: [
      { label: '伦敦 (英国)', value: 'Europe/London', country: '英国' },
      { label: '巴黎 (法国)', value: 'Europe/Paris', country: '法国' },
      { label: '柏林 (德国)', value: 'Europe/Berlin', country: '德国' },
      { label: '罗马 (意大利)', value: 'Europe/Rome', country: '意大利' },
      { label: '莫斯科 (俄罗斯)', value: 'Europe/Moscow', country: '俄罗斯' },
      { label: '阿姆斯特丹 (荷兰)', value: 'Europe/Amsterdam', country: '荷兰' }
    ]
  },
  {
    label: '美洲',
    cities: [
      { label: '纽约 (美国)', value: 'America/New_York', country: '美国' },
      { label: '洛杉矶 (美国)', value: 'America/Los_Angeles', country: '美国' },
      { label: '芝加哥 (美国)', value: 'America/Chicago', country: '美国' },
      { label: '多伦多 (加拿大)', value: 'America/Toronto', country: '加拿大' },
      { label: '圣保罗 (巴西)', value: 'America/Sao_Paulo', country: '巴西' },
      { label: '墨西哥城 (墨西哥)', value: 'America/Mexico_City', country: '墨西哥' }
    ]
  },
  {
    label: '大洋洲',
    cities: [
      { label: '悉尼 (澳大利亚)', value: 'Australia/Sydney', country: '澳大利亚' },
      { label: '墨尔本 (澳大利亚)', value: 'Australia/Melbourne', country: '澳大利亚' },
      { label: '奥克兰 (新西兰)', value: 'Pacific/Auckland', country: '新西兰' }
    ]
  }
]

// 热门城市快速添加
const popularCities = [
  { label: '纽约', value: 'America/New_York', country: '美国' },
  { label: '伦敦', value: 'Europe/London', country: '英国' },
  { label: '东京', value: 'Asia/Tokyo', country: '日本' },
  { label: '悉尼', value: 'Australia/Sydney', country: '澳大利亚' },
  { label: '巴黎', value: 'Europe/Paris', country: '法国' },
  { label: '新加坡', value: 'Asia/Singapore', country: '新加坡' }
]

// 更新时间
const updateTime = () => {
  const now = new Date()
  
  // 更新本地时间
  currentTime.time = formatTime(now, show24Hour.value, showSeconds.value)
  currentTime.date = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  currentTime.timezone = `GMT${getTimezoneOffset(now)}`
  currentTime.week = now.toLocaleDateString('zh-CN', { weekday: 'long' })
  
  // 更新世界时钟
  worldClocks.value.forEach(clock => {
    const clockTime = new Date(now.toLocaleString('en-US', { timeZone: clock.timezone }))
    clock.time = formatTime(clockTime, show24Hour.value, showSeconds.value)
    clock.date = clockTime.toLocaleDateString('zh-CN')
    clock.isNight = clockTime.getHours() >= 18 || clockTime.getHours() < 6
    clock.period = getDayPeriod(clockTime)
    clock.comparison = getTimeComparison(now, clockTime)
  })
  
  // 更新UTC和其他时间格式
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000)
  utcTime.value = formatTime(utc, true, true)
  unixTimestamp.value = Math.floor(now.getTime() / 1000)
  julianDay.value = Math.floor(now.getTime() / 86400000) + 2440588
  isoTime.value = now.toISOString()
}

// 格式化时间
const formatTime = (date: Date, is24Hour: boolean, withSeconds: boolean) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour
  }
  
  if (withSeconds) {
    options.second = '2-digit'
  }
  
  return date.toLocaleTimeString('zh-CN', options)
}

// 获取时区偏移
const getTimezoneOffset = (date: Date) => {
  const offset = -date.getTimezoneOffset() / 60
  return offset >= 0 ? `+${offset}` : `${offset}`
}

// 获取时间段
const getDayPeriod = (date: Date) => {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return '上午'
  if (hour >= 12 && hour < 18) return '下午'
  if (hour >= 18 && hour < 22) return '晚上'
  return '深夜'
}

// 时间比较
const getTimeComparison = (localTime: Date, targetTime: Date) => {
  const diffMs = targetTime.getTime() - localTime.getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  
  if (diffHours === 0) return '与本地时间相同'
  if (diffHours > 0) return `比本地时间快 ${diffHours} 小时`
  return `比本地时间慢 ${Math.abs(diffHours)} 小时`
}

// 添加时区
const addTimezone = () => {
  if (!selectedCity.value) return
  
  // 检查是否已添加
  if (worldClocks.value.some(clock => clock.timezone === selectedCity.value)) {
    ElMessage.warning('该时区已添加')
    return
  }
  
  const cityInfo = findCityInfo(selectedCity.value)
  if (!cityInfo) return
  
  const now = new Date()
  const clockTime = new Date(now.toLocaleString('en-US', { timeZone: selectedCity.value }))
  
  const newClock = {
    id: Date.now(),
    timezone: selectedCity.value,
    cityName: cityInfo.label.split(' (')[0],
    country: cityInfo.country,
    time: formatTime(clockTime, show24Hour.value, showSeconds.value),
    date: clockTime.toLocaleDateString('zh-CN'),
    offset: getTimezoneOffset(clockTime),
    isNight: clockTime.getHours() >= 18 || clockTime.getHours() < 6,
    period: getDayPeriod(clockTime),
    comparison: getTimeComparison(now, clockTime)
  }
  
  worldClocks.value.push(newClock)
  selectedCity.value = ''
  ElMessage.success('时区添加成功')
}

// 添加预设时区
const addPresetTimezone = (preset: any) => {
  selectedCity.value = preset.value
  addTimezone()
}

// 移除时区
const removeTimezone = (index: number) => {
  worldClocks.value.splice(index, 1)
  ElMessage.success('时区已移除')
}

// 检查时区是否已添加
const isTimezoneAdded = (timezone: string) => {
  return worldClocks.value.some(clock => clock.timezone === timezone)
}

// 查找城市信息
const findCityInfo = (timezone: string) => {
  for (const region of timezoneRegions) {
    const city = region.cities.find(c => c.value === timezone)
    if (city) return city
  }
  return popularCities.find(c => c.value === timezone)
}

// 生命周期
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  
  // 默认添加几个热门城市
  setTimeout(() => {
    addPresetTimezone({ label: '纽约', value: 'America/New_York', country: '美国' })
    addPresetTimezone({ label: '伦敦', value: 'Europe/London', country: '英国' })
    addPresetTimezone({ label: '东京', value: 'Asia/Tokyo', country: '日本' })
  }, 100)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.world-clock {
  --tool-color: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.current-time-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #10b981;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.current-time-display {
  text-align: center;
  padding: 30px 20px;
}

.main-time {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 16px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.time-details {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.time-details span {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  font-size: 14px;
  color: #6b7280;
}

.timezone-controls {
  padding: 20px;
}

.add-timezone {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.display-options {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.clocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.clock-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.clock-card.is-night {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.8) 100%);
  color: white;
}

.clock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.clock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.city-info {
  flex: 1;
}

.city-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.country {
  font-size: 12px;
  opacity: 0.7;
}

.clock-display {
  text-align: center;
  margin-bottom: 12px;
}

.clock-card .time {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 8px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.time-info {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.time-info span {
  font-size: 12px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.clock-card.is-night .time-info span {
  background: rgba(255, 255, 255, 0.2);
}

.time-comparison {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.clock-card.is-night .time-comparison {
  border-top-color: rgba(255, 255, 255, 0.2);
}

.comparison-text {
  font-size: 12px;
  opacity: 0.8;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
}

.timezone-info {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.info-label {
  font-weight: 500;
  color: #6b7280;
}

.info-value {
  font-family: 'Monaco', 'Consolas', monospace;
  font-weight: 600;
  color: var(--el-color-primary);
}

@media (max-width: 768px) {
  .main-time {
    font-size: 2.5rem;
  }
  
  .clocks-grid {
    grid-template-columns: 1fr;
  }
  
  .add-timezone {
    flex-direction: column;
    align-items: stretch;
  }
  
  .display-options {
    flex-direction: column;
    gap: 12px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
