<template>
  <div class="tetris-game">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.tetris') }}</h1>
        <p class="hero-description">{{ t('pages.tetris.description') }}</p>
      </div>
    </div>

    <!-- 游戏主体 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Trophy /></el-icon>
          {{ t('pages.tetris.gameArea') }}
        </h3>
        <p class="card-description">{{ t('pages.tetris.instructions') }}</p>
      </div>
      
      <div class="card-body">
        <!-- 游戏控制面板 -->
        <div class="game-controls">
          <div class="game-info">
            <div class="info-item">
              <span class="label">{{ t('pages.tetris.score') }}:</span>
              <span class="value score">{{ score }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('pages.tetris.level') }}:</span>
              <span class="value">{{ level }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('pages.tetris.lines') }}:</span>
              <span class="value">{{ lines }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ t('pages.tetris.highScore') }}:</span>
              <span class="value">{{ highScore }}</span>
            </div>
          </div>
          
          <div class="game-buttons">
            <el-button 
              @click="startGame" 
              type="primary" 
              :icon="VideoPlay"
              :disabled="gameRunning && !gamePaused"
            >
              {{ gameRunning ? (gamePaused ? '继续' : '游戏中...') : '开始游戏' }}
            </el-button>
            <el-button 
              @click="pauseGame" 
              v-if="gameRunning" 
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
          <!-- 下一个方块预览 -->
          <div class="next-piece">
            <h4>下一个</h4>
            <div class="next-preview">
              <div
                v-for="(row, y) in nextPieceGrid"
                :key="y"
                class="preview-row"
              >
                <div
                  v-for="(cell, x) in row"
                  :key="x"
                  :class="[
                    'preview-cell',
                    cell ? `color-${nextPiece?.color || 0}` : ''
                  ]"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- 游戏板 -->
          <div class="game-board">
            <div
              v-for="(row, y) in displayGrid"
              :key="y"
              class="board-row"
            >
              <div
                v-for="(cell, x) in row"
                :key="x"
                :class="[
                  'board-cell',
                  cell ? `color-${cell}` : '',
                  { 'clearing': clearingRows.includes(y) }
                ]"
              ></div>
            </div>
          </div>

          <!-- 游戏信息面板 -->
          <div class="game-panel">
            <div class="panel-section">
              <h4>操作说明</h4>
              <div class="controls-info">
                <p>← → 左右移动</p>
                <p>↓ 快速下落</p>
                <p>↑ 旋转方块</p>
                <p>空格 暂停</p>
              </div>
            </div>
            
            <div class="panel-section">
              <h4>计分规则</h4>
              <div class="scoring-info">
                <p>单行: 100分</p>
                <p>双行: 300分</p>
                <p>三行: 500分</p>
                <p>四行: 800分</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏状态 -->
        <div v-if="gameOver" class="game-status">
          <div class="game-over-message">
            <h3>🎮 游戏结束！</h3>
            <p>最终得分: {{ score }}</p>
            <p>消除行数: {{ lines }}</p>
            <p>达到等级: {{ level }}</p>
            <p v-if="score > highScore">🎉 新纪录！</p>
            <el-button @click="startGame" type="primary" size="large">
              重新开始
            </el-button>
          </div>
        </div>

        <!-- 暂停提示 -->
        <div v-if="gamePaused && gameRunning" class="pause-overlay">
          <div class="pause-message">
            <h3>⏸️ 游戏暂停</h3>
            <p>按空格键或点击继续按钮恢复游戏</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 帮助弹窗 -->
    <el-dialog v-model="showHelp" title="游戏说明" width="500px">
      <div class="help-content">
        <h4>🎯 游戏目标</h4>
        <p>控制下落的方块，填满水平行来消除并获得分数！</p>
        
        <h4>🎮 操作方法</h4>
        <ul>
          <li>← → 方向键：左右移动方块</li>
          <li>↓ 方向键：加速方块下落</li>
          <li>↑ 方向键：旋转方块</li>
          <li>空格键：暂停/继续游戏</li>
        </ul>
        
        <h4>🏆 游戏规则</h4>
        <ul>
          <li>方块会自动从顶部下落</li>
          <li>填满一行时该行会被消除</li>
          <li>同时消除多行可获得更高分数</li>
          <li>方块堆积到顶部时游戏结束</li>
          <li>等级越高下落速度越快</li>
        </ul>
        
        <h4>💡 游戏技巧</h4>
        <ul>
          <li>尽量同时消除多行获得更高分数</li>
          <li>合理利用不同形状的方块</li>
          <li>保持底部平整，避免留下空隙</li>
          <li>提前规划方块的摆放位置</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  Grid,
  Trophy,
  VideoPlay,
  VideoPause,
  QuestionFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()
// 方块类型定义
interface Piece {
  shape: number[][]
  color: number
  x: number
  y: number
}

