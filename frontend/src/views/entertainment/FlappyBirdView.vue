<template>
  <div class="flappy-bird">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Promotion /></el-icon>
        </div>
        <h1 class="hero-title">Flappy Bird</h1>
        <p class="hero-description">经典飞行躲避游戏，点击屏幕控制小鸟飞翔！</p>
      </div>
    </div>

    <!-- 游戏主体 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Trophy /></el-icon>
          游戏区域
        </h3>
        <p class="card-description">点击屏幕或按空格键控制小鸟飞翔，躲避管道获得高分！</p>
      </div>
      
      <div class="card-body">
        <!-- 游戏控制面板 -->
        <div class="game-controls">
          <div class="game-info">
            <div class="info-item">
              <span class="label">得分:</span>
              <span class="value score">{{ score }}</span>
            </div>
            <div class="info-item">
              <span class="label">最高分:</span>
              <span class="value">{{ highScore }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态:</span>
              <span class="value">{{ gameStatusText }}</span>
            </div>
          </div>
          
          <div class="game-buttons">
            <el-button 
              @click="startGame" 
              type="primary" 
              :icon="VideoPlay"
              :disabled="gameRunning && !gameOver"
            >
              {{ gameRunning ? (gameOver ? '重新开始' : '游戏中...') : '开始游戏' }}
            </el-button>
            <el-button 
              @click="pauseGame" 
              v-if="gameRunning && !gameOver" 
              :icon="VideoPause"
            >
              {{ gamePaused ? '继续' : '暂停' }}
            </el-button>
            <el-button @click="showHelp = true" :icon="QuestionFilled">
              帮助
            </el-button>
          </div>
        </div>

        <!-- 游戏主区域 -->
        <div class="game-main">
          <div class="game-canvas-container" @click="jump">
            <canvas
              ref="gameCanvas"
              :width="canvasWidth"
              :height="canvasHeight"
              class="game-canvas"
            ></canvas>
            
            <!-- 游戏开始提示 -->
            <div v-if="!gameStarted" class="start-overlay">
              <div class="start-message">
                <h3>🐦 准备起飞！</h3>
                <p>点击屏幕或按空格键开始游戏</p>
                <div class="start-icon">👆</div>
              </div>
            </div>
            
            <!-- 游戏结束提示 -->
            <div v-if="gameOver" class="game-over-overlay">
              <div class="game-over-message">
                <h3>💥 游戏结束！</h3>
                <p>最终得分: {{ score }}</p>
                <p v-if="score > highScore">🎉 新纪录！</p>
                <p v-else-if="highScore > 0">最高纪录: {{ highScore }}</p>
                <el-button @click="startGame" type="primary" size="large">
                  再来一次
                </el-button>
              </div>
            </div>
            
            <!-- 暂停提示 -->
            <div v-if="gamePaused && gameRunning" class="pause-overlay">
              <div class="pause-message">
                <h3>⏸️ 游戏暂停</h3>
                <p>点击继续按钮或按空格键恢复游戏</p>
              </div>
            </div>
          </div>
          
          <!-- 游戏信息面板 -->
          <div class="game-panel">
            <div class="panel-section">
              <h4>🎮 操作说明</h4>
              <div class="controls-info">
                <p>🖱️ 鼠标点击 - 小鸟向上飞</p>
                <p>⌨️ 空格键 - 小鸟向上飞</p>
                <p>⏸️ P键 - 暂停游戏</p>
              </div>
            </div>
            
            <div class="panel-section">
              <h4>🏆 游戏规则</h4>
              <div class="rules-info">
                <p>• 控制小鸟飞翔</p>
                <p>• 穿过管道缝隙</p>
                <p>• 每过一个管道得1分</p>
                <p>• 撞到管道或地面游戏结束</p>
              </div>
            </div>
            
            <div class="panel-section">
              <h4>💡 游戏技巧</h4>
              <div class="tips-info">
                <p>• 保持节奏，不要连续点击</p>
                <p>• 提前预判管道位置</p>
                <p>• 尽量飞在屏幕中央</p>
                <p>• 放松心态，熟能生巧</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 帮助弹窗 -->
    <el-dialog v-model="showHelp" title="游戏说明" width="500px">
      <div class="help-content">
        <h4>🎯 游戏目标</h4>
        <p>控制小鸟飞翔，穿过尽可能多的管道获得高分！</p>
        
        <h4>🎮 操作方法</h4>
        <ul>
          <li>点击屏幕或按空格键：小鸟向上飞翔</li>
          <li>松开后小鸟会因重力下降</li>
          <li>按P键：暂停/继续游戏</li>
        </ul>
        
        <h4>🏆 游戏规则</h4>
        <ul>
          <li>小鸟会受到重力影响向下坠落</li>
          <li>每次点击让小鸟向上飞一小段距离</li>
          <li>成功穿过一个管道得1分</li>
          <li>撞到管道、地面或天花板游戏结束</li>
        </ul>
        
        <h4>💡 高分技巧</h4>
        <ul>
          <li>保持稳定的点击节奏</li>
          <li>不要让小鸟飞得太高或太低</li>
          <li>提前观察下一个管道的位置</li>
          <li>多练习培养手感和反应能力</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Promotion,
  Trophy,
  VideoPlay,
  VideoPause,
  QuestionFilled
} from '@element-plus/icons-vue'

