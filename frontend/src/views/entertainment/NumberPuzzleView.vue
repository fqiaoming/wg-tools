<template>
  <div class="number-puzzle">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h1 class="hero-title">数字华容道</h1>
        <p class="hero-description">经典数字拼图游戏，锻炼逻辑思维和空间想象力</p>
      </div>
    </div>

    <!-- 游戏主体 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Rank /></el-icon>
          游戏区域
        </h3>
        <p class="card-description">将数字按1-15的顺序排列，空格在右下角即为胜利</p>
      </div>
      
      <div class="card-body">
        <!-- 游戏控制面板 -->
        <div class="game-controls">
          <div class="game-info">
            <div class="info-item">
              <span class="label">移动次数:</span>
              <span class="value">{{ moveCount }}</span>
            </div>
            <div class="info-item">
              <span class="label">游戏时间:</span>
              <span class="value">{{ formatTime(gameTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">难度:</span>
              <span class="value">{{ difficultyNames[difficulty] }}</span>
            </div>
            <div class="info-item">
              <span class="label">最佳记录:</span>
              <span class="value">{{ bestTime > 0 ? formatTime(bestTime) : '--' }}</span>
            </div>
          </div>
          
          <div class="game-buttons">
            <el-button @click="newGame" type="primary" :icon="Refresh">
              新游戏
            </el-button>
            <el-button @click="showHint" type="info" :disabled="!gameStarted || gameWon">
              💡 提示
            </el-button>
            <el-button @click="checkSolvable" type="warning" :disabled="gameWon">
              🔍 检查可解性
            </el-button>
            <el-button @click="showSettings = true" :icon="Setting">
              设置
            </el-button>
          </div>
        </div>

        <!-- 游戏主区域 -->
        <div class="game-main">
          <div class="puzzle-container" :class="[`size-${difficulty + 3}`, `theme-${theme}`]">
            <div class="puzzle-grid" :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }" :class="`theme-${theme}`">
              <div
                v-for="(tile, index) in puzzle"
                :key="index"
                :class="[
                  'puzzle-tile',
                  `theme-${theme}`,
                  { 
                    'empty': tile === 0,
                    'movable': isMovable(index),
                    'hint': hintIndex === index
                  }
                ]"
                @click="moveTile(index)"
              >
                {{ tile === 0 ? '' : tile }}
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏状态 -->
        <div v-if="gameWon" class="game-status">
          <div class="win-message">
            <h3>🎉 恭喜通关！</h3>
            <p>移动次数: {{ moveCount }} | 用时: {{ formatTime(gameTime) }}</p>
            <el-button @click="newGame" type="primary" size="large">
              再来一局
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <el-dialog v-model="showSettings" title="游戏设置" width="400px">
      <div class="settings-content">
        <div class="setting-group">
          <label>难度设置:</label>
          <el-radio-group v-model="difficulty" @change="changeDifficulty">
            <el-radio :value="0">3x3 (简单)</el-radio>
            <el-radio :value="1">4x4 (普通)</el-radio>
            <el-radio :value="2">5x5 (困难)</el-radio>
          </el-radio-group>
        </div>
        
        <div class="setting-group">
          <label>主题设置:</label>
          <el-radio-group v-model="theme">
            <el-radio value="classic">经典</el-radio>
            <el-radio value="modern">现代</el-radio>
            <el-radio value="colorful">彩色</el-radio>
          </el-radio-group>
        </div>

        <div class="setting-group">
          <label>游戏记录:</label>
          <div class="game-records">
            <div v-if="gameHistory.length === 0">暂无游戏记录</div>
            <div v-else>
              <div v-for="(record, index) in gameHistory.slice(0, 5)" :key="index" class="record-item">
                {{ difficultyNames[record.difficulty] }} - {{ record.moves }}步 - {{ formatTime(record.time) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="clearHistory" type="danger">清空记录</el-button>
        <el-button @click="showSettings = false" type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Grid,
  Rank,
  Refresh,
  Setting
} from '@element-plus/icons-vue'

// 游戏状态
const puzzle = ref<number[]>([])
const moveCount = ref(0)
const gameTime = ref(0)
const gameStarted = ref(false)
const gameWon = ref(false)
const showSettings = ref(false)
const hintIndex = ref(-1)
// 缓存可移动的索引，避免频繁计算
const movableIndices = ref<number[]>([])
// 记录最近提示过的数字，避免重复提示
const recentHints = ref<number[]>([])

// 游戏配置
const difficulty = ref(1) // 0: 3x3, 1: 4x4, 2: 5x5
const theme = ref('classic')
const difficultyNames: Record<number, string> = {
  0: '简单 (3×3)',
  1: '普通 (4×4)', 
  2: '困难 (5×5)'
}

// 游戏计时器
let gameTimer: number | null = null

// 最佳记录
const bestTime = ref(0)
const gameHistory = ref<Array<{difficulty: number, moves: number, time: number, date: number}>>([])

// 计算属性
const gridSize = computed(() => difficulty.value + 3)
const totalTiles = computed(() => gridSize.value * gridSize.value)

// 初始化游戏
const initGame = () => {
  const size = totalTiles.value
  puzzle.value = Array.from({ length: size }, (_, i) => i)
  
  // 打乱拼图，确保有解
  shufflePuzzle()
  
  moveCount.value = 0
  gameTime.value = 0
  gameStarted.value = false
  gameWon.value = false
  hintIndex.value = -1
  
  // 清空提示记录
  recentHints.value = []
  
  // 初始化可移动索引缓存
  updateMovableIndices()
  
  if (gameTimer) {
    clearInterval(gameTimer)
    gameTimer = null
  }
}

// 获取可移动的索引
const getMovableIndices = (emptyIndex: number) => {
  const size = gridSize.value
  const row = Math.floor(emptyIndex / size)
  const col = emptyIndex % size
  const indices = []
  
  // 上
  if (row > 0) indices.push((row - 1) * size + col)
  // 下
  if (row < size - 1) indices.push((row + 1) * size + col)
  // 左
  if (col > 0) indices.push(row * size + (col - 1))
  // 右
  if (col < size - 1) indices.push(row * size + (col + 1))
  
  return indices
}

// 打乱拼图（确保有解）
const shufflePuzzle = () => {
  // 使用正确的洗牌算法 - Fisher-Yates洗牌，然后检查可解性
  let attempts = 0
  const maxAttempts = 100
  
  do {
    // 创建完整序列然后洗牌（不包括空格位置）
    const numbers = Array.from({ length: totalTiles.value - 1 }, (_, i) => i + 1)
    
    // Fisher-Yates 洗牌算法
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = numbers[i]
      numbers[i] = numbers[j]
      numbers[j] = temp
    }
    
    // 将洗牌后的数字填入拼图，空格放在最后
    puzzle.value = [...numbers, 0]
    
    attempts++
  } while (!isSolvable() && attempts < maxAttempts)
  
  // 如果尝试多次仍无解，使用备用方案：从解决状态开始随机移动
  if (!isSolvable()) {
    useBackupShuffle()
  }
}

// 检查拼图是否可解
const isSolvable = () => {
  const size = gridSize.value
  let inversions = 0
  
  // 计算逆序对数（不包括空格）
  for (let i = 0; i < puzzle.value.length; i++) {
    if (puzzle.value[i] === 0) continue
    for (let j = i + 1; j < puzzle.value.length; j++) {
      if (puzzle.value[j] === 0) continue
      if (puzzle.value[i] > puzzle.value[j]) {
        inversions++
      }
    }
  }
  
  // 根据网格大小判断可解性
  if (size % 2 === 1) {
    // 奇数网格：逆序对数为偶数时可解
    return inversions % 2 === 0
  } else {
    // 偶数网格：需要考虑空格位置
    const emptyRow = Math.floor(puzzle.value.indexOf(0) / size)
    const emptyRowFromBottom = size - emptyRow
    
    if (emptyRowFromBottom % 2 === 1) {
      // 空格在奇数行（从底部数）：逆序对数为偶数时可解
      return inversions % 2 === 0
    } else {
      // 空格在偶数行（从底部数）：逆序对数为奇数时可解
      return inversions % 2 === 1
    }
  }
}

// 备用洗牌方案：从解决状态开始随机移动
const useBackupShuffle = () => {
  // 重置为解决状态
  puzzle.value = Array.from({ length: totalTiles.value }, (_, i) => i === totalTiles.value - 1 ? 0 : i + 1)
  
  // 执行随机移动
  const moves = Math.min(1000, totalTiles.value * 50)
  for (let i = 0; i < moves; i++) {
    const emptyIndex = puzzle.value.indexOf(0)
    const movableIndices = getMovableIndices(emptyIndex)
    if (movableIndices.length > 0) {
      const randomIndex = movableIndices[Math.floor(Math.random() * movableIndices.length)]
      const temp = puzzle.value[emptyIndex]
      puzzle.value[emptyIndex] = puzzle.value[randomIndex]
      puzzle.value[randomIndex] = temp
    }
  }
}

// 更新可移动索引缓存
const updateMovableIndices = () => {
  const emptyIndex = puzzle.value.indexOf(0)
  movableIndices.value = getMovableIndices(emptyIndex)
}

// 检查数字块是否可移动（使用缓存）
const isMovable = (index: number) => {
  return movableIndices.value.includes(index)
}

// 移动数字块
const moveTile = (index: number) => {
  if (gameWon.value || !isMovable(index)) return
  
  if (!gameStarted.value) {
    startGame()
  }
  
  const emptyIndex = puzzle.value.indexOf(0)
  
  // 交换数字块和空格
  const temp = puzzle.value[index]
  puzzle.value[index] = puzzle.value[emptyIndex]
  puzzle.value[emptyIndex] = temp
  
  moveCount.value++
  hintIndex.value = -1
  
  // 更新可移动索引缓存
  updateMovableIndices()
  
  // 检查是否获胜
  if (checkWin()) {
    gameWon.value = true
    stopGame()
    saveRecord()
    ElMessage.success('🎉 恭喜通关！')
  }
}

// 开始游戏
const startGame = () => {
  gameStarted.value = true
  gameTimer = setInterval(() => {
    gameTime.value++
  }, 1000)
}

// 停止游戏
const stopGame = () => {
  if (gameTimer) {
    clearInterval(gameTimer)
    gameTimer = null
  }
}

// 检查是否获胜
const checkWin = () => {
  for (let i = 0; i < puzzle.value.length - 1; i++) {
    if (puzzle.value[i] !== i + 1) return false
  }
  return puzzle.value[puzzle.value.length - 1] === 0
}

// 新游戏
const newGame = () => {
  stopGame()
  initGame()
}

// 显示提示
const showHint = () => {
  if (hintIndex.value >= 0) {
    hintIndex.value = -1
    return
  }
  
  // 使用缓存的可移动索引
  if (movableIndices.value.length > 0) {
    let bestIndex = -1
    let bestScore = 0
    let bestReason = ''
    
    const emptyIndex = puzzle.value.indexOf(0)
    
    for (const index of movableIndices.value) {
      const value = puzzle.value[index]
      const targetPos = value - 1 // 目标位置（0-based）
      
      // 如果这个数字最近被提示过，降低优先级
      const wasRecentlyHinted = recentHints.value.includes(value)
      
      // 当前位置
      const currentRow = Math.floor(index / gridSize.value)
      const currentCol = index % gridSize.value
      
      // 目标位置
      const targetRow = Math.floor(targetPos / gridSize.value)
      const targetCol = targetPos % gridSize.value
      
      // 空格位置（移动后数字会到达的位置）
      const emptyRow = Math.floor(emptyIndex / gridSize.value)
      const emptyCol = emptyIndex % gridSize.value
      
      let score = 0
      let reason = ''
      
      // 策略1：如果移动后数字能到达正确位置，最高优先级
      if (emptyRow === targetRow && emptyCol === targetCol) {
        score = 1000
        reason = `将数字${value}移动到正确位置`
      }
      // 策略2：如果移动后数字更接近目标位置
      else {
        const currentDistance = Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol)
        const newDistance = Math.abs(emptyRow - targetRow) + Math.abs(emptyCol - targetCol)
        
        if (newDistance < currentDistance) {
          score = 500 + (currentDistance - newDistance) * 50
          reason = `使数字${value}更接近目标位置`
        }
        // 策略3：优先移动已经在正确行或列的数字
        else if (currentRow === targetRow || currentCol === targetCol) {
          score = 300
          reason = `数字${value}在正确的行或列`
        }
        // 策略4：移动小数字（通常更容易处理）
        else if (value <= 4) {
          score = 200
          reason = `优先处理小数字${value}`
        }
        // 策略5：随机选择，避免死循环
        else {
          score = Math.random() * 100
          reason = `尝试移动数字${value}`
        }
      }
      
      // 如果最近被提示过，大幅降低评分
      if (wasRecentlyHinted) {
        score = score * 0.3 // 降低到30%
        reason += ' (寻找其他选择)'
      }
      
      // 添加一些随机性，避免总是选择相同的数字
      score += Math.random() * 50
      
      if (score > bestScore) {
        bestScore = score
        bestIndex = index
        bestReason = reason
      }
    }
    
    if (bestIndex >= 0) {
      hintIndex.value = bestIndex
      
      // 记录这次提示的数字，避免重复提示
      const hintedValue = puzzle.value[bestIndex]
      recentHints.value.push(hintedValue)
      
      // 只保留最近3次的提示记录
      if (recentHints.value.length > 3) {
        recentHints.value.shift()
      }
      
      // 提示时间延长到3秒，给用户充分时间理解
      setTimeout(() => {
        hintIndex.value = -1
      }, 3000)
      
      // 给用户详细的文字提示
      ElMessage.info(`💡 ${bestReason}`)
    }
  } else {
    ElMessage.warning('当前没有可移动的数字块')
  }
}

