<template>
  <div class="classroom-seating-container">
    <!-- 工具标题 -->
    <div class="tool-header">
      <h1 class="tool-title">
        <el-icon class="title-icon"><School /></el-icon>
        班级座次表管理系统
      </h1>
      <p class="tool-description">智能排座，优化班级管理效率</p>
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <!-- 文件上传区域 -->
      <el-card class="upload-section" shadow="hover">
        <template #header>
          <span class="card-title">📋 数据导入</span>
        </template>
        <div class="upload-groups">
          <div class="upload-group">
            <el-button @click="downloadNameSample" type="info" plain>
              <el-icon><Download /></el-icon>
              下载班级名单示例
            </el-button>
            <el-upload
              :before-upload="handleNameListUpload"
              :show-file-list="false"
              accept=".txt,.csv,.xlsx"
              action=""
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                上传班级名单
              </el-button>
            </el-upload>
          </div>
          <div class="upload-group">
            <el-button @click="downloadGradeSample" type="info" plain>
              <el-icon><Download /></el-icon>
              下载成绩名次示例
            </el-button>
            <el-upload
              :before-upload="handleGradeListUpload"
              :show-file-list="false"
              accept=".txt,.csv,.xlsx"
              action=""
            >
              <el-button type="success">
                <el-icon><Upload /></el-icon>
                上传成绩名次
              </el-button>
            </el-upload>
          </div>
        </div>
      </el-card>

      <!-- 设置区域 -->
      <el-card class="settings-section" shadow="hover">
        <template #header>
          <span class="card-title">⚙️ 布局设置</span>
        </template>
        <div class="settings-grid">
          <div class="setting-item">
            <label>行数:</label>
            <el-input-number v-model="rows" :min="1" :max="10" size="large" />
          </div>
          <div class="setting-item">
            <label>列数:</label>
            <el-input-number v-model="cols" :min="1" :max="12" size="large" />
          </div>
          <div class="setting-item">
            <el-button @click="updateGrid" type="warning" size="large">
              <el-icon><Refresh /></el-icon>
              更新布局
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 排座方式 -->
      <el-card class="arrangement-section" shadow="hover">
        <template #header>
          <span class="card-title">🎯 排座方式</span>
        </template>
        <div class="arrangement-buttons">
          <el-button @click="randomArrange" type="primary" size="large">
            <el-icon><Refresh /></el-icon>
            随机排座
          </el-button>
          <el-button @click="gradeArrange" type="success" size="large">
            <el-icon><Trophy /></el-icon>
            成绩分区
          </el-button>
          <el-button @click="balanceArrange" type="info" size="large">
            <el-icon><Refresh /></el-icon>
            优差搭配
          </el-button>
        </div>
      </el-card>

      <!-- 显示选项 -->
      <el-card class="display-options" shadow="hover">
        <template #header>
          <span class="card-title">👁️ 显示选项</span>
        </template>
        <div class="option-checks">
          <el-checkbox v-model="showColor" size="large">展示颜色</el-checkbox>
          <el-checkbox v-model="showRank" size="large">展示名次</el-checkbox>
        </div>
      </el-card>

      <!-- 导出功能 -->
      <el-card class="export-section" shadow="hover">
        <template #header>
          <span class="card-title">📤 导出功能</span>
        </template>
        <el-button @click="exportSeating" type="danger" size="large">
          <el-icon><Document /></el-icon>
          导出座位图
        </el-button>
      </el-card>
    </div>

    <!-- 提示信息 -->
    <el-alert
      v-if="infoMessage"
      :title="infoMessage"
      type="info"
      :closable="false"
      class="info-alert"
    />

    <!-- 座位表网格 -->
    <div class="classroom-container">
      <div class="classroom-header">
        <h3>🏫 教室座位布局</h3>
        <div class="blackboard">黑板</div>
      </div>
      <div 
        class="classroom-grid" 
        :style="{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }"
      >
        <div
          v-for="(seat, index) in seats"
          :key="index"
          class="seat-cell"
          :class="{ 'has-student': seat.student }"
          @drop="handleDrop($event, index)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-if="seat.student"
            class="student-card"
            :class="getStudentCardClass(seat.student)"
            draggable="true"
            @dragstart="handleDragStart($event, seat.student, index)"
          >
            <div class="student-name">{{ seat.student.name }}</div>
            <div v-if="showRank && seat.student.rank" class="student-rank">
              第{{ seat.student.rank }}名
            </div>
          </div>
          <div v-else class="empty-seat">
            空座位
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  School,
  Download,
  Upload,
  Refresh,
  Trophy,
  Document
} from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

