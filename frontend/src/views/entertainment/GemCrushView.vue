<template>
  <div class="gem-crush">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Guide /></el-icon>
        </div>
        <h1 class="hero-title">宝石消除</h1>
        <p class="hero-description">经典三消游戏，交换相邻宝石，消除三个或更多相同宝石！</p>
      </div>
    </div>

    <!-- 游戏主体 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Trophy /></el-icon>
          宝石消除世界
        </h3>
        <p class="card-description">拖拽相邻宝石交换位置，或点击选择，消除三个或更多相同宝石获得分数！</p>
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
              <span class="label">关卡:</span>
              <span class="value">{{ level }}</span>
            </div>
            <div class="info-item">
              <span class="label">目标:</span>
              <span class="value">{{ levelTarget }}</span>
            </div>
            <div class="info-item">
              <span class="label">剩余步数:</span>
              <span class="value">{{ movesLeft }}</span>
            </div>
            <div class="info-item">
              <span class="label">最高分:</span>
              <span class="value">{{ highScore }}</span>
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
              @click="resetGame" 
              v-if="gameRunning" 
              :icon="RefreshRight"
            >
              重置游戏
            </el-button>
            <el-button @click="showHelp = true" :icon="QuestionFilled">
              帮助
            </el-button>
          </div>
        </div>

        <!-- 游戏主区域 -->
        <div class="game-main">
          <div class="game-board-container">
            <canvas
              ref="gameCanvas"
              :width="canvasWidth"
              :height="canvasHeight"
              class="game-canvas"
              @click="handleCanvasClick"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseLeave"
            ></canvas>
            
            <!-- 游戏开始提示 -->
            <div v-if="!gameStarted" class="start-overlay">
              <div class="start-message">
                <h3>💎 宝石消除 准备开始！</h3>
                <p>拖拽相邻宝石交换位置</p>
                <p>消除三个或更多相同宝石</p>
                <div class="controls-hint">
                  <p>🎯 达成目标分数即可过关</p>
                  <p>💫 消除更多宝石获得连击奖励</p>
                </div>
                <el-button @click="startGame" type="primary" size="large">
                  开始挑战
                </el-button>
              </div>
            </div>
            
            <!-- 游戏结束提示 -->
            <div v-if="gameOver" class="game-over-overlay">
              <div class="game-over-message">
                <h3 v-if="score >= levelTarget">🎉 过关成功！</h3>
                <h3 v-else>💔 挑战失败！</h3>
                <p>最终得分: {{ score }}</p>
                <p>目标分数: {{ levelTarget }}</p>
                <p v-if="score > highScore">🎉 新纪录！</p>
                <el-button @click="startGame" type="primary" size="large">
                  {{ score >= levelTarget ? '下一关' : '重新挑战' }}
                </el-button>
              </div>
            </div>
            
            <!-- 选中提示 -->
            <div v-if="selectedGem && gameRunning && !gameOver" class="selection-hint">
              <p>已选中宝石，点击相邻宝石进行交换</p>
            </div>
          </div>
          
          <!-- 游戏信息面板 -->
          <div class="game-panel">
            <div class="panel-section">
              <h4>🎮 游戏规则</h4>
              <div class="rules-info">
                <p>• 拖拽宝石到相邻位置交换，或点击选择</p>
                <p>• 三个或更多相同宝石会被消除</p>
                <p>• 消除宝石获得分数和连击奖励</p>
                <p>• 达到目标分数即可过关</p>
              </div>
            </div>
            
            <div class="panel-section">
              <h4>💎 宝石类型</h4>
              <div class="gems-info">
                <div class="gem-type">🔴 红宝石 - 10分</div>
                <div class="gem-type">🔵 蓝宝石 - 10分</div>
                <div class="gem-type">🟢 绿宝石 - 10分</div>
                <div class="gem-type">🟡 黄宝石 - 10分</div>
                <div class="gem-type">🟣 紫宝石 - 10分</div>
                <div class="gem-type">⚪ 白宝石 - 10分</div>
              </div>
            </div>
            
            <div class="panel-section">
              <h4>💡 高分技巧</h4>
              <div class="tips-info">
                <p>• 寻找能形成连击的组合</p>
                <p>• 优先消除底部的宝石</p>
                <p>• 创造T型或L型消除获得更高分</p>
                <p>• 计划好每一步，避免浪费移动次数</p>
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
        <p>在有限的步数内，通过消除宝石达到目标分数！</p>
        
        <h4>🎮 操作方法</h4>
        <ul>
          <li>点击宝石选中（会有高亮效果）</li>
          <li>再点击相邻的宝石进行交换</li>
          <li>只能与上下左右相邻的宝石交换</li>
          <li>交换后必须能形成消除才有效</li>
        </ul>
        
        <h4>🏆 消除规则</h4>
        <ul>
          <li>横向或纵向三个或更多相同宝石会被消除</li>
          <li>消除后上方宝石会掉落填充空位</li>
          <li>可能形成连锁消除获得额外分数</li>
          <li>不同形状的消除有不同分数奖励</li>
        </ul>
        
        <h4>📈 计分系统</h4>
        <ul>
          <li>基础消除：每个宝石10分</li>
          <li>连击奖励：连续消除有额外分数</li>
          <li>特殊形状：T型、L型消除有额外奖励</li>
          <li>长链消除：消除越多宝石分数越高</li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Guide,
  Trophy,
  VideoPlay,
  RefreshRight,
  QuestionFilled
} from '@element-plus/icons-vue'

