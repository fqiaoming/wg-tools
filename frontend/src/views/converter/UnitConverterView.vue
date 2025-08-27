<template>
  <div class="unit-converter">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Operation /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('pages.unitConverter.title') }}</h1>
        <p class="hero-description">{{ t('pages.unitConverter.description') }}</p>
      </div>
    </div>

    <!-- 转换类型选择卡片 -->
    <div class="type-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h3>{{ t('pages.unitConverter.typeSelection') }}</h3>
        <div class="selector-description">{{ t('pages.unitConverter.selectTypeDescription') }}</div>
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
            <div class="type-name">{{ t(`pages.unitConverter.types.${type.value}.name`) }}</div>
            <div class="type-description">{{ t(`pages.unitConverter.types.${type.value}.description`) }}</div>
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
        <h3>{{ t(`pages.unitConverter.types.${selectedType}.name`) }} {{ t('pages.unitConverter.conversion') }}</h3>
        <div class="converter-description">{{ t('pages.unitConverter.conversionDescription') }}</div>
      </div>
      
      <div class="converter-body">
        <div class="conversion-sections">
          <!-- 源单位 -->
          <div class="conversion-section">
            <div class="section-header">
              <div class="section-icon">
                <el-icon><Edit /></el-icon>
              </div>
              <h4>{{ t('pages.unitConverter.inputValue') }}</h4>
            </div>
            
            <div class="input-group">
              <el-input
                v-model="inputValue"
                type="number"
                :placeholder="t('pages.unitConverter.inputPlaceholder')"
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
              <h4>{{ t('pages.unitConverter.outputValue') }}</h4>
            </div>
            
            <div class="input-group">
              <el-input
                v-model="outputValue"
                type="number"
                :placeholder="t('pages.unitConverter.outputPlaceholder')"
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
          <h4 class="quick-title">{{ t('pages.unitConverter.quickConversion') }}</h4>
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
            {{ t('pages.unitConverter.copyResult') }}
          </el-button>
          <el-button 
            @click="clearAll"
            class="clear-btn"
          >
            <el-icon><Delete /></el-icon>
            {{ t('pages.unitConverter.clearData') }}
          </el-button>
          <el-button 
            @click="addToHistory"
            :disabled="!inputValue || !outputValue"
            class="history-btn"
          >
            <el-icon><Plus /></el-icon>
            {{ t('pages.unitConverter.saveRecord') }}
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
        <h3>{{ t('pages.unitConverter.conversionHistory') }}</h3>
        <div class="history-description">{{ t('pages.unitConverter.historyDescription') }}</div>
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
                {{ t('pages.unitConverter.use') }}
              </el-button>
              <el-button 
                size="small" 
                @click="removeHistoryRecord(index)"
                class="remove-btn"
              >
                {{ t('pages.unitConverter.delete') }}
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
            {{ t('pages.unitConverter.clearHistory') }}
          </el-button>
          <el-button 
            @click="exportHistory"
            class="export-history-btn"
          >
            <el-icon><Download /></el-icon>
            {{ t('pages.unitConverter.exportHistory') }}
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
        <h3>{{ t('pages.unitConverter.supportedTypes') }}</h3>
        <div class="usage-description">{{ t('pages.unitConverter.usageDescription') }}</div>
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
              {{ t(`pages.unitConverter.types.${type.value}.name`) }}
            </h4>
            <div class="category-description">{{ t(`pages.unitConverter.types.${type.value}.description`) }}</div>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const selectedType = ref('length')
const inputValue = ref('')
const outputValue = ref('')
const fromUnit = ref('m')
const toUnit = ref('km')
const conversionHistory = ref<any[]>([])

// 单位类型定义
const unitTypes = [
  { value: 'length', icon: '📏' },
  { value: 'weight', icon: '⚖️' },
  { value: 'temperature', icon: '🌡️' },
  { value: 'area', icon: '⬜' },
  { value: 'volume', icon: '🧊' },
  { value: 'time', icon: '⏰' },
  { value: 'speed', icon: '🚗' },
  { value: 'energy', icon: '⚡' }
]

