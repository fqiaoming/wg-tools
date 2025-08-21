<template>
  <div class="color-picker-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Brush /></el-icon>
        </div>
        <h1 class="hero-title">颜色选择器</h1>
        <p class="hero-description">专业的颜色选择和转换工具，支持多种颜色格式转换</p>
      </div>
    </div>

    <!-- 主要颜色选择卡片 -->
    <div class="main-picker-card">
      <div class="picker-header">
                  <div class="picker-icon">
            <el-icon><Brush /></el-icon>
          </div>
        <h3>颜色选择</h3>
        <div class="picker-description">选择和调整颜色</div>
      </div>
      
      <div class="picker-body">
        <div class="color-display-section">
          <div class="main-color-display">
            <div 
              class="color-preview" 
              :style="{ backgroundColor: currentColor }"
            ></div>
            <div class="color-info">
              <div class="color-name">{{ getColorName(currentColor) }}</div>
              <div class="color-brightness">亮度: {{ getBrightness(currentColor) }}%</div>
            </div>
          </div>
          
          <div class="color-picker-container">
            <el-color-picker 
              v-model="currentColor" 
              @change="onColorChange"
              show-alpha
              color-format="hex"
              size="large"
              class="main-color-picker"
            />
          </div>
        </div>

        <div class="format-converters">
          <div class="converter-grid">
            <div class="format-item">
              <label class="format-label">HEX</label>
              <el-input 
                v-model="colorFormats.hex" 
                @change="convertFromHex"
                class="format-input"
              />
              <el-button 
                size="small" 
                @click="copyFormat('hex')"
                class="copy-btn"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
            
            <div class="format-item">
              <label class="format-label">RGB</label>
              <el-input 
                v-model="colorFormats.rgb" 
                @change="convertFromRgb"
                class="format-input"
              />
              <el-button 
                size="small" 
                @click="copyFormat('rgb')"
                class="copy-btn"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
            
            <div class="format-item">
              <label class="format-label">HSL</label>
              <el-input 
                v-model="colorFormats.hsl" 
                @change="convertFromHsl"
                class="format-input"
              />
              <el-button 
                size="small" 
                @click="copyFormat('hsl')"
                class="copy-btn"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
            
            <div class="format-item">
              <label class="format-label">RGBA</label>
              <el-input 
                v-model="colorFormats.rgba" 
                @change="convertFromRgba"
                class="format-input"
              />
              <el-button 
                size="small" 
                @click="copyFormat('rgba')"
                class="copy-btn"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 调色板卡片 -->
    <div class="palette-card">
      <div class="palette-header">
        <div class="palette-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h3>颜色调色板</h3>
        <div class="palette-description">生成和谐的颜色方案</div>
      </div>
      
      <div class="palette-body">
        <div class="palette-type-selector">
          <el-radio-group v-model="paletteType" @change="generatePalette">
            <el-radio-button label="complementary">互补色</el-radio-button>
            <el-radio-button label="analogous">类似色</el-radio-button>
            <el-radio-button label="triadic">三色组</el-radio-button>
            <el-radio-button label="tetradic">四色组</el-radio-button>
            <el-radio-button label="monochromatic">单色调</el-radio-button>
          </el-radio-group>
        </div>

        <div class="generated-palette" v-if="palette.length > 0">
          <div class="palette-colors">
            <div 
              v-for="(color, index) in palette" 
              :key="index"
              class="palette-color-item"
              @click="selectPaletteColor(color)"
            >
              <div 
                class="palette-color-swatch" 
                :style="{ backgroundColor: color }"
              ></div>
              <div class="palette-color-code">{{ color }}</div>
            </div>
          </div>
          
          <div class="palette-actions">
            <el-button 
              type="primary" 
              @click="exportPalette"
              class="export-btn"
            >
              <el-icon><Download /></el-icon>
              导出调色板
            </el-button>
            <el-button 
              @click="copyPalette"
              class="copy-palette-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              复制全部
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 常用颜色卡片 -->
    <div class="common-colors-card">
      <div class="common-header">
        <div class="common-icon">
          <el-icon><Star /></el-icon>
        </div>
        <h3>常用颜色</h3>
        <div class="common-description">快速选择常用的颜色</div>
      </div>
      
      <div class="common-body">
        <div class="color-categories">
          <div class="category-section">
            <h4 class="category-title">基础颜色</h4>
            <div class="color-swatches">
              <div 
                v-for="color in basicColors" 
                :key="color.hex"
                class="color-swatch"
                :style="{ backgroundColor: color.hex }"
                @click="selectColor(color.hex)"
                :title="color.name"
              ></div>
            </div>
          </div>
          
          <div class="category-section">
            <h4 class="category-title">材质设计</h4>
            <div class="color-swatches">
              <div 
                v-for="color in materialColors" 
                :key="color.hex"
                class="color-swatch"
                :style="{ backgroundColor: color.hex }"
                @click="selectColor(color.hex)"
                :title="color.name"
              ></div>
            </div>
          </div>
          
          <div class="category-section">
            <h4 class="category-title">Tailwind CSS</h4>
            <div class="color-swatches">
              <div 
                v-for="color in tailwindColors" 
                :key="color.hex"
                class="color-swatch"
                :style="{ backgroundColor: color.hex }"
                @click="selectColor(color.hex)"
                :title="color.name"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 颜色分析卡片 -->
    <div class="analysis-card">
      <div class="analysis-header">
        <div class="analysis-icon">
          <el-icon><DataAnalysis /></el-icon>
        </div>
        <h3>颜色分析</h3>
        <div class="analysis-description">当前颜色的详细信息</div>
      </div>
      
      <div class="analysis-body">
        <div class="analysis-grid">
          <div class="analysis-item">
            <div class="analysis-label">色相 (Hue)</div>
            <div class="analysis-value">{{ colorAnalysis.hue }}°</div>
          </div>
          <div class="analysis-item">
            <div class="analysis-label">饱和度 (Saturation)</div>
            <div class="analysis-value">{{ colorAnalysis.saturation }}%</div>
          </div>
          <div class="analysis-item">
            <div class="analysis-label">亮度 (Lightness)</div>
            <div class="analysis-value">{{ colorAnalysis.lightness }}%</div>
          </div>
          <div class="analysis-item">
            <div class="analysis-label">透明度 (Alpha)</div>
            <div class="analysis-value">{{ colorAnalysis.alpha }}%</div>
          </div>
          <div class="analysis-item">
            <div class="analysis-label">温度</div>
            <div class="analysis-value">{{ colorAnalysis.temperature }}</div>
          </div>
          <div class="analysis-item">
            <div class="analysis-label">对比色</div>
            <div 
              class="analysis-color-preview" 
              :style="{ backgroundColor: colorAnalysis.complementary }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Brush,
  Grid,
  Star,
  DataAnalysis,
  CopyDocument,
  Download
} from '@element-plus/icons-vue'
import { advancedColorTool, type ToolResponse } from '../../utils/newTools'