// 方块形状定义
const PIECES = [
  // I型
  {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 1
  },
  // O型
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 2
  },
  // T型
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 3
  },
  // S型
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 4
  },
  // Z型
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 5
  },
  // J型
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 6
  },
  // L型
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 7
  }
]

// 游戏状态
const BOARD_WIDTH = 12
const BOARD_HEIGHT = 20
const board = ref<number[][]>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)))
const currentPiece = ref<Piece | null>(null)
const nextPiece = ref<Piece | null>(null)
const score = ref(0)
const level = ref(1)
const lines = ref(0)
const gameRunning = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)
const showHelp = ref(false)
const clearingRows = ref<number[]>([])

// 游戏计时器
let gameTimer: number | null = null
let dropSpeed = ref(1000) // 毫秒

// 最高分
const highScore = ref(0)

// 下一个方块预览网格
const nextPieceGrid = computed(() => {
  if (!nextPiece.value) return Array(4).fill(null).map(() => Array(4).fill(0))
  
  const grid = Array(4).fill(null).map(() => Array(4).fill(0))
  const shape = nextPiece.value.shape
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        grid[y][x] = 1
      }
    }
  }
  
  return grid
})

// 显示网格（包含当前方块）
const displayGrid = computed(() => {
  const grid = board.value.map(row => [...row])
  
  if (currentPiece.value && gameRunning.value && !gamePaused.value) {
    const piece = currentPiece.value
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y
          const boardX = piece.x + x
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            grid[boardY][boardX] = piece.color
          }
        }
      }
    }
  }
  
  return grid
})

// 创建新方块
const createPiece = (): Piece => {
  const pieceData = PIECES[Math.floor(Math.random() * PIECES.length)]
  return {
    shape: pieceData.shape.map(row => [...row]),
    color: pieceData.color,
    x: Math.floor((BOARD_WIDTH - pieceData.shape[0].length) / 2),
    y: 0
  }
}

// 初始化游戏
const initGame = () => {
  board.value = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  score.value = 0
  level.value = 1
  lines.value = 0
  gameRunning.value = false
  gamePaused.value = false
  gameOver.value = false
  clearingRows.value = []
  dropSpeed.value = 1000
  
  nextPiece.value = createPiece()
  currentPiece.value = createPiece()
  nextPiece.value = createPiece()
}

// 开始游戏
const startGame = () => {
  if (gameOver.value) {
    initGame()
  }
  
  gameRunning.value = true
  gamePaused.value = false
  startDropTimer()
}

// 暂停游戏
const pauseGame = () => {
  gamePaused.value = !gamePaused.value
  
  if (gamePaused.value) {
    stopDropTimer()
  } else {
    startDropTimer()
  }
}

// 开始下落计时器
const startDropTimer = () => {
  stopDropTimer()
  if (!gamePaused.value && gameRunning.value) {
    gameTimer = setInterval(() => {
      if (!gamePaused.value && gameRunning.value) {
        dropPiece()
      }
    }, dropSpeed.value)
  }
}

// 停止下落计时器
const stopDropTimer = () => {
  if (gameTimer) {
    clearInterval(gameTimer)
    gameTimer = null
  }
}

// 检查位置是否有效
const isValidPosition = (piece: Piece, newX: number, newY: number, newShape?: number[][]): boolean => {
  const shape = newShape || piece.shape
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = newX + x
        const boardY = newY + y
        
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false
        }
        
        if (boardY >= 0 && board.value[boardY][boardX]) {
          return false
        }
      }
    }
  }
  
  return true
}

// 移动方块
const movePiece = (dx: number, dy: number) => {
  if (!currentPiece.value || !gameRunning.value || gamePaused.value) return
  
  const newX = currentPiece.value.x + dx
  const newY = currentPiece.value.y + dy
  
  if (isValidPosition(currentPiece.value, newX, newY)) {
    currentPiece.value.x = newX
    currentPiece.value.y = newY
    return true
  }
  
  return false
}

// 旋转方块
const rotatePiece = () => {
  if (!currentPiece.value || !gameRunning.value || gamePaused.value) return
  
  const shape = currentPiece.value.shape
  const rotated = shape[0].map((_, i) => shape.map(row => row[i]).reverse())
  
  if (isValidPosition(currentPiece.value, currentPiece.value.x, currentPiece.value.y, rotated)) {
    currentPiece.value.shape = rotated
  }
}

// 方块下落
const dropPiece = () => {
  if (!currentPiece.value || !gameRunning.value || gamePaused.value) return
  
  if (!movePiece(0, 1)) {
    // 方块无法继续下落，固定到游戏板
    fixPiece()
  }
}

// 固定方块到游戏板
const fixPiece = () => {
  if (!currentPiece.value) return
  
  const piece = currentPiece.value
  
  // 将方块添加到游戏板
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y
        const boardX = piece.x + x
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          board.value[boardY][boardX] = piece.color
        }
      }
    }
  }
  
  // 检查并清除满行
  clearLines()
  
  // 生成新方块
  currentPiece.value = nextPiece.value
  nextPiece.value = createPiece()
  
  // 检查游戏是否结束
  if (!isValidPosition(currentPiece.value!, currentPiece.value!.x, currentPiece.value!.y)) {
    endGame()
  }
}

