<template>
  <div class="password-generator">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Lock /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('pages.password.title') }}</h1>
        <p class="hero-description">{{ t('pages.password.description') }}</p>
      </div>
    </div>

    <!-- 密码配置卡片 -->
    <div class="tool-card config-card">
      <div class="card-header">
        <h3>
          <el-icon><Setting /></el-icon>
          {{ t('pages.password.title') }}配置
        </h3>
      </div>
      
      <div class="card-body">
        <div class="length-section">
          <div class="length-header">
            <label class="length-label">{{ t('pages.password.options.length') }}</label>
            <span class="length-value">{{ passwordLength }} 位</span>
          </div>
          <el-slider
            v-model="passwordLength"
            :min="4"
            :max="128"
            :step="1"
            @input="generatePassword"
            class="length-slider"
          />
          <div class="length-tips">
            <span class="tip-item" :class="{ active: passwordLength >= 12 }">12位以上推荐</span>
            <span class="tip-item" :class="{ active: passwordLength >= 16 }">16位以上更安全</span>
          </div>
        </div>

        <div class="character-section">
          <div class="section-header">
            <h4>字符类型</h4>
            <span class="selection-count">已选择 {{ selectedTypesCount }} 种类型</span>
          </div>
          <div class="option-grid">
            <div class="option-item" :class="{ checked: options.uppercase }">
              <el-checkbox v-model="options.uppercase" @change="generatePassword" size="large">
                <div class="option-content">
                  <span class="option-title">大写字母</span>
                  <span class="option-example">A-Z</span>
                </div>
              </el-checkbox>
            </div>
            <div class="option-item" :class="{ checked: options.lowercase }">
              <el-checkbox v-model="options.lowercase" @change="generatePassword" size="large">
                <div class="option-content">
                  <span class="option-title">小写字母</span>
                  <span class="option-example">a-z</span>
                </div>
              </el-checkbox>
            </div>
            <div class="option-item" :class="{ checked: options.numbers }">
              <el-checkbox v-model="options.numbers" @change="generatePassword" size="large">
                <div class="option-content">
                  <span class="option-title">数字</span>
                  <span class="option-example">0-9</span>
                </div>
              </el-checkbox>
            </div>
            <div class="option-item" :class="{ checked: options.symbols }">
              <el-checkbox v-model="options.symbols" @change="generatePassword" size="large">
                <div class="option-content">
                  <span class="option-title">特殊符号</span>
                  <span class="option-example">!@#$%^&*</span>
                </div>
              </el-checkbox>
            </div>
          </div>
          
          <div class="advanced-options">
            <div class="option-item advanced" :class="{ checked: options.excludeAmbiguous }">
              <el-checkbox v-model="options.excludeAmbiguous" @change="generatePassword" size="large">
                <div class="option-content">
                  <span class="option-title">排除易混淆字符</span>
                  <span class="option-example">避免 0,O,l,1,I 等</span>
                </div>
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 生成和结果卡片 -->
    <div class="tool-card result-card">
      <div class="card-header">
        <h3>
          <el-icon><Key /></el-icon>
          密码生成
        </h3>
      </div>
      
      <div class="card-body">
        <div class="generate-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="generatePassword"
            :loading="loading"
            class="generate-button"
          >
            <el-icon><Refresh /></el-icon>
            {{ t('pages.password.actions.generate') }}
          </el-button>
        </div>

        <!-- 结果显示 -->
        <div v-if="result" class="result-section">
          <div class="password-display">
            <div class="password-value">{{ result }}</div>
            <div class="password-actions">
              <el-button @click="copyPassword" size="small">
                <el-icon><CopyDocument /></el-icon>
                {{ t('pages.password.actions.copy') }}
              </el-button>
              <el-button @click="generatePassword" size="small" type="primary" plain>
                <el-icon><Refresh /></el-icon>
                重新生成
              </el-button>
            </div>
          </div>

          <!-- 密码强度 -->
          <div v-if="extra" class="strength-info">
            <div class="strength-header">
              <h4>密码强度</h4>
              <el-tag 
                :type="getStrengthColor(extra.strength)"
                size="large"
              >
                {{ getStrengthText(extra.strength) }}
              </el-tag>
            </div>
            
            <div class="strength-details">
              <div class="detail-row">
                <span>长度:</span>
                <span>{{ extra.length }} 位</span>
              </div>
              <div class="detail-row">
                <span>熵值:</span>
                <span>{{ extra.entropy }} 位</span>
              </div>
              <div class="detail-row">
                <span>字符集:</span>
                <span>
                  <el-tag v-if="extra.charSets.uppercase" size="small">大写</el-tag>
                  <el-tag v-if="extra.charSets.lowercase" size="small">小写</el-tag>
                  <el-tag v-if="extra.charSets.numbers" size="small">数字</el-tag>
                  <el-tag v-if="extra.charSets.symbols" size="small">符号</el-tag>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 密码建议 -->
        <div class="tips-section">
          <h4>密码安全建议</h4>
          <ul class="tips-list">
            <li>使用至少12个字符的密码</li>
            <li>包含大写字母、小写字母、数字和特殊符号</li>
            <li>避免使用个人信息或常见单词</li>
            <li>为不同账户使用不同的密码</li>
            <li>定期更换重要账户的密码</li>
            <li>使用密码管理器安全存储密码</li>
          </ul>
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
      <div class="card-body">
        <div class="usage-content">
          <div class="usage-section">
            <h4>🔐 安全建议</h4>
            <p>建议使用12位以上长度的密码，包含大小写字母、数字和特殊符号</p>
          </div>
          <div class="usage-section">
            <h4>⚠️ 安全提醒</h4>
            <p>生成的密码请妥善保管，不要在不安全的地方记录或分享</p>
          </div>
          <div class="usage-section">
            <h4>💡 实用技巧</h4>
            <p>可以排除易混淆字符来避免输入错误，适合需要手动输入的场景</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  Lock,
  Refresh,
  CopyDocument,
  Setting,
  Key,
  InfoFilled
} from '@element-plus/icons-vue'
import { passwordTool } from '../../utils/newTools'