// 游戏状态
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 400
const canvasHeight = 600
const gameRunning = ref(false)
const gameStarted = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)
const showHelp = ref(false)
const score = ref(0)
const highScore = ref(0)

// 游戏对象
interface Bird {
  x: number
  y: number
  velocity: number
  size: number
}

interface Pipe {
  x: number
  topHeight: number
  bottomHeight: number
  width: number
  gap: number
  passed: boolean
}

// 游戏变量
let ctx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null
let wingAnimationTime = 0

const bird = ref<Bird>({
  x: 80,
  y: 300,
  velocity: 0,
  size: 20
})

const pipes = ref<Pipe[]>([])
const gravity = 0.5
const jumpStrength = -8
const pipeWidth = 60
const pipeGap = 150
const pipeSpeed = 2

// 游戏状态文本
const gameStatusText = computed(() => {
  if (!gameStarted.value) return '准备中'
  if (gameOver.value) return '游戏结束'
  if (gamePaused.value) return '已暂停'
  if (gameRunning.value) return '进行中'
  return '等待开始'
})

// 初始化游戏
const initGame = () => {
  score.value = 0
  gameRunning.value = false
  gameStarted.value = false
  gamePaused.value = false
  gameOver.value = false
  
  // 重置小鸟位置
  bird.value = {
    x: 80,
    y: 300,
    velocity: 0,
    size: 20
  }
  
  // 清空管道
  pipes.value = []
  
  // 清空画布
  if (ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    drawBackground()
    drawBird()
  }
}

// 开始游戏
const startGame = () => {
  initGame()
  gameRunning.value = true
  gameStarted.value = true
  
  // 生成第一个管道
  generatePipe()
  
  // 开始游戏循环
  gameLoop()
}

// 暂停游戏
const pauseGame = () => {
  gamePaused.value = !gamePaused.value
  
  if (!gamePaused.value && gameRunning.value) {
    gameLoop()
  }
}

// 小鸟跳跃
const jump = () => {
  if (!gameStarted.value) {
    startGame()
    return
  }
  
  if (gameOver.value) return
  if (gamePaused.value) return
  
  bird.value.velocity = jumpStrength
}

// 生成管道
const generatePipe = () => {
  const minHeight = 50
  const maxHeight = canvasHeight - pipeGap - minHeight
  const topHeight = Math.random() * (maxHeight - minHeight) + minHeight
  
  pipes.value.push({
    x: canvasWidth,
    topHeight,
    bottomHeight: canvasHeight - topHeight - pipeGap,
    width: pipeWidth,
    gap: pipeGap,
    passed: false
  })
}

// 更新游戏状态
const updateGame = () => {
  if (!gameRunning.value || gamePaused.value || gameOver.value) return
  
  // 更新小鸟
  bird.value.velocity += gravity
  bird.value.y += bird.value.velocity
  
  // 检查小鸟边界
  if (bird.value.y < 0 || bird.value.y > canvasHeight - bird.value.size) {
    endGame()
    return
  }
  
  // 更新管道
  pipes.value.forEach((pipe) => {
    pipe.x -= pipeSpeed
    
    // 检查得分
    if (!pipe.passed && pipe.x + pipe.width < bird.value.x) {
      pipe.passed = true
      score.value++
    }
    
    // 检查碰撞
    if (checkCollision(pipe)) {
      endGame()
      return
    }
  })
  
  // 移除超出屏幕的管道
  pipes.value = pipes.value.filter(pipe => pipe.x > -pipe.width)
  
  // 生成新管道
  if (pipes.value.length === 0 || pipes.value[pipes.value.length - 1].x < canvasWidth - 200) {
    generatePipe()
  }
}

