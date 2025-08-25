<template>
  <div class="whack-mole">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Pointer /></el-icon>
        </div>
        <h1 class="hero-title">打地鼠游戏</h1>
        <p class="hero-description">经典反应训练游戏，考验你的手速和专注力</p>
      </div>
    </div>

    <!-- 游戏主体 -->
    <div class="tool-card">
      <div class="card-header">
        <h3>
          <el-icon><Aim /></el-icon>
          游戏区域
        </h3>
        <p class="card-description">快速点击冒出来的地鼠，不要让它们跑掉！</p>
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
              <span class="label">剩余时间:</span>
              <span class="value">{{ timeLeft }}s</span>
            </div>
            <div class="info-item">
              <span class="label">连击:</span>
              <span class="value">{{ combo }}</span>
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
              :disabled="gameRunning"
            >
              {{ gameRunning ? '游戏中...' : '开始游戏' }}
            </el-button>
            <el-button @click="pauseGame" v-if="gameRunning" :icon="VideoPause">
              {{ gamePaused ? '继续' : '暂停' }}
            </el-button>
            <el-button @click="showSettings = true" :icon="Setting">
              设置
            </el-button>
          </div>
        </div>

        <!-- 游戏主区域 -->
        <div class="game-main">
          <div class="mole-field" :class="`difficulty-${difficulty}`">
            <div
              v-for="(hole, index) in holes"
              :key="index"
              :class="[
                'mole-hole',
                { 
                  'has-mole': hole.hasMole,
                  'mole-hit': hole.isHit,
                  'special-mole': hole.isSpecial
                }
              ]"
              @click="hitMole(index)"
            >
              <div class="hole-bg"></div>
              <div v-if="hole.hasMole" class="mole" :class="{ 'special': hole.isSpecial }">
                <div class="mole-emoji">
                  {{ hole.isSpecial ? '🐹' : '🐭' }}
                </div>
              </div>
              <div v-if="hole.showPoints" class="points-popup">
                +{{ hole.points }}
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏状态 -->
        <div v-if="gameOver" class="game-status">
          <div class="game-over-message">
            <h3>🎮 游戏结束！</h3>
            <p>最终得分: {{ score }}</p>
            <p v-if="score > highScore">🎉 新纪录！</p>
            <p>击中率: {{ hitRate }}%</p>
            <el-button @click="startGame" type="primary" size="large">
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
          <label>游戏难度:</label>
          <el-radio-group v-model="difficulty">
            <el-radio :value="0">简单 (3×3)</el-radio>
            <el-radio :value="1">普通 (4×4)</el-radio>
            <el-radio :value="2">困难 (5×5)</el-radio>
          </el-radio-group>
        </div>
        
        <div class="setting-group">
          <label>游戏时长:</label>
          <el-radio-group v-model="gameDuration">
            <el-radio :value="30">30秒</el-radio>
            <el-radio :value="60">60秒</el-radio>
            <el-radio :value="90">90秒</el-radio>
          </el-radio-group>
        </div>

        <div class="setting-group">
          <label>音效设置:</label>
          <el-switch v-model="soundEnabled" active-text="开启" inactive-text="关闭" />
        </div>

        <div class="setting-group">
          <label>游戏记录:</label>
          <div class="game-records">
            <div v-if="gameHistory.length === 0">暂无游戏记录</div>
            <div v-else>
              <div v-for="(record, index) in gameHistory.slice(0, 5)" :key="index" class="record-item">
                {{ difficultyNames[record.difficulty] }} - {{ record.score }}分 - {{ record.hitRate }}%
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Pointer,
  Aim,
  VideoPlay,
  VideoPause,
  Setting
} from '@element-plus/icons-vue'

// 地鼠洞数据类型
interface Hole {
  hasMole: boolean
  isHit: boolean
  isSpecial: boolean
  showPoints: boolean
  points: number
  timer?: number
}

// 游戏状态
const holes = ref<Hole[]>([])
const score = ref(0)
const combo = ref(0)
const timeLeft = ref(60)
const gameRunning = ref(false)
const gamePaused = ref(false)
const gameOver = ref(false)
const showSettings = ref(false)
const totalHits = ref(0)
const totalMoles = ref(0)

// 游戏配置
const difficulty = ref(1) // 0: 3x3, 1: 4x4, 2: 5x5
const gameDuration = ref(60)
const soundEnabled = ref(true)
const difficultyNames: Record<number, string> = {
  0: '简单',
  1: '普通',
  2: '困难'
}

