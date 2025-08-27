<template>
  <div class="mortgage-calculator">
    <div class="page-header">
      <h1>{{ t('pages.mortgageCalculator.title') }}</h1>
      <p>{{ t('pages.mortgageCalculator.description') }}</p>
    </div>

    <div class="calculator-container">
      <!-- 输入区域 -->
      <div class="input-section">
        <h3>贷款信息</h3>
        
        <div class="input-group">
          <label>贷款总额 (万元)</label>
          <el-input
            v-model="loanAmount"
            type="number"
            placeholder="请输入实际贷款金额"
            :min="1"
            :max="10000"
            clearable
          >
            <template #append>万元</template>
          </el-input>
          <div class="input-tip">
            <span>💡 提示：请直接输入需要贷款的金额，无需考虑首付</span>
          </div>
        </div>

        <div class="input-group">
          <label>贷款年限</label>
          <el-select v-model="loanYears" placeholder="请选择贷款年限" clearable>
            <el-option label="5年" :value="5" />
            <el-option label="10年" :value="10" />
            <el-option label="15年" :value="15" />
            <el-option label="20年" :value="20" />
            <el-option label="25年" :value="25" />
            <el-option label="30年" :value="30" />
          </el-select>
        </div>

        <div class="input-group">
          <label>年利率 (%)</label>
          <el-input
            v-model="annualRate"
            type="number"
            placeholder="请输入年利率"
            :min="0.1"
            :max="20"
            :step="0.01"
            clearable
          >
            <template #append>%</template>
          </el-input>
        </div>

        <div class="input-group">
          <label>还款方式</label>
          <el-radio-group v-model="paymentMethod">
            <el-radio label="equal-payment">等额本息</el-radio>
            <el-radio label="equal-principal">等额本金</el-radio>
          </el-radio-group>
        </div>



        <el-button 
          type="primary" 
          size="large" 
          @click="calculateMortgage"
          :disabled="!canCalculate"
          class="calculate-btn"
        >
          计算房贷
        </el-button>
      </div>

      <!-- 结果区域 -->
      <div v-if="mortgageResult" class="result-section">
        <h3>计算结果</h3>
        
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-title">月供</div>
            <div class="card-value">¥{{ formatMoney(mortgageResult.monthlyPayment) }}</div>
          </div>
          <div class="summary-card">
            <div class="card-title">总利息</div>
            <div class="card-value">¥{{ formatMoney(mortgageResult.totalInterest) }}</div>
          </div>
          <div class="summary-card">
            <div class="card-title">还款总额</div>
            <div class="card-value">¥{{ formatMoney(mortgageResult.totalPayment) }}</div>
          </div>
        </div>

        <div class="payment-breakdown">
          <h4>还款明细</h4>
          <div class="breakdown-item">
            <span>贷款本金：</span>
            <span class="amount">¥{{ formatMoney(mortgageResult.principal) }}</span>
          </div>
          <div class="breakdown-item">
            <span>月利率：</span>
            <span class="amount">{{ (mortgageResult.monthlyRate * 100).toFixed(4) }}%</span>
          </div>
          <div class="breakdown-item">
            <span>还款月数：</span>
            <span class="amount">{{ mortgageResult.totalMonths }} 个月</span>
          </div>
        </div>

        <div class="payment-chart">
          <h4>还款趋势图</h4>
          <div class="chart-container">
            <div class="chart-bar">
              <div class="bar-segment principal" :style="{ width: '60%' }">
                <span>本金</span>
              </div>
              <div class="bar-segment interest" :style="{ width: '40%' }">
                <span>利息</span>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color principal"></span>
                <span>本金：{{ formatMoney(mortgageResult.principal) }}</span>
              </div>
              <div class="legend-item">
                <span class="legend-color interest"></span>
                <span>利息：{{ formatMoney(mortgageResult.totalInterest) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="monthly-details">
          <h4>前12个月还款明细</h4>
          <div class="details-table">
            <div class="table-header">
              <span>期数</span>
              <span>月供</span>
              <span>本金</span>
              <span>利息</span>
              <span>剩余本金</span>
            </div>
            <div 
              v-for="(month, index) in mortgageResult.monthlyDetails.slice(0, 12)" 
              :key="index"
              class="table-row"
            >
              <span>{{ month.month }}</span>
              <span>¥{{ formatMoney(month.payment) }}</span>
              <span>¥{{ formatMoney(month.principal) }}</span>
              <span>¥{{ formatMoney(month.interest) }}</span>
              <span>¥{{ formatMoney(month.remainingPrincipal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 还款方式说明 -->
    <div class="payment-explanation">
      <h3>还款方式说明</h3>
      <div class="explanation-grid">
        <div class="explanation-card">
          <h4>等额本息</h4>
          <p>每月还款金额相同，前期还款中利息占比大，后期本金占比大。适合收入稳定、希望月供固定的借款人。</p>
          <ul>
            <li>月供固定，便于规划</li>
            <li>前期利息较多</li>
            <li>总利息相对较高</li>
          </ul>
        </div>
        <div class="explanation-card">
          <h4>等额本金</h4>
          <p>每月还款本金相同，利息逐月递减，月供逐月减少。适合收入较高、希望减少总利息的借款人。</p>
          <ul>
            <li>月供逐月递减</li>
            <li>总利息相对较少</li>
            <li>前期还款压力较大</li>
          </ul>
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
const loanAmount = ref('')
const loanYears = ref(30)
const annualRate = ref('4.2')
const paymentMethod = ref('equal-payment')

const mortgageResult = ref<any>(null)

// 计算属性
const canCalculate = computed(() => {
  return loanAmount.value && loanYears.value && annualRate.value
})

// 格式化金额
const formatMoney = (amount: number) => {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 房贷计算函数
const calculateMortgage = () => {
  if (!canCalculate.value) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const principal = parseFloat(loanAmount.value) * 10000 // 转换为元
  const monthlyRate = parseFloat(annualRate.value) / 100 / 12
  const totalMonths = loanYears.value * 12

  let monthlyPayment, totalInterest, totalPayment, monthlyDetails

  if (paymentMethod.value === 'equal-payment') {
    // 等额本息
    monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / 
                     (Math.pow(1 + monthlyRate, totalMonths) - 1)
    totalPayment = monthlyPayment * totalMonths
    totalInterest = totalPayment - principal

    // 生成每月还款明细
    monthlyDetails = []
    let remainingPrincipal = principal
    for (let month = 1; month <= totalMonths; month++) {
      const interest = remainingPrincipal * monthlyRate
      const principalPaid = monthlyPayment - interest
      remainingPrincipal -= principalPaid
      
      monthlyDetails.push({
        month,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        remainingPrincipal: Math.max(0, remainingPrincipal)
      })
    }
  } else {
    // 等额本金
    const monthlyPrincipal = principal / totalMonths
    totalInterest = 0
    monthlyDetails = []
    let remainingPrincipal = principal

    for (let month = 1; month <= totalMonths; month++) {
      const interest = remainingPrincipal * monthlyRate
      const payment = monthlyPrincipal + interest
      totalInterest += interest
      remainingPrincipal -= monthlyPrincipal
      
      monthlyDetails.push({
        month,
        payment,
        principal: monthlyPrincipal,
        interest,
        remainingPrincipal: Math.max(0, remainingPrincipal)
      })
    }

    totalPayment = principal + totalInterest
    monthlyPayment = monthlyDetails[0].payment // 第一个月的还款额
  }

  mortgageResult.value = {
    principal,
    monthlyPayment,
    totalInterest,
    totalPayment,
    monthlyRate,
    totalMonths,
    monthlyDetails
  }

  ElMessage.success('房贷计算完成！')
}
</script>

<style scoped>
.mortgage-calculator {
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

.input-tip {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0f9ff;
  border-left: 3px solid #3498db;
  border-radius: 4px;
}

.input-tip span {
  color: #2563eb;
  font-size: 0.9rem;
}

.calculate-btn {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 1.1rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.summary-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.summary-card .card-title {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.summary-card .card-value {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: bold;
}

.payment-breakdown {
  margin-bottom: 30px;
}

.payment-breakdown h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ecf0f1;
}

.breakdown-item .amount {
  font-weight: bold;
  color: #2c3e50;
}

.payment-chart {
  margin-bottom: 30px;
}

.payment-chart h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.chart-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.chart-bar {
  display: flex;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 15px;
}

.bar-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
}

.bar-segment.principal { background: #3498db; }
.bar-segment.interest { background: #e74c3c; }

.chart-legend {
  display: flex;
  justify-content: space-around;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.principal { background: #3498db; }
.legend-color.interest { background: #e74c3c; }

.monthly-details h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.details-table {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1.5fr;
  background: #34495e;
  color: white;
  padding: 12px;
  font-weight: bold;
  font-size: 0.9rem;
}

.table-row {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1.5fr;
  padding: 10px 12px;
  border-bottom: 1px solid #ecf0f1;
  font-size: 0.9rem;
}

.table-row:nth-child(even) {
  background: white;
}

.payment-explanation {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.payment-explanation h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.explanation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.explanation-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.explanation-card h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.explanation-card p {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 15px;
}

.explanation-card ul {
  padding-left: 20px;
}

.explanation-card li {
  color: #34495e;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .calculator-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .explanation-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header, .table-row {
    grid-template-columns: 0.8fr 1fr 1fr 1fr 1.2fr;
    font-size: 0.8rem;
  }
}
</style>