// 游戏状态
const gameCanvas = ref<HTMLCanvasElement | null>(null)
const canvasWidth = 600
const canvasHeight = 600
const gameRunning = ref(false)
const gameStarted = ref(false)
const gameOver = ref(false)
const showHelp = ref(false)
const score = ref(0)
const level = ref(1)
const levelTarget = ref(800)
const movesLeft = ref(20)
const highScore = ref(0)

// 游戏设置
const GRID_SIZE = 8
const GEM_SIZE = 60
const OFFSET_X = 60
const OFFSET_Y = 60

// 宝石类型和颜色
const GEM_TYPES = ['🔴', '🔵', '🟢', '🟡', '🟣', '⚪']
const GEM_COLORS = {
  '🔴': '#E53E3E', // 鲜艳红色 - 饱满而不刺眼
  '🔵': '#3182CE', // 鲜艳蓝色 - 深邃海蓝
  '🟢': '#48BB78', // 鲜艳绿色 - 生机翡翠
  '🟡': '#ECC94B', // 鲜艳黄色 - 温暖金黄
  '🟣': '#9F7AEA', // 鲜艳紫色 - 神秘紫罗兰
  '⚪': '#E2E8F0'  // 亮银白色 - 纯净珍珠
}

// 游戏数据
interface Gem {
  type: string
  x: number
  y: number
  falling?: boolean
  fallSpeed?: number
  animationY?: number
  removing?: boolean
  removeAnimation?: number
  scale?: number
}

interface SelectedGem {
  x: number
  y: number
}

const board = ref<Gem[][]>([])
const selectedGem = ref<SelectedGem | null>(null)
const hoveredGem = ref<SelectedGem | null>(null)
const animating = ref(false)
const removingGems = ref<boolean[][]>([])
const fallingGems = ref<{x: number, y: number, fromY: number, toY: number, progress: number}[]>([])

// 拖拽相关状态
const isDragging = ref(false)
const dragStart = ref<SelectedGem | null>(null)
const dragCurrent = ref<SelectedGem | null>(null)
const dragPath = ref<SelectedGem[]>([])

let ctx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null

// 初始化游戏
const initGame = () => {
  score.value = 0
  level.value = 1
  levelTarget.value = 800
  movesLeft.value = 20
  gameRunning.value = false
  gameStarted.value = false
  gameOver.value = false
  selectedGem.value = null
  hoveredGem.value = null
  animating.value = false
  
  // 初始化棋盘
  initBoard()
  
  // 清空画布并绘制初始状态
  if (ctx) {
    render()
  }
}

// 初始化棋盘
const initBoard = () => {
  board.value = []
  removingGems.value = []
  fallingGems.value = []
  
  for (let y = 0; y < GRID_SIZE; y++) {
    board.value[y] = []
    removingGems.value[y] = []
    for (let x = 0; x < GRID_SIZE; x++) {
      board.value[y][x] = {
        type: getRandomGemType(),
        x: x,
        y: y,
        animationY: y,
        scale: 1
      }
      removingGems.value[y][x] = false
    }
  }
  
  // 确保初始状态没有现成的消除
  removeInitialMatches()
}

// 获取随机宝石类型
const getRandomGemType = (): string => {
  return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)]
}

// 移除初始匹配
const removeInitialMatches = () => {
  let hasMatches = true
  while (hasMatches) {
    hasMatches = false
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (hasMatchAt(x, y)) {
          board.value[y][x].type = getRandomGemType()
          hasMatches = true
        }
      }
    }
  }
}

// 检查指定位置是否有匹配
const hasMatchAt = (x: number, y: number): boolean => {
  const gem = board.value[y][x]
  
  // 检查水平匹配
  let horizontalCount = 1
  // 向左检查
  for (let i = x - 1; i >= 0 && board.value[y][i].type === gem.type; i--) {
    horizontalCount++
  }
  // 向右检查
  for (let i = x + 1; i < GRID_SIZE && board.value[y][i].type === gem.type; i++) {
    horizontalCount++
  }
  
  // 检查垂直匹配
  let verticalCount = 1
  // 向上检查
  for (let i = y - 1; i >= 0 && board.value[i][x].type === gem.type; i--) {
    verticalCount++
  }
  // 向下检查
  for (let i = y + 1; i < GRID_SIZE && board.value[i][x].type === gem.type; i++) {
    verticalCount++
  }
  
  return horizontalCount >= 3 || verticalCount >= 3
}