const currentColor = ref('#3b82f6')
const paletteType = ref('complementary')
const palette = ref<string[]>([])

const colorFormats = reactive({
  hex: '#3b82f6',
  rgb: 'rgb(59, 130, 246)',
  hsl: 'hsl(217, 91%, 60%)',
  rgba: 'rgba(59, 130, 246, 1)'
})

const colorAnalysis = reactive({
  hue: 217,
  saturation: 91,
  lightness: 60,
  alpha: 100,
  temperature: '冷色调',
  complementary: '#ffffff'
})

// 基础颜色
const basicColors = [
  { name: '红色', hex: '#ff0000' },
  { name: '绿色', hex: '#00ff00' },
  { name: '蓝色', hex: '#0000ff' },
  { name: '黄色', hex: '#ffff00' },
  { name: '青色', hex: '#00ffff' },
  { name: '品红', hex: '#ff00ff' },
  { name: '黑色', hex: '#000000' },
  { name: '白色', hex: '#ffffff' },
  { name: '灰色', hex: '#808080' },
  { name: '橙色', hex: '#ffa500' },
  { name: '紫色', hex: '#800080' },
  { name: '粉色', hex: '#ffc0cb' }
]

// 材质设计颜色
const materialColors = [
  { name: 'Red 500', hex: '#f44336' },
  { name: 'Pink 500', hex: '#e91e63' },
  { name: 'Purple 500', hex: '#9c27b0' },
  { name: 'Deep Purple 500', hex: '#673ab7' },
  { name: 'Indigo 500', hex: '#3f51b5' },
  { name: 'Blue 500', hex: '#2196f3' },
  { name: 'Light Blue 500', hex: '#03a9f4' },
  { name: 'Cyan 500', hex: '#00bcd4' },
  { name: 'Teal 500', hex: '#009688' },
  { name: 'Green 500', hex: '#4caf50' },
  { name: 'Light Green 500', hex: '#8bc34a' },
  { name: 'Lime 500', hex: '#cddc39' }
]

