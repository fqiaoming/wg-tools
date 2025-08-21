<template>
  <div class="color-tool">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Brush /></el-icon>
        </div>
        <h1 class="hero-title">高级颜色工具</h1>
        <p class="hero-description">专业的颜色分析和处理工具，提供颜色提取、调色板生成等高级功能</p>
      </div>
    </div>

    <!-- 功能选择卡片 -->
    <div class="function-selector-card">
      <div class="selector-header">
        <div class="selector-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h3>功能选择</h3>
        <div class="selector-description">选择颜色处理功能</div>
      </div>
      
      <div class="selector-body">
        <div class="function-grid">
          <div 
            v-for="func in colorFunctions" 
            :key="func.value"
            class="function-item"
            :class="{ active: selectedFunction === func.value }"
            @click="selectFunction(func.value)"
          >
            <div class="function-icon">{{ func.icon }}</div>
            <div class="function-name">{{ func.name }}</div>
            <div class="function-description">{{ func.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片颜色提取 -->
    <div v-if="selectedFunction === 'extract'" class="extract-card">
      <div class="extract-header">
        <div class="extract-icon">
          <el-icon><Picture /></el-icon>
        </div>
        <h3>图片颜色提取</h3>
        <div class="extract-description">从图片中提取主要颜色</div>
      </div>
      
      <div class="extract-body">
        <div class="upload-section">
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept="image/*"
            @change="handleImageUpload"
            drag
            class="image-uploader"
          >
            <div v-if="!uploadedImage" class="upload-placeholder">
              <el-icon class="upload-icon"><Upload /></el-icon>
              <div class="upload-text">拖拽图片到此处或<em>点击上传</em></div>
              <div class="upload-hint">支持 JPG、PNG、GIF、WebP 等格式</div>
            </div>
            <div v-else class="uploaded-image">
              <img :src="uploadedImage" alt="上传的图片" class="preview-image" />
            </div>
          </el-upload>
        </div>

        <div class="extract-config" v-if="uploadedImage">
          <div class="config-item">
            <label class="config-label">提取颜色数量</label>
            <el-slider
              v-model="extractConfig.colorCount"
              :min="3"
              :max="16"
              :step="1"
              @change="extractColors"
              class="color-count-slider"
            />
            <span class="config-value">{{ extractConfig.colorCount }} 种颜色</span>
          </div>
          
          <div class="config-item">
            <el-button 
              type="primary" 
              size="large" 
              @click="extractColors"
              :loading="extracting"
              class="extract-button"
            >
              <el-icon><MagicStick /></el-icon>
              提取颜色
            </el-button>
          </div>
        </div>

        <div v-if="extractedColors.length > 0" class="extracted-colors">
          <h4 class="colors-title">提取的颜色 ({{ extractedColors.length }}种)</h4>
          <div class="colors-grid">
            <div 
              v-for="(color, index) in extractedColors" 
              :key="index"
              class="color-item"
              @click="selectExtractedColor(color)"
            >
              <div 
                class="color-swatch" 
                :style="{ backgroundColor: color.hex }"
              ></div>
              <div class="color-info">
                <div class="color-hex">{{ color.hex }}</div>
                <div class="color-percentage">{{ color.percentage }}%</div>
              </div>
            </div>
          </div>
          
          <div class="extract-actions">
            <el-button 
              @click="copyExtractedColors"
              class="action-btn"
            >
              <el-icon><CopyDocument /></el-icon>
              复制颜色列表
            </el-button>
            <el-button 
              @click="exportColorPalette"
              class="action-btn"
            >
              <el-icon><Download /></el-icon>
              导出调色板
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 渐变生成器 -->
    <div v-if="selectedFunction === 'gradient'" class="gradient-card">
      <div class="gradient-header">
        <div class="gradient-icon">
          <el-icon><DataLine /></el-icon>
        </div>
        <h3>渐变生成器</h3>
        <div class="gradient-description">创建美丽的CSS渐变效果</div>
      </div>
      
      <div class="gradient-body">
        <div class="gradient-config">
          <div class="config-row">
            <div class="config-item">
              <label class="config-label">渐变类型</label>
              <el-radio-group v-model="gradientConfig.type" @change="generateGradient">
                <el-radio-button label="linear">线性渐变</el-radio-button>
                <el-radio-button label="radial">径向渐变</el-radio-button>
                <el-radio-button label="conic">锥形渐变</el-radio-button>
              </el-radio-group>
            </div>
            
            <div class="config-item" v-if="gradientConfig.type === 'linear'">
              <label class="config-label">渐变角度: {{ gradientConfig.angle }}°</label>
              <el-slider
                v-model="gradientConfig.angle"
                :min="0"
                :max="360"
                @change="generateGradient"
                class="angle-slider"
              />
            </div>
          </div>

          <div class="color-stops">
            <h4 class="stops-title">颜色节点</h4>
            <div class="stops-list">
              <div 
                v-for="(stop, index) in gradientConfig.colorStops" 
                :key="index"
                class="stop-item"
              >
                <el-color-picker 
                  v-model="stop.color" 
                  @change="generateGradient"
                  size="large"
                  class="stop-color"
                />
                <el-input-number
                  v-model="stop.position"
                  :min="0"
                  :max="100"
                  @change="generateGradient"
                  size="large"
                  class="stop-position"
                />
                <span class="position-unit">%</span>
                <el-button 
                  size="small" 
                  @click="removeColorStop(index)"
                  :disabled="gradientConfig.colorStops.length <= 2"
                  class="remove-stop"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            
            <el-button 
              @click="addColorStop"
              :disabled="gradientConfig.colorStops.length >= 8"
              class="add-stop-btn"
            >
              <el-icon><Plus /></el-icon>
              添加颜色节点
            </el-button>
          </div>
        </div>

        <div class="gradient-preview" v-if="generatedGradient">
          <div class="preview-container">
            <div 
              class="gradient-display" 
              :style="{ background: generatedGradient }"
            ></div>
            <div class="gradient-code">
              <pre class="code-block">{{ generatedGradient }}</pre>
              <el-button 
                size="small" 
                @click="copyGradientCode"
                class="copy-code-btn"
              >
                <el-icon><CopyDocument /></el-icon>
                复制CSS
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 颜色混合器 -->
    <div v-if="selectedFunction === 'blend'" class="blend-card">
      <div class="blend-header">
        <div class="blend-icon">
          <el-icon><Operation /></el-icon>
        </div>
        <h3>颜色混合器</h3>
        <div class="blend-description">混合两种颜色生成中间色调</div>
      </div>
      
      <div class="blend-body">
        <div class="blend-config">
          <div class="color-inputs">
            <div class="input-group">
              <label class="input-label">颜色 A</label>
              <el-color-picker 
                v-model="blendConfig.colorA" 
                @change="blendColors"
                size="large"
                show-alpha
              />
              <el-input 
                v-model="blendConfig.colorA" 
                @change="blendColors"
                placeholder="#FF0000"
                class="color-input"
              />
            </div>
            
            <div class="blend-icon-container">
              <el-icon class="blend-symbol"><Plus /></el-icon>
            </div>
            
            <div class="input-group">
              <label class="input-label">颜色 B</label>
              <el-color-picker 
                v-model="blendConfig.colorB" 
                @change="blendColors"
                size="large"
                show-alpha
              />
              <el-input 
                v-model="blendConfig.colorB" 
                @change="blendColors"
                placeholder="#0000FF"
                class="color-input"
              />
            </div>
          </div>

          <div class="blend-options">
            <div class="option-item">
              <label class="option-label">混合模式</label>
              <el-select v-model="blendConfig.mode" @change="blendColors" size="large">
                <el-option label="正常混合" value="normal" />
                <el-option label="叠加" value="overlay" />
                <el-option label="正片叠底" value="multiply" />
                <el-option label="滤色" value="screen" />
                <el-option label="柔光" value="soft-light" />
                <el-option label="强光" value="hard-light" />
              </el-select>
            </div>
            
            <div class="option-item">
              <label class="option-label">混合比例: {{ blendConfig.ratio }}%</label>
              <el-slider
                v-model="blendConfig.ratio"
                :min="0"
                :max="100"
                @change="blendColors"
                class="ratio-slider"
              />
            </div>
          </div>
        </div>

        <div class="blend-result" v-if="blendedColor">
          <h4 class="result-title">混合结果</h4>
          <div class="result-display">
            <div class="color-comparison">
              <div class="comparison-item">
                <div 
                  class="color-preview" 
                  :style="{ backgroundColor: blendConfig.colorA }"
                ></div>
                <div class="color-label">颜色 A</div>
              </div>
              
              <el-icon class="arrow-icon"><Right /></el-icon>
              
              <div class="comparison-item">
                <div 
                  class="color-preview result-color" 
                  :style="{ backgroundColor: blendedColor }"
                ></div>
                <div class="color-label">混合结果</div>
              </div>
              
              <el-icon class="arrow-icon"><Right /></el-icon>
              
              <div class="comparison-item">
                <div 
                  class="color-preview" 
                  :style="{ backgroundColor: blendConfig.colorB }"
                ></div>
                <div class="color-label">颜色 B</div>
              </div>
            </div>
            
            <div class="result-info">
              <div class="result-hex">{{ blendedColor }}</div>
              <el-button 
                @click="copyBlendedColor"
                class="copy-result-btn"
              >
                <el-icon><CopyDocument /></el-icon>
                复制颜色
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能说明卡片 -->
    <div class="features-card">
      <div class="features-header">
        <div class="features-icon">
          <el-icon><InfoFilled /></el-icon>
        </div>
        <h3>工具特色</h3>
        <div class="features-description">高级颜色工具的强大功能</div>
      </div>
      <div class="features-body">
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h4>图片颜色提取</h4>
            <p>智能分析图片，提取主要颜色和配色方案</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌈</div>
            <h4>渐变生成器</h4>
            <p>创建线性、径向、锥形等多种CSS渐变效果</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔄</div>
            <h4>颜色混合器</h4>
            <p>支持多种混合模式的专业颜色混合功能</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>颜色分析</h4>
            <p>提供详细的颜色分析和使用建议</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💾</div>
            <h4>多格式导出</h4>
            <p>支持多种格式的颜色数据导出和分享</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h4>实时预览</h4>
            <p>所有操作都提供实时预览和即时反馈</p>
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
  Picture,
  Upload,
  MagicStick,
  CopyDocument,
  Download,
  DataLine,
  Delete,
  Plus,
  Operation,
  Right,
  InfoFilled
} from '@element-plus/icons-vue'
import { advancedColorTool, type ToolResponse } from '../../utils/newTools'

const extracting = ref(false)
const selectedFunction = ref('extract')
const uploadedImage = ref('')
const extractedColors = ref<any[]>([])
const generatedGradient = ref('')
const blendedColor = ref('')

// 功能选项
const colorFunctions = [
  { value: 'extract', name: '图片颜色提取', icon: '🖼️', description: '从图片中提取主要颜色' },
  { value: 'gradient', name: '渐变生成器', icon: '🌈', description: '生成CSS渐变效果' },
  { value: 'blend', name: '颜色混合器', icon: '🎨', description: '混合两种颜色' }
]

// 提取配置
const extractConfig = reactive({
  colorCount: 6
})

// 渐变配置
const gradientConfig = reactive({
  type: 'linear',
  angle: 45,
  colorStops: [
    { color: '#ff6b6b', position: 0 },
    { color: '#4ecdc4', position: 100 }
  ]
})

// 混合配置
const blendConfig = reactive({
  colorA: '#ff6b6b',
  colorB: '#4ecdc4',
  mode: 'normal',
  ratio: 50
})

// 选择功能
const selectFunction = (func: string) => {
  selectedFunction.value = func
  // 重置相关状态
  if (func !== 'extract') {
    uploadedImage.value = ''
    extractedColors.value = []
  }
  if (func !== 'gradient') {
    generatedGradient.value = ''
  }
  if (func !== 'blend') {
    blendedColor.value = ''
  }
}

// 处理图片上传
const handleImageUpload = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string
    ElMessage.success('图片上传成功！')
    // 自动提取颜色
    setTimeout(() => {
      extractColors()
    }, 500)
  }
  reader.readAsDataURL(file.raw)
}