// 清除满行
const clearLines = async () => {
  const linesToClear: number[] = []
  
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board.value[y].every(cell => cell !== 0)) {
      linesToClear.push(y)
    }
  }
  
  if (linesToClear.length > 0) {
    // 显示清除动画
    clearingRows.value = linesToClear
    
    // 等待动画
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 移除满行
    for (let i = linesToClear.length - 1; i >= 0; i--) {
      board.value.splice(linesToClear[i], 1)
      board.value.unshift(Array(BOARD_WIDTH).fill(0))
    }
    
    clearingRows.value = []
    
    // 更新分数和等级
    const linesCleared = linesToClear.length
    lines.value += linesCleared
    
    // 计分规则
    const scoreMap = [0, 100, 300, 500, 800]
    score.value += scoreMap[linesCleared] * level.value
    
    // 每10行提升一个等级
    const newLevel = Math.floor(lines.value / 10) + 1
    if (newLevel > level.value) {
      level.value = newLevel
      dropSpeed.value = Math.max(100, 1000 - (level.value - 1) * 100)
      startDropTimer() // 重新启动计时器以应用新速度
    }
  }
}

// 结束游戏
const endGame = () => {
  gameRunning.value = false
  gameOver.value = true
  stopDropTimer()
  
  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('tetrisHighScore', highScore.value.toString())
    ElMessage.success('🎉 新纪录！')
  }
  
  ElMessage.error('游戏结束！')
}

// 键盘控制
const handleKeydown = (event: KeyboardEvent) => {
  if (showHelp.value) return
  
  event.preventDefault()
  
  switch (event.key) {
    case 'ArrowLeft':
      movePiece(-1, 0)
      break
    case 'ArrowRight':
      movePiece(1, 0)
      break
    case 'ArrowDown':
      dropPiece()
      break
    case 'ArrowUp':
      rotatePiece()
      break
    case ' ':
      if (gameRunning.value) {
        pauseGame()
      }
      break
  }
}

// 加载最高分
const loadHighScore = () => {
  const saved = localStorage.getItem('tetrisHighScore')
  if (saved) {
    highScore.value = parseInt(saved, 10)
  }
}

// 生命周期
onMounted(() => {
  loadHighScore()
  initGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopDropTimer()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.tetris-game {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea, #764ba2);
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
  position: relative;
}

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
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
  color: #667eea;
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

.next-piece {
  text-align: center;
}

.next-piece h4 {
  margin-bottom: 16px;
  color: #333;
}

.next-preview {
  width: 140px;
  height: 140px;
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.preview-row {
  display: flex;
  gap: 3px;
}

.preview-cell {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  background: #fff;
}

.game-board {
  background: linear-gradient(145deg, #1a1a1a, #000000);
  border: 4px solid #555;
  border-radius: 16px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 2px 8px rgba(255, 255, 255, 0.05);
}

.board-row {
  display: flex;
  gap: 1px;
}

.board-cell {
  width: 28px;
  height: 28px;
  background: #111;
  transition: all 0.1s ease;
}

.board-cell.clearing {
  animation: line-clear 0.3s ease;
}

@keyframes line-clear {
  0% { background: white; }
  100% { background: #111; }
}

.game-panel {
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-section h4 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.controls-info, .scoring-info {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
}

.controls-info p, .scoring-info p {
  margin: 4px 0;
  color: #666;
}

/* 方块颜色 */
.color-1 { background: #00f5ff; } /* I型 - 青色 */
.color-2 { background: #ffff00; } /* O型 - 黄色 */
.color-3 { background: #a000ff; } /* T型 - 紫色 */
.color-4 { background: #00ff00; } /* S型 - 绿色 */
.color-5 { background: #ff0000; } /* Z型 - 红色 */
.color-6 { background: #0000ff; } /* J型 - 蓝色 */
.color-7 { background: #ff8000; } /* L型 - 橙色 */

.game-status {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.game-over-message {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.game-over-message h3 {
  font-size: 32px;
  margin-bottom: 12px;
}

.game-over-message p {
  font-size: 18px;
  margin-bottom: 8px;
  opacity: 0.9;
}

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
  z-index: 10;
}

.pause-message {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.pause-message h3 {
  font-size: 32px;
  margin-bottom: 12px;
  color: #333;
}

.pause-message p {
  font-size: 16px;
  color: #666;
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
    justify-content: space-around;
  }
  
  .panel-section {
    flex: 1;
    margin: 0 10px;
  }
  
  .board-cell {
    width: 22px;
    height: 22px;
  }
  
  .next-preview {
    width: 120px;
    height: 120px;
  }
  
  .preview-cell {
    width: 20px;
    height: 20px;
  }
  
  .game-buttons {
    justify-content: center;
  }
}
</style>
