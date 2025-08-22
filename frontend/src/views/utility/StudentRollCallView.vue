<template>
  <div class="roll-call-system">
    <!-- 粒子背景 -->
    <div class="particles" ref="particlesContainer"></div>

    <div class="container">
      <!-- 头部 -->
      <div class="header">
        <h1>🎯 学生点名器</h1>
        <div class="subtitle">开发者：WG科技</div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="upload-section">
          <el-button @click="downloadSample" type="primary">
            📁 下载示例
          </el-button>
          <el-upload
            :auto-upload="false"
            :show-file-list="false"
            accept=".txt,.csv"
            :on-change="handleFileUpload"
            action=""
          >
            <el-button type="info">
              📤 上传班级名单
            </el-button>
          </el-upload>
        </div>
        <div v-if="fileInfo.show" class="file-info">
          <span>{{ fileInfo.fileName }}</span> - 共 <span>{{ studentCount }}</span> 名学生
        </div>
      </div>

          <!-- 点名显示区域 -->
    <div class="roll-call-area">
      <div class="display-section">
        <div 
          :class="['student-display', displayClass]"
          ref="studentDisplayRef"
        >
          {{ displayText }}
        </div>
      </div>
      
      <div class="button-area">
        <el-button 
          :disabled="!canStart" 
          @click="startRollCall" 
          type="success" 
          size="large"
          class="start-btn"
        >
          🚀 开始点名
        </el-button>
        <el-button 
          :disabled="!isRolling" 
          @click="stopRollCall" 
          type="danger" 
          size="large"
          class="stop-btn"
        >
          ⏹️ 停止
        </el-button>
      </div>

      <div class="status-section">
        <div :class="['status-info', `status-${statusType}`]">
          {{ statusMessage }}
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const students = ref<string[]>([])
const isRolling = ref(false)
const selectedStudent = ref('')
const countdownTime = ref(5)
const statusType = ref<'waiting' | 'rolling' | 'selected'>('waiting')
const statusMessage = ref('等待上传名单...')
const displayText = ref('请先上传班级名单')
const displayClass = ref('')

// 文件信息
const fileInfo = ref({
  show: false,
  fileName: ''
})

// DOM引用
const particlesContainer = ref<HTMLElement>()
const studentDisplayRef = ref<HTMLElement>()

// 定时器
let rollInterval: number | null = null
let rollTimeout: number | null = null
let countdownInterval: number | null = null

// 音效上下文
let audioContext: AudioContext | null = null

// 计算属性
const studentCount = computed(() => students.value.length)
const canStart = computed(() => students.value.length > 0 && !isRolling.value)

// 初始化音效
const initializeAudio = () => {
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  } catch (e) {
    console.log('Audio not supported')
  }
}

// 播放音效
const playSound = () => {
  if (!audioContext) return
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5)
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

// 创建粒子背景
const createParticles = () => {
  if (!particlesContainer.value) return
  
  particlesContainer.value.innerHTML = ''
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    particle.style.width = Math.random() * 4 + 2 + 'px'
    particle.style.height = particle.style.width
    particle.style.animationDelay = Math.random() * 6 + 's'
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's'
    particlesContainer.value.appendChild(particle)
  }
}

// 下载示例文件
const downloadSample = () => {
  const sampleData = "陈雨桐\n李沐轩\n王诗源\n张宇晴\n朱博文\n刘子涵\n赵思远\n孙梦瑶\n周志强\n吴雨薇\n郑浩然\n王晓燕\n李明轩\n张思琪\n陈俊杰"
  const blob = new Blob([sampleData], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '班级名单示例.txt'
  a.click()
  URL.revokeObjectURL(url)
}

// 读取文件
const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsText(file, 'UTF-8')
  })
}

// 处理文件上传
const handleFileUpload = async (file: any) => {
  try {
    const text = await readFile(file.raw)
    const parsedStudents = text.split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0)

    if (parsedStudents.length === 0) {
      ElMessage.error('文件中没有找到有效的学生姓名！')
      return
    }

    students.value = parsedStudents
    fileInfo.value = {
      show: true,
      fileName: file.name
    }

    displayText.value = '准备就绪，点击开始点名！'
    updateStatus('waiting', '已加载名单，准备点名')

  } catch (error) {
    ElMessage.error('文件读取失败，请确保文件格式正确！')
    console.error(error)
  }
}

// 开始点名
const startRollCall = () => {
  if (students.value.length === 0) return

  isRolling.value = true
  countdownTime.value = 5
  displayClass.value = 'rolling'
  updateStatus('rolling', `正在点名中... ${countdownTime.value}秒`)

  // 快速滚动显示名字
  rollInterval = setInterval(() => {
    const randomStudent = students.value[Math.floor(Math.random() * students.value.length)]
    displayText.value = randomStudent
  }, 100)

  // 倒计时显示
  countdownInterval = setInterval(() => {
    countdownTime.value--
    updateStatus('rolling', `正在点名中... ${countdownTime.value}秒`)
    
    if (countdownTime.value <= 0) {
      clearInterval(countdownInterval!)
    }
  }, 1000)

  // 5秒后自动停止
  rollTimeout = setTimeout(() => {
    stopRollCall()
  }, 5000)
}

