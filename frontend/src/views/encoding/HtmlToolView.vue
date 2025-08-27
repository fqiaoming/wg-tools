<template>
  <div class="html-tool">
    <div class="tool-card">
      <div class="card-header">
        <el-icon class="icon"><Connection /></el-icon>
        <div>
          <h2 class="title">{{ t('pages.html.title') }}</h2>
          <p class="description">{{ t('pages.html.description') }}</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="encodeHtml" :loading="loading">
          <el-icon><Lock /></el-icon>
          {{ t('pages.html.modes.encode') }}
        </el-button>
        <el-button type="success" @click="decodeHtml" :loading="loading">
          <el-icon><Unlock /></el-icon>
          {{ t('pages.html.modes.decode') }}
        </el-button>
        <el-button @click="clearAll">
          <el-icon><Delete /></el-icon>
          {{ t('common.clear') }}
        </el-button>
        <el-button @click="copyResult" v-if="result">
          <el-icon><CopyDocument /></el-icon>
          {{ t('common.copy') }}
        </el-button>
      </div>

      <!-- 输入输出区域 -->
      <div class="input-output-container">
        <!-- 输入区域 -->
        <div class="input-section">
          <div class="section-header">
            <span class="section-title">{{ t('common.input') }}HTML</span>
            <span class="char-count">{{ inputText.length }} {{ t('common.characters') }}</span>
          </div>
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="12"
            :placeholder="t('pages.html.inputPlaceholder')"
            class="code-editor"
          />
        </div>

        <!-- 输出区域 -->
        <div class="output-section">
          <div class="section-header">
            <span class="section-title">{{ t('common.output') }}{{ t('common.result') }}</span>
            <span class="char-count">{{ result.length }} {{ t('common.characters') }}</span>
          </div>
          <el-input
            v-model="result"
            type="textarea"
            :rows="12"
            readonly
            :placeholder="`${t('common.result')}...`"
            class="code-editor"
          />
        </div>
      </div>

      <!-- 结果信息 -->
      <div v-if="resultInfo" class="result-info">
        <div class="info-item">
          <strong>处理时间:</strong> {{ resultInfo.processTime }}ms
        </div>
      </div>

      <!-- HTML实体对照表 -->
      <div class="html-entities-table">
        <h3>常用HTML实体对照表</h3>
        <el-table :data="htmlEntitiesData" size="small" border>
          <el-table-column prop="char" label="字符" width="80" align="center" />
          <el-table-column prop="entity" label="实体编码" width="120" align="center" />
          <el-table-column prop="description" label="说明" />
        </el-table>
      </div>

      <!-- 使用说明 -->
      <div class="usage-tips">
        <el-alert
          title="使用说明"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p><strong>HTML编码:</strong> 将HTML特殊字符转换为实体编码，防止HTML解析错误</p>
            <p><strong>HTML解码:</strong> 将HTML实体编码还原为原始字符</p>
            <p><strong>应用场景:</strong> HTML内容显示、防XSS攻击、模板引擎处理</p>
            <p><strong>安全性:</strong> 编码可以防止恶意脚本注入，提高网站安全性</p>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  Connection,
  Lock,
  Unlock,
  Delete,
  CopyDocument
} from '@element-plus/icons-vue'
import { htmlTool, type ToolResponse } from '@/utils/localTools'

const { t } = useI18n()
const inputText = ref('')
const result = ref('')
const loading = ref(false)
const resultInfo = ref<ToolResponse | null>(null)

// HTML实体对照表数据
const htmlEntitiesData = ref([
  { char: '&', entity: '&amp;', description: '和号' },
  { char: '<', entity: '&lt;', description: '小于号' },
  { char: '>', entity: '&gt;', description: '大于号' },
  { char: '"', entity: '&quot;', description: '双引号' },
  { char: "'", entity: '&#39;', description: '单引号' },
  { char: ' ', entity: '&nbsp;', description: '不间断空格' },
  { char: '©', entity: '&copy;', description: '版权符号' },
  { char: '®', entity: '&reg;', description: '注册商标' },
  { char: '™', entity: '&trade;', description: '商标符号' },
  { char: '€', entity: '&euro;', description: '欧元符号' },
  { char: '¥', entity: '&yen;', description: '日元符号' },
  { char: '£', entity: '&pound;', description: '英镑符号' },
  { char: '°', entity: '&deg;', description: '度数符号' },
  { char: '±', entity: '&plusmn;', description: '正负号' },
  { char: '×', entity: '&times;', description: '乘号' },
  { char: '÷', entity: '&divide;', description: '除号' }
])

// HTML编码
const encodeHtml = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要编码的HTML文本')
    return
  }

  loading.value = true
  try {
    const response = htmlTool.encode(inputText.value.trim())
    
    if (response.success) {
      result.value = response.result
      resultInfo.value = response
      ElMessage.success('HTML编码成功')
    } else {
      ElMessage.error(response.error || 'HTML编码失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'HTML编码失败')
  } finally {
    loading.value = false
  }
}

// HTML解码
const decodeHtml = async () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入要解码的HTML实体')
    return
  }

  loading.value = true
  try {
    const response = htmlTool.decode(inputText.value.trim())
    
    if (response.success) {
      result.value = response.result
      resultInfo.value = response
      ElMessage.success('HTML解码成功')
    } else {
      ElMessage.error(response.error || 'HTML解码失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || 'HTML解码失败')
  } finally {
    loading.value = false
  }
}

// 清空所有内容
const clearAll = () => {
  inputText.value = ''
  result.value = ''
  resultInfo.value = null
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.html-tool {
  max-width: 1200px;
  margin: 0 auto;
}

.html-entities-table {
  margin-top: 20px;
}

.html-entities-table h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

.usage-tips {
  margin-top: 20px;
}

.usage-tips p {
  margin: 5px 0;
  line-height: 1.5;
}
</style>
