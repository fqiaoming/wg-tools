<template>
  <div class="roll-call-container">
    <!-- 动态粒子背景 -->
    <div class="particles" ref="particlesRef"></div>

    <!-- 主容器 -->
    <div class="container">
      <!-- 工具标题 -->
      <div class="tool-header">
        <h1 class="tool-title">
          <el-icon class="title-icon"><Bell /></el-icon>
          学生点名器
        </h1>
        <p class="tool-description">智能随机点名，活跃课堂氛围</p>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <el-card class="settings-card" shadow="hover">
          <template #header>
            <span class="card-title">🎯 点名设置</span>
          </template>
          
          <!-- 名单管理 -->
          <div class="name-management">
            <div class="input-section">
              <el-input
                v-model="newStudentName"
                placeholder="输入学生姓名"
                @keyup.enter="addStudent"
                size="large"
              >
                <template #append>
                  <el-button @click="addStudent" type="primary">
                    <el-icon><Plus /></el-icon>
                    添加
                  </el-button>
                </template>
              </el-input>
            </div>

            <div class="upload-section">
              <el-upload
                :before-upload="handleFileUpload"
                :show-file-list="false"
                accept=".txt,.csv,.xlsx"
                action=""
              >
                <el-button type="success" size="large">
                  <el-icon><Upload /></el-icon>
                  批量导入名单
                </el-button>
              </el-upload>
              
              <el-button @click="downloadSample" type="info" size="large" plain>
                <el-icon><Download /></el-icon>
                下载示例文件
              </el-button>
            </div>
          </div>

          <!-- 点名选项 -->
          <div class="roll-call-options">
            <div class="option-group">
              <label>点名模式:</label>
              <el-radio-group v-model="rollCallMode" size="large">
                <el-radio value="single">单个点名</el-radio>
                <el-radio value="multiple">多个点名</el-radio>
              </el-radio-group>
            </div>
            
            <div v-if="rollCallMode === 'multiple'" class="option-group">
              <label>点名数量:</label>
              <el-input-number 
                v-model="rollCallCount" 
                :min="1" 
                :max="studentList.length" 
                size="large"
              />
            </div>

            <div class="option-group">
              <label>动画效果:</label>
              <el-switch 
                v-model="enableAnimation" 
                active-text="开启" 
                inactive-text="关闭"
                size="large"
              />
            </div>

            <div class="option-group">
              <label>音效提示:</label>
              <el-switch 
                v-model="enableSound" 
                active-text="开启" 
                inactive-text="关闭"
                size="large"
              />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button 
              @click="startRollCall" 
              type="primary" 
              size="large"
              :disabled="studentList.length === 0"
              :loading="isRolling"
            >
              <el-icon><Refresh /></el-icon>
              {{ isRolling ? '点名中...' : '开始点名' }}
            </el-button>
            
            <el-button @click="clearAll" type="danger" size="large" plain>
              <el-icon><Delete /></el-icon>
              清空名单
            </el-button>
            
            <el-button @click="exportHistory" type="info" size="large" plain>
              <el-icon><Document /></el-icon>
              导出记录
            </el-button>
          </div>
        </el-card>
      </div>

      <!-- 点名结果区域 -->
      <div class="result-area">
        <el-card class="result-card" shadow="hover">
          <template #header>
            <span class="card-title">🎊 点名结果</span>
          </template>
          
          <div v-if="!selectedStudents.length" class="no-result">
            <el-icon class="no-result-icon"><User /></el-icon>
            <p>点击"开始点名"来随机选择学生</p>
          </div>

          <div v-else class="result-display">
            <div 
              v-for="(student, index) in selectedStudents" 
              :key="index"
              class="selected-student"
              :class="{ 'animate__animated animate__bounceIn': enableAnimation }"
            >
              <div class="student-avatar">
                {{ getStudentInitial(student.name) }}
              </div>
              <div class="student-info">
                <h3 class="student-name">{{ student.name }}</h3>
                <p class="selection-time">{{ formatTime(student.selectedAt) }}</p>
              </div>
              <div class="student-badge">
                <el-tag type="success" size="large">被点中</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 学生名单区域 -->
      <div class="student-list-area">
        <el-card class="list-card" shadow="hover">
          <template #header>
            <div class="list-header">
              <span class="card-title">👥 学生名单 ({{ studentList.length }}人)</span>
              <el-button @click="resetCallCount" type="warning" size="small" plain>
                <el-icon><RefreshLeft /></el-icon>
                重置计数
              </el-button>
            </div>
          </template>
          
          <div v-if="!studentList.length" class="empty-list">
            <el-icon class="empty-icon"><UserFilled /></el-icon>
            <p>暂无学生名单，请先添加学生</p>
          </div>

          <div v-else class="student-grid">
            <div 
              v-for="(student, index) in studentList" 
              :key="index"
              class="student-item"
              :class="{ 'recently-called': isRecentlyCalled(student) }"
            >
              <div class="student-avatar-small">
                {{ getStudentInitial(student.name) }}
              </div>
              <div class="student-details">
                <span class="student-name-small">{{ student.name }}</span>
                <span class="call-count">被点{{ student.callCount }}次</span>
              </div>
              <el-button 
                @click="removeStudent(index)" 
                type="danger" 
                size="small" 
                circle
                plain
              >
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 统计信息 -->
      <div class="statistics-area">
        <el-card class="stats-card" shadow="hover">
          <template #header>
            <span class="card-title">📊 统计信息</span>
          </template>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ studentList.length }}</div>
              <div class="stat-label">总人数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ totalCalls }}</div>
              <div class="stat-label">总点名次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getMostCalledStudent()?.name || '-' }}</div>
              <div class="stat-label">最多被点</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getLeastCalledStudent()?.name || '-' }}</div>
              <div class="stat-label">最少被点</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Bell,
  Plus,
  Upload,
  Download,
  Refresh,
  Delete,
  Document,
  User,
  UserFilled,
  Close,
  RefreshLeft
} from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