// 数据接口定义
interface Student {
  name: string
  rank?: number
  grade?: number
}

interface Seat {
  student: Student | null
}

// 响应式数据
const students = ref<Student[]>([])
const grades = ref<any[]>([])
const rows = ref(6)
const cols = ref(8)
const showRank = ref(true)
const showColor = ref(true)
const seats = ref<Seat[]>([])
const infoMessage = ref('请先上传班级名单和成绩信息，设置教室布局后开始排座。')

// 计算属性
const totalSeats = computed(() => rows.value * cols.value)

// 初始化座位
const initializeSeats = () => {
  seats.value = Array.from({ length: totalSeats.value }, () => ({ student: null }))
}

// 更新网格
const updateGrid = () => {
  initializeSeats()
  if (students.value.length > 0) {
    randomArrange()
  }
  ElMessage.success('布局已更新')
}

// 处理名单上传
const handleNameListUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(content, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][]
        students.value = data.reduce((acc, val) => acc.concat(val), []).filter(name => name && name.trim()).map(name => ({ name: name.trim() }))
      } else {
        // 处理txt/csv文件
        const names = content.split(/[\n,]/).filter(name => name && name.trim()).map(name => name.trim())
        students.value = names.map(name => ({ name }))
      }
      
      if (students.value.length > 0) {
        infoMessage.value = `已导入 ${students.value.length} 名学生，可以开始排座了！`
        ElMessage.success(`成功导入 ${students.value.length} 名学生`)
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
  
  return false // 阻止默认上传行为
}

// 处理成绩上传
const handleGradeListUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      let gradeData: any[] = []
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(content, { type: 'binary' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        gradeData = XLSX.utils.sheet_to_json(firstSheet) as any[]
      } else {
        // 处理txt/csv文件
        const lines = content.split('\n').filter(line => line.trim())
        gradeData = lines.map((line, index) => {
          const parts = line.split(/[,\t]/)
          return {
            name: parts[0]?.trim(),
            rank: parseInt(parts[1]) || index + 1,
            grade: parseFloat(parts[2]) || 0
          }
        })
      }
      
      // 合并成绩数据到学生信息
      gradeData.forEach(gradeItem => {
        const student = students.value.find(s => s.name === gradeItem.name)
        if (student) {
          student.rank = gradeItem.rank
          student.grade = gradeItem.grade
        }
      })
      
      grades.value = gradeData
      ElMessage.success(`成功导入 ${gradeData.length} 条成绩数据`)
    } catch (error) {
      ElMessage.error('成绩文件解析失败，请检查文件格式')
    }
  }
  
  if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
    reader.readAsBinaryString(file)
  } else {
    reader.readAsText(file, 'UTF-8')
  }
  
  return false
}

// 随机排座
const randomArrange = () => {
  if (students.value.length === 0) {
    ElMessage.warning('请先上传班级名单')
    return
  }
  
  initializeSeats()
  const shuffledStudents = [...students.value].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < Math.min(shuffledStudents.length, totalSeats.value); i++) {
    seats.value[i].student = shuffledStudents[i]
  }
  
  ElMessage.success('随机排座完成')
}

// 成绩分区排座
const gradeArrange = () => {
  if (students.value.length === 0) {
    ElMessage.warning('请先上传班级名单')
    return
  }
  
  initializeSeats()
  const sortedStudents = [...students.value].sort((a, b) => (a.rank || 999) - (b.rank || 999))
  
  // 按成绩分区域排座，前排放优秀学生
  for (let i = 0; i < Math.min(sortedStudents.length, totalSeats.value); i++) {
    seats.value[i].student = sortedStudents[i]
  }
  
  ElMessage.success('成绩分区排座完成')
}

// 优差搭配排座
const balanceArrange = () => {
  if (students.value.length === 0) {
    ElMessage.warning('请先上传班级名单')
    return
  }
  
  initializeSeats()
  const sortedStudents = [...students.value].sort((a, b) => (a.rank || 999) - (b.rank || 999))
  const half = Math.floor(sortedStudents.length / 2)
  const goodStudents = sortedStudents.slice(0, half)
  const averageStudents = sortedStudents.slice(half)
  
  // 优差搭配
  const arrangedStudents: Student[] = []
  for (let i = 0; i < Math.max(goodStudents.length, averageStudents.length); i++) {
    if (goodStudents[i]) arrangedStudents.push(goodStudents[i])
    if (averageStudents[i]) arrangedStudents.push(averageStudents[i])
  }
  
  for (let i = 0; i < Math.min(arrangedStudents.length, totalSeats.value); i++) {
    seats.value[i].student = arrangedStudents[i]
  }
  
  ElMessage.success('优差搭配排座完成')
}