// 停止点名
const stopRollCall = () => {
  if (!isRolling.value) return

  isRolling.value = false
  clearInterval(rollInterval!)
  clearInterval(countdownInterval!)
  clearTimeout(rollTimeout!)

  // 选择最终学生
  selectedStudent.value = students.value[Math.floor(Math.random() * students.value.length)]
  displayText.value = selectedStudent.value
  displayClass.value = 'selected'

  // 创建波纹效果
  createRippleEffect()

  // 播放音效
  playSound()

  updateStatus('selected', `点名结果：${selectedStudent.value}`)
}

// 创建波纹效果
const createRippleEffect = () => {
  if (!studentDisplayRef.value) return
  
  const rollCallArea = studentDisplayRef.value.closest('.roll-call-area') as HTMLElement
  if (!rollCallArea) return
  
  const ripple = document.createElement('div')
  ripple.className = 'ripple'
  
  // 固定波纹大小，避免影响容器布局
  const size = 300 // 固定大小
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = '50%'
  ripple.style.top = '50%'
  ripple.style.transform = 'translate(-50%, -50%)'
  ripple.style.position = 'absolute'
  ripple.style.zIndex = '1'
  
  rollCallArea.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 1000)
}

// 更新状态
const updateStatus = (type: 'waiting' | 'rolling' | 'selected', message: string) => {
  statusType.value = type
  statusMessage.value = message
}

// 生命周期
onMounted(() => {
  initializeAudio()
  createParticles()
})

onUnmounted(() => {
  if (rollInterval) clearInterval(rollInterval)
  if (rollTimeout) clearTimeout(rollTimeout)
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.roll-call-system {
  font-family: 'Microsoft YaHei', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* 粒子背景动画 */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 6s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 主容器 */
.container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 头部 */
.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.1); }
}

.header .subtitle {
  font-size: 1.1em;
  opacity: 0.9;
  color: #e8f2ff;
}

/* 控制面板 */
.control-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  margin-bottom: 40px;
  min-width: 400px;
  text-align: center;
}

.upload-section {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.file-info {
  margin-bottom: 10px;
  padding: 12px 20px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 15px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

/* 点名显示区域 */
.roll-call-area {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 50px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  width: 700px;
  min-width: 700px;
  max-width: 700px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

/* 显示区域容器 */
.display-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  max-height: 150px;
}

.student-display {
  font-size: 4em;
  font-weight: bold;
  color: #333;
  text-align: center;
  height: 120px;
  width: 500px;
  min-width: 500px;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  word-break: break-all;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rolling {
  animation: rollText 0.1s infinite ease-in-out;
  color: #667eea;
}

@keyframes rollText {
  0% { transform: rotateY(0deg); opacity: 0.8; }
  25% { transform: rotateY(90deg); opacity: 0.6; }
  50% { transform: rotateY(180deg); opacity: 0.8; }
  75% { transform: rotateY(270deg); opacity: 0.6; }
  100% { transform: rotateY(360deg); opacity: 0.8; }
}

.selected {
  animation: selectGlow 1s ease-out;
  color: #e74c3c;
  text-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
}

@keyframes selectGlow {
  0% { 
    text-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
    filter: brightness(1);
  }
  50% { 
    text-shadow: 0 0 40px rgba(231, 76, 60, 0.8), 0 0 60px rgba(231, 76, 60, 0.6);
    filter: brightness(1.2);
  }
  100% { 
    text-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
    filter: brightness(1);
  }
}

/* 波纹效果 */
.ripple {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(231, 76, 60, 0.3) 0%, transparent 70%);
  animation: rippleEffect 1s ease-out;
  pointer-events: none;
  z-index: 1;
}

@keyframes rippleEffect {
  0% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* 按钮区域 */
.button-area {
  display: flex;
  gap: 20px;
  justify-content: center;
  min-height: 80px;
  max-height: 80px;
  align-items: center;
}

/* 状态区域 */
.status-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  max-height: 60px;
}

.start-btn {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  border: none;
  color: white;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.stop-btn {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  border: none;
  color: white;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.stop-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

:deep(.el-button.is-disabled) {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* 状态提示 */
.status-info {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
}

.status-waiting {
  background: rgba(52, 152, 219, 0.2);
  color: #2980b9;
}

.status-rolling {
  background: rgba(241, 196, 15, 0.2);
  color: #f39c12;
}

.status-selected {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel {
    min-width: 350px;
    max-width: 350px;
    width: 350px;
    padding: 20px;
  }
  
  .roll-call-area {
    width: 350px;
    min-width: 350px;
    max-width: 350px;
    min-height: 350px;
    padding: 30px 20px;
  }
  
  .display-section {
    min-height: 120px;
    max-height: 120px;
  }
  
  .student-display {
    font-size: 2.5em;
    width: 280px;
    min-width: 280px;
    max-width: 280px;
    height: 100px;
  }
  
  .button-area {
    min-height: 60px;
    max-height: 60px;
    flex-direction: column;
    gap: 10px;
  }
  
  .status-section {
    min-height: 50px;
    max-height: 50px;
  }
  
  .upload-section {
    flex-direction: column;
    gap: 10px;
  }
  
  .header h1 {
    font-size: 2em;
  }
}
</style>