// 检查碰撞
const checkCollision = (pipe: Pipe): boolean => {
  const birdLeft = bird.value.x
  const birdRight = bird.value.x + bird.value.size
  const birdTop = bird.value.y
  const birdBottom = bird.value.y + bird.value.size
  
  const pipeLeft = pipe.x
  const pipeRight = pipe.x + pipe.width
  
  // 检查是否在管道的X范围内
  if (birdRight > pipeLeft && birdLeft < pipeRight) {
    // 检查是否撞到上管道或下管道
    if (birdTop < pipe.topHeight || birdBottom > canvasHeight - pipe.bottomHeight) {
      return true
    }
  }
  
  return false
}

// 绘制背景
const drawBackground = () => {
  if (!ctx) return
  
  // 天空渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
  gradient.addColorStop(0, '#87CEEB')
  gradient.addColorStop(1, '#E0F6FF')
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // 云朵装饰
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
  drawCloud(80, 100, 30)
  drawCloud(250, 80, 25)
  drawCloud(320, 120, 35)
}

// 绘制云朵
const drawCloud = (x: number, y: number, size: number) => {
  if (!ctx) return
  
  ctx.beginPath()
  ctx.arc(x, y, size, 0, Math.PI * 2)
  ctx.arc(x + size * 0.8, y, size * 0.8, 0, Math.PI * 2)
  ctx.arc(x + size * 1.6, y, size, 0, Math.PI * 2)
  ctx.arc(x + size * 0.8, y - size * 0.5, size * 0.6, 0, Math.PI * 2)
  ctx.fill()
}

