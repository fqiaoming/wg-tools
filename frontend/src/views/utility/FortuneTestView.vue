<template>
  <div class="fortune-test">
    <div class="page-header">
      <h1>🔮 运势测试</h1>
      <p>测试你的今日运势，看看会有什么惊喜等着你</p>
    </div>

    <div class="fortune-container">
      <!-- 测试区域 -->
      <div class="test-section">
        <div class="crystal-ball" :class="{ spinning: isSpinning }">
          <div class="crystal-inner">
            <div class="crystal-shine"></div>
            <div class="fortune-text" v-if="!isSpinning && currentFortune">
              <div class="fortune-level" :class="fortuneLevelClass">
                {{ currentFortune.level }}
              </div>
              <div class="fortune-description">
                {{ currentFortune.description }}
              </div>
            </div>
            <div v-else-if="!isSpinning" class="initial-text">
              点击下方按钮<br>测试运势
            </div>
          </div>
        </div>

        <el-button 
          type="primary" 
          size="large" 
          @click="testFortune"
          :disabled="isSpinning"
          class="test-btn"
          :loading="isSpinning"
        >
          {{ isSpinning ? '占卜中...' : '测试运势' }}
        </el-button>

        <div v-if="currentFortune && !isSpinning" class="fortune-details">
          <div class="fortune-card">
            <h3>{{ currentFortune.level }}</h3>
            <p class="fortune-meaning">{{ currentFortune.meaning }}</p>
            <div class="fortune-advice">
              <h4>今日建议</h4>
              <ul>
                <li v-for="(advice, index) in currentFortune.advice" :key="index">
                  {{ advice }}
                </li>
              </ul>
            </div>
            <div class="fortune-lucky">
              <div class="lucky-item">
                <span class="label">幸运颜色：</span>
                <span class="value" :style="{ color: currentFortune.luckyColor }">
                  {{ currentFortune.luckyColorName }}
                </span>
              </div>
              <div class="lucky-item">
                <span class="label">幸运数字：</span>
                <span class="value">{{ currentFortune.luckyNumber }}</span>
              </div>
              <div class="lucky-item">
                <span class="label">{{ currentFortune.timeLabel }}：</span>
                <span class="value">{{ currentFortune.timeValue }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 运势说明 -->
      <div class="fortune-guide">
        <h3>运势等级说明</h3>
        <div class="guide-grid">
          <div class="guide-item good" v-for="item in fortuneGuide.good" :key="item.level">
            <div class="guide-level">{{ item.level }}</div>
            <div class="guide-desc">{{ item.description }}</div>
            <div class="guide-rate">概率: {{ item.rate }}%</div>
          </div>
          <div class="guide-item bad" v-for="item in fortuneGuide.bad" :key="item.level">
            <div class="guide-level">{{ item.level }}</div>
            <div class="guide-desc">{{ item.description }}</div>
            <div class="guide-rate">概率: {{ item.rate }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 温馨提示 -->
    <div class="fortune-tips">
      <h3>💡 温馨提示</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <h4>娱乐为主</h4>
          <p>运势测试仅供娱乐参考，请理性看待结果，不要过分迷信。</p>
        </div>
        <div class="tip-card">
          <h4>积极心态</h4>
          <p>保持积极乐观的心态，用正能量面对每一天的生活。</p>
        </div>
        <div class="tip-card">
          <h4>努力奋斗</h4>
          <p>好运气需要配合自己的努力，机会总是留给有准备的人。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const isSpinning = ref(false)
const currentFortune = ref<any>(null)

// 运势配置
const fortuneConfig = [
  {
    level: '大吉',
    rate: 2,
    class: 'excellent',
    type: 'good',
    meaning: '运势极佳，万事如意！今天是你的幸运日，把握机会，勇敢追求梦想。',
    description: '诸事顺利，大获成功',
    advice: [
      '今天是做重要决定的好日子',
      '可以尝试新的挑战和机会',
      '与他人合作会有意想不到的收获',
      '投资理财可能会有不错的回报'
    ]
  },
  {
    level: '吉',
    rate: 16,
    class: 'good',
    type: 'good',
    meaning: '运势良好，事事顺心。今天的努力会得到相应的回报。',
    description: '运势不错，顺风顺水',
    advice: [
      '继续保持积极的工作态度',
      '人际关系会有所改善',
      '学习新知识会有显著进步',
      '健康状况良好，精力充沛'
    ]
  },
  {
    level: '小吉',
    rate: 16,
    class: 'fair',
    type: 'good',
    meaning: '运势平稳向上，虽无大喜，但也顺利安康。',
    description: '小有收获，稳步前进',
    advice: [
      '适合制定长期计划',
      '保持耐心，成功在路上',
      '注意细节，避免小错误',
      '与朋友聚会会带来好心情'
    ]
  },
  {
    level: '小小吉',
    rate: 16,
    class: 'slight-good',
    type: 'good',
    meaning: '运势略有起色，小心谨慎中带有希望。',
    description: '运势回升，谨慎乐观',
    advice: [
      '保持低调，不要张扬',
      '做事稳重，一步一个脚印',
      '多听取他人的建议',
      '今天适合处理琐碎事务'
    ]
  },
  {
    level: '小小凶',
    rate: 16,
    class: 'slight-bad',
    type: 'bad',
    meaning: '运势略有波折，需要多加小心，避免冲动行事。',
    description: '需要谨慎，小心行事',
    advice: [
      '避免做重大决定',
      '保持冷静，不要急躁',
      '多检查工作中的细节',
      '今天不适合投资理财'
    ]
  },
  {
    level: '小凶',
    rate: 16,
    class: 'poor',
    type: 'bad',
    meaning: '运势不佳，建议保守行事，等待转机。',
    description: '运势欠佳，保守为宜',
    advice: [
      '今天适合休息调整',
      '避免与他人发生争执',
      '推迟重要的会议或决定',
      '多关注身体健康'
    ]
  },
  {
    level: '凶',
    rate: 16,
    class: 'bad',
    type: 'bad',
    meaning: '运势较差，诸事不宜，建议静心等待，不宜妄动。',
    description: '运势低迷，静心等待',
    advice: [
      '今天最好待在家中',
      '避免外出和社交活动',
      '可以用来反思和总结',
      '保持心态平和，明天会更好'
    ]
  },
  {
    level: '大凶',
    rate: 2,
    class: 'terrible',
    type: 'bad',
    meaning: '运势极差，万事皆凶。但否极泰来，困境过后必有转机。',
    description: '运势极差，需要忍耐',
    advice: [
      '今天什么都不要做',
      '在家休息，调整心态',
      '可以读书学习，提升自己',
      '记住：山重水复疑无路，柳暗花明又一村'
    ]
  }
]

// 幸运元素配置
const luckyColors = [
  { name: '红色', color: '#e74c3c' },
  { name: '蓝色', color: '#3498db' },
  { name: '绿色', color: '#27ae60' },
  { name: '紫色', color: '#9b59b6' },
  { name: '橙色', color: '#f39c12' },
  { name: '粉色', color: '#e91e63' },
  { name: '金色', color: '#f1c40f' },
  { name: '银色', color: '#95a5a6' }
]

// 时间配置
const luckyTimes = [
  '上午8-10点', '上午10-12点', '下午2-4点', '下午4-6点',
  '晚上6-8点', '晚上8-10点', '深夜10-12点', '凌晨12-2点'
]

const unluckyTimes = [
  '上午9-11点', '下午1-3点', '下午3-5点', '下午5-7点',
  '晚上7-9点', '晚上9-11点', '深夜11点-1点', '凌晨1-3点'
]

// 运势指南
const fortuneGuide = {
  good: [
    { level: '大吉', description: '运势极佳，万事如意', rate: 2 },
    { level: '吉', description: '运势良好，事事顺心', rate: 16 },
    { level: '小吉', description: '运势平稳，小有收获', rate: 16 },
    { level: '小小吉', description: '运势略好，谨慎乐观', rate: 16 }
  ],
  bad: [
    { level: '小小凶', description: '运势略差，需要小心', rate: 16 },
    { level: '小凶', description: '运势不佳，保守行事', rate: 16 },
    { level: '凶', description: '运势较差，静心等待', rate: 16 },
    { level: '大凶', description: '运势极差，忍耐为主', rate: 2 }
  ]
}

// 计算属性
const fortuneLevelClass = computed(() => {
  return currentFortune.value?.class || ''
})

// 运势测试函数
const testFortune = () => {
  isSpinning.value = true
  currentFortune.value = null

  // 模拟占卜过程
  setTimeout(() => {
    const result = generateFortune()
    currentFortune.value = result
    isSpinning.value = false
    
    ElMessage.success(`运势测试完成！今日运势：${result.level}`)
  }, 2000)
}

// 生成运势结果
const generateFortune = () => {
  // 根据概率生成运势
  const random = Math.random() * 100
  let currentRate = 0
  
  for (const fortune of fortuneConfig) {
    currentRate += fortune.rate
    if (random <= currentRate) {
      // 生成随机的幸运元素
      const randomColor = luckyColors[Math.floor(Math.random() * luckyColors.length)]
      const randomNumber = Math.floor(Math.random() * 100) + 1
      
      // 根据运势类型选择时间概念
      let timeLabel, timeValue, timeTips
      if (fortune.type === 'good') {
        // 好运势：显示幸运时间
        timeLabel = '幸运时间'
        timeValue = luckyTimes[Math.floor(Math.random() * luckyTimes.length)]
        timeTips = '这个时间段做事会更加顺利'
      } else {
        // 坏运势：显示需要谨慎的时间
        timeLabel = '谨慎时间'
        timeValue = unluckyTimes[Math.floor(Math.random() * unluckyTimes.length)]
        timeTips = '这个时间段需要格外小心谨慎'
      }
      
      return {
        ...fortune,
        luckyColor: randomColor.color,
        luckyColorName: randomColor.name,
        luckyNumber: randomNumber,
        timeLabel,
        timeValue,
        timeTips
      }
    }
  }
  
  // 默认返回小吉（理论上不会执行到这里）
  const defaultFortune = fortuneConfig[2]
  const randomColor = luckyColors[Math.floor(Math.random() * luckyColors.length)]
  const randomNumber = Math.floor(Math.random() * 100) + 1
  const timeValue = luckyTimes[Math.floor(Math.random() * luckyTimes.length)]
  
  return {
    ...defaultFortune,
    luckyColor: randomColor.color,
    luckyColorName: randomColor.name,
    luckyNumber: randomNumber,
    timeLabel: '幸运时间',
    timeValue,
    timeTips: '这个时间段做事会更加顺利'
  }
}

// 验证概率分配（开发调试用）
const verifyProbability = () => {
  const total = fortuneConfig.reduce((sum, fortune) => sum + fortune.rate, 0)
  console.log('总概率:', total)
  console.log('概率分配:', fortuneConfig.map(f => ({ level: f.level, rate: f.rate })))
  
  // 测试1000次的概率分布
  const testResults = {}
  for (let i = 0; i < 1000; i++) {
    const result = generateFortune()
    testResults[result.level] = (testResults[result.level] || 0) + 1
  }
  
  console.log('1000次测试结果分布:')
  Object.entries(testResults).forEach(([level, count]) => {
    const percentage = (((count as number) / 1000) * 100).toFixed(1)
    console.log(`${level}: ${count}次 (${percentage}%)`)
  })
}

// 开发环境下可以调用 verifyProbability() 来验证概率
</script>

<style scoped>
.fortune-test {
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

.fortune-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.test-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.crystal-ball {
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.crystal-ball:hover {
  transform: scale(1.05);
}

.crystal-ball.spinning {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.crystal-inner {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
}

.crystal-shine {
  position: absolute;
  top: 20px;
  left: 30px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  filter: blur(8px);
}

.fortune-text, .initial-text {
  color: white;
  text-align: center;
  z-index: 1;
}

.fortune-level {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.fortune-description {
  font-size: 0.9rem;
  opacity: 0.9;
}

.initial-text {
  font-size: 1rem;
  line-height: 1.5;
}

.test-btn {
  width: 200px;
  height: 48px;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.fortune-details {
  text-align: left;
}

.fortune-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.fortune-card h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
  font-size: 1.3rem;
}

.fortune-meaning {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 20px;
  font-style: italic;
}

.fortune-advice h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.fortune-advice ul {
  padding-left: 20px;
  margin-bottom: 20px;
}

.fortune-advice li {
  margin-bottom: 8px;
  color: #34495e;
}

.fortune-lucky {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.lucky-item {
  display: flex;
  justify-content: space-between;
}

.lucky-item .label {
  color: #7f8c8d;
}

.lucky-item .value {
  font-weight: bold;
  color: #2c3e50;
}

.fortune-guide {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.fortune-guide h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.guide-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.guide-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 15px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
}

.guide-item.good {
  background: rgba(39, 174, 96, 0.1);
  border-left: 4px solid #27ae60;
}

.guide-item.bad {
  background: rgba(231, 76, 60, 0.1);
  border-left: 4px solid #e74c3c;
}

.guide-level {
  font-weight: bold;
  color: #2c3e50;
  min-width: 60px;
}

.guide-desc {
  color: #34495e;
}

.guide-rate {
  color: #7f8c8d;
  font-size: 0.9rem;
  min-width: 60px;
  text-align: right;
}

.fortune-tips {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.fortune-tips h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.tip-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.tip-card h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.tip-card p {
  color: #34495e;
  line-height: 1.6;
}

/* 运势等级颜色 */
.excellent { color: #e74c3c !important; }
.good { color: #27ae60 !important; }
.fair { color: #f39c12 !important; }
.slight-good { color: #3498db !important; }
.slight-bad { color: #9b59b6 !important; }
.poor { color: #e67e22 !important; }
.bad { color: #c0392b !important; }
.terrible { color: #8e44ad !important; }

@media (max-width: 768px) {
  .fortune-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .crystal-ball {
    width: 150px;
    height: 150px;
  }
  
  .crystal-inner {
    width: 130px;
    height: 130px;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .guide-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .guide-rate {
    text-align: left;
  }
}
</style>
