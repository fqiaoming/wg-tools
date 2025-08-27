<template>
  <div class="classroom-seating">
    <!-- 开发者信息 -->
    <header class="developer-info">
      <h1>{{ t('menu.classroomSeatingChart') }}</h1>
      <div class="developer-tag">开发者：WG科技</div>
    </header>

    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="upload-section">
          <div class="upload-group">
          <el-button @click="downloadNameSample" size="small" type="primary">
              下载班级名单示例
            </el-button>
            <el-upload
            ref="nameListUpload"
            :auto-upload="false"
              :show-file-list="false"
              accept=".txt,.csv,.xlsx"
            :on-change="handleNameListUpload"
              action=""
            >
            <el-button size="small" type="info">
                上传班级名单
              </el-button>
            </el-upload>
          </div>
          <div class="upload-group">
          <el-button @click="downloadGradeSample" size="small" type="primary">
              下载成绩名次示例
            </el-button>
            <el-upload
            ref="gradeListUpload"
            :auto-upload="false"
              :show-file-list="false"
              accept=".txt,.csv,.xlsx"
            :on-change="handleGradeListUpload"
              action=""
            >
            <el-button size="small" type="info">
                上传成绩名次
              </el-button>
            </el-upload>
          </div>
        </div>

      <div class="settings-section">
        <div class="setting-group">
            <label>行数:</label>
          <el-input-number v-model="rows" :min="1" :max="10" size="small" />
          </div>
        <div class="setting-group">
            <label>列数:</label>
          <el-input-number v-model="cols" :min="1" :max="12" size="small" />
          </div>
        <div class="setting-group">
          <el-button @click="updateGrid" size="small" type="success">
              更新布局
            </el-button>
          </div>
        </div>

      <div class="arrangement-section">
        <label>排座方式:</label>
        <div class="arrangement-buttons">
          <el-button 
            @click="arrangeSeats('random')" 
            size="small" 
            :type="currentArrangement === 'random' ? 'primary' : 'default'"
          >
            随机排座
          </el-button>
          <el-button 
            @click="arrangeSeats('grade')" 
            size="small" 
            :type="currentArrangement === 'grade' ? 'primary' : 'default'"
          >
            成绩分区
          </el-button>
          <el-button 
            @click="arrangeSeats('balance')" 
            size="small" 
            :type="currentArrangement === 'balance' ? 'primary' : 'default'"
          >
            优差搭配
          </el-button>
        </div>
      </div>

      <div class="display-options">
        <el-checkbox v-model="showColor" @change="toggleColorDisplay">
          展示颜色
        </el-checkbox>
        <el-checkbox v-model="showRank" @change="toggleRankDisplay">
          展示名次
        </el-checkbox>
        </div>

      <div class="export-section">
        <el-button @click="exportSeatingChart" size="small" type="danger">
          导出座位图
        </el-button>
      </div>
    </div>

    <!-- 提示信息 -->
    <el-alert
      :title="infoMessage"
      type="info"
      :closable="false"
      style="margin-bottom: 20px;"
    />

    <!-- 座位表网格 -->
    <div class="classroom-container">
      <div 
        class="classroom-grid" 
        :style="gridStyle"
        @dragover="handleDragOver"
        @drop="handleDrop"
      >
        <div
          v-for="(seat, index) in seats"
          :key="index"
          :class="getSeatClass(seat)"
          :draggable="seat.student ? true : false"
          :data-position="index"
          :data-student-id="seat.student?.id"
          @dragstart="handleDragStart($event, seat, index)"
          @dragend="handleDragEnd"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop"
        >
          <template v-if="seat.student">
            <div class="student-name">{{ seat.student.name }}</div>
            <div 
              v-if="showRank && seat.student.rank" 
              class="student-rank"
            >
              名次: {{ seat.student.rank }}
            </div>
          </template>
          <template v-else>
            空座位
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 响应式数据
const students = ref<Student[]>([])
const grades = ref<Grade[]>([])
const rows = ref(6)
const cols = ref(8)
const showRank = ref(true)
const showColor = ref(true)
const currentArrangement = ref('random')
const infoMessage = ref('请先上传班级名单和成绩信息，设置教室布局后开始排座。')
const seats = ref<Seat[]>([])
const draggedSeat = ref<{ seat: Seat; index: number } | null>(null)