// 获取单位定义
const getUnits = (type: string) => {
  const unitMap: { [key: string]: { value: string, labelKey: string }[] } = {
    length: [
      { value: 'mm', labelKey: 'pages.unitConverter.units.length.mm' },
      { value: 'cm', labelKey: 'pages.unitConverter.units.length.cm' },
      { value: 'm', labelKey: 'pages.unitConverter.units.length.m' },
      { value: 'km', labelKey: 'pages.unitConverter.units.length.km' },
      { value: 'in', labelKey: 'pages.unitConverter.units.length.in' },
      { value: 'ft', labelKey: 'pages.unitConverter.units.length.ft' },
      { value: 'yd', labelKey: 'pages.unitConverter.units.length.yd' },
      { value: 'mi', labelKey: 'pages.unitConverter.units.length.mi' }
    ],
    weight: [
      { value: 'mg', labelKey: 'pages.unitConverter.units.weight.mg' },
      { value: 'g', labelKey: 'pages.unitConverter.units.weight.g' },
      { value: 'kg', labelKey: 'pages.unitConverter.units.weight.kg' },
      { value: 't', labelKey: 'pages.unitConverter.units.weight.t' },
      { value: 'oz', labelKey: 'pages.unitConverter.units.weight.oz' },
      { value: 'lb', labelKey: 'pages.unitConverter.units.weight.lb' },
      { value: 'st', labelKey: 'pages.unitConverter.units.weight.st' }
    ],
    temperature: [
      { value: 'c', labelKey: 'pages.unitConverter.units.temperature.c' },
      { value: 'f', labelKey: 'pages.unitConverter.units.temperature.f' },
      { value: 'k', labelKey: 'pages.unitConverter.units.temperature.k' },
      { value: 'r', labelKey: 'pages.unitConverter.units.temperature.r' }
    ],
    area: [
      { value: 'mm2', labelKey: 'pages.unitConverter.units.area.mm2' },
      { value: 'cm2', labelKey: 'pages.unitConverter.units.area.cm2' },
      { value: 'm2', labelKey: 'pages.unitConverter.units.area.m2' },
      { value: 'km2', labelKey: 'pages.unitConverter.units.area.km2' },
      { value: 'in2', labelKey: 'pages.unitConverter.units.area.in2' },
      { value: 'ft2', labelKey: 'pages.unitConverter.units.area.ft2' },
      { value: 'ac', labelKey: 'pages.unitConverter.units.area.ac' },
      { value: 'ha', labelKey: 'pages.unitConverter.units.area.ha' }
    ],
    volume: [
      { value: 'ml', labelKey: 'pages.unitConverter.units.volume.ml' },
      { value: 'l', labelKey: 'pages.unitConverter.units.volume.l' },
      { value: 'm3', labelKey: 'pages.unitConverter.units.volume.m3' },
      { value: 'in3', labelKey: 'pages.unitConverter.units.volume.in3' },
      { value: 'ft3', labelKey: 'pages.unitConverter.units.volume.ft3' },
      { value: 'gal', labelKey: 'pages.unitConverter.units.volume.gal' },
      { value: 'qt', labelKey: 'pages.unitConverter.units.volume.qt' }
    ],
    time: [
      { value: 'ms', labelKey: 'pages.unitConverter.units.time.ms' },
      { value: 's', labelKey: 'pages.unitConverter.units.time.s' },
      { value: 'min', labelKey: 'pages.unitConverter.units.time.min' },
      { value: 'h', labelKey: 'pages.unitConverter.units.time.h' },
      { value: 'd', labelKey: 'pages.unitConverter.units.time.d' },
      { value: 'w', labelKey: 'pages.unitConverter.units.time.w' },
      { value: 'mo', labelKey: 'pages.unitConverter.units.time.mo' },
      { value: 'y', labelKey: 'pages.unitConverter.units.time.y' }
    ],
    speed: [
      { value: 'mps', labelKey: 'pages.unitConverter.units.speed.mps' },
      { value: 'kmh', labelKey: 'pages.unitConverter.units.speed.kmh' },
      { value: 'mph', labelKey: 'pages.unitConverter.units.speed.mph' },
      { value: 'fps', labelKey: 'pages.unitConverter.units.speed.fps' },
      { value: 'knot', labelKey: 'pages.unitConverter.units.speed.knot' }
    ],
    energy: [
      { value: 'j', labelKey: 'pages.unitConverter.units.energy.j' },
      { value: 'kj', labelKey: 'pages.unitConverter.units.energy.kj' },
      { value: 'cal', labelKey: 'pages.unitConverter.units.energy.cal' },
      { value: 'kcal', labelKey: 'pages.unitConverter.units.energy.kcal' },
      { value: 'wh', labelKey: 'pages.unitConverter.units.energy.wh' },
      { value: 'kwh', labelKey: 'pages.unitConverter.units.energy.kwh' },
      { value: 'btu', labelKey: 'pages.unitConverter.units.energy.btu' }
    ]
  }
  
  return unitMap[type] || []
}