// 游戏计时器
let gameTimer: number | null = null
let moleSpawnTimer: number | null = null

// 最高分和游戏记录
const highScore = ref(0)
const gameHistory = ref<Array<{difficulty: number, score: number, hitRate: number, date: number}>>([])

// 计算属性
const gridSize = computed(() => difficulty.value + 3)
const totalHoles = computed(() => gridSize.value * gridSize.value)
const hitRate = computed(() => 
  totalMoles.value > 0 ? Math.round((totalHits.value / totalMoles.value) * 100) : 0
)

// 音频上下文
let audioContext: AudioContext | null = null

// 初始化游戏
const initGame = () => {
  const holeCount = totalHoles.value
  holes.value = Array.from({ length: holeCount }, () => ({
    hasMole: false,
    isHit: false,
    isSpecial: false,
    showPoints: false,
    points: 0
  }))
  
  score.value = 0
  combo.value = 0
  timeLeft.value = gameDuration.value
  gameRunning.value = false
  gamePaused.value = false
  gameOver.value = false
  totalHits.value = 0
  totalMoles.value = 0
  
  clearAllTimers()
}

// 清除所有计时器
const clearAllTimers = () => {
  if (gameTimer) {
    clearInterval(gameTimer)
    gameTimer = null
  }
  if (moleSpawnTimer) {
    clearInterval(moleSpawnTimer)
    moleSpawnTimer = null
  }
  
  holes.value.forEach(hole => {
    if (hole.timer) {
      clearTimeout(hole.timer)
    }
  })
}

// 开始游戏
const startGame = () => {
  initGame()
  gameRunning.value = true
  
  // 开始倒计时
  gameTimer = setInterval(() => {
    if (!gamePaused.value) {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        endGame()
      }
    }
  }, 1000)
  
  // 开始生成地鼠
  spawnMole()
  
  if (soundEnabled.value) {
    playSound('start')
  }
}

// 暂停游戏
const pauseGame = () => {
  gamePaused.value = !gamePaused.value
}

// 结束游戏
const endGame = () => {
  gameRunning.value = false
  gameOver.value = true
  clearAllTimers()
  
  // 更新最高分
  if (score.value > highScore.value) {
    highScore.value = score.value
    localStorage.setItem('whackMoleHighScore', highScore.value.toString())
  }
  
  // 保存游戏记录
  saveRecord()
  
  if (soundEnabled.value) {
    playSound('end')
  }
}

// 生成地鼠
const spawnMole = () => {
  if (!gameRunning.value || gamePaused.value) return
  
  // 计算生成间隔（难度越高间隔越短）
  const baseInterval = 1500
  const difficultyMultiplier = [1.5, 1.0, 0.7][difficulty.value]
  const interval = baseInterval * difficultyMultiplier
  
  // 随机选择一个空洞
  const emptyHoles = holes.value
    .map((hole, index) => ({ hole, index }))
    .filter(({ hole }) => !hole.hasMole)
  
  if (emptyHoles.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyHoles.length)
    const { index } = emptyHoles[randomIndex]
    const hole = holes.value[index]
    
    // 10% 概率生成特殊地鼠
    const isSpecial = Math.random() < 0.1
    
    hole.hasMole = true
    hole.isSpecial = isSpecial
    hole.isHit = false
    totalMoles.value++
    
    // 地鼠显示时间（特殊地鼠时间更短）
    const showTime = isSpecial ? 800 : 1200
    
    hole.timer = setTimeout(() => {
      if (hole.hasMole && !hole.isHit) {
        hole.hasMole = false
        combo.value = 0 // 错过地鼠，连击重置
      }
    }, showTime)
  }
  
  // 设置下次生成地鼠的时间
  moleSpawnTimer = setTimeout(spawnMole, interval + Math.random() * 500)
}

// 打击地鼠
const hitMole = (index: number) => {
  if (!gameRunning.value || gamePaused.value) return
  
  const hole = holes.value[index]
  if (hole.hasMole && !hole.isHit) {
    hole.isHit = true
    hole.hasMole = false
    totalHits.value++
    combo.value++
    
    // 计算得分
    let points = hole.isSpecial ? 50 : 10
    points += Math.floor(combo.value / 5) * 5 // 连击奖励
    
    score.value += points
    hole.points = points
    hole.showPoints = true
    
    // 清除地鼠计时器
    if (hole.timer) {
      clearTimeout(hole.timer)
    }
    
    // 显示得分动画
    setTimeout(() => {
      hole.showPoints = false
      hole.isHit = false
    }, 500)
    
    if (soundEnabled.value) {
      playSound(hole.isSpecial ? 'special' : 'hit')
    }
  }
}

