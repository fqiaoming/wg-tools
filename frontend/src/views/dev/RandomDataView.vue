<template>
  <div class="random-data-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Coin /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.randomData') }}</h1>
        <p class="hero-description">{{ t('pages.randomData.description') }}</p>
      </div>
    </div>

    <!-- 数据类型选择卡片 -->
    <div class="type-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h3>{{ t('pages.randomData.dataType') }}</h3>
        <div class="selector-description">{{ t('pages.randomData.selectType') }}</div>
      </div>
      
      <div class="selector-body">
        <div class="type-grid">
          <div 
            v-for="type in dataTypes" 
            :key="type.value"
            class="type-item"
            :class="{ active: selectedType === type.value }"
            @click="selectType(type.value)"
          >
            <div class="type-icon">{{ type.icon }}</div>
            <div class="type-name">{{ type.name }}</div>
            <div class="type-description">{{ type.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置选项卡片 -->
    <div class="config-card">
      <div class="config-header">
        <div class="config-icon">
          <el-icon><Setting /></el-icon>
        </div>
        <h3>生成配置</h3>
        <div class="config-description">自定义数据生成参数</div>
      </div>
      
      <div class="config-body">
        <!-- 基础配置 -->
        <div class="basic-config">
          <div class="config-item">
            <label class="config-label">生成数量</label>
            <el-input-number
              v-model="generateConfig.count"
              :min="1"
              :max="1000"
              size="large"
              class="count-input"
            />
            <span class="config-note">最多可生成1000条数据</span>
          </div>
          
          <div class="config-item">
            <label class="config-label">输出格式</label>
            <el-radio-group v-model="generateConfig.format" size="large">
              <el-radio-button label="json">JSON</el-radio-button>
              <el-radio-button label="csv">CSV</el-radio-button>
              <el-radio-button label="text">文本</el-radio-button>
              <el-radio-button label="sql">SQL</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <!-- 特定类型配置 -->
        <div class="specific-config" v-if="getTypeConfig(selectedType)">
          <h4 class="config-section-title">{{ getTypeName(selectedType) }}配置</h4>
          <div class="type-config-grid">
            <!-- 姓名配置 -->
            <template v-if="selectedType === 'name'">
              <div class="config-item">
                <label class="config-label">姓名类型</label>
                <el-radio-group v-model="typeConfigs.name.type">
                  <el-radio-button label="chinese">中文姓名</el-radio-button>
                  <el-radio-button label="english">英文姓名</el-radio-button>
                  <el-radio-button label="mixed">混合姓名</el-radio-button>
                </el-radio-group>
              </div>
              <div class="config-item">
                <el-checkbox v-model="typeConfigs.name.includeGender">包含性别</el-checkbox>
              </div>
            </template>

            <!-- 手机号配置 -->
            <template v-if="selectedType === 'phone'">
              <div class="config-item">
                <label class="config-label">号码类型</label>
                <el-checkbox-group v-model="typeConfigs.phone.types">
                  <el-checkbox label="mobile">手机号</el-checkbox>
                  <el-checkbox label="landline">座机号</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="config-item">
                <label class="config-label">地区</label>
                <el-select v-model="typeConfigs.phone.region" placeholder="选择地区">
                  <el-option label="全国" value="all" />
                  <el-option label="北京" value="beijing" />
                  <el-option label="上海" value="shanghai" />
                  <el-option label="广东" value="guangdong" />
                  <el-option label="浙江" value="zhejiang" />
                </el-select>
              </div>
            </template>

            <!-- 邮箱配置 -->
            <template v-if="selectedType === 'email'">
              <div class="config-item">
                <label class="config-label">邮箱域名</label>
                <el-checkbox-group v-model="typeConfigs.email.domains">
                  <el-checkbox label="gmail.com">Gmail</el-checkbox>
                  <el-checkbox label="163.com">网易</el-checkbox>
                  <el-checkbox label="qq.com">QQ邮箱</el-checkbox>
                  <el-checkbox label="hotmail.com">Hotmail</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>

            <!-- 数字配置 -->
            <template v-if="selectedType === 'number'">
              <div class="config-item">
                <label class="config-label">数字范围</label>
                <div class="range-inputs">
                  <el-input-number 
                    v-model="typeConfigs.number.min" 
                    placeholder="最小值"
                    size="large"
                  />
                  <span class="range-separator">到</span>
                  <el-input-number 
                    v-model="typeConfigs.number.max" 
                    placeholder="最大值"
                    size="large"
                  />
                </div>
              </div>
              <div class="config-item">
                <el-checkbox v-model="typeConfigs.number.decimal">包含小数</el-checkbox>
                <el-input-number 
                  v-if="typeConfigs.number.decimal"
                  v-model="typeConfigs.number.precision"
                  :min="1"
                  :max="10"
                  placeholder="小数位数"
                  size="small"
                  style="margin-left: 12px; width: 120px;"
                />
              </div>
            </template>

            <!-- 地址配置 -->
            <template v-if="selectedType === 'address'">
              <div class="config-item">
                <label class="config-label">地址类型</label>
                <el-checkbox-group v-model="typeConfigs.address.types">
                  <el-checkbox label="province">省份</el-checkbox>
                  <el-checkbox label="city">城市</el-checkbox>
                  <el-checkbox label="district">区县</el-checkbox>
                  <el-checkbox label="street">街道</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>

            <!-- 日期配置 -->
            <template v-if="selectedType === 'date'">
              <div class="config-item">
                <label class="config-label">日期范围</label>
                <el-date-picker
                  v-model="typeConfigs.date.range"
                  type="daterange"
                  range-separator="到"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="large"
                />
              </div>
              <div class="config-item">
                <label class="config-label">日期格式</label>
                <el-select v-model="typeConfigs.date.format" placeholder="选择格式">
                  <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                  <el-option label="YYYY/MM/DD" value="YYYY/MM/DD" />
                  <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
                  <el-option label="DD-MM-YYYY" value="DD-MM-YYYY" />
                  <el-option label="YYYY-MM-DD HH:mm:ss" value="YYYY-MM-DD HH:mm:ss" />
                </el-select>
              </div>
            </template>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="generateData"
            :loading="loading"
            class="generate-button"
          >
            <el-icon><MagicStick /></el-icon>
            生成数据
          </el-button>
          <el-button 
            size="large" 
            @click="generatePreview"
            class="preview-button"
          >
            <el-icon><View /></el-icon>
            预览示例
          </el-button>
          <el-button 
            size="large" 
            @click="clearResults"
            class="clear-button"
          >
            <el-icon><Delete /></el-icon>
            清空结果
          </el-button>
        </div>
      </div>
    </div>

    <!-- 生成结果卡片 -->
    <div v-if="generatedData" class="result-card">
      <div class="result-header">
        <div class="result-icon">
          <el-icon><DataBoard /></el-icon>
        </div>
        <h3>生成结果</h3>
        <div class="result-info">
          已生成 {{ generateConfig.count }} 条{{ getTypeName(selectedType) }}数据
        </div>
      </div>
      
      <div class="result-body">
        <div class="result-actions">
          <el-button 
            type="primary" 
            @click="copyResults"
            class="action-btn"
          >
            <el-icon><CopyDocument /></el-icon>
            复制数据
          </el-button>
          <el-button 
            @click="downloadResults"
            class="action-btn"
          >
            <el-icon><Download /></el-icon>
            下载文件
          </el-button>
          <el-button 
            @click="regenerateData"
            class="action-btn"
          >
            <el-icon><Refresh /></el-icon>
            重新生成
          </el-button>
        </div>

        <div class="result-display">
          <div class="result-content">
            <pre class="data-output">{{ generatedData }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 使用说明卡片 -->
    <div class="usage-card">
      <div class="usage-header">
        <div class="usage-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>功能说明</h3>
        <div class="usage-description">随机数据生成器的使用指南</div>
      </div>
      <div class="usage-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🎲</div>
            <h4>多种数据类型</h4>
            <p>支持姓名、手机号、邮箱、地址、日期等多种数据类型</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚙️</div>
            <h4>灵活配置</h4>
            <p>每种数据类型都有详细的配置选项，满足不同需求</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>多种格式</h4>
            <p>支持JSON、CSV、文本、SQL等多种输出格式</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📦</div>
            <h4>批量生成</h4>
            <p>一次可生成多达1000条测试数据</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🇨🇳</div>
            <h4>本土化支持</h4>
            <p>支持中文姓名、中国手机号、地址等本土化数据</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>便捷导出</h4>
            <p>支持复制到剪贴板或下载为文件</p>
          </div>
        </div>

        <div class="use-cases-section">
          <h4 class="cases-title">应用场景：</h4>
          <div class="cases-grid">
            <div class="case-item">
              <span class="case-icon">🧪</span>
              <span class="case-text">软件测试 - 生成测试用例数据</span>
            </div>
            <div class="case-item">
              <span class="case-icon">🗄️</span>
              <span class="case-text">数据库填充 - 创建示例数据</span>
            </div>
            <div class="case-item">
              <span class="case-icon">🎨</span>
              <span class="case-text">UI设计 - 制作设计原型数据</span>
            </div>
            <div class="case-item">
              <span class="case-icon">📈</span>
              <span class="case-text">数据分析 - 生成模拟数据集</span>
            </div>
            <div class="case-item">
              <span class="case-icon">🏫</span>
              <span class="case-text">教学演示 - 准备教学示例</span>
            </div>
            <div class="case-item">
              <span class="case-icon">🔧</span>
              <span class="case-text">系统调试 - 模拟真实数据</span>
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
  Coin,
  Grid,
  Setting,
  MagicStick,
  View,
  Delete,
  DataBoard,
  CopyDocument,
  Download,
  Refresh,
  InfoFilled
} from '@element-plus/icons-vue'
import { randomDataTool, type ToolResponse } from '../../utils/newTools'

const { t } = useI18n()
const loading = ref(false)
const selectedType = ref('name')
const generatedData = ref('')

// 数据类型定义
const dataTypes = [
  { value: 'name', name: '姓名', icon: '👤', description: '中英文姓名' },
  { value: 'phone', name: '手机号', icon: '📱', description: '中国手机号码' },
  { value: 'email', name: '邮箱', icon: '📧', description: '电子邮箱地址' },
  { value: 'address', name: '地址', icon: '🏠', description: '中国地址信息' },
  { value: 'date', name: '日期', icon: '📅', description: '日期时间' },
  { value: 'number', name: '数字', icon: '🔢', description: '随机数字' },
  { value: 'text', name: '文本', icon: '📝', description: '随机文本内容' },
  { value: 'uuid', name: 'UUID', icon: '🆔', description: '唯一标识符' },
  { value: 'color', name: '颜色', icon: '🎨', description: '颜色代码' },
  { value: 'url', name: '网址', icon: '🌐', description: 'URL地址' }
]

// 生成配置
const generateConfig = reactive({
  count: 10,
  format: 'json'
})

// 各类型特定配置
const typeConfigs = reactive({
  name: {
    type: 'chinese',
    includeGender: false
  },
  phone: {
    types: ['mobile'],
    region: 'all'
  },
  email: {
    domains: ['gmail.com', '163.com', 'qq.com']
  },
  number: {
    min: 1,
    max: 100,
    decimal: false,
    precision: 2
  },
  address: {
    types: ['province', 'city', 'district']
  },
  date: {
    range: [new Date('2020-01-01'), new Date()] as [Date, Date],
    format: 'YYYY-MM-DD'
  }
})

// 选择数据类型
const selectType = (type: string) => {
  selectedType.value = type
  generatedData.value = ''
}

// 获取类型名称
const getTypeName = (type: string) => {
  const dataType = dataTypes.find(t => t.value === type)
  return dataType ? dataType.name : '数据'
}

// 获取类型配置
const getTypeConfig = (type: string) => {
  return typeConfigs[type as keyof typeof typeConfigs]
}

// 生成数据
const generateData = async () => {
  loading.value = true
  
  try {
    let response: ToolResponse
    
    // 根据类型调用不同的生成方法
    switch (selectedType.value) {
      case 'name':
        response = await randomDataTool.generateName(
          typeConfigs.name.type,
          generateConfig.count
        )
        break
      case 'email':
        response = await randomDataTool.generateEmail(generateConfig.count)
        break
      case 'phone':
        response = await randomDataTool.generatePhone('china', generateConfig.count)
        break
      case 'address':
        response = await randomDataTool.generateAddress(generateConfig.count)
        break
      case 'date':
        response = await randomDataTool.generateDate(
          generateConfig.count,
          typeConfigs.date.range ? typeConfigs.date.range[0] : undefined,
          typeConfigs.date.range ? typeConfigs.date.range[1] : undefined,
          typeConfigs.date.format
        )
        break
      case 'number':
        response = await randomDataTool.generateNumber(
          generateConfig.count,
          typeConfigs.number.min,
          typeConfigs.number.max,
          typeConfigs.number.decimal,
          typeConfigs.number.precision
        )
        break
      case 'text':
        response = await randomDataTool.generateText(generateConfig.count, 10)
        break
      case 'uuid':
        response = await randomDataTool.generateUUID(generateConfig.count)
        break
      case 'color':
        response = await randomDataTool.generateColor(generateConfig.count, 'hex')
        break
      case 'url':
        response = await randomDataTool.generateURL(generateConfig.count)
        break
      default:
        response = await randomDataTool.generateName('chinese', generateConfig.count)
    }
    
    if (response.success) {
      generatedData.value = response.result
      ElMessage.success(`成功生成 ${generateConfig.count} 条${getTypeName(selectedType.value)}数据！`)
    } else {
      ElMessage.error(response.error || '生成失败')
    }
  } catch (error) {
    ElMessage.error('生成失败，请重试')
    console.error('随机数据生成错误:', error)
  } finally {
    loading.value = false
  }
}

// 生成预览
const generatePreview = async () => {
  const originalCount = generateConfig.count
  generateConfig.count = 3
  
  await generateData()
  
  generateConfig.count = originalCount
  ElMessage.info('已生成3条预览数据')
}

// 重新生成
const regenerateData = () => {
  generateData()
}

// 清空结果
const clearResults = () => {
  generatedData.value = ''
  ElMessage.info('已清空生成结果')
}

// 复制结果
const copyResults = async () => {
  if (!generatedData.value) {
    ElMessage.warning('没有数据可复制')
    return
  }

  try {
    await navigator.clipboard.writeText(generatedData.value)
    ElMessage.success('数据已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 下载结果
const downloadResults = () => {
  if (!generatedData.value) {
    ElMessage.warning('没有数据可下载')
    return
  }

  try {
    const formatExtensions = {
      json: 'json',
      csv: 'csv',
      text: 'txt',
      sql: 'sql'
    }
    
    const formatMimeTypes = {
      json: 'application/json',
      csv: 'text/csv',
      text: 'text/plain',
      sql: 'text/plain'
    }
    
    const extension = formatExtensions[generateConfig.format as keyof typeof formatExtensions]
    const mimeType = formatMimeTypes[generateConfig.format as keyof typeof formatMimeTypes]
    
    const blob = new Blob([generatedData.value], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `random-${selectedType.value}-data.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('文件下载成功！')
  } catch (error) {
    ElMessage.error('下载失败')
    console.error('下载错误:', error)
  }
}
</script>

<style scoped>
.random-data-tool {
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
.type-selector-card,
.config-card,
.result-card,
.usage-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

/* 卡片头部 */
.selector-header,
.config-header,
.result-header,
.usage-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.selector-icon,
.config-icon,
.result-icon,
.usage-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.selector-header h3,
.config-header h3,
.result-header h3,
.usage-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.selector-description,
.config-description,
.result-info,
.usage-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 数据类型选择 */
.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.type-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-item:hover {
  border-color: var(--primary-color);
  background: #fefbf2;
  transform: translateY(-2px);
}

.type-item.active {
  border-color: var(--primary-color);
  background: #fefbf2;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.type-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.type-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.type-description {
  font-size: 12px;
  color: #6b7280;
}

/* 配置选项 */
.basic-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.count-input {
  width: 200px;
}

.config-note {
  font-size: 12px;
  color: #6b7280;
}

/* 特定类型配置 */
.specific-config {
  margin-bottom: 24px;
}

.config-section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color);
  display: inline-block;
}

.type-config-grid {
  display: grid;
  gap: 16px;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-separator {
  font-size: 14px;
  color: #6b7280;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.generate-button {
  min-width: 140px;
}

.preview-button,
.clear-button {
  min-width: 120px;
}

/* 结果展示 */
.result-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  min-width: 120px;
}

.result-display {
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
}

.data-output {
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 功能特色 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.feature-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-item h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.feature-item p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 应用场景 */
.use-cases-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.cases-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.case-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.case-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.case-icon {
  font-size: 18px;
}

.case-text {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .random-data-tool {
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
  
  .type-selector-card,
  .config-card,
  .result-card,
  .usage-card {
    padding: 20px 16px;
  }
  
  .type-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .basic-config {
    grid-template-columns: 1fr;
  }
  
  .action-section,
  .result-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .generate-button,
  .preview-button,
  .clear-button,
  .action-btn {
    width: 100%;
  }
  
  .feature-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }
  
  .count-input {
    width: 100%;
  }
  
  .range-inputs {
    flex-direction: column;
    gap: 8px;
  }
  
  .selector-header,
  .config-header,
  .result-header,
  .usage-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .selector-description,
  .config-description,
  .result-info,
  .usage-description {
    margin-left: 0;
  }
}
</style>