// 绘制小鸟
const drawBird = () => {
  if (!ctx) return
  
  const { x, y, size, velocity } = bird.value
  
  // 更新翅膀动画时间 (更自然的频率)
  wingAnimationTime += 0.4
  
  // 根据速度计算小鸟的倾斜角度
  const angle = Math.min(velocity * 0.05, 0.8)
  
  // 翅膀扇动动画 (更复杂的波形，模拟真实鸟类扇动)
  const primaryWingFlap = Math.sin(wingAnimationTime) * 0.6
  const secondaryWingFlap = Math.sin(wingAnimationTime * 1.5) * 0.3
  const wingAngle = primaryWingFlap + secondaryWingFlap * 0.5
  
  ctx.save()
  ctx.translate(x + size/2, y + size/2)
  ctx.rotate(angle)
  
  // 绘制翅膀 (在身体之前，这样身体会部分遮挡翅膀)
  ctx.save()
  
  // 翅膀基础位置和旋转
  const wingBaseX = -size * 0.1
  const wingBaseY = 0
  ctx.translate(wingBaseX, wingBaseY)
  ctx.rotate(wingAngle * 0.8)
  
  // 翅膀主体 (更真实的翅膀形状)
  const wingGradient = ctx.createLinearGradient(-size * 0.4, -size * 0.2, -size * 0.05, size * 0.3)
  wingGradient.addColorStop(0, '#2C5282')
  wingGradient.addColorStop(0.3, '#3182CE')
  wingGradient.addColorStop(0.7, '#4299E1')
  wingGradient.addColorStop(1, '#63B3ED')
  
  ctx.fillStyle = wingGradient
  ctx.beginPath()
  // 更像真实鸟翅膀的形状
  ctx.moveTo(0, 0) // 翅膀根部
  ctx.quadraticCurveTo(-size * 0.35, -size * 0.1, -size * 0.45, 0) // 翅膀上弧
  ctx.quadraticCurveTo(-size * 0.4, size * 0.15, -size * 0.25, size * 0.25) // 翅膀下弧
  ctx.quadraticCurveTo(-size * 0.1, size * 0.2, 0, size * 0.1) // 回到根部
  ctx.closePath()
  ctx.fill()
  
  // 翅膀羽毛纹理
  ctx.strokeStyle = '#2C5282'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  // 主羽干
  ctx.moveTo(0, 0)
  ctx.lineTo(-size * 0.35, size * 0.05)
  ctx.stroke()
  
  // 次要羽干
  ctx.lineWidth = 1
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath()
    ctx.moveTo(-size * 0.08 * i, size * 0.02 * i)
    ctx.lineTo(-size * 0.25 - size * 0.05 * i, size * 0.08 + size * 0.04 * i)
    ctx.stroke()
  }
  
  // 翅膀边缘高光
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-size * 0.1, -size * 0.05)
  ctx.quadraticCurveTo(-size * 0.3, -size * 0.08, -size * 0.4, -size * 0.02)
  ctx.stroke()
  
  ctx.restore()
  
  // 小鸟身体 (更圆润的椭圆形)
  const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, size * 0.1, size * 0.5)
  bodyGradient.addColorStop(0, '#FED570')
  bodyGradient.addColorStop(0.4, '#F6AD55')
  bodyGradient.addColorStop(0.8, '#ED8936')
  bodyGradient.addColorStop(1, '#DD6B20')
  
  ctx.fillStyle = bodyGradient
  ctx.beginPath()
  ctx.ellipse(0, 0, size * 0.45, size * 0.35, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 身体边框和细节
  ctx.strokeStyle = '#C05621'
  ctx.lineWidth = 1.5
  ctx.stroke()
  
  // 胸部斑纹
  ctx.fillStyle = '#FED570'
  ctx.beginPath()
  ctx.ellipse(size * 0.05, size * 0.1, size * 0.15, size * 0.2, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // 小鸟头部
  const headGradient = ctx.createRadialGradient(size * 0.35, -size * 0.1, 0, size * 0.35, -size * 0.1, size * 0.25)
  headGradient.addColorStop(0, '#FEF570')
  headGradient.addColorStop(0.6, '#FBBF24')
  headGradient.addColorStop(1, '#F59E0B')
  
  ctx.fillStyle = headGradient
  ctx.beginPath()
  ctx.arc(size * 0.35, -size * 0.1, size * 0.22, 0, Math.PI * 2)
  ctx.fill()
  
  // 头部边框
  ctx.strokeStyle = '#D97706'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // 小鸟眼睛 (更大更生动)
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(size * 0.42, -size * 0.15, size * 0.08, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = '#000000'
  ctx.beginPath()
  ctx.arc(size * 0.44, -size * 0.13, size * 0.05, 0, Math.PI * 2)
  ctx.fill()
  
  // 眼睛高光
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(size * 0.46, -size * 0.15, size * 0.015, 0, Math.PI * 2)
  ctx.fill()
  
  // 小鸟嘴巴 (更立体的形状)
  const beakGradient = ctx.createLinearGradient(size * 0.5, -size * 0.05, size * 0.7, 0)
  beakGradient.addColorStop(0, '#F97316')
  beakGradient.addColorStop(1, '#EA580C')
  
  ctx.fillStyle = beakGradient
  ctx.beginPath()
  ctx.moveTo(size * 0.52, -size * 0.08)
  ctx.lineTo(size * 0.7, -size * 0.03)
  ctx.lineTo(size * 0.68, 0)
  ctx.lineTo(size * 0.52, -size * 0.02)
  ctx.closePath()
  ctx.fill()
  
  // 嘴巴边框
  ctx.strokeStyle = '#C2410C'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // 小鸟尾巴 (更精细的羽毛状)
  const tailGradient = ctx.createLinearGradient(-size * 0.4, 0, -size * 0.7, 0)
  tailGradient.addColorStop(0, '#3B82F6')
  tailGradient.addColorStop(0.5, '#2563EB')
  tailGradient.addColorStop(1, '#1D4ED8')
  
  ctx.fillStyle = tailGradient
  ctx.beginPath()
  // 主尾羽
  ctx.moveTo(-size * 0.4, 0)
  ctx.quadraticCurveTo(-size * 0.65, -size * 0.12, -size * 0.7, -size * 0.05)
  ctx.lineTo(-size * 0.68, 0)
  ctx.quadraticCurveTo(-size * 0.65, size * 0.12, -size * 0.7, size * 0.05)
  ctx.lineTo(-size * 0.4, size * 0.03)
  ctx.closePath()
  ctx.fill()
  
  // 尾羽纹理
  ctx.strokeStyle = '#1E40AF'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(-size * 0.4, -size * 0.02)
  ctx.lineTo(-size * 0.6, -size * 0.08)
  ctx.moveTo(-size * 0.4, 0)
  ctx.lineTo(-size * 0.65, 0)
  ctx.moveTo(-size * 0.4, size * 0.02)
  ctx.lineTo(-size * 0.6, size * 0.08)
  ctx.stroke()
  
  ctx.restore()
}

// 绘制管道
const drawPipes = () => {
  if (!ctx) return
  
  pipes.value.forEach(pipe => {
    // 管道渐变
    const gradient = ctx!.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0)
    gradient.addColorStop(0, '#228B22')
    gradient.addColorStop(0.5, '#32CD32')
    gradient.addColorStop(1, '#228B22')
    
    ctx!.fillStyle = gradient
    
    // 上管道
    ctx!.fillRect(pipe.x, 0, pipe.width, pipe.topHeight)
    
    // 下管道
    ctx!.fillRect(pipe.x, canvasHeight - pipe.bottomHeight, pipe.width, pipe.bottomHeight)
    
    // 管道边框
    ctx!.strokeStyle = '#006400'
    ctx!.lineWidth = 2
    ctx!.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight)
    ctx!.strokeRect(pipe.x, canvasHeight - pipe.bottomHeight, pipe.width, pipe.bottomHeight)
    
    // 管道顶部装饰
    ctx!.fillStyle = '#32CD32'
    ctx!.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20)
    ctx!.fillRect(pipe.x - 5, canvasHeight - pipe.bottomHeight, pipe.width + 10, 20)
  })
}