// 类型定义
interface Student {
  id: number
  name: string
  rank?: number
}

interface Grade {
  name: string
  rank: number
}

interface Seat {
  student?: Student
  zone?: 'front' | 'middle' | 'back'
}

// 计算属性
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
  gridTemplateRows: `repeat(${rows.value}, 1fr)`
}))

// 文件处理方法
const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file, 'UTF-8')
  })
}

const parseStudentList = (content: string, fileName: string): Student[] => {
  const lines = content.trim().split('\n')
  const students: Student[] = []
  
  if (fileName.endsWith('.csv')) {
    lines.forEach((line, index) => {
      const parts = line.split(',')
      if (parts.length > 0 && parts[0].trim()) {
        students.push({
          id: index + 1,
          name: parts[0].trim(),
          rank: undefined
        })
      }
    })
  } else {
    lines.forEach((line, index) => {
      const name = line.trim()
      if (name) {
        students.push({
          id: index + 1,
          name: name,
          rank: undefined
        })
      }
    })
  }
  
  return students
}

const parseGradeList = (content: string, fileName: string): Grade[] => {
  const lines = content.trim().split('\n')
  const grades: Grade[] = []
  
  lines.forEach(line => {
    if (fileName.endsWith('.csv')) {
      const parts = line.split(',')
      if (parts.length >= 2) {
        grades.push({
          name: parts[0].trim(),
          rank: parseInt(parts[1].trim()) || 0
        })
      }
      } else {
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 2) {
        grades.push({
          name: parts[0],
          rank: parseInt(parts[1]) || 0
        })
      }
    }
  })
  
  return grades
}

// 文件上传处理
const handleNameListUpload = async (file: any) => {
  try {
    const content = await readFile(file.raw)
    students.value = parseStudentList(content, file.name)
    updateInfoMessage(`已上传 ${students.value.length} 名学生信息`)
    
    if (grades.value.length === 0) {
      arrangeSeats('random')
    } else {
      checkReadyState()
      }
    } catch (error) {
    ElMessage.error('名单文件读取失败：' + (error as Error).message)
  }
}

const handleGradeListUpload = async (file: any) => {
  try {
    const content = await readFile(file.raw)
    grades.value = parseGradeList(content, file.name)
    updateInfoMessage(`已上传 ${grades.value.length} 名学生成绩信息`)
    
    if (students.value.length === 0) {
      students.value = grades.value.map((grade, index) => ({
        id: index + 1,
        name: grade.name,
        rank: grade.rank
      }))
      arrangeSeats('balance')
  } else {
      mergeStudentData()
      arrangeSeats('balance')
    }
  } catch (error) {
    ElMessage.error('成绩文件读取失败：' + (error as Error).message)
  }
}

const checkReadyState = () => {
  if (students.value.length > 0 && grades.value.length > 0) {
    mergeStudentData()
    updateInfoMessage(`数据准备完成，共 ${students.value.length} 名学生，点击排座方式开始排座`)
  }
}

const mergeStudentData = () => {
  students.value.forEach(student => {
    const gradeData = grades.value.find(grade => grade.name === student.name)
    if (gradeData) {
      student.rank = gradeData.rank
    }
  })
  
  students.value.sort((a, b) => (a.rank || 999) - (b.rank || 999))
}

// 网格管理
const createGrid = () => {
  const totalSeats = rows.value * cols.value
  seats.value = Array.from({ length: totalSeats }, () => ({}))
}

const updateGrid = () => {
  createGrid()
  if (students.value.length > 0) {
    arrangeSeats(currentArrangement.value)
  }
}

// 排座算法
const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