// 播放音效
const playSound = (type: 'hit' | 'special' | 'start' | 'end') => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (e) {
      return
    }
  }
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  switch (type) {
    case 'hit':
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
      break
    case 'special':
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.2)
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
      break
    case 'start':
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3)
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
      break
    case 'end':
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.5)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
      break
  }
}

// 保存游戏记录
const saveRecord = () => {
  const record = {
    difficulty: difficulty.value,
    score: score.value,
    hitRate: hitRate.value,
    date: Date.now()
  }
  
  gameHistory.value.unshift(record)
  gameHistory.value.sort((a, b) => b.score - a.score)
  
  // 保存到本地存储
  localStorage.setItem('whackMoleHistory', JSON.stringify(gameHistory.value))
}

// 清空记录
const clearHistory = () => {
  gameHistory.value = []
  highScore.value = 0
  localStorage.removeItem('whackMoleHistory')
  localStorage.removeItem('whackMoleHighScore')
  ElMessage.success('记录已清空')
}

// 加载历史记录
const loadHistory = () => {
  try {
    const history = localStorage.getItem('whackMoleHistory')
    if (history) {
      gameHistory.value = JSON.parse(history)
    }
    
    const high = localStorage.getItem('whackMoleHighScore')
    if (high) {
      highScore.value = parseInt(high, 10)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadHistory()
  initGame()
})

onUnmounted(() => {
  clearAllTimers()
  if (audioContext) {
    audioContext.close()
  }
})
</script>

<style scoped>
.whack-mole {
  min-height: 100vh;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  max-width: 950px;
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
  background: linear-gradient(135deg, #10b981, #059669);
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

.info-item .value.score {
  color: #10b981;
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

.mole-field {
  display: grid;
  gap: 18px;
  padding: 25px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6366f1 100%);
  border-radius: 24px;
  box-shadow: 
    0 15px 50px rgba(139, 92, 246, 0.3),
    inset 0 2px 8px rgba(255, 255, 255, 0.1);
  border: 4px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.mole-field::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(109, 40, 217, 0.2) 0%, transparent 50%);
  border-radius: 12px;
  pointer-events: none;
}

.difficulty-0 {
  grid-template-columns: repeat(3, 1fr);
  width: 360px;
  height: 360px;
}

.difficulty-1 {
  grid-template-columns: repeat(4, 1fr);
  width: 480px;
  height: 480px;
}

.difficulty-2 {
  grid-template-columns: repeat(5, 1fr);
  width: 600px;
  height: 600px;
}

.mole-hole {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
  transition: transform 0.1s ease;
}

.mole-hole:hover {
  transform: scale(1.05);
}

.hole-bg {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #3b82f6 0%, #1d4ed8 100%);
  border: 3px solid #1e40af;
  border-radius: 50%;
  box-shadow: 
    inset 0 4px 12px rgba(29, 78, 216, 0.4),
    0 2px 8px rgba(59, 130, 246, 0.3);
}

.mole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: mole-popup 0.3s ease-out;
}

.mole.special {
  animation: special-mole-popup 0.3s ease-out;
}

@keyframes mole-popup {
  0% { transform: translate(-50%, 100%); }
  100% { transform: translate(-50%, -50%); }
}

@keyframes special-mole-popup {
  0% { transform: translate(-50%, 100%) scale(0.8); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.mole-emoji {
  font-size: 48px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.1s ease;
}

.special .mole-emoji {
  font-size: 52px;
  filter: 
    drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))
    drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
  animation: special-glow 1s ease-in-out infinite alternate;
}

@keyframes special-glow {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.mole-hit {
  animation: hit-effect 0.5s ease-out;
}

@keyframes hit-effect {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 0; }
}

.points-popup {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #fbbf24;
  font-weight: bold;
  font-size: 16px;
  pointer-events: none;
  animation: points-float 0.5s ease-out;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes points-float {
  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-30px); }
}

.game-status {
  text-align: center;
  margin-top: 30px;
}

.game-over-message {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.3);
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
  
  .difficulty-0 {
    width: 280px;
    height: 280px;
  }
  
  .difficulty-1 {
    width: 320px;
    height: 320px;
  }
  
  .difficulty-2 {
    width: 360px;
    height: 360px;
  }
  
  .mole-emoji {
    font-size: 36px;
  }
  
  .special .mole-emoji {
    font-size: 40px;
  }
  
  .game-buttons {
    justify-content: center;
  }
}
</style>