// 数据接口定义
interface Student {
  name: string
  callCount: number
  lastCalledAt?: number
}

interface SelectedStudent {
  name: string
  selectedAt: number
}

// 响应式数据
const newStudentName = ref('')
const studentList = ref<Student[]>([])
const selectedStudents = ref<SelectedStudent[]>([])
const rollCallMode = ref<'single' | 'multiple'>('single')
const rollCallCount = ref(1)
const enableAnimation = ref(true)
const enableSound = ref(true)
const isRolling = ref(false)
const particlesRef = ref<HTMLElement>()

// 计算属性
const totalCalls = computed(() => studentList.value.reduce((sum, student) => sum + student.callCount, 0))

// 添加学生
const addStudent = () => {
  const name = newStudentName.value.trim()
  if (!name) {
    ElMessage.warning('请输入学生姓名')
    return
  }
  
  if (studentList.value.some(student => student.name === name)) {
    ElMessage.warning('该学生已存在')
    return
  }
  
  studentList.value.push({
    name,
    callCount: 0
  })
  
  newStudentName.value = ''
  ElMessage.success(`已添加学生: ${name}`)
}

// 移除学生
const removeStudent = (index: number) => {
  const student = studentList.value[index]
  studentList.value.splice(index, 1)
  ElMessage.info(`已移除学生: ${student.name}`)
}

// 开始点名
const startRollCall = async () => {
  if (studentList.value.length === 0) {
    ElMessage.warning('请先添加学生')
    return
  }
  
  isRolling.value = true
  selectedStudents.value = []
  
  // 播放音效
  if (enableSound.value) {
    playSound()
  }
  
  // 模拟点名动画
  if (enableAnimation.value) {
    await animateRollCall()
  }
  
  // 选择学生
  const count = rollCallMode.value === 'single' ? 1 : Math.min(rollCallCount.value, studentList.value.length)
  const shuffled = [...studentList.value].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, count)
  
  // 更新选中结果和统计
  const now = Date.now()
  selectedStudents.value = selected.map(student => ({
    name: student.name,
    selectedAt: now
  }))
  
  // 更新被点次数
  selected.forEach(student => {
    const studentRef = studentList.value.find(s => s.name === student.name)
    if (studentRef) {
      studentRef.callCount++
      studentRef.lastCalledAt = now
    }
  })
  
  isRolling.value = false
  
  const names = selected.map(s => s.name).join('、')
  ElMessage.success(`点名结果: ${names}`)
}

// 点名动画
const animateRollCall = () => {
  return new Promise(resolve => {
    let count = 0
    const maxCount = 20
    const interval = setInterval(() => {
      count++
      if (count >= maxCount) {
        clearInterval(interval)
        resolve(true)
        return
      }
      
      // 随机选择一个学生名字进行展示
      const randomStudent = studentList.value[Math.floor(Math.random() * studentList.value.length)]
      selectedStudents.value = [{
        name: randomStudent.name,
        selectedAt: Date.now()
      }]
    }, 100)
  })
}

// 播放音效
const playSound = () => {
  try {
    const audio = new Audio()
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LKeSMFl...'
    audio.volume = 0.3
    audio.play().catch(() => {
      // 忽略音频播放错误
    })
  } catch (error) {
    // 忽略音频播放错误
  }
}