const randomArrangement = (): (number | null)[] => {
  const totalSeats = rows.value * cols.value
  const positions = new Array(totalSeats).fill(null)
  const studentCount = Math.min(students.value.length, totalSeats)
  
  const availablePositions = Array.from({length: studentCount}, (_, i) => i)
  
  students.value.slice(0, studentCount).forEach((_, index) => {
    const randomIndex = Math.floor(Math.random() * availablePositions.length)
    const position = availablePositions.splice(randomIndex, 1)[0]
    positions[position] = index
  })
  
  return positions
}

const assignStudentsToSeats = (positions: (number | null)[], studentsToAssign: Student[], seatPositions: number[]) => {
  const shuffledSeats = [...seatPositions]
  shuffleArray(shuffledSeats)
  
  studentsToAssign.forEach((student, index) => {
    if (index < shuffledSeats.length) {
      const position = shuffledSeats[index]
      // 在全局学生数组中查找该学生的索引
      const studentIndex = students.value.findIndex(s => s.id === student.id)
      if (studentIndex !== -1) {
        positions[position] = studentIndex
      }
    }
  })
}

const gradeZoneArrangement = (): (number | null)[] => {
  const positions = new Array(rows.value * cols.value).fill(null)
  const studentsWithRank = students.value.filter(s => s.rank).sort((a, b) => a.rank! - b.rank!)
  
  if (studentsWithRank.length === 0) {
    return randomArrangement()
  }
  
  const totalSeats = rows.value * cols.value
  const studentCount = Math.min(students.value.length, totalSeats)
  
  // 按名次分组学生：前30%名次为优等生，中50%名次为中等生，后20%名次为差等生
  const excellentStudentCount = Math.floor(studentsWithRank.length * 0.3)
  const middleStudentCount = Math.floor(studentsWithRank.length * 0.5)
  
  const excellentStudents = studentsWithRank.slice(0, excellentStudentCount)
  const middleStudents = studentsWithRank.slice(excellentStudentCount, excellentStudentCount + middleStudentCount)
  const poorStudents = studentsWithRank.slice(excellentStudentCount + middleStudentCount)
  
  // 按座位位置分区：前30%座位给优等生，中50%座位给中等生，后20%座位给差等生
  const excellentSeatCount = Math.floor(studentCount * 0.3)
  const middleSeatCount = Math.floor(studentCount * 0.5)
  
  const allSeatPositions = Array.from({length: studentCount}, (_, i) => i)
  const excellentSeatPositions = allSeatPositions.slice(0, excellentSeatCount)
  const middleSeatPositions = allSeatPositions.slice(excellentSeatCount, excellentSeatCount + middleSeatCount)
  const poorSeatPositions = allSeatPositions.slice(excellentSeatCount + middleSeatCount)
  
  assignStudentsToSeats(positions, excellentStudents, excellentSeatPositions)
  assignStudentsToSeats(positions, middleStudents, middleSeatPositions)
  assignStudentsToSeats(positions, poorStudents, poorSeatPositions)
  
  return positions
}

const balanceArrangement = (): (number | null)[] => {
  const positions = new Array(rows.value * cols.value).fill(null)
  const studentsWithRank = students.value.filter(s => s.rank)
  
  if (studentsWithRank.length === 0) {
    return randomArrangement()
  }
  
  const totalSeats = rows.value * cols.value
  const studentCount = Math.min(students.value.length, totalSeats)
  
  const halfPoint = Math.floor(studentsWithRank.length / 2)
  const excellentStudents = [...studentsWithRank.slice(0, halfPoint)]
  const poorStudents = [...studentsWithRank.slice(halfPoint)]
  
  shuffleArray(excellentStudents)
  shuffleArray(poorStudents)
  
  let positionIndex = 0
  let excellentIndex = 0
  let poorIndex = 0
  
  while (positionIndex < studentCount && (excellentIndex < excellentStudents.length || poorIndex < poorStudents.length)) {
    if (excellentIndex < excellentStudents.length && positionIndex < studentCount) {
      const student = excellentStudents[excellentIndex]
      const studentIndex = students.value.findIndex(s => s.id === student.id)
      positions[positionIndex++] = studentIndex
      excellentIndex++
    }
    
    if (poorIndex < poorStudents.length && positionIndex < studentCount) {
      const student = poorStudents[poorIndex]
      const studentIndex = students.value.findIndex(s => s.id === student.id)
      positions[positionIndex++] = studentIndex
      poorIndex++
    }
  }
  
  return positions
}