// 开始游戏
const startGame = () => {
  // 如果是游戏结束状态，重置为第一关
  if (gameOver.value) {
    level.value = 1
    levelTarget.value = 800
    movesLeft.value = 20
    score.value = 0
  }
  
  initGame()
  gameRunning.value = true
  gameStarted.value = true
  
  // 启动游戏循环
  gameLoop()
}

// 游戏循环
const gameLoop = () => {
  if (!gameRunning.value) return
  
  render()
  animationFrame = requestAnimationFrame(gameLoop)
}

// 重置游戏
const resetGame = () => {
  level.value = 1
  initGame()
  if (gameRunning.value) {
    gameRunning.value = true
    gameStarted.value = true
    render()
  }
}

// 处理画布点击
const handleCanvasClick = (event: MouseEvent) => {
  if (!gameRunning.value || gameOver.value || animating.value) return
  
  const rect = gameCanvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const clickX = event.clientX - rect.left
  const clickY = event.clientY - rect.top
  
  // 计算点击的格子位置
  const gridX = Math.floor((clickX - OFFSET_X) / GEM_SIZE)
  const gridY = Math.floor((clickY - OFFSET_Y) / GEM_SIZE)
  
  if (gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE) return
  
  if (!selectedGem.value) {
    // 选中宝石
    selectedGem.value = { x: gridX, y: gridY }
  } else {
    // 尝试交换
    if (isAdjacent(selectedGem.value, { x: gridX, y: gridY })) {
      swapGems(selectedGem.value, { x: gridX, y: gridY })
    } else {
      // 选中新的宝石
      selectedGem.value = { x: gridX, y: gridY }
    }
  }
  
  render()
}



// 鼠标按下开始拖拽
const handleMouseDown = (event: MouseEvent) => {
  if (!gameRunning.value || gameOver.value || animating.value) return
  
  const rect = gameCanvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const clickX = event.clientX - rect.left
  const clickY = event.clientY - rect.top
  
  const gridX = Math.floor((clickX - OFFSET_X) / GEM_SIZE)
  const gridY = Math.floor((clickY - OFFSET_Y) / GEM_SIZE)
  
  if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
    isDragging.value = true
    dragStart.value = { x: gridX, y: gridY }
    dragCurrent.value = { x: gridX, y: gridY }
    dragPath.value = [{ x: gridX, y: gridY }]
    selectedGem.value = null
    hoveredGem.value = null
    
    render()
  }
}

// 鼠标移动时更新拖拽或悬停
const handleMouseMove = (event: MouseEvent) => {
  if (!gameRunning.value || gameOver.value) return
  
  const rect = gameCanvas.value?.getBoundingClientRect()
  if (!rect) return
  
  const moveX = event.clientX - rect.left
  const moveY = event.clientY - rect.top
  
  const gridX = Math.floor((moveX - OFFSET_X) / GEM_SIZE)
  const gridY = Math.floor((moveY - OFFSET_Y) / GEM_SIZE)
  
  if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
    if (isDragging.value && dragStart.value) {
      // 拖拽逻辑
      const newPos = { x: gridX, y: gridY }
      
      // 只允许相邻移动
      if (dragCurrent.value && isAdjacent(dragCurrent.value, newPos)) {
        // 检查是否已经在路径中
        const existingIndex = dragPath.value.findIndex(pos => pos.x === gridX && pos.y === gridY)
        
        if (existingIndex === -1) {
          // 新位置，添加到路径
          dragPath.value.push(newPos)
          dragCurrent.value = newPos
        } else if (existingIndex === dragPath.value.length - 2) {
          // 返回到上一个位置，移除最后一个
          dragPath.value.pop()
          dragCurrent.value = dragPath.value[dragPath.value.length - 1]
        }
        
        render()
      }
    } else {
      // 悬停逻辑
      hoveredGem.value = { x: gridX, y: gridY }
      render()
    }
  } else {
    hoveredGem.value = null
    render()
  }
}

// 鼠标释放完成拖拽
const handleMouseUp = () => {
  if (!isDragging.value || !dragStart.value || dragPath.value.length < 2) {
    resetDrag()
    return
  }
  
  // 只处理两个宝石的交换
  if (dragPath.value.length === 2) {
    const pos1 = dragPath.value[0]
    const pos2 = dragPath.value[1]
    swapGems(pos1, pos2)
  }
  
  resetDrag()
}

// 鼠标离开画布
const handleMouseLeave = () => {
  resetDrag()
}

// 重置拖拽状态
const resetDrag = () => {
  isDragging.value = false
  dragStart.value = null
  dragCurrent.value = null
  dragPath.value = []
  render()
}

// 检查两个位置是否相邻
const isAdjacent = (pos1: SelectedGem, pos2: SelectedGem): boolean => {
  const dx = Math.abs(pos1.x - pos2.x)
  const dy = Math.abs(pos1.y - pos2.y)
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1)
}