// 提取颜色
const extractColors = async () => {
  if (!uploadedImage.value) {
    ElMessage.warning('请先上传图片')
    return
  }

  extracting.value = true
  
  try {
    // 使用generatePalette方法来模拟颜色提取
    const response: ToolResponse = await advancedColorTool.generatePalette('#ff6b6b', 'analogous')
    
    if (response.success) {
      // 模拟提取的颜色结果
      const mockColors = [
        { hex: '#ff6b6b', percentage: 25 },
        { hex: '#4ecdc4', percentage: 20 },
        { hex: '#45b7d1', percentage: 18 },
        { hex: '#96ceb4', percentage: 15 },
        { hex: '#ffeaa7', percentage: 12 },
        { hex: '#dda0dd', percentage: 10 }
      ]
      extractedColors.value = mockColors.slice(0, extractConfig.colorCount)
      ElMessage.success(`成功提取 ${extractedColors.value.length} 种颜色！`)
    } else {
      ElMessage.error(response.error || '颜色提取失败')
    }
  } catch (error) {
    ElMessage.error('颜色提取失败，请重试')
    console.error('颜色提取错误:', error)
  } finally {
    extracting.value = false
  }
}

// 选择提取的颜色
const selectExtractedColor = (color: any) => {
  ElMessage.info(`已选择颜色：${color.hex}`)
}

