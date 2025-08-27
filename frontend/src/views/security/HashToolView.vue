<template>
  <div class="hash-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Key /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('pages.hash.title') }}</h1>
        <p class="hero-description">{{ t('pages.hash.description') }}</p>
      </div>
    </div>

    <!-- 输入和配置卡片 -->
    <div class="tool-card input-card">
      <div class="card-header">
        <h3>
          <el-icon><MagicStick /></el-icon>
          {{ t('pages.hash.title') }}
        </h3>
      </div>
      <div class="card-body">
        <!-- 输入区域 -->
        <div class="input-section">
          <label class="input-label">{{ t('common.input') }}{{ t('common.text') }}</label>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="6"
            :placeholder="t('pages.hash.inputPlaceholder')"
            @input="calculateHash"
          />
        </div>

        <!-- 算法选择 -->
        <div class="algorithm-section">
          <label class="input-label">{{ t('pages.hash.algorithm') }}</label>
          <el-radio-group v-model="selectedAlgorithm" @change="calculateHash">
            <el-radio-button label="djb2">DJB2</el-radio-button>
            <el-radio-button label="sdbm">SDBM</el-radio-button>
            <el-radio-button label="loselose">Lose Lose</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 计算按钮 -->
        <div class="calculate-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="calculateHash"
            :loading="loading"
            :disabled="!inputText.trim()"
          >
            <el-icon><MagicStick /></el-icon>
            {{ t('pages.hash.calculateButton') }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 结果卡片 -->
    <div v-if="result" class="tool-card result-card">
      <div class="card-header">
        <h3>
          <el-icon><Key /></el-icon>
          {{ t('pages.hash.hashResult') }}
        </h3>
      </div>
      <div class="card-body">
        <div class="hash-result">
          <div class="hash-value">{{ result }}</div>
          <div class="hash-actions">
            <el-button @click="copyResult" type="primary" size="small">
              <el-icon><CopyDocument /></el-icon>
              {{ t('pages.hash.copyResult') }}
            </el-button>
          </div>
        </div>

        <!-- 详细信息 -->
        <div v-if="extra" class="details-section">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">{{ t('pages.hash.detailLabels.algorithm') }}:</span>
              <span class="detail-value">{{ extra.algorithm.toUpperCase() }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('pages.hash.detailLabels.inputLength') }}:</span>
              <span class="detail-value">{{ extra.inputLength }} {{ t('pages.hash.detailLabels.characters') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('pages.hash.detailLabels.outputLength') }}:</span>
              <span class="detail-value">{{ extra.outputLength }} {{ t('pages.hash.detailLabels.characters') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t('pages.hash.detailLabels.processTime') }}:</span>
              <span class="detail-value">{{ processTime }}{{ t('pages.hash.detailLabels.milliseconds') }}</span>
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
          {{ t('pages.hash.algorithmDesc') }}
        </h3>
      </div>
      <div class="card-body">
        <div class="usage-content">
          <div class="usage-section">
            <h4>{{ t('pages.hash.algorithms.djb2.name') }}</h4>
            <p>{{ t('pages.hash.algorithms.djb2.description') }}</p>
          </div>
          <div class="usage-section">
            <h4>{{ t('pages.hash.algorithms.sdbm.name') }}</h4>
            <p>{{ t('pages.hash.algorithms.sdbm.description') }}</p>
          </div>
          <div class="usage-section">
            <h4>{{ t('pages.hash.algorithms.loselose.name') }}</h4>
            <p>{{ t('pages.hash.algorithms.loselose.description') }}</p>
          </div>
          <div class="usage-section warning">
            <h4>⚠️ {{ t('pages.hash.warning.title') }}</h4>
            <p>{{ t('pages.hash.warning.description') }}</p>
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
  Key,
  MagicStick,
  CopyDocument,
  InfoFilled
} from '@element-plus/icons-vue'
import { hashTool } from '../../utils/newTools'

const { t } = useI18n()
const loading = ref(false)
const inputText = ref('')
const selectedAlgorithm = ref('djb2')
const result = ref('')
const extra = ref<any>(null)
const processTime = ref(0)

// 计算哈希值
const calculateHash = () => {
  if (!inputText.value.trim()) {
    result.value = ''
    extra.value = null
    return
  }

  loading.value = true
  const startTime = Date.now()
  
  try {
    const response = hashTool.simpleHash(inputText.value, selectedAlgorithm.value)
    
    if (response.success) {
      result.value = response.result
      extra.value = response.extra
      processTime.value = Date.now() - startTime
    } else {
      ElMessage.error(response.error || t('pages.hash.messages.calculationError'))
    }
  } catch (error: any) {
    ElMessage.error(error.message || t('pages.hash.messages.calculationError'))
  } finally {
    loading.value = false
  }
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success(t('pages.hash.messages.copied'))
  } catch (error) {
    ElMessage.error(t('pages.hash.messages.copyFailed'))
  }
}
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.hash-tool {
  --tool-color: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 哈希工具特定样式 */
.input-section {
  margin-bottom: 20px;
}

.input-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
}

.algorithm-section {
  margin-bottom: 20px;
}

.calculate-section {
  text-align: center;
  padding: 20px 0;
}

.hash-result {
  margin-bottom: 20px;
}

.hash-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
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

.hash-actions {
  text-align: center;
}

.details-section {
  margin-top: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border-left: 4px solid var(--el-color-primary);
}

.detail-label {
  font-weight: 500;
  color: #6b7280;
}

.detail-value {
  font-weight: 600;
  color: var(--el-color-primary);
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

.usage-section.warning {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
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
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>