// 交换宝石
const swapGems = (pos1: SelectedGem, pos2: SelectedGem) => {
  // 交换宝石
  const temp = board.value[pos1.y][pos1.x].type
  board.value[pos1.y][pos1.x].type = board.value[pos2.y][pos2.x].type
  board.value[pos2.y][pos2.x].type = temp
  
  // 检查是否能消除
  const canMatch = hasMatchAt(pos1.x, pos1.y) || hasMatchAt(pos2.x, pos2.y)
  
  if (canMatch) {
    // 有效交换
    movesLeft.value--
    selectedGem.value = null
    
    // 处理消除
    processMatches()
    
    // 检查游戏结束条件
    if (movesLeft.value <= 0) {
      checkGameEnd()
    }
  } else {
    // 无效交换，恢复原状
    const temp = board.value[pos1.y][pos1.x].type
    board.value[pos1.y][pos1.x].type = board.value[pos2.y][pos2.x].type
    board.value[pos2.y][pos2.x].type = temp
    
    selectedGem.value = null
    ElMessage.warning('无法形成消除，请尝试其他组合')
  }
}

// 处理匹配消除
const processMatches = () => {
  const matchesToRemove: boolean[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  let matchCount = 0
  
  // 找出所有匹配
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (hasMatchAt(x, y)) {
        markMatchesAt(x, y, matchesToRemove)
      }
    }
  }
  
  // 计算匹配数量和分数
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (matchesToRemove[y][x]) {
        matchCount++
      }
    }
  }
  
  if (matchCount > 0) {
    animating.value = true
    
    // 计算分数（基础分数降低，避免分数增长过快）
    let baseScore = matchCount * 8 // 从10降到8
    let comboBonus = matchCount > 3 ? (matchCount - 3) * 3 : 0 // 从5降到3
    let levelPenalty = Math.max(1, level.value - 1) * 0.1 // 关卡越高，分数增长越慢
    let finalScore = Math.floor((baseScore + comboBonus) * (1 - levelPenalty))
    
    score.value += Math.max(1, finalScore) // 至少得1分
    
    // 标记要移除的宝石并开始消除动画
    removingGems.value = matchesToRemove
    startRemoveAnimation()
  }
}

// 开始消除动画
const startRemoveAnimation = () => {
  let animationProgress = 0
  const animationDuration = 30 // 动画帧数
  
  const animate = () => {
    animationProgress++
    
    // 更新消除动画
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (removingGems.value[y][x]) {
          const progress = animationProgress / animationDuration
          board.value[y][x].scale = Math.max(0, 1 - progress * 2) // 缩放到0
          board.value[y][x].removeAnimation = progress
        }
      }
    }
    
    render()
    
    if (animationProgress < animationDuration) {
      requestAnimationFrame(animate)
    } else {
      // 动画完成，实际移除宝石
      finishRemoveAnimation()
    }
  }
  
  requestAnimationFrame(animate)
}

// 完成消除动画
const finishRemoveAnimation = () => {
  // 移除匹配的宝石
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (removingGems.value[y][x]) {
        board.value[y][x].type = ''
        board.value[y][x].scale = 1
        board.value[y][x].removeAnimation = 0
      }
    }
  }
  
  // 重置移除标记
  removingGems.value = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false))
  
  // 开始掉落动画
  startFallAnimation()
}

// 标记匹配的宝石
const markMatchesAt = (x: number, y: number, matches: boolean[][]) => {
  const gem = board.value[y][x]
  if (!gem.type) return
  
  // 标记水平匹配
  let horizontalMatches = [{ x, y }]
  // 向左
  for (let i = x - 1; i >= 0 && board.value[y][i].type === gem.type; i--) {
    horizontalMatches.push({ x: i, y })
  }
  // 向右
  for (let i = x + 1; i < GRID_SIZE && board.value[y][i].type === gem.type; i++) {
    horizontalMatches.push({ x: i, y })
  }
  
  if (horizontalMatches.length >= 3) {
    horizontalMatches.forEach(pos => {
      matches[pos.y][pos.x] = true
    })
  }
  
  // 标记垂直匹配
  let verticalMatches = [{ x, y }]
  // 向上
  for (let i = y - 1; i >= 0 && board.value[i][x].type === gem.type; i--) {
    verticalMatches.push({ x, y: i })
  }
  // 向下
  for (let i = y + 1; i < GRID_SIZE && board.value[i][x].type === gem.type; i++) {
    verticalMatches.push({ x, y: i })
  }
  
  if (verticalMatches.length >= 3) {
    verticalMatches.forEach(pos => {
      matches[pos.y][pos.x] = true
    })
  }
}

