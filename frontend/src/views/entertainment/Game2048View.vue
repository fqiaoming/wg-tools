<template>
  <div class="game-2048">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Grid /></el-icon>
        </div>
        <h1 class="hero-title">2048 数字合成</h1>
        <p class="hero-description">滑动合并相同数字，挑战2048！</p>
      </div>
    </div>

    <!-- 游戏主体 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Trophy /></el-icon>
          游戏区域
        </h3>
        <p class="card-description">使用方向键或WASD移动，合并相同数字，目标是2048！</p>
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
              <span class="label">移动次数:</span>
              <span class="value">{{ moves }}</span>
            </div>
          </div>
          
          <div class="game-buttons">
            <el-button 
              @click="newGame" 
              type="primary" 
              :icon="Refresh"
            >
              新游戏
            </el-button>
            <el-button @click="undoMove" :disabled="!canUndo" :icon="Back">
              撤销
            </el-button>
            <el-button @click="showHelp = true" :icon="QuestionFilled">
              帮助
            </el-button>
          </div>
        </div>

        <!-- 游戏主区域 -->
        <div class="game-main">
          <div class="game-board">
            <div class="board-background">
              <div v-for="i in 16" :key="i" class="cell-bg"></div>
            </div>
            <div class="board-container">
              <div
                v-for="tile in tiles"
                :key="tile.id"
                :class="[
                  'tile',
                  `tile-${tile.value}`,
                  { 
                    'tile-new': tile.isNew,
                    'tile-merged': tile.isMerged
                  }
                ]"
                :style="{
                  transform: `translate(${getTilePosition(tile.position).x}px, ${getTilePosition(tile.position).y}px)`
                }"
              >
                {{ tile.value }}
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏状态 -->
        <div v-if="gameWon && !keepPlaying" class="game-status win">
          <div class="status-message">
            <h3>🎉 恭喜你达到了 2048！</h3>
            <p>你可以继续挑战更高的数字</p>
            <div class="status-buttons">
              <el-button @click="keepPlaying = true" type="primary">
                继续游戏
              </el-button>
              <el-button @click="newGame">
                重新开始
              </el-button>
            </div>
          </div>
        </div>

        <div v-if="gameOver" class="game-status over">
          <div class="status-message">
            <h3>💀 游戏结束！</h3>
            <p>无法移动了，最终得分: {{ score }}</p>
            <p v-if="score > highScore">🎉 新纪录！</p>
            <el-button @click="newGame" type="primary" size="large">
              重新开始
            </el-button>
          </div>
        </div>

        <!-- 移动提示 -->
        <div class="move-hint">
          <p>💡 使用 ← → ↑ ↓ 方向键或 WASD 键移动</p>
        </div>
      </div>
    </div>

    <!-- 帮助弹窗 -->
    <el-dialog v-model="showHelp" title="游戏说明" width="500px">
      <div class="help-content">
        <h4>🎯 游戏目标</h4>
        <p>通过移动数字方块，合并相同的数字，最终达到 2048！</p>
        
        <h4>🎮 操作方法</h4>
        <ul>
          <li>使用方向键 ← → ↑ ↓ 移动所有方块</li>
          <li>或使用 WASD 键控制移动方向</li>
          <li>相同数字的方块碰撞时会合并</li>
          <li>每次移动后会随机出现新的数字块</li>
        </ul>
        
        <h4>🏆 游戏规则</h4>
        <ul>
          <li>每次移动，所有方块都会向指定方向滑动</li>
          <li>相同数字相撞时合并成更大的数字</li>
          <li>合并后的数字会加到得分中</li>
          <li>当无法移动时游戏结束</li>
          <li>达到 2048 即为胜利，但可以继续挑战更高分数</li>
        </ul>
        
        <h4>💡 游戏技巧</h4>
        <ul>
          <li>尽量保持最大数字在角落</li>
          <li>不要随意移动，要有策略</li>
          <li>尽量让相同数字靠近</li>
          <li>合理利用撤销功能</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Grid,
  Trophy,
  Refresh,
  Back,
  QuestionFilled
} from '@element-plus/icons-vue'

