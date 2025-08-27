<template>
  <div class="bmi-calculator">
    <div class="page-header">
      <h1>{{ t('pages.bmiCalculator.title') }}</h1>
      <p>{{ t('pages.bmiCalculator.description') }}</p>
    </div>

    <div class="calculator-container">
      <!-- 输入区域 -->
      <div class="input-section">
        <h3>{{ t('pages.bmiCalculator.basicInfo') }}</h3>
        <div class="input-group">
          <label>{{ t('pages.bmiCalculator.height') }}</label>
          <el-input
            v-model="height"
            type="number"
            :placeholder="t('pages.bmiCalculator.heightPlaceholder')"
            :min="100"
            :max="250"
            clearable
          >
            <template #append>cm</template>
          </el-input>
        </div>
        
        <div class="input-group">
          <label>{{ t('pages.bmiCalculator.weight') }}</label>
          <el-input
            v-model="weight"
            type="number"
            :placeholder="t('pages.bmiCalculator.weightPlaceholder')"
            :min="20"
            :max="300"
            clearable
          >
            <template #append>kg</template>
          </el-input>
        </div>

        <div class="input-group">
          <label>{{ t('pages.bmiCalculator.age') }}</label>
          <el-input
            v-model="age"
            type="number"
            :placeholder="t('pages.bmiCalculator.agePlaceholder')"
            :min="1"
            :max="120"
            clearable
          >
            <template #append>{{ t('pages.bmiCalculator.years') }}</template>
          </el-input>
        </div>

        <div class="input-group">
          <label>性别</label>
          <el-radio-group v-model="gender">
            <el-radio label="male">男性</el-radio>
            <el-radio label="female">女性</el-radio>
          </el-radio-group>
        </div>

        <el-button 
          type="primary" 
          size="large" 
          @click="calculateBMI"
          :disabled="!canCalculate"
          class="calculate-btn"
        >
          {{ t('pages.bmiCalculator.calculate') }}
        </el-button>
      </div>

      <!-- 结果区域 -->
      <div v-if="bmiResult" class="result-section">
        <h3>{{ t('pages.bmiCalculator.result') }}</h3>
        
        <div class="bmi-display">
          <div class="bmi-value">
            <span class="value">{{ bmiResult.bmi.toFixed(1) }}</span>
            <span class="unit">BMI</span>
          </div>
          <div class="bmi-category" :class="bmiResult.categoryClass">
            {{ bmiResult.category }}
          </div>
        </div>

        <div class="bmi-chart">
          <div class="chart-bar">
            <div class="bar-segment underweight" :style="{ width: '16.67%' }">
              <span>偏瘦</span>
            </div>
            <div class="bar-segment normal" :style="{ width: '16.67%' }">
              <span>正常</span>
            </div>
            <div class="bar-segment overweight" :style="{ width: '16.67%' }">
              <span>超重</span>
            </div>
            <div class="bar-segment obese" :style="{ width: '16.67%' }">
              <span>肥胖</span>
            </div>
          </div>
          <div class="chart-labels">
            <span>18.5</span>
            <span>24</span>
            <span>28</span>
            <span>35</span>
          </div>
        </div>

        <div class="health-info">
          <h4>健康评估</h4>
          <p>{{ bmiResult.assessment }}</p>
          
          <h4>健康建议</h4>
          <ul>
            <li v-for="(advice, index) in bmiResult.advice" :key="index">
              {{ advice }}
            </li>
          </ul>
        </div>

        <div class="ideal-weight">
          <h4>理想体重范围</h4>
          <p>根据您的身高，理想体重范围：<strong>{{ idealWeightRange.min }} - {{ idealWeightRange.max }} kg</strong></p>
        </div>
      </div>
    </div>

    <!-- 健康知识 -->
    <div class="health-tips">
      <h3>健康小贴士</h3>
      <div class="tips-grid">
        <div class="tip-card">
          <h4>什么是BMI？</h4>
          <p>BMI（身体质量指数）是衡量体重与身高关系的标准指标，计算公式为：体重(kg) ÷ 身高(m)²</p>
        </div>
        <div class="tip-card">
          <h4>BMI标准</h4>
          <p>偏瘦：&lt;18.5 | 正常：18.5-24 | 超重：24-28 | 肥胖：&gt;28</p>
        </div>
        <div class="tip-card">
          <h4>注意事项</h4>
          <p>BMI仅供参考，不能完全反映身体健康状况，建议结合体脂率、肌肉量等指标综合评估</p>
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
const height = ref('')
const weight = ref('')
const age = ref('')
const gender = ref('male')
const bmiResult = ref<any>(null)