// 开始掉落动画
const startFallAnimation = () => {
  fallingGems.value = []
  
  // 计算掉落路径
  for (let x = 0; x < GRID_SIZE; x++) {
    const column = []
    let writeIndex = GRID_SIZE - 1
    
    // 从底部开始收集非空宝石
    for (let y = GRID_SIZE - 1; y >= 0; y--) {
      if (board.value[y][x].type) {
        column.push({
          gem: board.value[y][x],
          fromY: y,
          toY: writeIndex
        })
        writeIndex--
      }
    }
    
    // 添加需要掉落的宝石到动画列表
    column.forEach(item => {
      if (item.fromY !== item.toY) {
        fallingGems.value.push({
          x: x,
          y: item.toY,
          fromY: item.fromY,
          toY: item.toY,
          progress: 0
        })
        
        // 设置动画起始位置
        board.value[item.toY][x] = { ...item.gem }
        board.value[item.toY][x].animationY = item.fromY
        
        // 清空原位置
        if (item.fromY !== item.toY) {
          board.value[item.fromY][x].type = ''
        }
      }
    })
    
    // 填充新宝石
    for (let y = writeIndex; y >= 0; y--) {
      const newGem = {
        type: getRandomGemType(),
        x: x,
        y: y,
        animationY: -1 - (writeIndex - y), // 从顶部上方开始
        scale: 1
      }
      board.value[y][x] = newGem
      
      fallingGems.value.push({
        x: x,
        y: y,
        fromY: newGem.animationY!,
        toY: y,
        progress: 0
      })
    }
  }
  
  // 开始掉落动画
  if (fallingGems.value.length > 0) {
    animateFalling()
  } else {
    // 没有掉落，检查新的匹配
    animating.value = false
    setTimeout(() => {
      processMatches()
    }, 100)
  }
}

// 掉落动画
const animateFalling = () => {
  let animationProgress = 0
  const animationDuration = 20 // 动画帧数
  
  const animate = () => {
    animationProgress++
    const progress = animationProgress / animationDuration
    
    // 使用缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    fallingGems.value.forEach(falling => {
      const gem = board.value[falling.y][falling.x]
      gem.animationY = falling.fromY + (falling.toY - falling.fromY) * easeProgress
    })
    
    render()
    
    if (animationProgress < animationDuration) {
      requestAnimationFrame(animate)
    } else {
      // 动画完成
      fallingGems.value.forEach(falling => {
        board.value[falling.y][falling.x].animationY = falling.toY
      })
      
      fallingGems.value = []
      animating.value = false
      
      // 检查新的匹配
      setTimeout(() => {
        processMatches()
      }, 100)
    }
  }
  
  requestAnimationFrame(animate)
}

// 检查游戏结束
const checkGameEnd = () => {
  if (score.value >= levelTarget.value) {
    // 过关
    level.value++
    
    // 计算新关卡的目标分数和步数（基于800分起始）
    const difficultyMultiplier = 1 + (level.value - 1) * 0.12 // 难度递增12%，更温和
    const newTargetIncrement = Math.floor(800 * difficultyMultiplier + Math.pow(level.value - 1, 1.2) * 150)
    const newMoves = Math.max(12, 22 - Math.floor(level.value / 3)) // 步数逐渐减少，最少12步
    
    levelTarget.value = score.value + newTargetIncrement
    movesLeft.value = newMoves
    
    ElMessage.success(`🎉 恭喜过关！进入第 ${level.value} 关！需要再得：${newTargetIncrement} 分，剩余：${movesLeft.value} 步`)
    
    // 分数继续累积，但目标分数是基于当前分数的增量
    
    // 重新生成棋盘，但游戏继续运行
    initBoard()
    render()
    
  } else if (movesLeft.value <= 0) {
    // 失败
    ElMessage.error(`💀 挑战失败！得分：${score.value}，到达第 ${level.value} 关`)
    endGame()
  }
}

// 结束游戏
const endGame = () => {
  gameOver.value = true
  gameRunning.value = false
  
  // 停止游戏循环
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  
  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('gemCrushHighScore', highScore.value.toString())
    ElMessage.success('🎉 新纪录！')
  }
}

// 渲染游戏
const render = () => {
  if (!ctx) return
  
  // 清空画布
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  
  // 绘制背景
  drawBackground()
  
  // 绘制宝石
  drawGems()
  
  // 绘制选中效果
  drawSelection()
}