// Tailwind CSS颜色
const tailwindColors = [
  { name: 'Slate 500', hex: '#64748b' },
  { name: 'Gray 500', hex: '#6b7280' },
  { name: 'Red 500', hex: '#ef4444' },
  { name: 'Orange 500', hex: '#f97316' },
  { name: 'Amber 500', hex: '#f59e0b' },
  { name: 'Yellow 500', hex: '#eab308' },
  { name: 'Lime 500', hex: '#84cc16' },
  { name: 'Green 500', hex: '#22c55e' },
  { name: 'Emerald 500', hex: '#10b981' },
  { name: 'Teal 500', hex: '#14b8a6' },
  { name: 'Cyan 500', hex: '#06b6d4' },
  { name: 'Sky 500', hex: '#0ea5e9' }
]

// 颜色改变时更新所有格式
const onColorChange = () => {
  updateColorFormats()
  updateColorAnalysis()
  generatePalette()
}

// 更新颜色格式
const updateColorFormats = () => {
  const rgb = hexToRgb(currentColor.value)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  
  colorFormats.hex = currentColor.value
  colorFormats.rgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  colorFormats.hsl = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
  colorFormats.rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
}

// 更新颜色分析
const updateColorAnalysis = () => {
  const rgb = hexToRgb(currentColor.value)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  
  colorAnalysis.hue = Math.round(hsl.h)
  colorAnalysis.saturation = Math.round(hsl.s)
  colorAnalysis.lightness = Math.round(hsl.l)
  colorAnalysis.alpha = 100
  colorAnalysis.temperature = hsl.h < 180 ? '暖色调' : '冷色调'
  colorAnalysis.complementary = getComplementaryColor(currentColor.value)
}

// 获取互补色
const getComplementaryColor = (hex: string) => {
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const compHue = (hsl.h + 180) % 360
  const compRgb = hslToRgb(compHue, hsl.s, hsl.l)
  return rgbToHex(compRgb.r, compRgb.g, compRgb.b)
}

// 生成调色板
const generatePalette = async () => {
  try {
    const response: ToolResponse = advancedColorTool.generatePalette(currentColor.value, paletteType.value)
    
    if (response.success && response.result) {
      // 如果result是字符串数组，直接使用；如果是对象，取colors属性
      palette.value = Array.isArray(response.result) ? response.result : []
    }
  } catch (error) {
    console.error('调色板生成错误:', error)
  }
}

// 选择调色板颜色
const selectPaletteColor = (color: string) => {
  currentColor.value = color
  onColorChange()
  ElMessage.success('已选择颜色: ' + color)
}

// 选择颜色
const selectColor = (hex: string) => {
  currentColor.value = hex
  onColorChange()
  ElMessage.success('已选择颜色: ' + hex)
}