// 计算属性
const canCalculate = computed(() => {
  return height.value && weight.value && age.value && gender.value
})

const idealWeightRange = computed(() => {
  if (!height.value) return { min: 0, max: 0 }
  const heightM = parseFloat(height.value) / 100
  const min = (18.5 * heightM * heightM).toFixed(1)
  const max = (24 * heightM * heightM).toFixed(1)
  return { min, max }
})

// BMI计算函数
const calculateBMI = () => {
  if (!canCalculate.value) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const heightM = parseFloat(height.value) / 100
  const weightKg = parseFloat(weight.value)
  const bmi = weightKg / (heightM * heightM)

  // 确定BMI分类
  let category, categoryClass, assessment, advice

  if (bmi < 18.5) {
    category = '偏瘦'
    categoryClass = 'underweight'
    assessment = '您的体重偏轻，可能存在营养不良的风险。'
    advice = [
      '适当增加热量摄入，多吃富含蛋白质的食物',
      '进行力量训练，增加肌肉量',
      '保证充足的睡眠和休息',
      '如有需要，建议咨询营养师'
    ]
  } else if (bmi < 24) {
    category = '正常'
    categoryClass = 'normal'
    assessment = '恭喜！您的体重在健康范围内，请继续保持良好的生活习惯。'
    advice = [
      '保持均衡的饮食结构',
      '坚持适量运动，每周至少150分钟中等强度运动',
      '定期体检，关注健康指标',
      '保持良好的作息习惯'
    ]
  } else if (bmi < 28) {
    category = '超重'
    categoryClass = 'overweight'
    assessment = '您的体重超出正常范围，需要适当控制体重。'
    advice = [
      '控制热量摄入，减少高脂肪、高糖食物',
      '增加有氧运动，如快走、游泳、骑自行车',
      '规律作息，避免熬夜',
      '建议咨询医生或营养师制定减重计划'
    ]
  } else {
    category = '肥胖'
    categoryClass = 'obese'
    assessment = '您的体重严重超标，需要积极采取措施减重。'
    advice = [
      '严格控制饮食，制定科学的减重计划',
      '在医生指导下进行运动，避免剧烈运动',
      '定期体检，关注血压、血糖等指标',
      '建议寻求专业医疗帮助'
    ]
  }

  bmiResult.value = {
    bmi,
    category,
    categoryClass,
    assessment,
    advice
  }

  ElMessage.success('BMI计算完成！')
}
</script>

<style scoped>
.bmi-calculator {
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

.calculate-btn {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 1.1rem;
}

.bmi-display {
  text-align: center;
  margin-bottom: 30px;
}

.bmi-value {
  margin-bottom: 15px;
}

.bmi-value .value {
  font-size: 4rem;
  font-weight: bold;
  color: #2c3e50;
}

.bmi-value .unit {
  font-size: 1.5rem;
  color: #7f8c8d;
  margin-left: 10px;
}

.bmi-category {
  display: inline-block;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
}

.bmi-category.underweight { background: #3498db; }
.bmi-category.normal { background: #27ae60; }
.bmi-category.overweight { background: #f39c12; }
.bmi-category.obese { background: #e74c3c; }

.bmi-chart {
  margin-bottom: 30px;
}

.chart-bar {
  display: flex;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 10px;
}

.bar-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
}

.bar-segment.underweight { background: #3498db; }
.bar-segment.normal { background: #27ae60; }
.bar-segment.overweight { background: #f39c12; }
.bar-segment.obese { background: #e74c3c; }

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.health-info h4 {
  color: #2c3e50;
  margin: 20px 0 10px 0;
}

.health-info ul {
  padding-left: 20px;
}

.health-info li {
  margin-bottom: 8px;
  color: #34495e;
}

.ideal-weight {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.ideal-weight h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.health-tips {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.health-tips h3 {
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

@media (max-width: 768px) {
  .calculator-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