// 瓦片数据类型
interface Tile {
  id: number
  value: number
  position: number
  isNew: boolean
  isMerged: boolean
}

// 游戏状态
const board = ref<number[]>(Array(16).fill(0))
const tiles = ref<Tile[]>([])
const score = ref(0)
const moves = ref(0)
const gameWon = ref(false)
const gameOver = ref(false)
const keepPlaying = ref(false)
const showHelp = ref(false)
const canUndo = ref(false)

// 历史状态（用于撤销）
const history = ref<{
  board: number[]
  tiles: Tile[]
  score: number
  moves: number
}>()

// 最高分
const highScore = ref(0)

// 瓦片ID计数器
let tileIdCounter = 0

// 计算瓦片位置
const getTilePosition = (position: number) => {
  const row = Math.floor(position / 4)
  const col = position % 4
  return {
    x: col * 105 + col * 12,
    y: row * 105 + row * 12
  }
}

// 初始化游戏
const initGame = () => {
  board.value = Array(16).fill(0)
  tiles.value = []
  score.value = 0
  moves.value = 0
  gameWon.value = false
  gameOver.value = false
  keepPlaying.value = false
  canUndo.value = false
  tileIdCounter = 0
  
  // 添加两个初始瓦片
  addRandomTile()
  addRandomTile()
}

// 新游戏
const newGame = () => {
  initGame()
  ElMessage.success('新游戏开始！')
}

// 添加随机瓦片
const addRandomTile = () => {
  const emptyCells = []
  for (let i = 0; i < 16; i++) {
    if (board.value[i] === 0) {
      emptyCells.push(i)
    }
  }
  
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const position = emptyCells[randomIndex]
    const value = Math.random() < 0.9 ? 2 : 4
    
    board.value[position] = value
    
    const newTile: Tile = {
      id: ++tileIdCounter,
      value,
      position,
      isNew: true,
      isMerged: false
    }
    
    tiles.value.push(newTile)
    
    // 清除新瓦片标记
    setTimeout(() => {
      newTile.isNew = false
    }, 200)
  }
}

// 保存历史状态
const saveState = () => {
  history.value = {
    board: [...board.value],
    tiles: tiles.value.map(tile => ({ ...tile })),
    score: score.value,
    moves: moves.value
  }
  canUndo.value = true
}

// 撤销移动
const undoMove = () => {
  if (history.value) {
    board.value = [...history.value.board]
    tiles.value = history.value.tiles.map(tile => ({ ...tile }))
    score.value = history.value.score
    moves.value = history.value.moves
    canUndo.value = false
    gameOver.value = false
  }
}

// 移动瓦片
const moveTiles = (direction: 'up' | 'down' | 'left' | 'right') => {
  if (gameOver.value) return
  
  saveState()
  
  let moved = false
  const newBoard = [...board.value]
  const newTiles: Tile[] = []
  const mergedPositions = new Set<number>()
  
  // 清除合并标记
  tiles.value.forEach(tile => {
    tile.isMerged = false
  })
  
  for (let i = 0; i < 4; i++) {
    const line = getLine(newBoard, direction, i)
    const originalLine = [...line]
    const { movedLine, lineScore } = processLine(line)
    
    if (!arraysEqual(originalLine, movedLine)) {
      moved = true
    }
    
    score.value += lineScore
    setLine(newBoard, direction, i, movedLine)
  }
  
  if (moved) {
    board.value = newBoard
    
    // 更新瓦片位置
    tiles.value.forEach(tile => {
      const newPosition = findTileNewPosition(tile.position, direction, board.value, newBoard)
      if (newPosition !== tile.position) {
        tile.position = newPosition
      }
    })
    
    // 移除值为0的瓦片
    tiles.value = tiles.value.filter(tile => newBoard[tile.position] !== 0)
    
    // 创建新瓦片对象
    for (let i = 0; i < 16; i++) {
      if (newBoard[i] !== 0) {
        const existingTile = tiles.value.find(tile => tile.position === i)
        if (!existingTile) {
          newTiles.push({
            id: ++tileIdCounter,
            value: newBoard[i],
            position: i,
            isNew: false,
            isMerged: mergedPositions.has(i)
          })
        } else {
          existingTile.value = newBoard[i]
          if (mergedPositions.has(i)) {
            existingTile.isMerged = true
          }
        }
      }
    }
    
    tiles.value.push(...newTiles)
    moves.value++
    
    // 添加新瓦片
    nextTick(() => {
      addRandomTile()
      
      // 检查游戏状态
      checkGameState()
      
      // 清除合并标记
      setTimeout(() => {
        tiles.value.forEach(tile => {
          tile.isMerged = false
        })
      }, 200)
    })
  }
}