// 检查当前拼图是否可解
const checkSolvable = () => {
  if (checkWin()) {
    ElMessage.success('🎉 已经完成了！')
    return
  }
  
  if (isSolvable()) {
    ElMessage.success('✅ 当前拼图有解，继续加油！')
  } else {
    ElMessage.error('❌ 当前拼图无解！点击"新游戏"重新开始')
  }
}

// 改变难度
const changeDifficulty = () => {
  // 保存难度设置
  localStorage.setItem('numberPuzzleDifficulty', difficulty.value.toString())
  newGame()
}

// 保存主题设置
const saveTheme = () => {
  localStorage.setItem('numberPuzzleTheme', theme.value)
}

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 保存游戏记录
const saveRecord = () => {
  const record = {
    difficulty: difficulty.value,
    moves: moveCount.value,
    time: gameTime.value,
    date: Date.now()
  }
  
  gameHistory.value.unshift(record)
  gameHistory.value.sort((a, b) => a.time - b.time)
  
  // 更新最佳记录
  const sameDifficultyRecords = gameHistory.value.filter(r => r.difficulty === difficulty.value)
  if (sameDifficultyRecords.length > 0) {
    bestTime.value = sameDifficultyRecords[0].time
  }
  
  // 保存到本地存储
  localStorage.setItem('numberPuzzleHistory', JSON.stringify(gameHistory.value))
  localStorage.setItem('numberPuzzleBestTime', JSON.stringify(bestTime.value))
}

