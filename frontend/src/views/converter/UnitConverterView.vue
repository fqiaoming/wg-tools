<template>
  <div class="unit-converter">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Operation /></el-icon>
        </div>
        <h1 class="hero-title">单位转换工具</h1>
        <p class="hero-description">强大的单位转换器，支持长度、重量、温度、时间等多种单位类型</p>
      </div>
    </div>

    <!-- 转换类型选择卡片 -->
    <div class="type-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h3>转换类型</h3>
        <div class="selector-description">选择要转换的单位类型</div>
      </div>
      
      <div class="selector-body">
        <div class="type-grid">
          <div 
            v-for="type in unitTypes" 
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

    <!-- 转换器卡片 -->
    <div class="converter-card">
      <div class="converter-header">
        <div class="converter-icon">
          <el-icon><Switch /></el-icon>
        </div>
        <h3>{{ getTypeName(selectedType) }}转换</h3>
        <div class="converter-description">输入数值进行单位转换</div>
      </div>
      
      <div class="converter-body">
        <div class="conversion-sections">
          <!-- 源单位 -->
          <div class="conversion-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><Edit /></el-icon>
              </div>
              <h4>转换前</h4>
            </div>
            
            <div class="input-group">
              <el-input
                v-model="inputValue"
                type="number"
                placeholder="请输入数值"
                size="large"
                class="value-input"
                @input="performConversion"
              />
              <el-select
                v-model="fromUnit"
                size="large"
                class="unit-select"
                @change="performConversion"
              >
                <el-option
                  v-for="unit in getCurrentUnits()"
                  :key="unit.value"
                  :label="unit.label"
                  :value="unit.value"
                />
              </el-select>
            </div>
          </div>

          <!-- 转换箭头 -->
          <div class="conversion-arrow">
            <el-button 
              @click="swapUnits"
              class="swap-btn"
              :disabled="!inputValue"
            >
              <el-icon><Switch /></el-icon>
            </el-button>
          </div>

          <!-- 目标单位 -->
          <div class="conversion-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><View /></el-icon>
              </div>
              <h4>转换后</h4>
            </div>
            
            <div class="input-group">
              <el-input
                v-model="outputValue"
                type="number"
                placeholder="转换结果"
                size="large"
                readonly
                class="value-input result-input"
              />
              <el-select
                v-model="toUnit"
                size="large"
                class="unit-select"
                @change="performConversion"
              >
                <el-option
                  v-for="unit in getCurrentUnits()"
                  :key="unit.value"
                  :label="unit.label"
                  :value="unit.value"
                />
              </el-select>
            </div>
          </div>
        </div>

        <!-- 快速转换 -->
        <div class="quick-conversion">
          <h4 class="quick-title">快速转换</h4>
          <div class="quick-grid">
            <div 
              v-for="conversion in getQuickConversions()" 
              :key="conversion.from + conversion.to"
              class="quick-item"
              @click="useQuickConversion(conversion)"
            >
              <div class="quick-from">{{ conversion.fromLabel }}</div>
              <el-icon class="quick-arrow"><Right /></el-icon>
              <div class="quick-to">{{ conversion.toLabel }}</div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
          <el-button 
            type="primary" 
            @click="copyResult"
            :disabled="!outputValue"
            class="copy-btn"
          >
            <el-icon><CopyDocument /></el-icon>
            复制结果
          </el-button>
          <el-button 
            @click="clearAll"
            class="clear-btn"
          >
            <el-icon><Delete /></el-icon>
            清空数据
          </el-button>
          <el-button 
            @click="addToHistory"
            :disabled="!inputValue || !outputValue"
            class="history-btn"
          >
            <el-icon><Plus /></el-icon>
            保存记录
          </el-button>
        </div>
      </div>
    </div>

    <!-- 转换历史卡片 -->
    <div v-if="conversionHistory.length > 0" class="history-card">
      <div class="history-header">
        <div class="history-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <h3>转换历史</h3>
        <div class="history-description">最近的转换记录</div>
      </div>
      
      <div class="history-body">
        <div class="history-list">
          <div 
            v-for="(record, index) in conversionHistory" 
            :key="index"
            class="history-item"
          >
            <div class="history-content">
              <div class="history-conversion">
                <span class="history-value">{{ record.inputValue }}</span>
                <span class="history-unit">{{ record.fromUnit }}</span>
                <el-icon class="history-arrow"><Right /></el-icon>
                <span class="history-value">{{ record.outputValue }}</span>
                <span class="history-unit">{{ record.toUnit }}</span>
              </div>
              <div class="history-type">{{ record.typeName }}</div>
            </div>
            <div class="history-actions">
              <el-button 
                size="small" 
                @click="useHistoryRecord(record)"
                class="use-btn"
              >
                使用
              </el-button>
              <el-button 
                size="small" 
                @click="removeHistoryRecord(index)"
                class="remove-btn"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="history-actions-global">
          <el-button 
            @click="clearHistory"
            class="clear-history-btn"
          >
            <el-icon><Delete /></el-icon>
            清空历史
          </el-button>
          <el-button 
            @click="exportHistory"
            class="export-history-btn"
          >
            <el-icon><Download /></el-icon>
            导出历史
          </el-button>
        </div>
      </div>
    </div>

    <!-- 使用说明卡片 -->
    <div class="usage-card">
      <div class="usage-header">
        <div class="usage-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>支持的单位类型</h3>
        <div class="usage-description">详细的单位转换说明</div>
      </div>
      <div class="usage-body">
        <div class="unit-categories">
          <div 
            v-for="type in unitTypes" 
            :key="type.value"
            class="category-section"
          >
            <h4 class="category-title">
              <span class="category-icon">{{ type.icon }}</span>
              {{ type.name }}
            </h4>
            <div class="category-description">{{ type.description }}</div>
            <div class="category-units">
              <div class="units-grid">
                <span 
                  v-for="unit in getUnitsForType(type.value)" 
                  :key="unit.value"
                  class="unit-tag"
                >
                  {{ unit.label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Operation,
  Grid,
  Switch,
  Edit,
  View,
  Right,
  CopyDocument,
  Delete,
  Plus,
  Clock,
  Download,
  InfoFilled
} from '@element-plus/icons-vue'
import { unitTool, type ToolResponse } from '../../utils/newTools'

const selectedType = ref('length')
const inputValue = ref('')
const outputValue = ref('')
const fromUnit = ref('m')
const toUnit = ref('km')
const conversionHistory = ref<any[]>([])

// 单位类型定义
const unitTypes = [
  { value: 'length', name: '长度', icon: '📏', description: '米、千米、英尺、英寸等' },
  { value: 'weight', name: '重量', icon: '⚖️', description: '千克、克、磅、盎司等' },
  { value: 'temperature', name: '温度', icon: '🌡️', description: '摄氏度、华氏度、开尔文等' },
  { value: 'area', name: '面积', icon: '⬜', description: '平方米、公顷、英亩等' },
  { value: 'volume', name: '体积', icon: '🧊', description: '升、毫升、加仑等' },
  { value: 'time', name: '时间', icon: '⏰', description: '秒、分钟、小时、天等' },
  { value: 'speed', name: '速度', icon: '🚗', description: '米/秒、公里/小时等' },
  { value: 'energy', name: '能量', icon: '⚡', description: '焦耳、卡路里、千瓦时等' }
]

// 单位定义
const units = {
  length: [
    { value: 'mm', label: '毫米 (mm)' },
    { value: 'cm', label: '厘米 (cm)' },
    { value: 'm', label: '米 (m)' },
    { value: 'km', label: '千米 (km)' },
    { value: 'in', label: '英寸 (in)' },
    { value: 'ft', label: '英尺 (ft)' },
    { value: 'yd', label: '码 (yd)' },
    { value: 'mi', label: '英里 (mi)' }
  ],
  weight: [
    { value: 'mg', label: '毫克 (mg)' },
    { value: 'g', label: '克 (g)' },
    { value: 'kg', label: '千克 (kg)' },
    { value: 't', label: '吨 (t)' },
    { value: 'oz', label: '盎司 (oz)' },
    { value: 'lb', label: '磅 (lb)' },
    { value: 'st', label: '英石 (st)' }
  ],
  temperature: [
    { value: 'c', label: '摄氏度 (°C)' },
    { value: 'f', label: '华氏度 (°F)' },
    { value: 'k', label: '开尔文 (K)' },
    { value: 'r', label: '兰氏度 (°R)' }
  ],
  area: [
    { value: 'mm2', label: '平方毫米 (mm²)' },
    { value: 'cm2', label: '平方厘米 (cm²)' },
    { value: 'm2', label: '平方米 (m²)' },
    { value: 'km2', label: '平方千米 (km²)' },
    { value: 'in2', label: '平方英寸 (in²)' },
    { value: 'ft2', label: '平方英尺 (ft²)' },
    { value: 'ac', label: '英亩 (ac)' },
    { value: 'ha', label: '公顷 (ha)' }
  ],
  volume: [
    { value: 'ml', label: '毫升 (ml)' },
    { value: 'l', label: '升 (l)' },
    { value: 'm3', label: '立方米 (m³)' },
    { value: 'in3', label: '立方英寸 (in³)' },
    { value: 'ft3', label: '立方英尺 (ft³)' },
    { value: 'gal', label: '加仑 (gal)' },
    { value: 'qt', label: '夸脱 (qt)' }
  ],
  time: [
    { value: 'ms', label: '毫秒 (ms)' },
    { value: 's', label: '秒 (s)' },
    { value: 'min', label: '分钟 (min)' },
    { value: 'h', label: '小时 (h)' },
    { value: 'd', label: '天 (d)' },
    { value: 'w', label: '周 (w)' },
    { value: 'mo', label: '月 (mo)' },
    { value: 'y', label: '年 (y)' }
  ],
  speed: [
    { value: 'mps', label: '米/秒 (m/s)' },
    { value: 'kmh', label: '公里/小时 (km/h)' },
    { value: 'mph', label: '英里/小时 (mph)' },
    { value: 'fps', label: '英尺/秒 (ft/s)' },
    { value: 'knot', label: '节 (knot)' }
  ],
  energy: [
    { value: 'j', label: '焦耳 (J)' },
    { value: 'kj', label: '千焦 (kJ)' },
    { value: 'cal', label: '卡路里 (cal)' },
    { value: 'kcal', label: '千卡 (kcal)' },
    { value: 'wh', label: '瓦时 (Wh)' },
    { value: 'kwh', label: '千瓦时 (kWh)' },
    { value: 'btu', label: '英热单位 (BTU)' }
  ]
}

// 选择类型
const selectType = (type: string) => {
  selectedType.value = type
  const typeUnits = units[type as keyof typeof units]
  if (typeUnits && typeUnits.length >= 2) {
    fromUnit.value = typeUnits[0].value
    toUnit.value = typeUnits[1].value
  }
  inputValue.value = ''
  outputValue.value = ''
}

// 获取类型名称
const getTypeName = (type: string) => {
  const unitType = unitTypes.find(t => t.value === type)
  return unitType ? unitType.name : '单位'
}

// 获取当前单位列表
const getCurrentUnits = () => {
  return units[selectedType.value as keyof typeof units] || []
}

// 获取指定类型的单位
const getUnitsForType = (type: string) => {
  return units[type as keyof typeof units] || []
}

// 获取快速转换选项
const getQuickConversions = () => {
  const quickConversions = {
    length: [
      { from: 'm', to: 'km', fromLabel: '米', toLabel: '千米' },
      { from: 'cm', to: 'in', fromLabel: '厘米', toLabel: '英寸' },
      { from: 'ft', to: 'm', fromLabel: '英尺', toLabel: '米' },
      { from: 'mi', to: 'km', fromLabel: '英里', toLabel: '千米' }
    ],
    weight: [
      { from: 'kg', to: 'lb', fromLabel: '千克', toLabel: '磅' },
      { from: 'g', to: 'oz', fromLabel: '克', toLabel: '盎司' },
      { from: 't', to: 'kg', fromLabel: '吨', toLabel: '千克' },
      { from: 'lb', to: 'kg', fromLabel: '磅', toLabel: '千克' }
    ],
    temperature: [
      { from: 'c', to: 'f', fromLabel: '摄氏度', toLabel: '华氏度' },
      { from: 'f', to: 'c', fromLabel: '华氏度', toLabel: '摄氏度' },
      { from: 'c', to: 'k', fromLabel: '摄氏度', toLabel: '开尔文' },
      { from: 'k', to: 'c', fromLabel: '开尔文', toLabel: '摄氏度' }
    ],
    time: [
      { from: 'h', to: 'min', fromLabel: '小时', toLabel: '分钟' },
      { from: 'min', to: 's', fromLabel: '分钟', toLabel: '秒' },
      { from: 'd', to: 'h', fromLabel: '天', toLabel: '小时' },
      { from: 'w', to: 'd', fromLabel: '周', toLabel: '天' }
    ]
  }
  
  return quickConversions[selectedType.value as keyof typeof quickConversions] || []
}

// 使用快速转换
const useQuickConversion = (conversion: any) => {
  fromUnit.value = conversion.from
  toUnit.value = conversion.to
  if (inputValue.value) {
    performConversion()
  } else {
    inputValue.value = '1'
    performConversion()
  }
}

// 执行转换
const performConversion = async () => {
  if (!inputValue.value || !fromUnit.value || !toUnit.value) {
    outputValue.value = ''
    return
  }

  try {
    const response: ToolResponse = await unitTool.convert(
      parseFloat(inputValue.value),
      fromUnit.value,
      toUnit.value,
      selectedType.value
    )
    
    if (response.success) {
      outputValue.value = parseFloat(response.result).toFixed(6).replace(/\.?0+$/, '')
    } else {
      outputValue.value = ''
      ElMessage.error(response.error || '转换失败')
    }
  } catch (error) {
    outputValue.value = ''
    ElMessage.error('转换失败，请检查输入')
  }
}

// 交换单位
const swapUnits = () => {
  const temp = fromUnit.value
  fromUnit.value = toUnit.value
  toUnit.value = temp
  
  const tempValue = inputValue.value
  inputValue.value = outputValue.value
  outputValue.value = tempValue
  
  if (inputValue.value) {
    performConversion()
  }
}

// 复制结果
const copyResult = async () => {
  if (!outputValue.value) {
    ElMessage.warning('没有结果可复制')
    return
  }

  const fromUnitLabel = getCurrentUnits().find(u => u.value === fromUnit.value)?.label || fromUnit.value
  const toUnitLabel = getCurrentUnits().find(u => u.value === toUnit.value)?.label || toUnit.value
  
  const result = `${inputValue.value} ${fromUnitLabel} = ${outputValue.value} ${toUnitLabel}`
  
  try {
    await navigator.clipboard.writeText(result)
    ElMessage.success('转换结果已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 清空数据
const clearAll = () => {
  inputValue.value = ''
  outputValue.value = ''
  ElMessage.info('已清空数据')
}

// 添加到历史
const addToHistory = () => {
  if (!inputValue.value || !outputValue.value) {
    ElMessage.warning('没有转换结果可保存')
    return
  }

  const fromUnitLabel = getCurrentUnits().find(u => u.value === fromUnit.value)?.label || fromUnit.value
  const toUnitLabel = getCurrentUnits().find(u => u.value === toUnit.value)?.label || toUnit.value
  const typeName = getTypeName(selectedType.value)

  const record = {
    inputValue: inputValue.value,
    outputValue: outputValue.value,
    fromUnit: fromUnitLabel,
    toUnit: toUnitLabel,
    fromUnitValue: fromUnit.value,
    toUnitValue: toUnit.value,
    type: selectedType.value,
    typeName,
    timestamp: new Date().toLocaleString()
  }

  conversionHistory.value.unshift(record)
  
  // 限制历史记录数量
  if (conversionHistory.value.length > 20) {
    conversionHistory.value = conversionHistory.value.slice(0, 20)
  }

  ElMessage.success('已添加到转换历史')
}

// 使用历史记录
const useHistoryRecord = (record: any) => {
  selectedType.value = record.type
  fromUnit.value = record.fromUnitValue
  toUnit.value = record.toUnitValue
  inputValue.value = record.inputValue
  outputValue.value = record.outputValue
  ElMessage.info('已应用历史记录')
}

// 删除历史记录
const removeHistoryRecord = (index: number) => {
  conversionHistory.value.splice(index, 1)
  ElMessage.info('已删除历史记录')
}

// 清空历史
const clearHistory = () => {
  conversionHistory.value = []
  ElMessage.info('已清空转换历史')
}

// 导出历史
const exportHistory = () => {
  if (conversionHistory.value.length === 0) {
    ElMessage.warning('没有历史记录可导出')
    return
  }

  const data = {
    exportTime: new Date().toLocaleString(),
    totalRecords: conversionHistory.value.length,
    records: conversionHistory.value
  }

  const content = JSON.stringify(data, null, 2)
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'unit-conversion-history.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('转换历史已导出！')
}

// 初始化
selectType('length')
</script>

<style scoped>
.unit-converter {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #3b82f6;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
.converter-card,
.history-card,
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
.converter-header,
.history-header,
.usage-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.selector-icon,
.converter-icon,
.history-icon,
.usage-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.selector-header h3,
.converter-header h3,
.history-header h3,
.usage-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.selector-description,
.converter-description,
.history-description,
.usage-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 类型选择 */
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
  background: #eff6ff;
  transform: translateY(-2px);
}

.type-item.active {
  border-color: var(--primary-color);
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

/* 转换器 */
.conversion-sections {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 24px;
}

.conversion-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 16px;
  color: var(--primary-color);
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.input-group {
  display: flex;
  gap: 12px;
}

.value-input {
  flex: 1;
}

.value-input :deep(.el-input__wrapper) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
}

.result-input :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  color: var(--primary-color);
  font-weight: 600;
}

.unit-select {
  min-width: 160px;
}

.conversion-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.swap-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--primary-color);
  background: white;
  color: var(--primary-color);
  font-size: 18px;
  transition: all 0.3s ease;
}

.swap-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  transform: rotate(180deg);
}