const arrangeSeats = (method: string) => {
  currentArrangement.value = method
  
  if (students.value.length === 0) {
    ElMessage.error('请先上传学生名单和成绩信息')
    return
  }
  
  createGrid()
  
  let positions: (number | null)[] = []
  
  switch (method) {
    case 'random':
      positions = randomArrangement()
      break
    case 'grade':
      positions = gradeZoneArrangement()
      break
    case 'balance':
      positions = balanceArrangement()
      break
  }
  
  positions.forEach((studentIndex, position) => {
    if (studentIndex !== null && studentIndex < students.value.length) {
      seats.value[position].student = students.value[studentIndex]
      if (method === 'grade' && showColor.value) {
        seats.value[position].zone = getStudentZone(students.value[studentIndex])
      }
    }
  })
  
  updateInfoMessage(`已使用${getMethodName(method)}完成排座`)
}

// 辅助方法
const getStudentZone = (student: Student): 'front' | 'middle' | 'back' => {
  if (!student.rank) return 'middle'
  
  const studentsWithRank = students.value.filter(s => s.rank).sort((a, b) => a.rank! - b.rank!)
  const totalWithRank = studentsWithRank.length
  
  const excellentThreshold = Math.floor(totalWithRank * 0.3)
  const middleThreshold = Math.floor(totalWithRank * 0.8)
  
  const studentRankIndex = studentsWithRank.findIndex(s => s.id === student.id)
  
  if (studentRankIndex < excellentThreshold) {
    return 'front'
  } else if (studentRankIndex < middleThreshold) {
    return 'middle'
  } else {
    return 'back'
  }
}

const getSeatClass = (seat: Seat): string => {
  const classes = ['seat']
  
  if (seat.student) {
    classes.push('student-card')
    if (showColor.value && seat.zone) {
      classes.push(`${seat.zone}-zone`)
    }
  } else {
    classes.push('empty-seat')
  }
  
  return classes.join(' ')
}

const getMethodName = (method: string): string => {
  const names: Record<string, string> = {
    'random': '随机排座',
    'grade': '成绩分区',
    'balance': '优差搭配'
  }
  return names[method] || '未知方式'
}

const updateInfoMessage = (message: string) => {
  infoMessage.value = message
}

// 显示控制
const toggleColorDisplay = () => {
  if (currentArrangement.value === 'grade') {
    seats.value.forEach(seat => {
      if (seat.student && showColor.value) {
        seat.zone = getStudentZone(seat.student)
      } else {
        seat.zone = undefined
      }
    })
  }
}

const toggleRankDisplay = () => {
  // 响应式更新，无需额外操作
}

// 拖拽功能
const handleDragStart = (event: DragEvent, seat: Seat, index: number) => {
  if (seat.student) {
    draggedSeat.value = { seat, index }
    event.dataTransfer!.effectAllowed = 'move'
    
    // 添加拖拽样式
    const target = event.target as HTMLElement
    target.classList.add('dragging')
  }
}

const handleDragEnd = () => {
  // 移除拖拽样式
  document.querySelectorAll('.dragging').forEach(el => {
    el.classList.remove('dragging')
  })
  document.querySelectorAll('.drop-target').forEach(el => {
    el.classList.remove('drop-target')
  })
  
  draggedSeat.value = null
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const target = getDropTarget(event.target as HTMLElement)
  if (target && target !== draggedSeat.value?.seat) {
    target.classList.add('drop-target')
  }
}

const handleDragLeave = (event: DragEvent) => {
  event.stopPropagation()
  const target = getDropTarget(event.target as HTMLElement)
  if (target) {
    // 只有当鼠标真正离开元素时才移除样式
    const rect = target.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      target.classList.remove('drop-target')
    }
  }
}