// 文件上传处理
const handleFileUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      let names: string[] = []
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(content, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][]
        names = data.reduce((acc, val) => acc.concat(val), []).filter(name => name && name.trim()).map(name => name.trim())
      } else {
        names = content.split(/[\n,]/).filter(name => name && name.trim()).map(name => name.trim())
      }
      
      // 去重并添加到学生列表
      const newStudents = names.filter(name => !studentList.value.some(s => s.name === name))
      newStudents.forEach(name => {
        studentList.value.push({
          name,
          callCount: 0
        })
      })
      
      if (newStudents.length > 0) {
        ElMessage.success(`成功导入 ${newStudents.length} 名学生`)
      } else {
        ElMessage.info('没有新的学生需要导入')
      }
    } catch (error) {
      ElMessage.error('文件解析失败，请检查文件格式')
    }
  }
  
  if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    reader.readAsBinaryString(file)
  } else {
    reader.readAsText(file, 'UTF-8')
  }
  
  return false
}

// 下载示例文件
const downloadSample = () => {
  const sampleData = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const content = sampleData.join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '学生名单示例.txt'
  a.click()
  URL.revokeObjectURL(url)
}

// 清空名单
const clearAll = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有学生名单吗？此操作无法撤销。',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    studentList.value = []
    selectedStudents.value = []
    ElMessage.success('已清空所有名单')
  } catch (error) {
    // 用户取消
  }
}

// 重置点名计数
const resetCallCount = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置所有学生的点名计数吗？',
      '确认重置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    studentList.value.forEach(student => {
      student.callCount = 0
      student.lastCalledAt = undefined
    })
    
    ElMessage.success('已重置所有点名计数')
  } catch (error) {
    // 用户取消
  }
}

// 导出点名记录
const exportHistory = () => {
  if (studentList.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  
  const data = [
    ['姓名', '被点次数', '最后点名时间'],
    ...studentList.value.map(student => [
      student.name,
      student.callCount,
      student.lastCalledAt ? new Date(student.lastCalledAt).toLocaleString() : '未点名'
    ])
  ]
  
  const worksheet = XLSX.utils.aoa_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '点名记录')
  XLSX.writeFile(workbook, `点名记录_${new Date().toLocaleDateString()}.xlsx`)
  
  ElMessage.success('点名记录导出成功')
}

// 工具函数
const getStudentInitial = (name: string) => {
  return name.charAt(0).toUpperCase()
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

const isRecentlyCalled = (student: Student) => {
  if (!student.lastCalledAt) return false
  return Date.now() - student.lastCalledAt < 10000 // 10秒内被点过
}

const getMostCalledStudent = () => {
  if (studentList.value.length === 0) return null
  return studentList.value.reduce((max, student) => 
    student.callCount > max.callCount ? student : max
  )
}

const getLeastCalledStudent = () => {
  if (studentList.value.length === 0) return null
  return studentList.value.reduce((min, student) => 
    student.callCount < min.callCount ? student : min
  )
}

// 创建粒子动画
const createParticles = () => {
  if (!particlesRef.value) return
  
  const container = particlesRef.value
  const particleCount = 50
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'
    
    const size = Math.random() * 4 + 2
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 6}s`
    particle.style.animationDuration = `${Math.random() * 3 + 3}s`
    
    container.appendChild(particle)
  }
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    createParticles()
  })
})
</script>

<style scoped>
.roll-call-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
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
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-header {
  text-align: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.tool-title {
  font-size: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 36px;
  color: #667eea;
}

.tool-description {
  color: #666;
  font-size: 16px;
}

.card-title {
  font-weight: bold;
  font-size: 16px;
}

/* 控制面板 */
.control-panel {
  display: flex;
  justify-content: center;
}

.settings-card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.name-management {
  margin-bottom: 25px;
}

.input-section {
  margin-bottom: 15px;
}

.upload-section {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.roll-call-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-group label {
  font-weight: bold;
  color: #2c3e50;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 结果区域 */
.result-area {
  display: flex;
  justify-content: center;
}

.result-card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.no-result {
  text-align: center;
  padding: 40px;
  color: #999;
}

.no-result-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #ddd;
}

.result-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.selected-student {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 24px;
  margin-bottom: 5px;
}

.selection-time {
  opacity: 0.8;
  font-size: 14px;
}

.student-badge {
  font-size: 16px;
}

/* 学生名单区域 */
.student-list-area {
  display: flex;
  justify-content: center;
}

.list-card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-list {
  text-align: center;
  padding: 40px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #ddd;
}

.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.student-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.student-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.student-item.recently-called {
  border-color: #67c23a;
  background: #f0f9ff;
}

.student-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.student-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.student-name-small {
  font-weight: bold;
  color: #2c3e50;
}

.call-count {
  font-size: 12px;
  color: #666;
}

/* 统计信息 */
.statistics-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.stats-card {
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* 动画效果 */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate__animated.animate__bounceIn {
  animation: bounceIn 0.75s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .tool-title {
    font-size: 24px;
  }
  
  .upload-section {
    flex-direction: column;
  }
  
  .roll-call-options {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .student-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .selected-student {
    flex-direction: column;
    text-align: center;
  }
}
</style>