/* 快速转换 */
.quick-conversion {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.quick-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.quick-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-item:hover {
  border-color: var(--primary-color);
  background: #eff6ff;
  transform: translateY(-1px);
}

.quick-from,
.quick-to {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.quick-arrow {
  color: var(--primary-color);
  font-size: 16px;
}

/* 操作按钮 */
.action-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.copy-btn,
.clear-btn,
.history-btn {
  min-width: 120px;
}

/* 历史记录 */
.history-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-content {
  flex: 1;
}

.history-conversion {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.history-value {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.history-unit {
  font-size: 12px;
  color: #6b7280;
}

.history-arrow {
  color: var(--primary-color);
  font-size: 14px;
}

.history-type {
  font-size: 12px;
  color: #6b7280;
}

.history-actions {
  display: flex;
  gap: 8px;
}

.use-btn,
.remove-btn {
  font-size: 12px;
  padding: 4px 8px;
}

.history-actions-global {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.clear-history-btn,
.export-history-btn {
  min-width: 120px;
}

/* 使用说明 */
.unit-categories {
  display: grid;
  gap: 24px;
}

.category-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.category-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 20px;
}

.category-description {
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

.units-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.unit-tag {
  padding: 4px 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .unit-converter {
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
  .converter-card,
  .history-card,
  .usage-card {
    padding: 20px 16px;
  }
  
  .type-grid {
    grid-template-columns: 1fr;
  }
  
  .conversion-sections {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .conversion-arrow {
    transform: rotate(90deg);
  }
  
  .input-group {
    flex-direction: column;
    gap: 8px;
  }
  
  .quick-grid {
    grid-template-columns: 1fr;
  }
  
  .action-section,
  .history-actions-global {
    flex-direction: column;
    gap: 8px;
  }
  
  .copy-btn,
  .clear-btn,
  .history-btn,
  .clear-history-btn,
  .export-history-btn {
    width: 100%;
  }
  
  .history-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .history-actions {
    justify-content: center;
  }
  
  .units-grid {
    flex-direction: column;
    gap: 4px;
  }
  
  .unit-tag {
    text-align: center;
  }
}
</style>