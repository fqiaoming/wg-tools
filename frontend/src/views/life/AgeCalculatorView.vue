<template>
  <div class="age-calculator">
    <div class="page-header">
      <h1>{{ t('pages.ageCalculator.title') }}</h1>
      <p>{{ t('pages.ageCalculator.description') }}</p>
    </div>

    <div class="calculator-container">
      <!-- 输入区域 -->
      <div class="input-section">
        <h3>基本信息</h3>
        
        <div class="input-group">
          <label>日历类型</label>
          <el-radio-group v-model="calendarType" @change="clearBirthDate">
            <el-radio label="solar">阳历（公历）</el-radio>
            <el-radio label="lunar">农历（阴历）</el-radio>
          </el-radio-group>
        </div>

        <div class="input-group">
          <label>出生日期</label>
          <div class="unified-date-input">
            <el-select v-model="selectedYear" placeholder="年份" style="width: 120px">
              <el-option 
                v-for="year in yearOptions" 
                :key="year" 
                :label="year + '年'" 
                :value="year" 
              />
            </el-select>
            <el-select v-model="selectedMonth" placeholder="月份" style="width: 100px">
              <el-option 
                v-for="month in 12" 
                :key="month" 
                :label="month + '月'" 
                :value="month" 
              />
            </el-select>
            <el-select v-model="selectedDay" placeholder="日期" style="width: 100px">
              <el-option 
                v-for="day in dayOptions" 
                :key="day" 
                :label="day + '日'" 
                :value="day" 
              />
            </el-select>
            <el-checkbox 
              v-if="calendarType === 'lunar'" 
              v-model="isLeapMonth" 
              style="margin-left: 10px"
            >
              闰月
            </el-checkbox>
          </div>
          <div class="calendar-tip">
            <span v-if="calendarType === 'solar'">💡 阳历是现在通用的公历日期</span>
            <span v-else>💡 农历是中国传统的阴历日期，支持闰月</span>
          </div>
        </div>

        <div class="input-group">
          <label>计算基准日期</label>
          <el-date-picker
            v-model="targetDate"
            type="date"
            placeholder="请选择计算基准日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            style="width: 100%"
          />
          <div class="date-tips">
            <el-button size="small" @click="setToday">今天</el-button>
            <el-button size="small" @click="setNextBirthday">下次生日</el-button>
          </div>
        </div>

        <el-button 
          type="primary" 
          size="large" 
          @click="calculateAge"
          :disabled="!canCalculate"
          class="calculate-btn"
        >
          计算年龄
        </el-button>
      </div>

      <!-- 结果区域 -->
      <div v-if="ageResult" class="result-section">
        <h3>计算结果</h3>
        
        <div class="age-display">
          <div class="main-age">
            <span class="age-value">{{ ageResult.years }}</span>
            <span class="age-unit">岁</span>
          </div>
          <div class="age-details">
            <div class="detail-item">
              <span class="label">月：</span>
              <span class="value">{{ ageResult.months }}</span>
            </div>
            <div class="detail-item">
              <span class="label">天：</span>
              <span class="value">{{ ageResult.days }}</span>
            </div>
          </div>
        </div>

        <div class="info-cards">
          <div class="info-card zodiac">
            <div class="card-icon">🐉</div>
            <div class="card-content">
              <h4>生肖</h4>
              <p>{{ ageResult.zodiac }}</p>
            </div>
          </div>
          
          <div class="info-card constellation">
            <div class="card-icon">⭐</div>
            <div class="card-content">
              <h4>星座</h4>
              <p>{{ ageResult.constellation }}</p>
            </div>
          </div>
          
          <div class="info-card birthstone">
            <div class="card-icon">💎</div>
            <div class="card-content">
              <h4>诞生石</h4>
              <p>{{ ageResult.birthstone }}</p>
            </div>
          </div>
        </div>

        <div class="birthday-info">
          <h4>生日信息</h4>
          <div class="birthday-details">
            <div class="detail-row">
              <span>输入日期：</span>
              <span class="highlight">{{ ageResult.inputDateDisplay }}</span>
            </div>
            <div v-if="ageResult.convertedDate" class="detail-row">
              <span>对应阳历：</span>
              <span class="highlight">{{ ageResult.convertedDate }}</span>
            </div>
            <div class="detail-row">
              <span>距离下次生日：</span>
              <span class="highlight">{{ ageResult.daysToNextBirthday }} 天</span>
            </div>
            <div class="detail-row">
              <span>下次生日日期：</span>
              <span class="highlight">{{ ageResult.nextBirthday }}</span>
            </div>
            <div class="detail-row">
              <span>已过生日次数：</span>
              <span class="highlight">{{ ageResult.birthdaysPassed }} 次</span>
            </div>
          </div>
        </div>

        <div class="life-stages">
          <h4>人生阶段</h4>
          <div class="stage-progress">
            <div class="stage-bar">
              <div class="progress-fill" :style="{ width: ageResult.lifeProgress + '%' }"></div>
            </div>
            <div class="stage-labels">
              <span>童年</span>
              <span>青年</span>
              <span>中年</span>
              <span>老年</span>
            </div>
          </div>
          <p class="stage-description">{{ ageResult.lifeStage }}</p>
        </div>
      </div>
    </div>

    <!-- 生肖星座知识 -->
    <div class="knowledge-section">
      <h3>生肖星座知识</h3>
      <div class="knowledge-grid">
        <div class="knowledge-card">
          <h4>十二生肖</h4>
          <div class="zodiac-list">
            <span v-for="(zodiac, index) in zodiacList" :key="index" class="zodiac-item">
              {{ zodiac }}
            </span>
          </div>
        </div>
        
        <div class="knowledge-card">
          <h4>十二星座</h4>
          <div class="constellation-list">
            <span v-for="(constellation, index) in constellationList" :key="index" class="constellation-item">
              {{ constellation }}
            </span>
          </div>
        </div>
        
        <div class="knowledge-card">
          <h4>诞生石</h4>
          <div class="birthstone-list">
            <div v-for="(stone, month) in birthstoneList" :key="month" class="birthstone-item">
              <span class="month">{{ month }}月</span>
              <span class="stone">{{ stone }}</span>
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