// 绘制星空背景
const drawBackground = () => {
  if (!ctx) return
  
  // 深邃的星空蓝紫背景渐变（更护眼且炫酷）
  const backgroundGradient = ctx.createRadialGradient(
    canvasWidth / 2, canvasHeight / 2, 0,
    canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) / 2
  )
  backgroundGradient.addColorStop(0, '#1e1b4b')  // 中心深紫蓝 - 护眼且有质感
  backgroundGradient.addColorStop(0.5, '#0f0f23')  // 过渡到深蓝紫
  backgroundGradient.addColorStop(1, '#020617')  // 边缘极深蓝 - 炫酷边界
  
  ctx.fillStyle = backgroundGradient
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // 绘制稀疏的星点（静态位置，避免闪烁）
  const starPositions = [
    {x: 120, y: 80, size: 1.2}, {x: 280, y: 150, size: 0.8}, {x: 450, y: 100, size: 1.0},
    {x: 200, y: 300, size: 0.6}, {x: 380, y: 220, size: 1.1}, {x: 500, y: 350, size: 0.9},
    {x: 150, y: 480, size: 0.7}, {x: 350, y: 450, size: 1.3}, {x: 80, y: 250, size: 0.5},
    {x: 420, y: 50, size: 0.8}, {x: 250, y: 180, size: 1.0}, {x: 480, y: 280, size: 0.6}
  ]
  
  // 绘制主要星点
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  starPositions.forEach(star => {
    if (star.x < canvasWidth && star.y < canvasHeight && ctx) {
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  
  // 绘制微光星点
  const microStars = [
    {x: 60, y: 120, size: 0.3}, {x: 180, y: 60, size: 0.4}, {x: 320, y: 180, size: 0.2},
    {x: 240, y: 400, size: 0.3}, {x: 140, y: 350, size: 0.4}, {x: 400, y: 120, size: 0.2},
    {x: 300, y: 500, size: 0.3}, {x: 460, y: 200, size: 0.4}, {x: 100, y: 400, size: 0.2}
  ]
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  microStars.forEach(star => {
    if (star.x < canvasWidth && star.y < canvasHeight && ctx) {
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    }
  })
  
  // 绘制游戏区域边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 2
  ctx.strokeRect(OFFSET_X - 1, OFFSET_Y - 1, GRID_SIZE * GEM_SIZE + 2, GRID_SIZE * GEM_SIZE + 2)
  
  // 绘制格子网格线
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  
  // 绘制垂直线
  for (let x = 0; x <= GRID_SIZE; x++) {
    ctx.beginPath()
    ctx.moveTo(OFFSET_X + x * GEM_SIZE, OFFSET_Y)
    ctx.lineTo(OFFSET_X + x * GEM_SIZE, OFFSET_Y + GRID_SIZE * GEM_SIZE)
    ctx.stroke()
  }
  
  // 绘制水平线
  for (let y = 0; y <= GRID_SIZE; y++) {
    ctx.beginPath()
    ctx.moveTo(OFFSET_X, OFFSET_Y + y * GEM_SIZE)
    ctx.lineTo(OFFSET_X + GRID_SIZE * GEM_SIZE, OFFSET_Y + y * GEM_SIZE)
    ctx.stroke()
  }
}

// 绘制宝石
const drawGems = () => {
  if (!ctx) return
  
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const gem = board.value[y][x]
      if (!gem.type) continue
      
      const pixelX = OFFSET_X + x * GEM_SIZE
      // 使用动画Y位置
      const pixelY = OFFSET_Y + (gem.animationY !== undefined ? gem.animationY : y) * GEM_SIZE
      
      // 只绘制在可见区域内的宝石
      if (pixelY < OFFSET_Y - GEM_SIZE || pixelY > OFFSET_Y + GRID_SIZE * GEM_SIZE) {
        continue
      }
      
      ctx.save()
      
      // 应用缩放（用于消除动画）
      const scale = gem.scale !== undefined ? gem.scale : 1
      if (scale !== 1) {
        ctx.translate(pixelX + GEM_SIZE/2, pixelY + GEM_SIZE/2)
        ctx.scale(scale, scale)
        ctx.translate(-GEM_SIZE/2, -GEM_SIZE/2)
      } else {
        ctx.translate(pixelX, pixelY)
      }
      
      // 获取宝石颜色
      const gemColor = GEM_COLORS[gem.type as keyof typeof GEM_COLORS]
      
      // 定义钻石尺寸和位置（缩小尺寸，留出格子间隙）
      const centerX = GEM_SIZE/2
      const centerY = GEM_SIZE/2
      const size = GEM_SIZE/2 - 12  // 大幅缩小，留出更多空间
      
      // 绘制柔和外层光晕（适配小尺寸）
      const outerGlowGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size + 6
      )
      outerGlowGradient.addColorStop(0, `${gemColor}08`) // 很淡的中心
      outerGlowGradient.addColorStop(0.7, `${gemColor}03`) // 极淡的边缘
      outerGlowGradient.addColorStop(1, `${gemColor}00`)
      
      ctx.fillStyle = outerGlowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, size + 6, 0, Math.PI * 2)
      ctx.fill()
      
      // 菱形四个顶点
      const topPoint = { x: centerX, y: centerY - size }      // 上顶点
      const rightPoint = { x: centerX + size, y: centerY }    // 右顶点
      const bottomPoint = { x: centerX, y: centerY + size }   // 下顶点
      const leftPoint = { x: centerX - size, y: centerY }     // 左顶点
      
      // 绘制菱形主体
      ctx.beginPath()
      ctx.moveTo(topPoint.x, topPoint.y)
      ctx.lineTo(rightPoint.x, rightPoint.y)
      ctx.lineTo(bottomPoint.x, bottomPoint.y)
      ctx.lineTo(leftPoint.x, leftPoint.y)
      ctx.closePath()
      
      // 主体径向渐变（从中心向外）
      const diamondGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size
      )
      diamondGradient.addColorStop(0, adjustBrightness(gemColor, 15))    // 中心亮
      diamondGradient.addColorStop(0.6, gemColor)                        // 中间原色
      diamondGradient.addColorStop(1, adjustBrightness(gemColor, -25))   // 边缘暗
      
      ctx.fillStyle = diamondGradient
      ctx.fill()
      
      // 绘制精致边框
      ctx.strokeStyle = adjustBrightness(gemColor, -40)
      ctx.lineWidth = 1.2
      ctx.stroke()
      
      // 添加内阴影效果
      const innerShadow = ctx.createLinearGradient(
        topPoint.x, topPoint.y,
        bottomPoint.x, bottomPoint.y
      )
      innerShadow.addColorStop(0, 'rgba(0, 0, 0, 0)')
      innerShadow.addColorStop(0.9, 'rgba(0, 0, 0, 0.1)')
      innerShadow.addColorStop(1, 'rgba(0, 0, 0, 0.2)')
      
      ctx.fillStyle = innerShadow
      ctx.fill()
      
      // 绘制精致的内部切线（更细更淡）
      ctx.strokeStyle = adjustBrightness(gemColor, -20)
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.2
      
      ctx.beginPath()
      // 只绘制一条优雅的垂直线
      ctx.moveTo(centerX, topPoint.y + size * 0.2)
      ctx.lineTo(centerX, bottomPoint.y - size * 0.2)
      
      ctx.stroke()
      ctx.globalAlpha = 1
      
      // 绘制柔和高光点（小而精致）
      const highlightGradient = ctx.createRadialGradient(
        centerX - size * 0.2, centerY - size * 0.3, 0,
        centerX - size * 0.2, centerY - size * 0.3, size * 0.4
      )
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)')
      highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)')
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = highlightGradient
      ctx.beginPath()
      ctx.arc(centerX - size * 0.2, centerY - size * 0.3, size * 0.4, 0, Math.PI * 2)
      ctx.fill()
      
      // 绘制emoji（小而清晰）
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'
      ctx.font = 'bold 8px Arial'  // 缩小字体
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)'
      ctx.shadowBlur = 0.3
      ctx.fillText(gem.type, centerX, centerY)  // 菱形中心位置
      ctx.shadowBlur = 0
      
      // 如果是消除动画中的宝石，添加特效
      if (removingGems.value[y] && removingGems.value[y][x]) {
        const alpha = 1 - (gem.removeAnimation || 0)
        const animRadius = size * (1.5 + (gem.removeAnimation || 0))
        
        // 爆炸效果
        const explosionGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, animRadius
        )
        explosionGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`)
        explosionGradient.addColorStop(0.3, `rgba(255, 255, 100, ${alpha * 0.6})`)
        explosionGradient.addColorStop(0.6, `${gemColor}${Math.floor(alpha * 100).toString(16).padStart(2, '0')}`)
        explosionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.fillStyle = explosionGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, animRadius, 0, Math.PI * 2)
        ctx.fill()
        
        // 极柔和钻石粉碎效果
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + (alpha * 0.3) + ')'  // 大幅降低亮度
        ctx.lineWidth = 1  // 更细线条
        ctx.globalAlpha = alpha * 0.5  // 大幅降低整体透明度
        
        // 四个方向的钻石碎片效果
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2 + (gem.removeAnimation || 0) * Math.PI * 4
          const startRadius = size * 0.3
          const endRadius = size * (1.5 + (gem.removeAnimation || 0) * 0.8)
          
          ctx.beginPath()
          ctx.moveTo(
            centerX + Math.cos(angle) * startRadius,
            centerY + Math.sin(angle) * startRadius
          )
          ctx.lineTo(
            centerX + Math.cos(angle) * endRadius,
            centerY + Math.sin(angle) * endRadius
          )
          ctx.stroke()
          
          // 对角线碎片
          const diagonalAngle = angle + Math.PI / 4
          ctx.beginPath()
          ctx.moveTo(
            centerX + Math.cos(diagonalAngle) * startRadius * 0.7,
            centerY + Math.sin(diagonalAngle) * startRadius * 0.7
          )
          ctx.lineTo(
            centerX + Math.cos(diagonalAngle) * endRadius * 0.8,
            centerY + Math.sin(diagonalAngle) * endRadius * 0.8
          )
          ctx.stroke()
        }
        
        // 闪光效果
        ctx.strokeStyle = `${gemColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, size * (1 + (gem.removeAnimation || 0) * 2), 0, Math.PI * 2)
        ctx.stroke()
        
        ctx.globalAlpha = 1
      }
      
      ctx.restore()
    }
  }
}