// 获取正确的拖拽目标
const getDropTarget = (element: HTMLElement): HTMLElement | null => {
  // 如果点击的是座位元素本身
  if (element.classList.contains('seat')) {
    return element
  }
  
  // 如果点击的是座位内的子元素（如姓名或名次），向上查找座位元素
  let parent = element.parentElement
  while (parent && !parent.classList.contains('classroom-grid')) {
    if (parent.classList.contains('seat')) {
      return parent
    }
    parent = parent.parentElement
  }
  
  return null
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  
  const target = getDropTarget(event.target as HTMLElement)
  if (!target || !draggedSeat.value) {
    return
  }
  
  const targetPosition = parseInt(target.dataset.position || '-1')
  
  if (targetPosition >= 0 && targetPosition < seats.value.length && targetPosition !== draggedSeat.value.index) {
    const sourceIndex = draggedSeat.value.index
    const targetSeat = seats.value[targetPosition]
    
    // 交换座位内容
    const tempStudent = seats.value[sourceIndex].student
    const tempZone = seats.value[sourceIndex].zone
    
    seats.value[sourceIndex].student = targetSeat.student
    seats.value[sourceIndex].zone = targetSeat.zone
    
    seats.value[targetPosition].student = tempStudent
    seats.value[targetPosition].zone = tempZone
  }
  
  // 清除所有拖拽样式
  document.querySelectorAll('.drop-target').forEach(el => {
    el.classList.remove('drop-target')
  })
}

// 导出功能
const exportSeatingChart = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  const cardWidth = 120
  const cardHeight = 80
  const gap = 10
  const padding = 30
  
  canvas.width = cols.value * cardWidth + (cols.value - 1) * gap + 2 * padding
  canvas.height = rows.value * cardHeight + (rows.value - 1) * gap + 2 * padding + 60
  
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#333333'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('班级座次表', canvas.width / 2, 40)
  
  ctx.font = '14px Arial'
  ctx.fillStyle = '#666666'
  ctx.fillText('开发者：WG科技', canvas.width / 2, canvas.height - 10)
  
  seats.value.forEach((seat, index) => {
    const row = Math.floor(index / cols.value)
    const col = index % cols.value
    const x = padding + col * (cardWidth + gap)
    const y = padding + 60 + row * (cardHeight + gap)
    
    if (seat.student) {
      if (seat.zone === 'front') {
        ctx.fillStyle = '#a7f3d0'
      } else if (seat.zone === 'middle') {
        ctx.fillStyle = '#fde68a'
      } else if (seat.zone === 'back') {
        ctx.fillStyle = '#fecaca'
      } else {
        ctx.fillStyle = '#ffeaa7'
      }
    } else {
      ctx.fillStyle = '#f7fafc'
    }
    
    ctx.fillRect(x, y, cardWidth, cardHeight)
    
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, cardWidth, cardHeight)
    
    ctx.fillStyle = '#2d3748'
    ctx.textAlign = 'center'
    
    if (seat.student) {
      ctx.font = 'bold 16px Arial'
      ctx.fillText(seat.student.name, x + cardWidth / 2, y + cardHeight / 2 - 5)
      
      if (showRank.value && seat.student.rank) {
        ctx.font = '12px Arial'
        ctx.fillStyle = '#4a5568'
        ctx.fillText(`名次: ${seat.student.rank}`, x + cardWidth / 2, y + cardHeight / 2 + 15)
      }
    } else {
      ctx.font = '12px Arial'
      ctx.fillStyle = '#a0aec0'
      ctx.fillText('空座位', x + cardWidth / 2, y + cardHeight / 2)
    }
  })
  
  const link = document.createElement('a')
  link.download = '班级座次表.png'
  link.href = canvas.toDataURL()
  link.click()
  
  updateInfoMessage('座位图已导出下载')
}