// 选择类型
const selectType = (type: string) => {
  selectedType.value = type
  const typeUnits = getUnits(type)
  if (typeUnits && typeUnits.length >= 2) {
    fromUnit.value = typeUnits[0].value
    toUnit.value = typeUnits[1].value
  }
  inputValue.value = ''
  outputValue.value = ''
}

// 获取当前单位列表
const getCurrentUnits = () => {
  return getUnits(selectedType.value).map(unit => ({
    value: unit.value,
    label: t(unit.labelKey)
  }))
}

// 获取类型名称
const getTypeName = (typeValue: string) => {
  return t(`pages.unitConverter.types.${typeValue}.name`)
}

// 获取指定类型的单位
const getUnitsForType = (type: string) => {
  return getUnits(type).map(unit => ({
    value: unit.value,
    label: t(unit.labelKey)
  }))
}

// 获取快速转换选项
const getQuickConversions = () => {
  const quickConversions: { [key: string]: Array<{ from: string, to: string, fromLabelKey: string, toLabelKey: string }> } = {
    length: [
      { from: 'm', to: 'km', fromLabelKey: 'pages.unitConverter.units.length.m', toLabelKey: 'pages.unitConverter.units.length.km' },
      { from: 'cm', to: 'in', fromLabelKey: 'pages.unitConverter.units.length.cm', toLabelKey: 'pages.unitConverter.units.length.in' },
      { from: 'ft', to: 'm', fromLabelKey: 'pages.unitConverter.units.length.ft', toLabelKey: 'pages.unitConverter.units.length.m' },
      { from: 'mi', to: 'km', fromLabelKey: 'pages.unitConverter.units.length.mi', toLabelKey: 'pages.unitConverter.units.length.km' }
    ],
    weight: [
      { from: 'kg', to: 'lb', fromLabelKey: 'pages.unitConverter.units.weight.kg', toLabelKey: 'pages.unitConverter.units.weight.lb' },
      { from: 'g', to: 'oz', fromLabelKey: 'pages.unitConverter.units.weight.g', toLabelKey: 'pages.unitConverter.units.weight.oz' },
      { from: 't', to: 'kg', fromLabelKey: 'pages.unitConverter.units.weight.t', toLabelKey: 'pages.unitConverter.units.weight.kg' },
      { from: 'lb', to: 'kg', fromLabelKey: 'pages.unitConverter.units.weight.lb', toLabelKey: 'pages.unitConverter.units.weight.kg' }
    ],
    temperature: [
      { from: 'c', to: 'f', fromLabelKey: 'pages.unitConverter.units.temperature.c', toLabelKey: 'pages.unitConverter.units.temperature.f' },
      { from: 'f', to: 'c', fromLabelKey: 'pages.unitConverter.units.temperature.f', toLabelKey: 'pages.unitConverter.units.temperature.c' },
      { from: 'c', to: 'k', fromLabelKey: 'pages.unitConverter.units.temperature.c', toLabelKey: 'pages.unitConverter.units.temperature.k' },
      { from: 'k', to: 'c', fromLabelKey: 'pages.unitConverter.units.temperature.k', toLabelKey: 'pages.unitConverter.units.temperature.c' }
    ],
    time: [
      { from: 'h', to: 'min', fromLabelKey: 'pages.unitConverter.units.time.h', toLabelKey: 'pages.unitConverter.units.time.min' },
      { from: 'min', to: 's', fromLabelKey: 'pages.unitConverter.units.time.min', toLabelKey: 'pages.unitConverter.units.time.s' },
      { from: 'd', to: 'h', fromLabelKey: 'pages.unitConverter.units.time.d', toLabelKey: 'pages.unitConverter.units.time.h' },
      { from: 'w', to: 'd', fromLabelKey: 'pages.unitConverter.units.time.w', toLabelKey: 'pages.unitConverter.units.time.d' }
    ]
  }
  
  const conversions = quickConversions[selectedType.value] || []
  return conversions.map(conv => ({
    from: conv.from,
    to: conv.to,
    fromLabel: t(conv.fromLabelKey),
    toLabel: t(conv.toLabelKey)
  }))
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
      ElMessage.error(response.error || t('pages.unitConverter.messages.conversionFailed'))
    }
  } catch (error) {
    outputValue.value = ''
    ElMessage.error(t('pages.unitConverter.messages.conversionError'))
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
    ElMessage.warning(t('pages.unitConverter.messages.noResultToCopy'))
    return
  }

  const fromUnitLabel = getCurrentUnits().find(u => u.value === fromUnit.value)?.label || fromUnit.value
  const toUnitLabel = getCurrentUnits().find(u => u.value === toUnit.value)?.label || toUnit.value
  
  const result = `${inputValue.value} ${fromUnitLabel} = ${outputValue.value} ${toUnitLabel}`
  
  try {
    await navigator.clipboard.writeText(result)
    ElMessage.success(t('pages.unitConverter.messages.copiedToClipboard'))
  } catch (error) {
    ElMessage.error(t('pages.unitConverter.messages.copyFailed'))
  }
}