// 颜色亮度调整辅助函数
const adjustBrightness = (color: string, percent: number): string => {
  // 将十六进制颜色转换为RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // 调整亮度
  const newR = Math.max(0, Math.min(255, r + percent))
  const newG = Math.max(0, Math.min(255, g + percent))
  const newB = Math.max(0, Math.min(255, b + percent))
  
  // 转换回十六进制
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
}

// 绘制选中效果
const drawSelection = () => {
  if (!ctx) return
  
  // 绘制拖拽路径
  if (isDragging.value && dragPath.value.length > 0) {
    // 绘制路径连线
    if (dragPath.value.length > 1 && ctx) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)'
      ctx.lineWidth = 4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      const firstPos = dragPath.value[0]
      ctx.moveTo(
        OFFSET_X + firstPos.x * GEM_SIZE + GEM_SIZE/2,
        OFFSET_Y + firstPos.y * GEM_SIZE + GEM_SIZE/2
      )
      
      for (let i = 1; i < dragPath.value.length; i++) {
        const pos = dragPath.value[i]
        ctx.lineTo(
          OFFSET_X + pos.x * GEM_SIZE + GEM_SIZE/2,
          OFFSET_Y + pos.y * GEM_SIZE + GEM_SIZE/2
        )
      }
      ctx.stroke()
    }
    
    // 绘制拖拽路径上的宝石高亮
    dragPath.value.forEach((pos, index) => {
      if (!ctx) return
      
      const centerX = OFFSET_X + pos.x * GEM_SIZE + GEM_SIZE/2
      const centerY = OFFSET_Y + pos.y * GEM_SIZE + GEM_SIZE/2
      
      // 绘制光圈
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, GEM_SIZE/2 + 8
      )
      
      if (index === 0) {
        // 起始宝石用绿色
        glowGradient.addColorStop(0, 'rgba(34, 197, 94, 0.6)')
        glowGradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.3)')
        glowGradient.addColorStop(1, 'rgba(34, 197, 94, 0)')
      } else if (index === dragPath.value.length - 1) {
        // 当前位置用金色
        glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
        glowGradient.addColorStop(0.7, 'rgba(251, 191, 36, 0.4)')
        glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
      } else {
        // 中间路径用橙色
        glowGradient.addColorStop(0, 'rgba(249, 115, 22, 0.6)')
        glowGradient.addColorStop(0.7, 'rgba(249, 115, 22, 0.3)')
        glowGradient.addColorStop(1, 'rgba(249, 115, 22, 0)')
      }
      
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, GEM_SIZE/2 + 8, 0, Math.PI * 2)
      ctx.fill()
      
      // 绘制边框
      if (index === 0) {
        ctx.strokeStyle = '#22c55e'
      } else if (index === dragPath.value.length - 1) {
        ctx.strokeStyle = '#fbbf24'
      } else {
        ctx.strokeStyle = '#f97316'
      }
      
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(centerX, centerY, GEM_SIZE/2 - 3, 0, Math.PI * 2)
      ctx.stroke()
    })
  }
  
  // 绘制悬停效果（只在非拖拽状态下显示）
  if (hoveredGem.value && !isDragging.value && ctx) {
    const centerX = OFFSET_X + hoveredGem.value.x * GEM_SIZE + GEM_SIZE/2
    const centerY = OFFSET_Y + hoveredGem.value.y * GEM_SIZE + GEM_SIZE/2
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, GEM_SIZE/2 - 2, 0, Math.PI * 2)
    ctx.stroke()
  }
  
  // 绘制选中效果（只在非拖拽状态下显示）
  if (selectedGem.value && !isDragging.value && ctx) {
    const centerX = OFFSET_X + selectedGem.value.x * GEM_SIZE + GEM_SIZE/2
    const centerY = OFFSET_Y + selectedGem.value.y * GEM_SIZE + GEM_SIZE/2
    
    // 绘制发光背景
    const selectGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, GEM_SIZE/2 + 10
    )
    selectGradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)')
    selectGradient.addColorStop(0.7, 'rgba(251, 191, 36, 0.2)')
    selectGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
    
    ctx.fillStyle = selectGradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, GEM_SIZE/2 + 10, 0, Math.PI * 2)
    ctx.fill()
    
    // 绘制金色边框
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 3
    ctx.shadowColor = '#fbbf24'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(centerX, centerY, GEM_SIZE/2 - 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.shadowBlur = 0
  }
}