const { t } = useI18n()

// 响应式数据
const targetDate = ref('')
const ageResult = ref<any>(null)
const calendarType = ref('solar') // 'solar' 阳历, 'lunar' 农历
const isLeapMonth = ref(false)

// 统一的日期选择器数据
const selectedYear = ref<number>()
const selectedMonth = ref<number>()
const selectedDay = ref<number>()

// 生肖列表
const zodiacList = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 星座列表
const constellationList = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

// 诞生石列表
const birthstoneList = {
  '1': '石榴石',
  '2': '紫水晶',
  '3': '海蓝宝',
  '4': '钻石',
  '5': '祖母绿',
  '6': '珍珠',
  '7': '红宝石',
  '8': '橄榄石',
  '9': '蓝宝石',
  '10': '欧泊',
  '11': '黄水晶',
  '12': '绿松石'
}

// 年份选项（1920-2024）
const yearOptions = computed(() => {
  const years = []
  for (let year = 1920; year <= 2024; year++) {
    years.push(year)
  }
  return years
})

// 天数选项（根据日历类型和月份动态调整）
const dayOptions = computed(() => {
  const days = []
  let maxDays = 31
  
  if (calendarType.value === 'lunar') {
    maxDays = 30 // 农历最多30天
  } else if (selectedMonth.value && selectedYear.value) {
    // 阳历按实际月份天数
    const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
    maxDays = daysInMonth
  }
  
  for (let day = 1; day <= maxDays; day++) {
    days.push(day)
  }
  return days
})

// 计算属性
const canCalculate = computed(() => {
  return selectedYear.value && selectedMonth.value && selectedDay.value && targetDate.value
})

// 禁用未来日期
const disabledDate = (time: Date) => {
  return time > new Date()
}

// 设置今天
const setToday = () => {
  targetDate.value = new Date().toISOString().split('T')[0]
}

// 清空出生日期
const clearBirthDate = () => {
  selectedYear.value = undefined
  selectedMonth.value = undefined
  selectedDay.value = undefined
  isLeapMonth.value = false
}

// 设置下次生日
const setNextBirthday = () => {
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
    ElMessage.warning('请先选择出生日期')
    return
  }
  
  let birthDateToUse = ''
  
  if (calendarType.value === 'solar') {
    birthDateToUse = `${selectedYear.value}-${selectedMonth.value.toString().padStart(2, '0')}-${selectedDay.value.toString().padStart(2, '0')}`
  } else {
    // 将农历日期转换为阳历
    birthDateToUse = lunarToSolar(selectedYear.value, selectedMonth.value, selectedDay.value, isLeapMonth.value)
  }
  
  const today = new Date()
  const birth = new Date(birthDateToUse)
  const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  }
  
  targetDate.value = nextBirthday.toISOString().split('T')[0]
}