// 获取一行/列的数据
const getLine = (board: number[], direction: string, index: number): number[] => {
  const line: number[] = []
  
  switch (direction) {
    case 'left':
      for (let i = 0; i < 4; i++) {
        line.push(board[index * 4 + i])
      }
      break
    case 'right':
      for (let i = 3; i >= 0; i--) {
        line.push(board[index * 4 + i])
      }
      break
    case 'up':
      for (let i = 0; i < 4; i++) {
        line.push(board[i * 4 + index])
      }
      break
    case 'down':
      for (let i = 3; i >= 0; i--) {
        line.push(board[i * 4 + index])
      }
      break
  }
  
  return line
}

// 设置一行/列的数据
const setLine = (board: number[], direction: string, index: number, line: number[]) => {
  switch (direction) {
    case 'left':
      for (let i = 0; i < 4; i++) {
        board[index * 4 + i] = line[i]
      }
      break
    case 'right':
      for (let i = 3; i >= 0; i--) {
        board[index * 4 + (3 - i)] = line[i]
      }
      break
    case 'up':
      for (let i = 0; i < 4; i++) {
        board[i * 4 + index] = line[i]
      }
      break
    case 'down':
      for (let i = 3; i >= 0; i--) {
        board[(3 - i) * 4 + index] = line[i]
      }
      break
  }
}

// 处理一行/列的移动和合并
const processLine = (line: number[]): { movedLine: number[], lineScore: number } => {
  // 移除零
  const nonZero = line.filter(x => x !== 0)
  let lineScore = 0
  
  // 合并相同数字
  for (let i = 0; i < nonZero.length - 1; i++) {
    if (nonZero[i] === nonZero[i + 1]) {
      nonZero[i] *= 2
      lineScore += nonZero[i]
      nonZero.splice(i + 1, 1)
    }
  }
  
  // 填充零
  while (nonZero.length < 4) {
    nonZero.push(0)
  }
  
  return { movedLine: nonZero, lineScore }
}

// 查找瓦片新位置
const findTileNewPosition = (oldPos: number, direction: string, oldBoard: number[], newBoard: number[]): number => {
  const value = oldBoard[oldPos]
  if (value === 0) return oldPos
  
  const row = Math.floor(oldPos / 4)
  const col = oldPos % 4
  
  // 在新board中查找相同值的位置
  for (let i = 0; i < 16; i++) {
    if (newBoard[i] === value) {
      const newRow = Math.floor(i / 4)
      const newCol = i % 4
      
      // 根据移动方向判断是否为正确的新位置
      switch (direction) {
        case 'left':
          if (newRow === row && newCol <= col) return i
          break
        case 'right':
          if (newRow === row && newCol >= col) return i
          break
        case 'up':
          if (newCol === col && newRow <= row) return i
          break
        case 'down':
          if (newCol === col && newRow >= row) return i
          break
      }
    }
  }
  
  return oldPos
}

// 数组比较
const arraysEqual = (a: number[], b: number[]): boolean => {
  return a.length === b.length && a.every((val, i) => val === b[i])
}

// 检查游戏状态
const checkGameState = () => {
  // 检查是否达到2048
  if (!gameWon.value && board.value.includes(2048)) {
    gameWon.value = true
    ElMessage.success('🎉 恭喜达到 2048！')
  }
  
  // 检查是否游戏结束
  if (isGameOver()) {
    gameOver.value = true
    ElMessage.error('游戏结束！')
    
    // 更新最高分
    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('2048HighScore', highScore.value.toString())
      ElMessage.success('🎉 新纪录！')
    }
  }
}