// 绘制分数
const drawScore = () => {
  if (!ctx) return
  
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 3
  
  const text = score.value.toString()
  ctx.strokeText(text, canvasWidth / 2, 80)
  ctx.fillText(text, canvasWidth / 2, 80)
}

// 渲染游戏
const render = () => {
  if (!ctx) return
  
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  
  // 绘制背景
  drawBackground()
  
  // 绘制管道
  drawPipes()
  
  // 绘制小鸟
  drawBird()
  
  // 绘制分数
  if (gameStarted.value) {
    drawScore()
  }
}

// 游戏循环
const gameLoop = () => {
  if (!gameRunning.value || gamePaused.value || gameOver.value) return
  
  updateGame()
  render()
  
  animationFrame = requestAnimationFrame(gameLoop)
}

// 结束游戏
const endGame = () => {
  gameOver.value = true
  gameRunning.value = false
  
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  
  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('flappyBirdHighScore', highScore.value.toString())
    ElMessage.success('🎉 新纪录！')
  }
}

// 键盘控制
const handleKeydown = (event: KeyboardEvent) => {
  if (showHelp.value) return
  
  switch (event.key) {
    case ' ':
      event.preventDefault()
      if (!gameStarted.value || gameOver.value) {
        startGame()
      } else {
        jump()
      }
      break
    case 'p':
    case 'P':
      event.preventDefault()
      if (gameRunning.value && !gameOver.value) {
        pauseGame()
      }
      break
  }
}

// 加载最高分
const loadHighScore = () => {
  const saved = localStorage.getItem('flappyBirdHighScore')
  if (saved) {
    highScore.value = parseInt(saved, 10)
  }
}

// 初始化画布
const initCanvas = async () => {
  await nextTick()
  
  if (gameCanvas.value) {
    ctx = gameCanvas.value.getContext('2d')
    if (ctx) {
      initGame()
    }
  }
}

// 生命周期
onMounted(() => {
  loadHighScore()
  initCanvas()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.flappy-bird {
  min-height: 100vh;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

.hero-section {
  background: rgba(0, 0, 0, 0.1);
  padding: 80px 0;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-description {
  font-size: 20px;
  opacity: 0.9;
  line-height: 1.6;
}

.tool-card {
  max-width: 1250px;
  margin: -40px auto 40px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.15),
    0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.card-header {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  padding: 30px;
  text-align: center;
}

.card-header h3 {
  font-size: 28px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.card-description {
  font-size: 16px;
  opacity: 0.9;
}

.card-body {
  padding: 40px;
}

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.game-info {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-item .label {
  font-size: 14px;
  color: #666;
}

.info-item .value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.info-item .value.score {
  color: #74b9ff;
}

.game-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.game-main {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
  align-items: flex-start;
}

.game-canvas-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.game-canvas {
  display: block;
  border-radius: 12px;
}

.start-overlay,
.game-over-overlay,
.pause-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.start-message,
.game-over-message,
.pause-message {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 300px;
}

.start-message h3,
.game-over-message h3,
.pause-message h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
}

.start-message p,
.game-over-message p,
.pause-message p {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.start-icon {
  font-size: 32px;
  margin-top: 12px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.game-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.controls-info,
.rules-info,
.tips-info {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
}

.controls-info p,
.rules-info p,
.tips-info p {
  margin: 8px 0;
  color: #666;
  line-height: 1.4;
}

.help-content {
  line-height: 1.6;
}

.help-content h4 {
  color: #333;
  margin: 20px 0 10px;
  font-size: 16px;
}

.help-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.help-content li {
  margin: 8px 0;
  color: #555;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-description {
    font-size: 18px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .game-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .game-info {
    justify-content: space-around;
  }
  
  .game-main {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .game-panel {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .panel-section {
    flex: 1;
    min-width: 200px;
    margin: 0 5px;
  }
  
  .game-canvas-container {
    transform: scale(0.8);
    transform-origin: center;
  }
  
  .start-message,
  .game-over-message,
  .pause-message {
    max-width: 250px;
    padding: 20px;
  }
  
  .game-buttons {
    justify-content: center;
  }
}
</style>