// 清空记录
const clearHistory = () => {
  gameHistory.value = []
  bestTime.value = 0
  localStorage.removeItem('numberPuzzleHistory')
  localStorage.removeItem('numberPuzzleBestTime')
  ElMessage.success('记录已清空')
}

// 加载历史记录和设置
const loadHistory = () => {
  try {
    const history = localStorage.getItem('numberPuzzleHistory')
    if (history) {
      gameHistory.value = JSON.parse(history)
    }
    
    const best = localStorage.getItem('numberPuzzleBestTime')
    if (best) {
      bestTime.value = JSON.parse(best)
    }
    
    // 加载主题设置
    const savedTheme = localStorage.getItem('numberPuzzleTheme')
    if (savedTheme) {
      theme.value = savedTheme
    }
    
    // 加载难度设置
    const savedDifficulty = localStorage.getItem('numberPuzzleDifficulty')
    if (savedDifficulty) {
      difficulty.value = parseInt(savedDifficulty, 10)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

// 键盘控制（添加防抖）
let keyboardCooldown = false
const handleKeydown = (event: KeyboardEvent) => {
  if (gameWon.value || keyboardCooldown) return
  
  const emptyIndex = puzzle.value.indexOf(0)
  const size = gridSize.value
  const row = Math.floor(emptyIndex / size)
  const col = emptyIndex % size
  
  let targetIndex = -1
  
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (row < size - 1) targetIndex = (row + 1) * size + col
      break
    case 'ArrowDown':
    case 's':
    case 'S':
      if (row > 0) targetIndex = (row - 1) * size + col
      break
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (col < size - 1) targetIndex = row * size + (col + 1)
      break
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (col > 0) targetIndex = row * size + (col - 1)
      break
  }
  
  if (targetIndex >= 0) {
    event.preventDefault()
    
    // 设置短暂的键盘冷却时间，避免快速按键造成的闪烁
    keyboardCooldown = true
    setTimeout(() => {
      keyboardCooldown = false
    }, 100) // 100ms 冷却时间
    
    moveTile(targetIndex)
  }
}

// 监听主题变化
watch(theme, () => {
  saveTheme()
})

// 生命周期
onMounted(() => {
  loadHistory()
  initGame()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopGame()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.number-puzzle {
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
  max-width: 900px;
  margin: -40px auto 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

.game-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.game-main {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.puzzle-container {
  padding: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.puzzle-grid {
  display: grid;
  gap: 6px;
  background: linear-gradient(145deg, #667eea, #764ba2);
  padding: 12px;
  border-radius: 16px;
  box-shadow: 
    inset 0 2px 8px rgba(0, 0, 0, 0.2),
    0 4px 15px rgba(102, 126, 234, 0.3);
}

.size-3 .puzzle-grid {
  width: 300px;
  height: 300px;
}

.size-4 .puzzle-grid {
  width: 360px;
  height: 360px;
}

.size-5 .puzzle-grid {
  width: 400px;
  height: 400px;
}

.puzzle-tile {
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  /* 移除所有transition，避免闪烁 */
  user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

/* 移除hover变换效果，避免键盘操作时的视觉干扰 */

.puzzle-tile.empty {
  background: transparent;
  cursor: default;
  box-shadow: none;
}

.puzzle-tile.movable {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  cursor: pointer;
  /* 稳定的可移动状态，不添加动画 */
}

.puzzle-tile.movable:hover {
  /* 保留轻微的hover效果，但不要过于明显 */
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.puzzle-tile.hint {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 
    0 4px 16px rgba(245, 158, 11, 0.4),
    0 0 0 2px rgba(245, 158, 11, 0.6);
  /* 移除刺眼的动画，使用静态高亮 */
  z-index: 10;
}

.puzzle-tile.hint::after {
  content: '💡';
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  /* 移除弹跳动画，使用静态图标 */
  background: rgba(245, 158, 11, 0.9);
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 12px;
}

/* 移除所有闪烁动画 */

/* 主题样式 */
/* 经典主题 */
.puzzle-tile.theme-classic {
  background: white;
  color: #333;
  border: 1px solid #e5e7eb;
}

.puzzle-tile.theme-classic.movable {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
}

.puzzle-grid.theme-classic {
  background: #667eea;
  border: 8px solid #667eea;
}

/* 现代主题 */
.puzzle-tile.theme-modern {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  color: #1e293b;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.puzzle-tile.theme-modern.movable {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.puzzle-grid.theme-modern {
  background: linear-gradient(135deg, #64748b, #475569);
  border: 8px solid #64748b;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 彩色主题 */
.puzzle-tile.theme-colorful {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  border: 2px solid #d97706;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.puzzle-tile.theme-colorful.movable {
  background: linear-gradient(135deg, #ec4899, #db2777);
  border-color: #be185d;
  animation: colorful-pulse 1.5s ease-in-out infinite;
}

.puzzle-grid.theme-colorful {
  background: linear-gradient(45deg, #8b5cf6, #7c3aed, #6366f1, #3b82f6);
  background-size: 400% 400%;
  animation: colorful-gradient 3s ease infinite;
  border: 8px solid #7c3aed;
}

@keyframes colorful-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes colorful-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 主题特定的数字颜色 */
.puzzle-tile.theme-colorful:nth-child(4n+1) {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.puzzle-tile.theme-colorful:nth-child(4n+2) {
  background: linear-gradient(135deg, #10b981, #059669);
}

.puzzle-tile.theme-colorful:nth-child(4n+3) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.puzzle-tile.theme-colorful:nth-child(4n+4) {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

/* 主题特定的提示样式 */
.puzzle-tile.theme-classic.hint {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 
    0 4px 16px rgba(245, 158, 11, 0.4),
    0 0 0 2px rgba(245, 158, 11, 0.6);
}

.puzzle-tile.theme-modern.hint {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  box-shadow: 
    0 4px 16px rgba(6, 182, 212, 0.4),
    0 0 0 2px rgba(6, 182, 212, 0.6);
}

.puzzle-tile.theme-colorful.hint {
  background: linear-gradient(135deg, #fbbf24, #f59e0b) !important;
  box-shadow: 
    0 4px 16px rgba(251, 191, 36, 0.6),
    0 0 0 3px rgba(251, 191, 36, 0.8);
  animation: colorful-hint 1s ease-in-out infinite;
}

@keyframes colorful-hint {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.game-status {
  text-align: center;
  margin-top: 30px;
}

.win-message {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  color: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.win-message h3 {
  font-size: 32px;
  margin-bottom: 12px;
}

.win-message p {
  font-size: 18px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.settings-content {
  padding: 20px 0;
}

.setting-group {
  margin-bottom: 24px;
}

.setting-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
}

.game-records {
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #f9fafb;
}

.record-item {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #666;
}

.record-item:last-child {
  border-bottom: none;
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
  
  .size-3 .puzzle-grid {
    width: 250px;
    height: 250px;
  }
  
  .size-4 .puzzle-grid {
    width: 280px;
    height: 280px;
  }
  
  .size-5 .puzzle-grid {
    width: 300px;
    height: 300px;
  }
  
  .puzzle-tile {
    font-size: 18px;
  }
  
  .game-buttons {
    justify-content: center;
  }
}
</style>