// 判断游戏是否结束
const isGameOver = (): boolean => {
  // 如果还有空格，游戏未结束
  if (board.value.includes(0)) return false
  
  // 检查是否可以合并
  for (let i = 0; i < 16; i++) {
    const row = Math.floor(i / 4)
    const col = i % 4
    const value = board.value[i]
    
    // 检查右边
    if (col < 3 && board.value[i + 1] === value) return false
    
    // 检查下面
    if (row < 3 && board.value[i + 4] === value) return false
  }
  
  return true
}

// 键盘控制
const handleKeydown = (event: KeyboardEvent) => {
  if (showHelp.value) return
  
  event.preventDefault()
  
  switch (event.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      moveTiles('left')
      break
    case 'ArrowRight':
    case 'd':
    case 'D':
      moveTiles('right')
      break
    case 'ArrowUp':
    case 'w':
    case 'W':
      moveTiles('up')
      break
    case 'ArrowDown':
    case 's':
    case 'S':
      moveTiles('down')
      break
    case 'z':
    case 'Z':
      if (event.ctrlKey) {
        undoMove()
      }
      break
  }
}

// 加载最高分
const loadHighScore = () => {
  const saved = localStorage.getItem('2048HighScore')
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
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.game-2048 {
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
  max-width: 750px;
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
  margin: 40px 0;
}

.game-board {
  position: relative;
  width: 480px;
  height: 480px;
  background: linear-gradient(145deg, #bbada0, #a39590);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    inset 0 2px 8px rgba(255, 255, 255, 0.1);
  margin: 0 auto;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.board-background {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 456px;
  height: 456px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.cell-bg {
  background: rgba(238, 228, 218, 0.35);
  border-radius: 6px;
}

.board-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.tile {
  position: absolute;
  width: 105px;
  height: 105px;
  background: linear-gradient(145deg, #eee4da, #ddd0c4);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.15),
    inset 0 1px 3px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #776e65;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tile-new {
  animation: tile-appear 0.2s ease;
}

.tile-merged {
  animation: tile-merge 0.2s ease;
}

@keyframes tile-appear {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes tile-merge {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 不同数字的颜色 */
.tile-2 { background: #eee4da; color: #776e65; }
.tile-4 { background: #ede0c8; color: #776e65; }
.tile-8 { background: #f2b179; color: #f9f6f2; }
.tile-16 { background: #f59563; color: #f9f6f2; }
.tile-32 { background: #f67c5f; color: #f9f6f2; }
.tile-64 { background: #f65e3b; color: #f9f6f2; }
.tile-128 { background: #edcf72; color: #f9f6f2; font-size: 28px; }
.tile-256 { background: #edcc61; color: #f9f6f2; font-size: 28px; }
.tile-512 { background: #edc850; color: #f9f6f2; font-size: 28px; }
.tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 24px; }
.tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 24px; box-shadow: 0 0 20px rgba(237, 194, 46, 0.5); }

.tile-4096 { background: #667eea; color: #f9f6f2; font-size: 20px; }
.tile-8192 { background: #764ba2; color: #f9f6f2; font-size: 20px; }

.game-status {
  text-align: center;
  margin-top: 30px;
}

.status-message {
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.game-status.win .status-message {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.game-status.over .status-message {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.status-message h3 {
  font-size: 32px;
  margin-bottom: 12px;
}

.status-message p {
  font-size: 18px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.status-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.move-hint {
  text-align: center;
  margin-top: 20px;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.move-hint p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
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
  
  .game-board {
    width: 320px;
    height: 320px;
    padding: 10px;
  }
  
  .board-background {
    top: 10px;
    left: 10px;
    width: 300px;
    height: 300px;
    gap: 10px;
  }
  
  .tile {
    width: 67.5px;
    height: 67.5px;
    font-size: 20px;
  }
  
  .tile-128, .tile-256, .tile-512 {
    font-size: 18px;
  }
  
  .tile-1024, .tile-2048 {
    font-size: 16px;
  }
  
  .tile-4096, .tile-8192 {
    font-size: 14px;
  }
  
  .game-buttons {
    justify-content: center;
  }
}
</style>