// 加载最高分
const loadHighScore = () => {
  const saved = localStorage.getItem('gemCrushHighScore')
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
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped>
.gem-crush {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
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
  max-width: 1200px;
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
  background: linear-gradient(135deg, #1e1b4b, #312e81);
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
  color: #1e1b4b;
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

.game-board-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 8px 25px rgba(0, 0, 0, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.game-canvas {
  display: block;
  border-radius: 12px;
  cursor: pointer;
}

.start-overlay,
.game-over-overlay {
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
.game-over-message {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 400px;
}

.start-message h3,
.game-over-message h3 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
}

.start-message p,
.game-over-message p {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.controls-hint {
  background: #f1f5f9;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  border-left: 4px solid #1e1b4b;
}

.controls-hint p {
  margin: 4px 0;
  font-size: 14px;
  color: #334155;
}

.selection-hint {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(251, 191, 36, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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
}

.rules-info,
.gems-info,
.tips-info {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
}

.rules-info p,
.tips-info p {
  margin: 8px 0;
  color: #666;
  line-height: 1.4;
}

.gem-type {
  display: flex;
  align-items: center;
  margin: 6px 0;
  color: #666;
  font-size: 14px;
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
  
  .game-board-container {
    transform: scale(0.8);
    transform-origin: center;
  }
  
  .start-message,
  .game-over-message {
    max-width: 300px;
    padding: 20px;
  }
  
  .game-buttons {
    justify-content: center;
  }
}
</style>
