<template>
  <div class="snake-game">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Trophy /></el-icon>
        </div>
        <h1 class="hero-title">贪吃蛇游戏</h1>
        <p class="hero-description">经典街机游戏，考验你的反应速度和策略思维</p>
      </div>
    </div>

    <!-- 游戏主体 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><VideoPlay /></el-icon>
          游戏区域
        </h3>
        <p class="card-description">使用方向键或WASD控制蛇的移动</p>
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
              <span class="label">难度:</span>
              <span class="value">{{ difficultyNames[difficulty] }}</span>
            </div>
            <div class="info-item">
              <span class="label">长度:</span>
              <span class="value">{{ snake.length }}</span>
            </div>
          </div>
          
          <div class="game-buttons">
            <el-button 
              v-if="!gameRunning && !gameOver"
              @click="startGame"
              type="primary"
              size="large"
            >
              <el-icon><VideoPlay /></el-icon>
              开始游戏
            </el-button>
            
            <el-button 
              v-if="gameRunning"
              @click="pauseGame"
              type="warning"
              size="large"
            >
              <el-icon><VideoPause /></el-icon>
              {{ paused ? '继续' : '暂停' }}
            </el-button>
            
            <el-button 
              v-if="gameOver"
              @click="restartGame"
              type="success"
              size="large"
            >
              <el-icon><RefreshRight /></el-icon>
              重新开始
            </el-button>
            
            <el-button 
              @click="showSettings = true"
              size="large"
              :disabled="gameRunning && !paused"
            >
              <el-icon><Setting /></el-icon>
              设置
            </el-button>
          </div>
        </div>

        <!-- 游戏画布容器 -->
        <div class="game-container">
          <canvas
            ref="gameCanvas"
            :width="canvasWidth"
            :height="canvasHeight"
            @click="handleCanvasClick"
          ></canvas>
          
          <!-- 游戏状态覆盖层 -->
          <div v-if="!gameRunning || paused || gameOver" class="game-overlay">
            <div v-if="!gameRunning && !gameOver" class="start-message">
              <h3>准备开始</h3>
              <p>点击"开始游戏"或按空格键开始</p>
              <div class="controls-help">
                <p>控制方式：</p>
                <div class="control-keys">
                  <span>↑↓←→</span>
                  <span>或</span>
                  <span>WASD</span>
                </div>
              </div>
            </div>
            
            <div v-if="paused" class="pause-message">
              <h3>游戏暂停</h3>
              <p>按空格键或点击继续按钮恢复游戏</p>
            </div>
            
            <div v-if="gameOver" class="game-over-message">
              <h3>游戏结束</h3>
              <p>得分: <strong>{{ score }}</strong></p>
              <p v-if="score === highScore" class="new-record">🎉 新纪录！</p>
              <p>点击"重新开始"再来一局</p>
            </div>
          </div>
        </div>

        <!-- 移动端控制按钮 -->
        <div class="mobile-controls" v-if="isMobile">
          <div class="direction-pad">
            <div class="direction-row">
              <div></div>
              <button @click="changeDirection('up')" class="direction-btn up">↑</button>
              <div></div>
            </div>
            <div class="direction-row">
              <button @click="changeDirection('left')" class="direction-btn left">←</button>
              <div class="center-pad"></div>
              <button @click="changeDirection('right')" class="direction-btn right">→</button>
            </div>
            <div class="direction-row">
              <div></div>
              <button @click="changeDirection('down')" class="direction-btn down">↓</button>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Rank /></el-icon>
          游戏记录
        </h3>
        <p class="card-description">历史最佳成绩</p>
      </div>
      
      <div class="card-body">
        <div class="leaderboard">
          <div v-if="gameHistory.length === 0" class="no-records">
            <p>暂无游戏记录，开始第一局游戏吧！</p>
          </div>
          <div v-else class="records-list">
            <div 
              v-for="(record, index) in gameHistory.slice(0, 10)"
              :key="index"
              class="record-item"
            >
              <span class="rank">#{{ index + 1 }}</span>
              <span class="record-score">{{ record.score }}</span>
              <span class="record-date">{{ formatDate(record.date) }}</span>
              <span class="record-difficulty">{{ difficultyNames[record.difficulty] }}</span>
            </div>
          </div>
          <div class="record-actions">
            <el-button 
              @click="clearHistory" 
              type="danger" 
              size="small"
              :disabled="gameHistory.length === 0"
            >
              清空记录
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置对话框 -->
    <el-dialog
      v-model="showSettings"
      title="游戏设置"
      width="400px"
    >
      <div class="settings-content">
        <div class="setting-item">
          <label>难度等级:</label>
          <el-select v-model="difficulty" :disabled="gameRunning && !paused">
            <el-option
              v-for="(name, value) in difficultyNames"
              :key="value"
              :label="name"
              :value="parseInt(value as unknown as string)"
            />
          </el-select>
        </div>
        
        <div class="setting-item">
          <label>游戏尺寸:</label>
          <el-select v-model="gameSize" :disabled="gameRunning && !paused">
            <el-option label="小 (20x20)" :value="20" />
            <el-option label="中 (25x25)" :value="25" />
            <el-option label="大 (30x30)" :value="30" />
          </el-select>
        </div>
        
        <div class="setting-item">
          <label>主题颜色:</label>
          <el-select v-model="theme">
            <el-option label="经典绿色" value="classic" />
            <el-option label="霓虹蓝" value="neon" />
            <el-option label="复古橙" value="retro" />
            <el-option label="粉红少女" value="pink" />
          </el-select>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="applySettings">应用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Trophy,
  VideoPlay,
  VideoPause,
  RefreshRight,
  Setting,
  Rank
} from '@element-plus/icons-vue'