// 获取生肖
const getZodiac = (year: number) => {
  const zodiacIndex = (year - 4) % 12
  return zodiacList[zodiacIndex]
}

// 获取星座
const getConstellation = (month: number, day: number) => {
  // 星座划分日期（每个星座的开始日期）
  const constellationDates = [
    { name: '水瓶座', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { name: '双鱼座', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
    { name: '白羊座', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { name: '金牛座', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { name: '双子座', startMonth: 5, startDay: 21, endMonth: 6, endDay: 21 },
    { name: '巨蟹座', startMonth: 6, startDay: 22, endMonth: 7, endDay: 22 },
    { name: '狮子座', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { name: '处女座', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { name: '天秤座', startMonth: 9, startDay: 23, endMonth: 10, endDay: 23 },
    { name: '天蝎座', startMonth: 10, startDay: 24, endMonth: 11, endDay: 22 },
    { name: '射手座', startMonth: 11, startDay: 23, endMonth: 12, endDay: 21 },
    { name: '摩羯座', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 }
  ]
  
  for (const constellation of constellationDates) {
    if (constellation.startMonth === constellation.endMonth) {
      // 同一个月内的星座
      if (month === constellation.startMonth && day >= constellation.startDay && day <= constellation.endDay) {
        return constellation.name
      }
    } else {
      // 跨月的星座
      if ((month === constellation.startMonth && day >= constellation.startDay) ||
          (month === constellation.endMonth && day <= constellation.endDay)) {
        return constellation.name
      }
    }
  }
  
  return '未知'
}

// 获取诞生石
const getBirthstone = (month: number) => {
  return birthstoneList[month.toString() as keyof typeof birthstoneList] || '未知'
}

// 更精确的农历转阳历函数
const lunarToSolar = (lunarYear: number, lunarMonth: number, lunarDay: number, isLeap: boolean): string => {
  // 使用更精确的农历数据和算法
  const lunarData: { [key: number]: { newYear: string, months: number[] } } = {
    1992: { 
      newYear: '1992-02-04',
      months: [29, 30, 29, 29, 30, 29, 30, 30, 29, 30, 30, 29] // 1992年各月天数
    },
    1993: { 
      newYear: '1993-01-23',
      months: [30, 29, 30, 29, 29, 30, 29, 30, 29, 30, 30, 30] // 1993年各月天数（闰三月）
    }
    // 可以继续添加更多年份的精确数据
  }
  
  // 如果有精确数据，使用精确计算
  if (lunarData[lunarYear]) {
    const yearData = lunarData[lunarYear]
    const newYear = new Date(yearData.newYear)
    
    let daysSinceNewYear = 0
    
    // 计算到目标月份的天数
    for (let month = 1; month < lunarMonth; month++) {
      daysSinceNewYear += yearData.months[month - 1]
    }
    
    // 加上本月的天数
    daysSinceNewYear += lunarDay - 1
    
    // 如果是闰月，需要加上正常月份的天数
    if (isLeap && lunarMonth <= yearData.months.length) {
      daysSinceNewYear += yearData.months[lunarMonth - 1]
    }
    
    const solarDate = new Date(newYear.getTime() + daysSinceNewYear * 24 * 60 * 60 * 1000)
    return solarDate.toISOString().split('T')[0]
  }
  
  // 回退到简化算法（带修正）
  const lunarNewYearDates: { [key: number]: string } = {
    1920: '1920-02-20', 1921: '1921-02-08', 1922: '1922-01-28', 1923: '1923-02-16', 1924: '1924-02-05',
    1925: '1925-01-24', 1926: '1926-02-13', 1927: '1927-02-02', 1928: '1928-01-23', 1929: '1929-02-10',
    1930: '1930-01-30', 1931: '1931-02-17', 1932: '1932-02-06', 1933: '1933-01-26', 1934: '1934-02-14',
    1935: '1935-02-04', 1936: '1936-01-24', 1937: '1937-02-11', 1938: '1938-01-31', 1939: '1939-02-19',
    1940: '1940-02-08', 1941: '1941-01-27', 1942: '1942-02-15', 1943: '1943-02-05', 1944: '1944-01-25',
    1945: '1945-02-13', 1946: '1946-02-02', 1947: '1947-01-22', 1948: '1948-02-10', 1949: '1949-01-29',
    1950: '1950-02-17', 1951: '1951-02-06', 1952: '1952-01-27', 1953: '1953-02-14', 1954: '1954-02-03',
    1955: '1955-01-24', 1956: '1956-02-12', 1957: '1957-01-31', 1958: '1958-02-18', 1959: '1959-02-08',
    1960: '1960-01-28', 1961: '1961-02-15', 1962: '1962-02-05', 1963: '1963-01-25', 1964: '1964-02-13',
    1965: '1965-02-02', 1966: '1966-01-21', 1967: '1967-02-09', 1968: '1968-01-30', 1969: '1969-02-17',
    1970: '1970-02-06', 1971: '1971-01-27', 1972: '1972-02-15', 1973: '1973-02-03', 1974: '1974-01-23',
    1975: '1975-02-11', 1976: '1976-01-31', 1977: '1977-02-18', 1978: '1978-02-07', 1979: '1979-01-28',
    1980: '1980-02-16', 1981: '1981-02-05', 1982: '1982-01-25', 1983: '1983-02-13', 1984: '1984-02-02',
    1985: '1985-02-20', 1986: '1986-02-09', 1987: '1987-01-29', 1988: '1988-02-17', 1989: '1989-02-06',
    1990: '1990-01-27', 1991: '1991-02-15', 1992: '1992-02-04', 1993: '1993-01-23', 1994: '1994-02-10',
    1995: '1995-01-31', 1996: '1996-02-19', 1997: '1997-02-07', 1998: '1998-01-28', 1999: '1999-02-16',
    2000: '2000-02-05', 2001: '2001-01-24', 2002: '2002-02-12', 2003: '2003-02-01', 2004: '2004-01-22',
    2005: '2005-02-09', 2006: '2006-01-29', 2007: '2007-02-18', 2008: '2008-02-07', 2009: '2009-01-26',
    2010: '2010-02-14', 2011: '2011-02-03', 2012: '2012-01-23', 2013: '2013-02-10', 2014: '2014-01-31',
    2015: '2015-02-19', 2016: '2016-02-08', 2017: '2017-01-28', 2018: '2018-02-16', 2019: '2019-02-05',
    2020: '2020-01-25', 2021: '2021-02-12', 2022: '2022-02-01', 2023: '2023-01-22', 2024: '2024-02-10'
  }
  
  const newYearDate = lunarNewYearDates[lunarYear]
  if (!newYearDate) {
    return `${lunarYear}-${lunarMonth.toString().padStart(2, '0')}-${lunarDay.toString().padStart(2, '0')}`
  }
  
  const newYear = new Date(newYearDate)
  
  // 改进的天数计算（更精确的大小月规律）
  const monthDays = [30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 30, 29] // 更接近实际的大小月规律
  let daysSinceNewYear = 0
  
  for (let month = 1; month < lunarMonth; month++) {
    daysSinceNewYear += monthDays[month - 1]
  }
  daysSinceNewYear += lunarDay - 1
  
  // 闰月处理
  if (isLeap) {
    daysSinceNewYear += 29
  }
  
  const solarDate = new Date(newYear.getTime() + daysSinceNewYear * 24 * 60 * 60 * 1000)
  return solarDate.toISOString().split('T')[0]
}

// 年龄计算函数
const calculateAge = () => {
  if (!canCalculate.value) {
    ElMessage.warning('请填写完整信息')
    return
  }

  let birthDateToUse = ''
  
  if (calendarType.value === 'solar') {
    birthDateToUse = `${selectedYear.value}-${selectedMonth.value!.toString().padStart(2, '0')}-${selectedDay.value!.toString().padStart(2, '0')}`
  } else {
    // 农历转阳历
    birthDateToUse = lunarToSolar(selectedYear.value!, selectedMonth.value!, selectedDay.value!, isLeapMonth.value)
  }

  const birth = new Date(birthDateToUse)
  const target = new Date(targetDate.value)
  
  if (birth > target) {
    ElMessage.error('出生日期不能晚于计算日期')
    return
  }

  // 计算年龄
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

  // 计算生肖和星座
  const zodiac = getZodiac(birth.getFullYear())
  const constellation = getConstellation(birth.getMonth() + 1, birth.getDate())
  const birthstone = getBirthstone(birth.getMonth() + 1)

  // 计算下次生日
  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday < target) {
    nextBirthday.setFullYear(target.getFullYear() + 1)
  }
  
  const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
  const nextBirthdayStr = nextBirthday.toISOString().split('T')[0]
  const birthdaysPassed = years

  // 计算人生阶段
  let lifeStage, lifeProgress
  if (years < 18) {
    lifeStage = '童年/青少年时期'
    lifeProgress = (years / 18) * 25
  } else if (years < 35) {
    lifeStage = '青年时期'
    lifeProgress = 25 + ((years - 18) / 17) * 25
  } else if (years < 60) {
    lifeStage = '中年时期'
    lifeProgress = 50 + ((years - 35) / 25) * 25
  } else {
    lifeStage = '老年时期'
    lifeProgress = 75 + Math.min((years - 60) / 20, 1) * 25
  }

  // 生成输入日期显示
  let inputDateDisplay = ''
  let convertedDate = ''
  
  if (calendarType.value === 'solar') {
    inputDateDisplay = `阳历 ${birthDateToUse}`
  } else {
    const leapText = isLeapMonth.value ? '闰' : ''
    inputDateDisplay = `农历 ${selectedYear.value}年${leapText}${selectedMonth.value}月${selectedDay.value}日`
    convertedDate = birthDateToUse
  }

  ageResult.value = {
    years,
    months,
    days,
    zodiac,
    constellation,
    birthstone,
    daysToNextBirthday,
    nextBirthday: nextBirthdayStr,
    birthdaysPassed,
    lifeStage,
    lifeProgress: Math.min(lifeProgress, 100),
    inputDateDisplay,
    convertedDate
  }

  ElMessage.success('年龄计算完成！')
}
</script>

<style scoped>
.age-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.calculator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.input-section, .result-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.input-section h3, .result-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 500;
}

.date-tips {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.unified-date-input {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.calendar-tip {
  margin-top: 10px;
  padding: 8px 12px;
  background: #f0f9ff;
  border-left: 3px solid #3498db;
  border-radius: 4px;
}

.calendar-tip span {
  color: #2563eb;
  font-size: 0.9rem;
}

.calculate-btn {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 1.1rem;
}

.age-display {
  text-align: center;
  margin-bottom: 30px;
}

.main-age {
  margin-bottom: 20px;
}

.age-value {
  font-size: 4rem;
  font-weight: bold;
  color: #2c3e50;
}

.age-unit {
  font-size: 2rem;
  color: #7f8c8d;
  margin-left: 10px;
}

.age-details {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.detail-item {
  text-align: center;
}

.detail-item .label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.detail-item .value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.info-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 15px;
}

.info-card .card-icon {
  font-size: 2rem;
}

.info-card .card-content h4 {
  color: #2c3e50;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.info-card .card-content p {
  color: #34495e;
  font-weight: bold;
  margin: 0;
}

.birthday-info {
  margin-bottom: 30px;
}

.birthday-info h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.birthday-details {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ecf0f1;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .highlight {
  font-weight: bold;
  color: #e74c3c;
}

.life-stages {
  margin-bottom: 30px;
}

.life-stages h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.stage-progress {
  margin-bottom: 15px;
}

.stage-bar {
  height: 20px;
  background: #ecf0f1;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #e74c3c);
  transition: width 0.5s ease;
}

.stage-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.stage-description {
  text-align: center;
  color: #34495e;
  font-style: italic;
}

.knowledge-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.knowledge-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.knowledge-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.knowledge-card h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.zodiac-list, .constellation-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.zodiac-item, .constellation-item {
  background: white;
  padding: 8px;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
  color: #34495e;
}

.birthstone-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.birthstone-item {
  background: white;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.birthstone-item .month {
  color: #7f8c8d;
}

.birthstone-item .stone {
  color: #34495e;
  font-weight: 500;
}

@media (max-width: 768px) {
  .calculator-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .age-details {
    flex-direction: column;
    gap: 15px;
  }
  
  .knowledge-grid {
    grid-template-columns: 1fr;
  }
  
  .zodiac-list, .constellation-list {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .unified-date-input {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .unified-date-input .el-select {
    width: 100% !important;
  }
}
</style>
