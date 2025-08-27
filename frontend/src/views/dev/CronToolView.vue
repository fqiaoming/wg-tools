<template>
  <div class="cron-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Timer /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.cronTool') }}</h1>
        <p class="hero-description">{{ t('pages.cronTool.description') }}</p>
      </div>
    </div>

    <!-- 表达式生成器卡片 -->
    <div class="generator-card">
      <div class="generator-header">
        <div class="generator-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>表达式生成器</h3>
        <div class="generator-description">可视化配置Cron表达式</div>
      </div>
      
      <div class="generator-body">
        <div class="cron-fields">
          <!-- 秒 -->
          <div class="field-section">
            <label class="field-label">秒 (0-59)</label>
            <el-select v-model="cronConfig.second" placeholder="选择秒" class="field-select">
              <el-option label="每秒" value="*" />
              <el-option label="每30秒" value="*/30" />
              <el-option label="0秒" value="0" />
              <el-option label="15秒" value="15" />
              <el-option label="30秒" value="30" />
              <el-option label="45秒" value="45" />
            </el-select>
          </div>

          <!-- 分钟 -->
          <div class="field-section">
            <label class="field-label">分钟 (0-59)</label>
            <el-select v-model="cronConfig.minute" placeholder="选择分钟" class="field-select">
              <el-option label="每分钟" value="*" />
              <el-option label="每5分钟" value="*/5" />
              <el-option label="每10分钟" value="*/10" />
              <el-option label="每15分钟" value="*/15" />
              <el-option label="每30分钟" value="*/30" />
              <el-option label="0分" value="0" />
              <el-option label="30分" value="30" />
            </el-select>
          </div>

          <!-- 小时 -->
          <div class="field-section">
            <label class="field-label">小时 (0-23)</label>
            <el-select v-model="cronConfig.hour" placeholder="选择小时" class="field-select">
              <el-option label="每小时" value="*" />
              <el-option label="每2小时" value="*/2" />
              <el-option label="每6小时" value="*/6" />
              <el-option label="每12小时" value="*/12" />
              <el-option label="0点" value="0" />
              <el-option label="9点" value="9" />
              <el-option label="12点" value="12" />
              <el-option label="18点" value="18" />
            </el-select>
          </div>

          <!-- 日 -->
          <div class="field-section">
            <label class="field-label">日 (1-31)</label>
            <el-select v-model="cronConfig.day" placeholder="选择日期" class="field-select">
              <el-option label="每天" value="*" />
              <el-option label="1号" value="1" />
              <el-option label="15号" value="15" />
              <el-option label="最后一天" value="L" />
              <el-option label="每2天" value="*/2" />
              <el-option label="工作日" value="?" />
            </el-select>
          </div>

          <!-- 月 -->
          <div class="field-section">
            <label class="field-label">月 (1-12)</label>
            <el-select v-model="cronConfig.month" placeholder="选择月份" class="field-select">
              <el-option label="每月" value="*" />
              <el-option label="1月" value="1" />
              <el-option label="6月" value="6" />
              <el-option label="12月" value="12" />
              <el-option label="每3个月" value="*/3" />
              <el-option label="每6个月" value="*/6" />
            </el-select>
          </div>

          <!-- 星期 -->
          <div class="field-section">
            <label class="field-label">星期 (0-7)</label>
            <el-select v-model="cronConfig.week" placeholder="选择星期" class="field-select">
              <el-option label="每天" value="*" />
              <el-option label="周一" value="1" />
              <el-option label="周二" value="2" />
              <el-option label="周三" value="3" />
              <el-option label="周四" value="4" />
              <el-option label="周五" value="5" />
              <el-option label="周六" value="6" />
              <el-option label="周日" value="0" />
              <el-option label="工作日" value="1-5" />
              <el-option label="周末" value="0,6" />
            </el-select>
          </div>
        </div>

        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="generateCron"
            class="generate-button"
          >
            <el-icon><MagicStick /></el-icon>
            生成表达式
          </el-button>
          <el-button 
            size="large" 
            @click="resetFields"
            class="reset-button"
          >
            <el-icon><RefreshLeft /></el-icon>
            重置配置
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表达式结果卡片 -->
    <div v-if="cronExpression" class="result-card">
      <div class="result-header">
        <div class="result-icon">
          <el-icon><Document /></el-icon>
        </div>
        <h3>生成结果</h3>
        <div class="result-description">Cron表达式和说明</div>
      </div>
      
      <div class="result-body">
        <div class="expression-display">
          <label class="expression-label">Cron表达式：</label>
          <div class="expression-value">
            <code class="expression-code">{{ cronExpression }}</code>
            <el-button 
              size="small" 
              @click="copyExpression"
              class="copy-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
          </div>
        </div>

        <div class="description-display" v-if="cronDescription">
          <label class="description-label">执行说明：</label>
          <div class="description-text">{{ cronDescription }}</div>
        </div>

        <div class="next-runs" v-if="nextExecutions.length > 0">
          <label class="next-runs-label">接下来5次执行时间：</label>
          <div class="next-runs-list">
            <div 
              v-for="(time, index) in nextExecutions" 
              :key="index"
              class="next-run-item"
            >
              <span class="run-index">{{ index + 1 }}.</span>
              <span class="run-time">{{ time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常用模板卡片 -->
    <div class="templates-card">
      <div class="templates-header">
        <div class="templates-icon">
          <el-icon><Collection /></el-icon>
        </div>
        <h3>常用模板</h3>
        <div class="templates-description">快速选择常用的Cron表达式</div>
      </div>
      
      <div class="templates-body">
        <div class="template-grid">
          <div 
            v-for="template in commonTemplates" 
            :key="template.name"
            class="template-item"
            @click="useTemplate(template)"
          >
            <div class="template-header">
              <span class="template-name">{{ template.name }}</span>
              <el-icon class="template-icon"><Right /></el-icon>
            </div>
            <div class="template-expression">{{ template.expression }}</div>
            <div class="template-description">{{ template.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 语法说明卡片 -->
    <div class="syntax-card">
      <div class="syntax-header">
        <div class="syntax-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>语法说明</h3>
        <div class="syntax-description">Cron表达式格式详解</div>
      </div>
      
      <div class="syntax-body">
        <div class="syntax-format">
          <h4 class="format-title">表达式格式：</h4>
          <div class="format-structure">
            <span class="format-field">秒</span>
            <span class="format-field">分</span>
            <span class="format-field">时</span>
            <span class="format-field">日</span>
            <span class="format-field">月</span>
            <span class="format-field">周</span>
          </div>
        </div>

        <div class="syntax-symbols">
          <h4 class="symbols-title">特殊符号：</h4>
          <div class="symbols-grid">
            <div class="symbol-item">
              <span class="symbol-char">*</span>
              <span class="symbol-desc">匹配任意值</span>
            </div>
            <div class="symbol-item">
              <span class="symbol-char">?</span>
              <span class="symbol-desc">不指定值（日和周）</span>
            </div>
            <div class="symbol-item">
              <span class="symbol-char">-</span>
              <span class="symbol-desc">范围，如1-5</span>
            </div>
            <div class="symbol-item">
              <span class="symbol-char">,</span>
              <span class="symbol-desc">枚举，如1,3,5</span>
            </div>
            <div class="symbol-item">
              <span class="symbol-char">/</span>
              <span class="symbol-desc">间隔，如*/5</span>
            </div>
            <div class="symbol-item">
              <span class="symbol-char">L</span>
              <span class="symbol-desc">最后一天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  Timer,
  Setting,
  MagicStick,
  RefreshLeft,
  Document,
  CopyDocument,
  Collection,
  Right,
  InfoFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()
const cronExpression = ref('')
const cronDescription = ref('')
const nextExecutions = ref<string[]>([])

const cronConfig = reactive({
  second: '0',
  minute: '0',
  hour: '*',
  day: '*',
  month: '*',
  week: '?'
})

// 常用模板
const commonTemplates = [
  {
    name: '每分钟执行',
    expression: '0 * * * * ?',
    description: '每分钟的第0秒执行一次'
  },
  {
    name: '每小时执行',
    expression: '0 0 * * * ?',
    description: '每小时的第0分0秒执行一次'
  },
  {
    name: '每天上午9点',
    expression: '0 0 9 * * ?',
    description: '每天上午9点执行一次'
  },
  {
    name: '每天晚上18点',
    expression: '0 0 18 * * ?',
    description: '每天晚上18点执行一次'
  },
  {
    name: '工作日上午9点',
    expression: '0 0 9 ? * 1-5',
    description: '周一到周五上午9点执行'
  },
  {
    name: '每周一上午9点',
    expression: '0 0 9 ? * 1',
    description: '每周一上午9点执行一次'
  },
  {
    name: '每月1号上午9点',
    expression: '0 0 9 1 * ?',
    description: '每个月1号上午9点执行'
  },
  {
    name: '每年1月1号',
    expression: '0 0 0 1 1 ?',
    description: '每年1月1号零点执行'
  }
]

// 生成Cron表达式
const generateCron = () => {
  cronExpression.value = `${cronConfig.second} ${cronConfig.minute} ${cronConfig.hour} ${cronConfig.day} ${cronConfig.month} ${cronConfig.week}`
  
  // 生成描述
  generateDescription()
  
  // 计算下次执行时间（模拟）
  generateNextExecutions()
  
  ElMessage.success('Cron表达式生成成功！')
}

// 生成描述
const generateDescription = () => {
  const parts = []
  
  // 秒
  if (cronConfig.second === '*') {
    parts.push('每秒')
  } else if (cronConfig.second.includes('*/')) {
    const interval = cronConfig.second.split('*/')[1]
    parts.push(`每${interval}秒`)
  } else {
    parts.push(`第${cronConfig.second}秒`)
  }
  
  // 分钟
  if (cronConfig.minute === '*') {
    parts.push('每分钟')
  } else if (cronConfig.minute.includes('*/')) {
    const interval = cronConfig.minute.split('*/')[1]
    parts.push(`每${interval}分钟`)
  } else {
    parts.push(`第${cronConfig.minute}分钟`)
  }
  
  // 小时
  if (cronConfig.hour === '*') {
    parts.push('每小时')
  } else if (cronConfig.hour.includes('*/')) {
    const interval = cronConfig.hour.split('*/')[1]
    parts.push(`每${interval}小时`)
  } else {
    parts.push(`${cronConfig.hour}点`)
  }
  
  // 构建完整描述
  cronDescription.value = parts.join('，') + '执行一次'
}

// 生成下次执行时间（简单模拟）
const generateNextExecutions = () => {
  const now = new Date()
  const executions = []
  
  for (let i = 0; i < 5; i++) {
    const nextTime = new Date(now.getTime() + (i + 1) * 60000) // 简单示例，每分钟一次
    executions.push(nextTime.toLocaleString('zh-CN'))
  }
  
  nextExecutions.value = executions
}

// 使用模板
const useTemplate = (template: any) => {
  cronExpression.value = template.expression
  cronDescription.value = template.description
  
  // 解析表达式到配置（简单解析）
  const parts = template.expression.split(' ')
  if (parts.length === 6) {
    cronConfig.second = parts[0]
    cronConfig.minute = parts[1]
    cronConfig.hour = parts[2]
    cronConfig.day = parts[3]
    cronConfig.month = parts[4]
    cronConfig.week = parts[5]
  }
  
  generateNextExecutions()
  ElMessage.success(`已使用模板：${template.name}`)
}

// 复制表达式
const copyExpression = async () => {
  if (!cronExpression.value) {
    ElMessage.warning('请先生成表达式')
    return
  }

  try {
    await navigator.clipboard.writeText(cronExpression.value)
    ElMessage.success('表达式已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 重置配置
const resetFields = () => {
  cronConfig.second = '0'
  cronConfig.minute = '0'
  cronConfig.hour = '*'
  cronConfig.day = '*'
  cronConfig.month = '*'
  cronConfig.week = '?'
  
  cronExpression.value = ''
  cronDescription.value = ''
  nextExecutions.value = []
  
  ElMessage.info('配置已重置')
}
</script>

<style scoped>
.cron-tool {
  padding: 24px;
  max-width: 1200px;
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
.generator-card,
.result-card,
.templates-card,
.syntax-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

.generator-card:hover,
.result-card:hover,
.templates-card:hover,
.syntax-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* 卡片头部 */
.generator-header,
.result-header,
.templates-header,
.syntax-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.generator-icon,
.result-icon,
.templates-icon,
.syntax-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.generator-header h3,
.result-header h3,
.templates-header h3,
.syntax-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.generator-description,
.result-description,
.templates-description,
.syntax-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* Cron字段配置 */
.cron-fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.field-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.field-select {
  width: 100%;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px 0;
}

.generate-button {
  min-width: 160px;
}

.reset-button {
  min-width: 120px;
}

/* 结果展示 */
.result-body {
  display: grid;
  gap: 20px;
}

.expression-display,
.description-display {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.expression-label,
.description-label,
.next-runs-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: block;
}

.expression-value {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.expression-code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid var(--primary-color);
  flex: 1;
  min-width: 200px;
}

.copy-btn {
  font-size: 12px;
  padding: 8px 12px;
}

.description-text {
  font-size: 16px;
  color: #1f2937;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* 下次执行时间 */
.next-runs {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.next-runs-list {
  display: grid;
  gap: 8px;
}

.next-run-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.run-index {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  min-width: 20px;
}

.run-time {
  font-size: 14px;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 模板网格 */
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.template-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-item:hover {
  border-color: var(--primary-color);
  background: #fefbf2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.template-icon {
  font-size: 16px;
  color: #6b7280;
}

.template-expression {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  margin-bottom: 8px;
}

.template-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

/* 语法说明 */
.syntax-body {
  display: grid;
  gap: 24px;
}

.syntax-format,
.syntax-symbols {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.format-title,
.symbols-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.format-structure {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.format-field {
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  border: 2px solid var(--primary-color);
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  text-align: center;
}

.symbols-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.symbol-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.symbol-char {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-color);
  background: #fefbf2;
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 32px;
  text-align: center;
}

.symbol-desc {
  font-size: 14px;
  color: #1f2937;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cron-tool {
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
  
  .generator-card,
  .result-card,
  .templates-card,
  .syntax-card {
    padding: 20px 16px;
  }
  
  .cron-fields {
    grid-template-columns: 1fr;
  }
  
  .template-grid,
  .symbols-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .generate-button,
  .reset-button {
    width: 100%;
  }
  
  .expression-value {
    flex-direction: column;
    align-items: stretch;
  }
  
  .copy-btn {
    align-self: center;
  }
  
  .format-structure {
    flex-direction: column;
    align-items: stretch;
  }
  
  .generator-header,
  .result-header,
  .templates-header,
  .syntax-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .generator-description,
  .result-description,
  .templates-description,
  .syntax-description {
    margin-left: 0;
  }
}
</style>