// 游戏状态
const gameRunning = ref(false)
const paused = ref(false)
const gameOver = ref(false)
const score = ref(0)
const highScore = ref(0)
const showSettings = ref(false)

// 游戏配置
const difficulty = ref(1)
const gameSize = ref(25)
const theme = ref('classic')
const difficultyNames: Record<number, string> = {
  0: '简单',
  1: '普通',
  2: '困难',
  3: '地狱'
}

// 游戏元素
const gameCanvas = ref<HTMLCanvasElement>()
const canvasWidth = computed(() => gameSize.value * 20)
const canvasHeight = computed(() => gameSize.value * 20)

// 蛇和食物
const snake = ref<Array<{x: number, y: number}>>([])
const direction = ref('right')
const nextDirection = ref('right')
const food = ref({x: 0, y: 0})

// 游戏循环
let gameLoop: number | null = null
const gameSpeed = computed(() => {
  const speeds = [200, 150, 100, 80]
  return speeds[difficulty.value] || 150
})

// 游戏历史
const gameHistory = ref<Array<{score: number, date: number, difficulty: number}>>([])

// 移动端检测
const isMobile = ref(false)

// 主题配置
const themes = {
  classic: {
    snake: '#4ade80',
    food: '#ef4444',
    background: '#1f2937',
    grid: '#374151'
  },
  neon: {
    snake: '#06b6d4',
    food: '#f59e0b',
    background: '#0f172a',
    grid: '#1e293b'
  },
  retro: {
    snake: '#f97316',
    food: '#eab308',
    background: '#451a03',
    grid: '#78350f'
  },
  pink: {
    snake: '#ec4899',
    food: '#8b5cf6',
    background: '#500724',
    grid: '#831843'
  }
}

// 初始化游戏
const initGame = () => {
  snake.value = [
    {x: Math.floor(gameSize.value / 2), y: Math.floor(gameSize.value / 2)}
  ]
  direction.value = 'right'
  nextDirection.value = 'right'
  score.value = 0
  gameOver.value = false
  generateFood()
  drawGame()
}

// 生成食物
const generateFood = () => {
  do {
    food.value = {
      x: Math.floor(Math.random() * gameSize.value),
      y: Math.floor(Math.random() * gameSize.value)
    }
  } while (snake.value.some(segment => segment.x === food.value.x && segment.y === food.value.y))
}

// 开始游戏
const startGame = () => {
  initGame()
  gameRunning.value = true
  paused.value = false
  gameLoop = setInterval(updateGame, gameSpeed.value)
}

// 暂停/继续游戏
const pauseGame = () => {
  paused.value = !paused.value
  if (paused.value) {
    if (gameLoop) {
      clearInterval(gameLoop)
      gameLoop = null
    }
  } else {
    gameLoop = setInterval(updateGame, gameSpeed.value)
  }
}