// 复制格式
const copyFormat = async (format: string) => {
  const value = colorFormats[format as keyof typeof colorFormats]
  try {
    await navigator.clipboard.writeText(value)
    ElMessage.success(`${format.toUpperCase()}格式已复制！`)
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 复制调色板
const copyPalette = async () => {
  const paletteText = palette.value.join(', ')
  try {
    await navigator.clipboard.writeText(paletteText)
    ElMessage.success('调色板已复制！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 导出调色板
const exportPalette = () => {
  const css = palette.value.map((color, index) => 
    `--color-${index + 1}: ${color};`
  ).join('\n')
  
  const blob = new Blob([`:root {\n${css}\n}`], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'color-palette.css'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('调色板CSS已导出！')
}

// 颜色转换函数
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360
  s /= 100
  l /= 100
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

// 获取颜色名称
const getColorName = (hex: string) => {
  const knownColors: { [key: string]: string } = {
    '#ff0000': '红色',
    '#00ff00': '绿色',
    '#0000ff': '蓝色',
    '#ffff00': '黄色',
    '#ff00ff': '品红',
    '#00ffff': '青色',
    '#000000': '黑色',
    '#ffffff': '白色'
  }
  return knownColors[hex.toLowerCase()] || '自定义颜色'
}

// 获取亮度
const getBrightness = (hex: string) => {
  const rgb = hexToRgb(hex)
  return Math.round((rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255 * 100)
}

// 格式转换
const convertFromHex = () => {
  currentColor.value = colorFormats.hex
  onColorChange()
}

const convertFromRgb = () => {
  // 简化的RGB解析
  const match = colorFormats.rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match) {
    const r = parseInt(match[1])
    const g = parseInt(match[2])
    const b = parseInt(match[3])
    currentColor.value = rgbToHex(r, g, b)
    onColorChange()
  }
}

const convertFromHsl = () => {
  // 简化的HSL解析
  const match = colorFormats.hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  if (match) {
    const h = parseInt(match[1])
    const s = parseInt(match[2])
    const l = parseInt(match[3])
    const rgb = hslToRgb(h, s, l)
    currentColor.value = rgbToHex(rgb.r, rgb.g, rgb.b)
    onColorChange()
  }
}

const convertFromRgba = () => {
  // 简化的RGBA解析
  const match = colorFormats.rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/)
  if (match) {
    const r = parseInt(match[1])
    const g = parseInt(match[2])
    const b = parseInt(match[3])
    currentColor.value = rgbToHex(r, g, b)
    onColorChange()
  }
}

// 初始化
updateColorAnalysis()
onColorChange()
</script>

<style scoped>
.color-picker-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #8b5cf6;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
.main-picker-card,
.palette-card,
.common-colors-card,
.analysis-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

/* 卡片头部样式 */
.picker-header,
.palette-header,
.common-header,
.analysis-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.picker-icon,
.palette-icon,
.common-icon,
.analysis-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.picker-header h3,
.palette-header h3,
.common-header h3,
.analysis-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.picker-description,
.palette-description,
.common-description,
.analysis-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 主颜色选择器 */
.color-display-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  align-items: center;
}

.main-color-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.color-preview {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.color-info {
  text-align: center;
}

.color-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.color-brightness {
  font-size: 12px;
  color: #6b7280;
}

.color-picker-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

/* 格式转换器 */
.converter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.format-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.format-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  min-width: 50px;
  text-transform: uppercase;
}

.format-input {
  flex: 1;
}

.format-input :deep(.el-input__wrapper) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.copy-btn {
  font-size: 10px;
  padding: 4px 6px;
}

/* 调色板 */
.palette-type-selector {
  margin-bottom: 20px;
}

.generated-palette {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.palette-colors {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.palette-color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.palette-color-item:hover {
  transform: translateY(-2px);
}

.palette-color-swatch {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.palette-color-code {
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  color: #6b7280;
}

.palette-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 常用颜色 */
.color-categories {
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
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.color-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 8px;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 颜色分析 */
.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.analysis-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.analysis-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.analysis-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.analysis-color-preview {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .color-picker-tool {
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
  
  .main-picker-card,
  .palette-card,
  .common-colors-card,
  .analysis-card {
    padding: 20px 16px;
  }
  
  .color-display-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .converter-grid,
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .palette-colors {
    justify-content: space-around;
  }
  
  .palette-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .color-swatches {
    grid-template-columns: repeat(auto-fill, minmax(35px, 1fr));
  }
  
  .color-swatch {
    width: 35px;
    height: 35px;
  }
}
</style>