// 清空数据
const clearAll = () => {
  inputValue.value = ''
  outputValue.value = ''
  ElMessage.info(t('pages.unitConverter.messages.dataCleared'))
}

// 添加到历史
const addToHistory = () => {
  if (!inputValue.value || !outputValue.value) {
    ElMessage.warning(t('pages.unitConverter.messages.noResultToSave'))
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

  ElMessage.success(t('pages.unitConverter.messages.addedToHistory'))
}

// 使用历史记录
const useHistoryRecord = (record: any) => {
  selectedType.value = record.type
  fromUnit.value = record.fromUnitValue
  toUnit.value = record.toUnitValue
  inputValue.value = record.inputValue
  outputValue.value = record.outputValue
  ElMessage.info(t('pages.unitConverter.messages.historyApplied'))
}

// 删除历史记录
const removeHistoryRecord = (index: number) => {
  conversionHistory.value.splice(index, 1)
  ElMessage.info(t('pages.unitConverter.messages.historyDeleted'))
}

// 清空历史
const clearHistory = () => {
  conversionHistory.value = []
  ElMessage.info(t('pages.unitConverter.messages.historyCleared'))
}

// 导出历史
const exportHistory = () => {
  if (conversionHistory.value.length === 0) {
    ElMessage.warning(t('pages.unitConverter.messages.noHistoryToExport'))
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
  
  ElMessage.success(t('pages.unitConverter.messages.historyExported'))
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
  flex-wrap: wrap;
  gap: 8px;
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
  min-width: 0;
  word-break: break-word;
}

.selector-description,
.converter-description,
.history-description,
.usage-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* 类型选择 */
.type-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
  text-align: center;
  word-break: break-word;
}

.type-description {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  word-break: break-word;
  line-height: 1.4;
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
  min-width: 200px;
}

.value-input :deep(.el-input__wrapper) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  border: 1px solid #dcdfe6;
  background-color: #ffffff;
}

.value-input :deep(.el-input__inner) {
  color: #606266;
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
  overflow: hidden;
}

.quick-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
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
  
  .selector-description,
  .converter-description,
  .history-description,
  .usage-description {
    margin-left: 0;
    max-width: none;
    white-space: normal;
    text-overflow: unset;
    overflow: visible;
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