// 重新开始游戏
const restartGame = () => {
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }
  gameRunning.value = false
  gameOver.value = false
  paused.value = false
  initGame()
}

// 游戏更新逻辑
const updateGame = () => {
  if (paused.value || gameOver.value) return

  // 更新方向
  direction.value = nextDirection.value

  // 计算蛇头新位置
  const head = { ...snake.value[0] }
  switch (direction.value) {
    case 'up':
      head.y--
      break
    case 'down':
      head.y++
      break
    case 'left':
      head.x--
      break
    case 'right':
      head.x++
      break
  }

  // 检查碰撞
  if (checkCollision(head)) {
    endGame()
    return
  }

  // 添加新头部
  snake.value.unshift(head)

  // 检查是否吃到食物
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10 + difficulty.value * 5
    generateFood()
  } else {
    // 移除尾部
    snake.value.pop()
  }

  drawGame()
}

// 检查碰撞
const checkCollision = (head: {x: number, y: number}) => {
  // 撞墙
  if (head.x < 0 || head.x >= gameSize.value || head.y < 0 || head.y >= gameSize.value) {
    return true
  }
  
  // 撞自己
  return snake.value.some(segment => segment.x === head.x && segment.y === head.y)
}

// 结束游戏
const endGame = () => {
  gameOver.value = true
  gameRunning.value = false
  if (gameLoop) {
    clearInterval(gameLoop)
    gameLoop = null
  }

  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('snakeHighScore', highScore.value.toString())
    ElMessage.success('恭喜！创造了新纪录！')
  }

  // 保存游戏记录
  gameHistory.value.unshift({
    score: score.value,
    date: Date.now(),
    difficulty: difficulty.value
  })
  gameHistory.value = gameHistory.value.slice(0, 50) // 只保留前50条记录
  localStorage.setItem('snakeGameHistory', JSON.stringify(gameHistory.value))
}

// 绘制游戏
const drawGame = () => {
  const canvas = gameCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const currentTheme = themes[theme.value as keyof typeof themes]
  const cellSize = 20

  // 清空画布
  ctx.fillStyle = currentTheme.background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 绘制网格
  ctx.strokeStyle = currentTheme.grid
  ctx.lineWidth = 1
  for (let i = 0; i <= gameSize.value; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cellSize, 0)
    ctx.lineTo(i * cellSize, canvas.height)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(0, i * cellSize)
    ctx.lineTo(canvas.width, i * cellSize)
    ctx.stroke()
  }

  // 绘制蛇
  ctx.fillStyle = currentTheme.snake
  snake.value.forEach((segment, index) => {
    ctx.fillRect(
      segment.x * cellSize + 1,
      segment.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    )
    
    // 蛇头特殊效果
    if (index === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.fillRect(
        segment.x * cellSize + 4,
        segment.y * cellSize + 4,
        cellSize - 8,
        cellSize - 8
      )
      ctx.fillStyle = currentTheme.snake
    }
  })

  // 绘制食物
  ctx.fillStyle = currentTheme.food
  ctx.fillRect(
    food.value.x * cellSize + 2,
    food.value.y * cellSize + 2,
    cellSize - 4,
    cellSize - 4
  )
  
  // 食物发光效果
  ctx.shadowColor = currentTheme.food
  ctx.shadowBlur = 10
  ctx.fillRect(
    food.value.x * cellSize + 6,
    food.value.y * cellSize + 6,
    cellSize - 12,
    cellSize - 12
  )
  ctx.shadowBlur = 0
}

// 改变方向
const changeDirection = (newDirection: string) => {
  if (!gameRunning.value || paused.value) return

  const opposites = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  }

  if (newDirection !== opposites[direction.value as keyof typeof opposites]) {
    nextDirection.value = newDirection
  }
}

// 键盘控制
const handleKeyPress = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase()
  
  switch (key) {
    case ' ':
      event.preventDefault()
      if (!gameRunning.value && !gameOver.value) {
        startGame()
      } else if (gameRunning.value) {
        pauseGame()
      }
      break
    case 'r':
      if (gameOver.value) {
        restartGame()
      }
      break
    case 'arrowup':
    case 'w':
      event.preventDefault()
      changeDirection('up')
      break
    case 'arrowdown':
    case 's':
      event.preventDefault()
      changeDirection('down')
      break
    case 'arrowleft':
    case 'a':
      event.preventDefault()
      changeDirection('left')
      break
    case 'arrowright':
    case 'd':
      event.preventDefault()
      changeDirection('right')
      break
  }
}