// 获取学生卡片样式
const getStudentCardClass = (student: Student) => {
  if (!showColor.value || !student.rank) return ''
  
  if (student.rank <= 10) return 'excellent'
  if (student.rank <= 20) return 'good'
  if (student.rank <= 30) return 'average'
  return 'needs-improvement'
}

// 拖拽相关
const handleDragStart = (event: DragEvent, student: Student, seatIndex: number) => {
  event.dataTransfer?.setData('text/plain', JSON.stringify({ student, seatIndex }))
}

const handleDrop = (event: DragEvent, targetIndex: number) => {
  event.preventDefault()
  const data = event.dataTransfer?.getData('text/plain')
  if (!data) return
  
  const { student, seatIndex } = JSON.parse(data)
  
  // 交换座位
  const targetStudent = seats.value[targetIndex].student
  seats.value[seatIndex].student = targetStudent
  seats.value[targetIndex].student = student
  
  ElMessage.success('座位调整完成')
}

// 导出功能
const exportSeating = () => {
  if (seats.value.every(seat => !seat.student)) {
    ElMessage.warning('请先排座后再导出')
    return
  }
  
  // 创建座位数据
  const seatingData = []
  for (let row = 0; row < rows.value; row++) {
    const rowData = []
    for (let col = 0; col < cols.value; col++) {
      const index = row * cols.value + col
      const seat = seats.value[index]
      rowData.push(seat.student ? `${seat.student.name}(${seat.student.rank || '无'})` : '空座位')
    }
    seatingData.push(rowData)
  }
  
  // 导出为Excel
  const worksheet = XLSX.utils.aoa_to_sheet(seatingData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '座位表')
  XLSX.writeFile(workbook, `班级座位表_${new Date().toLocaleDateString()}.xlsx`)
  
  ElMessage.success('座位表导出成功')
}

// 下载示例文件
const downloadNameSample = () => {
  const sampleData = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const content = sampleData.join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '班级名单示例.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const downloadGradeSample = () => {
  const sampleData = [
    ['姓名', '名次', '成绩'],
    ['张三', '1', '95'],
    ['李四', '2', '92'],
    ['王五', '3', '89'],
    ['赵六', '4', '86']
  ]
  const worksheet = XLSX.utils.aoa_to_sheet(sampleData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '成绩示例')
  XLSX.writeFile(workbook, '成绩名次示例.xlsx')
}

// 初始化
onMounted(() => {
  initializeSeats()
})
</script>

<style scoped>
.classroom-seating-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.tool-title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.title-icon {
  font-size: 32px;
  color: #3498db;
}

.tool-description {
  color: #7f8c8d;
  font-size: 16px;
}

.control-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card-title {
  font-weight: bold;
  font-size: 16px;
}

.upload-groups {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.upload-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  align-items: end;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-weight: bold;
  color: #2c3e50;
}

.arrangement-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.option-checks {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.info-alert {
  margin-bottom: 20px;
}

.classroom-container {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.classroom-header {
  text-align: center;
  margin-bottom: 20px;
}

.classroom-header h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.blackboard {
  background: #2c3e50;
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 20px;
}

.classroom-grid {
  display: grid;
  gap: 10px;
  max-width: 100%;
}

.seat-cell {
  aspect-ratio: 1;
  border: 2px dashed #bdc3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  transition: all 0.3s ease;
}

.seat-cell.has-student {
  border-style: solid;
  border-color: #3498db;
}

.student-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #74b9ff, #0984e3);
  color: white;
  border-radius: 6px;
  cursor: move;
  transition: all 0.3s ease;
  padding: 8px;
  text-align: center;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.student-card.excellent {
  background: linear-gradient(135deg, #00b894, #00a085);
}

.student-card.good {
  background: linear-gradient(135deg, #0984e3, #74b9ff);
}

.student-card.average {
  background: linear-gradient(135deg, #fdcb6e, #e17055);
}

.student-card.needs-improvement {
  background: linear-gradient(135deg, #fd79a8, #e84393);
}

.student-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
}

.student-rank {
  font-size: 12px;
  opacity: 0.9;
}

.empty-seat {
  color: #bdc3c7;
  font-size: 12px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel {
    grid-template-columns: 1fr;
  }
  
  .upload-group {
    flex-direction: column;
  }
  
  .arrangement-buttons {
    flex-direction: column;
  }
  
  .classroom-grid {
    gap: 5px;
  }
  
  .seat-cell {
    min-height: 60px;
  }
  
  .student-name {
    font-size: 12px;
  }
  
  .student-rank {
    font-size: 10px;
  }
}
</style>