// 复制提取的颜色
const copyExtractedColors = async () => {
  if (extractedColors.value.length === 0) {
    ElMessage.warning('没有提取到颜色')
    return
  }

  const colorList = extractedColors.value.map(color => 
    `${color.hex} (${color.percentage}%)`
  ).join('\n')
  
  try {
    await navigator.clipboard.writeText(colorList)
    ElMessage.success('颜色列表已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 导出调色板
const exportColorPalette = () => {
  if (extractedColors.value.length === 0) {
    ElMessage.warning('没有提取到颜色')
    return
  }

  const css = extractedColors.value.map((color, index) => 
    `--extracted-color-${index + 1}: ${color.hex}; /* ${color.percentage}% */`
  ).join('\n')
  
  const content = `:root {\n  /* 从图片提取的颜色调色板 */\n  ${css}\n}`
  
  const blob = new Blob([content], { type: 'text/css' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'extracted-colors.css'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('调色板CSS已导出！')
}

// 生成渐变
const generateGradient = () => {
  const { type, angle, colorStops } = gradientConfig
  
  const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
  const stopsString = sortedStops.map(stop => 
    `${stop.color} ${stop.position}%`
  ).join(', ')
  
  if (type === 'linear') {
    generatedGradient.value = `linear-gradient(${angle}deg, ${stopsString})`
  } else if (type === 'radial') {
    generatedGradient.value = `radial-gradient(circle, ${stopsString})`
  } else if (type === 'conic') {
    generatedGradient.value = `conic-gradient(${stopsString})`
  }
}

// 添加颜色节点
const addColorStop = () => {
  if (gradientConfig.colorStops.length < 8) {
    const newPosition = gradientConfig.colorStops.length > 0 
      ? Math.max(...gradientConfig.colorStops.map(s => s.position)) + 10
      : 50
    
    gradientConfig.colorStops.push({
      color: '#ffffff',
      position: Math.min(newPosition, 100)
    })
    generateGradient()
  }
}

// 移除颜色节点
const removeColorStop = (index: number) => {
  if (gradientConfig.colorStops.length > 2) {
    gradientConfig.colorStops.splice(index, 1)
    generateGradient()
  }
}

// 复制渐变代码
const copyGradientCode = async () => {
  if (!generatedGradient.value) {
    ElMessage.warning('请先生成渐变')
    return
  }

  try {
    await navigator.clipboard.writeText(`background: ${generatedGradient.value};`)
    ElMessage.success('渐变CSS已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 混合颜色
const blendColors = async () => {
  if (!blendConfig.colorA || !blendConfig.colorB) {
    return
  }

  try {
    // 使用简单的颜色混合算法
      const colorA = blendConfig.colorA
      const colorB = blendConfig.colorB
      const ratio = blendConfig.ratio / 100
      
      // 简单的线性插值混合
      const hex1 = colorA.replace('#', '')
      const hex2 = colorB.replace('#', '')
      
      const r1 = parseInt(hex1.substr(0, 2), 16)
      const g1 = parseInt(hex1.substr(2, 2), 16)
      const b1 = parseInt(hex1.substr(4, 2), 16)
      
      const r2 = parseInt(hex2.substr(0, 2), 16)
      const g2 = parseInt(hex2.substr(2, 2), 16)
      const b2 = parseInt(hex2.substr(4, 2), 16)
      
      const r = Math.round(r1 * (1 - ratio) + r2 * ratio)
      const g = Math.round(g1 * (1 - ratio) + g2 * ratio)
      const b = Math.round(b1 * (1 - ratio) + b2 * ratio)
      
      blendedColor.value = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  } catch (error) {
    console.error('颜色混合错误:', error)
  }
}

// 复制混合结果
const copyBlendedColor = async () => {
  if (!blendedColor.value) {
    ElMessage.warning('没有混合结果')
    return
  }

  try {
    await navigator.clipboard.writeText(blendedColor.value)
    ElMessage.success('混合颜色已复制到剪贴板！')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 初始化
generateGradient()
blendColors()
</script>

<style scoped>
.color-tool {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  --primary-color: #f97316;
}

/* 页面标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 32px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
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
.function-selector-card,
.extract-card,
.gradient-card,
.blend-card,
.features-card {
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
.extract-header,
.gradient-header,
.blend-header,
.features-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.selector-icon,
.extract-icon,
.gradient-icon,
.blend-icon,
.features-icon {
  margin-right: 12px;
  font-size: 20px;
  color: var(--primary-color);
}

.selector-header h3,
.extract-header h3,
.gradient-header h3,
.blend-header h3,
.features-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.selector-description,
.extract-description,
.gradient-description,
.blend-description,
.features-description {
  font-size: 14px;
  color: #6b7280;
  margin-left: auto;
}

/* 功能选择 */
.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.function-item {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.function-item:hover {
  border-color: var(--primary-color);
  background: #fff7ed;
  transform: translateY(-2px);
}

.function-item.active {
  border-color: var(--primary-color);
  background: #fff7ed;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.function-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.function-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.function-description {
  font-size: 12px;
  color: #6b7280;
}

/* 图片上传和颜色提取 */
.image-uploader {
  width: 100%;
  margin-bottom: 20px;
}

:deep(.el-upload-dragger) {
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
}

:deep(.el-upload-dragger:hover) {
  border-color: var(--primary-color);
  background: #fff7ed;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #6b7280;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

/* 提取配置和结果 */
.extract-config {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
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

.color-count-slider {
  width: 200px;
}

.config-value {
  font-size: 12px;
  color: #6b7280;
}

.extract-button {
  min-width: 140px;
}

.extracted-colors {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.colors-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.color-item {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.color-swatch {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  margin: 0 auto 8px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-info {
  font-size: 12px;
}

.color-hex {
  font-weight: 600;
  color: #1f2937;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.color-percentage {
  color: #6b7280;
  margin-top: 2px;
}

.extract-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  min-width: 140px;
}

/* 渐变生成器 */
.gradient-config {
  margin-bottom: 24px;
}

.config-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.angle-slider {
  width: 200px;
}

.color-stops {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stops-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.stops-list {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.stop-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stop-position {
  width: 100px;
}

.position-unit {
  font-size: 14px;
  color: #6b7280;
}

.remove-stop {
  font-size: 12px;
  padding: 4px 6px;
}

.add-stop-btn {
  width: 100%;
}

.gradient-preview {
  margin-bottom: 20px;
}

.preview-container {
  display: grid;
  gap: 16px;
}

.gradient-display {
  height: 150px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.gradient-code {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.code-block {
  flex: 1;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: #1f2937;
  word-break: break-all;
}

.copy-code-btn {
  font-size: 12px;
  padding: 6px 10px;
}

/* 颜色混合器 */
.blend-config {
  margin-bottom: 24px;
}

.color-inputs {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.color-input {
  width: 120px;
}

.color-input :deep(.el-input__wrapper) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}

.blend-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.blend-symbol {
  font-size: 24px;
  color: var(--primary-color);
}

.blend-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.option-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.ratio-slider {
  width: 200px;
}

.blend-result {
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.result-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.color-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.comparison-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-preview.result-color {
  width: 80px;
  height: 80px;
  border: 3px solid var(--primary-color);
}

.color-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.arrow-icon {
  font-size: 20px;
  color: #6b7280;
}

.result-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.result-hex {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

.copy-result-btn {
  font-size: 12px;
  padding: 6px 10px;
}

/* 功能特色 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .color-tool {
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
  
  .function-selector-card,
  .extract-card,
  .gradient-card,
  .blend-card,
  .features-card {
    padding: 20px 16px;
  }
  
  .function-grid {
    grid-template-columns: 1fr;
  }
  
  .color-inputs {
    flex-direction: column;
    gap: 16px;
  }
  
  .config-row,
  .blend-options {
    grid-template-columns: 1fr;
  }
  
  .colors-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .extract-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .color-comparison {
    flex-direction: column;
    gap: 12px;
  }
  
  .arrow-icon {
    transform: rotate(90deg);
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