// 示例文件下载
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const downloadNameSample = () => {
  const sampleData = `陈雨桐
李沐轩
王诗源
张宇晴
朱博文
郑子昂
刘思琪
胡欣然
马嘉怡
许博轩
罗雨涵
邓紫萱
高筱雨
宋思源
周逸飞
林浩然
孙梓涵
何雨萱
吴志超
韩思雨
彭雅欣
冯嘉豪
董雨辰
蒋筱悦
薛思洁
陆嘉宇
顾雨桐
钱思远
沈雨晨
汪嘉欣`
  
  downloadFile(sampleData, '班级名单示例.txt', 'text/plain')
  updateInfoMessage('班级名单示例文件已下载')
}

const downloadGradeSample = () => {
  const sampleData = `陈雨桐 1
李沐轩 2
王诗源 3
张宇晴 4
朱博文 5
郑子昂 6
刘思琪 7
胡欣然 8
马嘉怡 9
许博轩 10
罗雨涵 11
邓紫萱 12
高筱雨 13
宋思源 14
周逸飞 15
林浩然 16
孙梓涵 17
何雨萱 18
吴志超 19
韩思雨 20
彭雅欣 21
冯嘉豪 22
董雨辰 23
蒋筱悦 24
薛思洁 25
陆嘉宇 26
顾雨桐 27
钱思远 28
沈雨晨 29
汪嘉欣 30`
  
  downloadFile(sampleData, '成绩名次示例.txt', 'text/plain')
  updateInfoMessage('成绩名次示例文件已下载')
}

// 初始化
createGrid()
</script>

<style scoped>
.classroom-seating {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

.developer-info {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.developer-info h1 {
  font-size: 2.5em;
  font-weight: 300;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.developer-tag {
  font-size: 1.1em;
  opacity: 0.9;
  font-weight: 300;
}

.control-panel {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 25px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: auto auto 1fr auto auto;
  gap: 15px;
  align-items: center;
}

.upload-section, .settings-section, .arrangement-section, .display-options, .export-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.upload-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-group label {
  font-weight: 500;
  color: #555;
  font-size: 12px;
  white-space: nowrap;
}

.arrangement-section {
  justify-self: center;
  flex: 1;
  justify-content: center;
}

.arrangement-buttons {
  display: flex;
  gap: 8px;
}

.arrangement-section label {
  font-weight: 500;
  color: #555;
  margin-right: 10px;
}

.display-options {
  justify-self: end;
}

.export-section {
  justify-self: end;
}

.classroom-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  min-height: 400px;
}

.classroom-grid {
  display: grid;
  gap: 15px;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.seat {
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 2px solid transparent;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
}

.student-card {
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  cursor: move;
}

.student-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.student-card.dragging {
  opacity: 0.7;
  transform: rotate(5deg) scale(1.05);
  z-index: 1000;
  box-shadow: 0 12px 24px rgba(0,0,0,0.3);
  border: 2px solid #667eea;
}

.empty-seat {
  background: #f7fafc;
  border: 2px dashed #cbd5e0;
  color: #a0aec0;
  font-size: 14px;
}

.drop-target {
  border-color: #667eea !important;
  background: rgba(102, 126, 234, 0.2) !important;
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
}

.front-zone {
  background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%) !important;
}

.middle-zone {
  background: linear-gradient(135deg, #fde68a 0%, #fbbf24 100%) !important;
}

.back-zone {
  background: linear-gradient(135deg, #fecaca 0%, #f87171 100%) !important;
}

.student-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 5px;
}

.student-rank {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
}

@media (max-width: 768px) {
  .control-panel {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 12px;
  }
  
  .upload-section, .settings-section, .arrangement-section, .display-options, .export-section {
    justify-self: center;
  }
  
  .classroom-container {
    padding: 15px;
  }
  
  .classroom-grid {
    gap: 10px;
  }
  
  .seat {
    padding: 10px;
    min-height: 60px;
  }
  
  .student-name {
    font-size: 14px;
  }
  
  .student-rank {
    font-size: 12px;
  }
}
</style>