const { t } = useI18n()
const loading = ref(false)
const passwordLength = ref(12)
const result = ref('')
const extra = ref<any>(null)

const options = ref({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
  excludeAmbiguous: false
})

// 计算属性
const selectedTypesCount = computed(() => {
  let count = 0
  if (options.value.uppercase) count++
  if (options.value.lowercase) count++
  if (options.value.numbers) count++
  if (options.value.symbols) count++
  return count
})

// 生成密码
const generatePassword = () => {
  loading.value = true
  try {
    const response = passwordTool.generate(passwordLength.value, options.value)
    
    if (response.success) {
      result.value = response.result
      extra.value = response.extra
    } else {
      ElMessage.error(response.error || '密码生成失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '密码生成失败')
  } finally {
    loading.value = false
  }
}

// 复制密码
const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success('密码已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 获取强度颜色
const getStrengthColor = (strength: string) => {
  switch (strength) {
    case 'strong': return 'success'
    case 'medium': return 'warning'
    case 'weak': return 'danger'
    default: return 'info'
  }
}

// 获取强度文本
const getStrengthText = (strength: string) => {
  switch (strength) {
    case 'strong': return '强'
    case 'medium': return '中等'
    case 'weak': return '弱'
    default: return '未知'
  }
}

// 页面加载时生成一个密码
onMounted(() => {
  generatePassword()
})
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.password-generator {
  --tool-color: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 密码生成器特定样式 */
.length-section {
  padding: 20px;
}

.length-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.length-label {
  font-weight: 500;
  color: #374151;
}

.length-value {
  font-weight: 600;
  color: var(--el-color-primary);
}

.length-tips {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  justify-content: center;
}

.tip-item {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.05);
  color: #6b7280;
  transition: all 0.3s ease;
}

.tip-item.active {
  background: var(--el-color-success);
  color: white;
}

.character-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.selection-count {
  font-size: 12px;
  color: #6b7280;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 12px;
  border-radius: 12px;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.option-item {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.option-item:hover {
  border-color: var(--el-color-primary);
}

.option-item.checked {
  border-color: var(--el-color-primary);
  background: rgba(64, 158, 255, 0.05);
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-title {
  font-weight: 500;
  color: #374151;
}

.option-example {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.advanced-options {
  margin-top: 16px;
}

.advanced {
  grid-column: 1 / -1;
}

.generate-section {
  text-align: center;
  padding: 20px;
}

.password-display {
  margin-bottom: 20px;
}

.password-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  margin-bottom: 12px;
  word-break: break-all;
  line-height: 1.5;
  min-height: 60px;
  display: flex;
  align-items: center;
}

.password-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.strength-info {
  margin-top: 20px;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.strength-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.strength-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.strength-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.strength-label {
  font-size: 14px;
  color: #6b7280;
}

.strength-value {
  font-weight: 500;
  color: #374151;
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

.config-section {
  margin-bottom: 24px;
}

.length-config {
  margin-bottom: 24px;
}

.length-config label {
  display: block;
  font-weight: 500;
  margin-bottom: 12px;
  color: #374151;
}

.character-options h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.generate-section {
  text-align: center;
  margin-bottom: 24px;
}

.result-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.password-display {
  margin-bottom: 20px;
}

.password-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  margin-bottom: 12px;
  word-break: break-all;
  line-height: 1.5;
}

.password-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.strength-info {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.strength-header h4 {
  margin: 0;
  font-size: 16px;
  color: #374151;
}

.strength-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.detail-row span:first-child {
  font-weight: 500;
  color: #6b7280;
}

.tips-section {
  background: #fef3c7;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #f59e0b;
}

.tips-section h4 {
  margin: 0 0 12px 0;
  color: #92400e;
  font-size: 16px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  color: #92400e;
}

.tips-list li {
  margin-bottom: 4px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .password-generator {
    padding: 16px;
  }
  
  .card-header {
    padding: 20px 16px;
  }
  
  .card-body {
    padding: 20px 16px;
  }
  
  .option-grid {
    grid-template-columns: 1fr;
  }
  
  .password-actions {
    flex-direction: column;
  }
  
  .strength-details {
    grid-template-columns: 1fr;
  }
}
</style>