// 处理画布点击
const handleCanvasClick = () => {
  if (!gameRunning.value && !gameOver.value) {
    startGame()
  } else if (gameRunning.value && !paused.value) {
    pauseGame()
  }
}

// 应用设置
const applySettings = () => {
  const wasRunning = gameRunning.value
  if (wasRunning) {
    restartGame()
  }
  
  showSettings.value = false
  
  nextTick(() => {
    initGame()
    if (wasRunning) {
      ElMessage.success('设置已应用，游戏已重新开始')
    }
  })
}

// 清空历史记录
const clearHistory = () => {
  gameHistory.value = []
  localStorage.removeItem('snakeGameHistory')
  ElMessage.success('游戏记录已清空')
}

// 格式化日期
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 检测移动端
const checkMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 生命周期
onMounted(() => {
  checkMobile()
  
  // 加载保存的数据
  const savedHighScore = localStorage.getItem('snakeHighScore')
  if (savedHighScore) {
    highScore.value = parseInt(savedHighScore)
  }
  
  const savedHistory = localStorage.getItem('snakeGameHistory')
  if (savedHistory) {
    try {
      gameHistory.value = JSON.parse(savedHistory)
    } catch (e) {
      gameHistory.value = []
    }
  }
  
  initGame()
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  if (gameLoop) {
    clearInterval(gameLoop)
  }
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.snake-game {
  --tool-color: linear-gradient(135deg, #10b981 0%, #059669 100%);
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 引用公共样式 */
@import '@/styles/modern-tool.css';

/* 游戏控制面板 */
.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 12px;
  border: 1px solid #bbf7d0;
}

.game-info {
  display: flex;
  gap: 30px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-item .label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #059669;
}

.info-item .score {
  color: #dc2626;
  font-size: 24px;
}

.game-buttons {
  display: flex;
  gap: 10px;
}

/* 游戏容器 */
.game-container {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

canvas {
  border: 3px solid #10b981;
  border-radius: 8px;
  background: #1f2937;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
}

/* 游戏覆盖层 */
.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  text-align: center;
}

.start-message,
.pause-message,
.game-over-message {
  padding: 30px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.start-message h3,
.pause-message h3,
.game-over-message h3 {
  margin: 0 0 15px 0;
  color: #10b981;
  font-size: 24px;
}

.controls-help {
  margin-top: 20px;
}

.control-keys {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.control-keys span {
  background: rgba(16, 185, 129, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  font-family: monospace;
  font-weight: bold;
}

.new-record {
  color: #fbbf24 !important;
  font-size: 18px;
  margin: 10px 0 !important;
}

/* 移动端控制 */
.mobile-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.direction-pad {
  display: grid;
  grid-template-rows: repeat(3, 60px);
  gap: 5px;
}

.direction-row {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  gap: 5px;
}

.direction-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.direction-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
}

.direction-btn:active {
  transform: translateY(0);
}

.center-pad {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  border: 2px solid #10b981;
}

/* 排行榜 */
.leaderboard {
  min-height: 200px;
}

.no-records {
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.record-item {
  display: grid;
  grid-template-columns: 60px 100px 1fr 80px;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 8px;
  border: 1px solid #bbf7d0;
}

.rank {
  font-weight: bold;
  color: #059669;
}

.record-score {
  font-weight: bold;
  font-size: 18px;
  color: #dc2626;
}

.record-date {
  color: #6b7280;
  font-size: 14px;
}

.record-difficulty {
  font-size: 12px;
  color: #10b981;
  text-align: center;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.record-actions {
  text-align: center;
  margin-top: 20px;
}

/* 设置对话框 */
.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item label {
  font-weight: 500;
  color: #374151;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-controls {
    flex-direction: column;
    gap: 20px;
  }
  
  .game-info {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  canvas {
    max-width: 100%;
    height: auto;
  }
  
  .record-item {
    grid-template-columns: 50px 80px 1fr 60px;
    font-size: 14px;
  }
  
  .info-item .value {
    font-size: 16px;
  }
  
  .info-item .score {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .game-info {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .direction-btn {
    font-size: 20px;
  }
  
  .record-item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 8px;
  }
}
</style>
