// 班级座次表管理系统
class SeatingChart {
    constructor() {
        this.students = [];
        this.grades = [];
        this.rows = 6;
        this.cols = 8;
        this.showRank = true;
        this.showColor = true;
        this.currentArrangement = 'random';
        this.draggedElement = null;
        this.dropIndicator = null;
        
        this.initializeElements();
        this.bindEvents();
        this.createGrid();
    }
    
    initializeElements() {
        this.nameListInput = document.getElementById('nameList');
        this.gradeListInput = document.getElementById('gradeList');
        this.downloadNameSampleBtn = document.getElementById('downloadNameSample');
        this.downloadGradeSampleBtn = document.getElementById('downloadGradeSample');
        this.rowsInput = document.getElementById('rows');
        this.colsInput = document.getElementById('cols');
        this.updateGridBtn = document.getElementById('updateGrid');
        this.randomArrangeBtn = document.getElementById('randomArrange');
        this.gradeArrangeBtn = document.getElementById('gradeArrange');
        this.balanceArrangeBtn = document.getElementById('balanceArrange');
        this.showColorCheckbox = document.getElementById('showColor');
        this.showRankCheckbox = document.getElementById('showRank');
        this.exportBtn = document.getElementById('exportBtn');
        this.classroomGrid = document.getElementById('classroomGrid');
        this.infoMessage = document.getElementById('infoMessage');
    }
    
    bindEvents() {
        // 文件上传事件
        this.nameListInput.addEventListener('change', (e) => this.handleNameListUpload(e));
        this.gradeListInput.addEventListener('change', (e) => this.handleGradeListUpload(e));
        
        // 下载示例文件事件
        this.downloadNameSampleBtn.addEventListener('click', () => this.downloadNameSample());
        this.downloadGradeSampleBtn.addEventListener('click', () => this.downloadGradeSample());
        
        // 布局控制事件
        this.updateGridBtn.addEventListener('click', () => this.updateGrid());
        this.rowsInput.addEventListener('change', () => this.updateGridSize());
        this.colsInput.addEventListener('change', () => this.updateGridSize());
        
        // 排座方式事件
        this.randomArrangeBtn.addEventListener('click', () => this.arrangeSeats('random'));
        this.gradeArrangeBtn.addEventListener('click', () => this.arrangeSeats('grade'));
        this.balanceArrangeBtn.addEventListener('click', () => this.arrangeSeats('balance'));
        
        // 显示控制事件
        this.showColorCheckbox.addEventListener('change', () => this.toggleColorDisplay());
        this.showRankCheckbox.addEventListener('change', () => this.toggleRankDisplay());
        
        // 导出事件
        this.exportBtn.addEventListener('click', () => this.exportSeatingChart());
    }
    
    // 处理班级名单上传
    async handleNameListUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const content = await this.readFile(file);
            this.students = this.parseStudentList(content, file.name);
            this.updateInfoMessage(`已上传 ${this.students.length} 名学生信息`);
            
            // 如果没有成绩数据，默认随机排座
            if (this.grades.length === 0) {
                this.arrangeSeats('random');
            } else {
                this.checkReadyState();
            }
        } catch (error) {
            this.showError('名单文件读取失败：' + error.message);
        }
    }
    
    // 处理成绩名次上传
    async handleGradeListUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const content = await this.readFile(file);
            this.grades = this.parseGradeList(content, file.name);
            this.updateInfoMessage(`已上传 ${this.grades.length} 名学生成绩信息`);
            
            // 如果没有学生数据，从成绩数据中生成学生数据
            if (this.students.length === 0) {
                this.students = this.grades.map((grade, index) => ({
                    id: index + 1,
                    name: grade.name,
                    rank: grade.rank
                }));
                this.arrangeSeats('balance');
            } else {
                // 如果已有学生数据，合并后默认优差搭配排座
                this.mergeStudentData();
                this.arrangeSeats('balance');
            }
        } catch (error) {
            this.showError('成绩文件读取失败：' + error.message);
        }
    }
    
    // 读取文件内容
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file, 'UTF-8');
        });
    }
    
    // 解析学生名单
    parseStudentList(content, fileName) {
        const lines = content.trim().split('\n');
        const students = [];
        
        if (fileName.endsWith('.csv')) {
            lines.forEach((line, index) => {
                const parts = line.split(',');
                if (parts.length > 0 && parts[0].trim()) {
                    students.push({
                        id: index + 1,
                        name: parts[0].trim(),
                        rank: null
                    });
                }
            });
        } else {
            lines.forEach((line, index) => {
                const name = line.trim();
                if (name) {
                    students.push({
                        id: index + 1,
                        name: name,
                        rank: null
                    });
                }
            });
        }
        
        return students;
    }
    
    // 解析成绩名次
    parseGradeList(content, fileName) {
        const lines = content.trim().split('\n');
        const grades = [];
        
        lines.forEach(line => {
            if (fileName.endsWith('.csv')) {
                const parts = line.split(',');
                if (parts.length >= 2) {
                    grades.push({
                        name: parts[0].trim(),
                        rank: parseInt(parts[1].trim()) || 0
                    });
                }
            } else {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 2) {
                    grades.push({
                        name: parts[0],
                        rank: parseInt(parts[1]) || 0
                    });
                }
            }
        });
        
        return grades;
    }
    
    // 检查是否可以开始排座
    checkReadyState() {
        if (this.students.length > 0 && this.grades.length > 0) {
            this.mergeStudentData();
            this.updateInfoMessage(`数据准备完成，共 ${this.students.length} 名学生，点击排座方式开始排座`);
        }
    }
    
    // 合并学生数据和成绩数据
    mergeStudentData() {
        this.students.forEach(student => {
            const gradeData = this.grades.find(grade => grade.name === student.name);
            if (gradeData) {
                student.rank = gradeData.rank;
            }
        });
        
        // 按成绩排序
        this.students.sort((a, b) => (a.rank || 999) - (b.rank || 999));
    }
    
    // 更新网格尺寸
    updateGridSize() {
        this.rows = parseInt(this.rowsInput.value) || 6;
        this.cols = parseInt(this.colsInput.value) || 8;
    }
    
    // 更新网格布局
    updateGrid() {
        this.updateGridSize();
        this.createGrid();
        if (this.students.length > 0) {
            this.arrangeSeats(this.currentArrangement);
        }
    }
    
    // 创建座位网格
    createGrid() {
        this.classroomGrid.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        this.classroomGrid.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        
        // 清空现有内容
        this.classroomGrid.innerHTML = '';
        
        // 创建空座位
        for (let i = 0; i < this.rows * this.cols; i++) {
            const seat = document.createElement('div');
            seat.className = 'empty-seat';
            seat.textContent = '空座位';
            seat.dataset.position = i;
            this.addDropEventListeners(seat);
            this.classroomGrid.appendChild(seat);
        }
    }
    
    // 排座算法
    arrangeSeats(method) {
        this.currentArrangement = method;
        this.updateArrangeButtons(method);
        
        if (this.students.length === 0) {
            this.showError('请先上传学生名单和成绩信息');
            return;
        }
        
        // 清空当前布局
        this.createGrid();
        
        let positions = [];
        const totalSeats = this.rows * this.cols;
        
        switch (method) {
            case 'random':
                positions = this.randomArrangement();
                break;
            case 'grade':
                positions = this.gradeZoneArrangement();
                break;
            case 'balance':
                positions = this.balanceArrangement();
                break;
        }
        

        
        // 放置学生
        positions.forEach((studentIndex, position) => {
            if (studentIndex !== null && studentIndex < this.students.length) {
                this.placeStudentAt(position, this.students[studentIndex], method);
            }
        });
        
        this.updateInfoMessage(`已使用${this.getMethodName(method)}完成排座`);

    }
    
    // 随机排座
    randomArrangement() {
        const positions = new Array(this.rows * this.cols).fill(null);
        const totalSeats = this.rows * this.cols;
        const studentCount = Math.min(this.students.length, totalSeats);
        
        // 只在前面的座位中随机排列学生
        const availablePositions = Array.from({length: studentCount}, (_, i) => i);
        
        this.students.slice(0, studentCount).forEach((student, index) => {
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            const position = availablePositions.splice(randomIndex, 1)[0];
            positions[position] = index;
        });
        
        return positions;
    }
    
    // 成绩分区排座
    gradeZoneArrangement() {
        const positions = new Array(this.rows * this.cols).fill(null);
        const studentsWithRank = this.students.filter(s => s.rank);
        
        if (studentsWithRank.length === 0) {
            return this.randomArrangement();
        }
        
        const totalSeats = this.rows * this.cols;
        const studentCount = Math.min(this.students.length, totalSeats);
        

        
        // 按座位位置分区：前30%座位给优等生，中50%座位给中等生，后20%座位给差等生
        const excellentSeatCount = Math.floor(studentCount * 0.3);
        const middleSeatCount = Math.floor(studentCount * 0.5);
        const poorSeatCount = studentCount - excellentSeatCount - middleSeatCount;
        

        
        // 按名次分组学生：前30%名次为优等生，中50%名次为中等生，后20%名次为差等生
        const sortedStudents = studentsWithRank.slice(0, studentCount);
        const excellentStudentCount = Math.floor(sortedStudents.length * 0.3);
        const middleStudentCount = Math.floor(sortedStudents.length * 0.5);
        const poorStudentCount = sortedStudents.length - excellentStudentCount - middleStudentCount;
        
        const excellentStudents = sortedStudents.slice(0, excellentStudentCount);
        const middleStudents = sortedStudents.slice(excellentStudentCount, excellentStudentCount + middleStudentCount);
        const poorStudents = sortedStudents.slice(excellentStudentCount + middleStudentCount);
        

        
        // 获取所有座位位置（按顺序：0, 1, 2, 3, ...）
        const allSeatPositions = Array.from({length: studentCount}, (_, i) => i);
        
        // 分配座位区域
        const excellentSeatPositions = allSeatPositions.slice(0, excellentSeatCount);
        const middleSeatPositions = allSeatPositions.slice(excellentSeatCount, excellentSeatCount + middleSeatCount);
        const poorSeatPositions = allSeatPositions.slice(excellentSeatCount + middleSeatCount);
        

        
        // 在各自区域内随机分配学生
        this.assignStudentsToSeats(positions, excellentStudents, excellentSeatPositions, 'excellent');
        this.assignStudentsToSeats(positions, middleStudents, middleSeatPositions, 'middle');
        this.assignStudentsToSeats(positions, poorStudents, poorSeatPositions, 'poor');
        

        
        return positions;
    }
    
    // 将学生分配到指定座位区域
    assignStudentsToSeats(positions, students, seatPositions, groupName) {
        
        // 随机打乱座位位置
        const shuffledSeats = [...seatPositions];
        for (let i = shuffledSeats.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSeats[i], shuffledSeats[j]] = [shuffledSeats[j], shuffledSeats[i]];
        }
        
        // 将学生分配到随机打乱的座位
        students.forEach((student, index) => {
            if (index < shuffledSeats.length) {
                const position = shuffledSeats[index];
                const studentIndex = this.students.findIndex(s => s.id === student.id);
                positions[position] = studentIndex;

            } else {

            }
        });
    }
    
    // 优差搭配排座
    balanceArrangement() {
        const positions = new Array(this.rows * this.cols).fill(null);
        const studentsWithRank = this.students.filter(s => s.rank);
        
        if (studentsWithRank.length === 0) {
            return this.randomArrangement();
        }
        
        const totalSeats = this.rows * this.cols;
        const studentCount = Math.min(this.students.length, totalSeats);
        
        // 按50%分组：前50%为优，后50%为差
        const halfPoint = Math.floor(studentsWithRank.length / 2);
        const excellentStudents = studentsWithRank.slice(0, halfPoint);
        const poorStudents = studentsWithRank.slice(halfPoint);
        
        // 随机打乱两组学生的顺序，每次点击都会重新排列
        const shuffledExcellent = [...excellentStudents];
        const shuffledPoor = [...poorStudents];
        
        // 打乱优秀学生组
        for (let i = shuffledExcellent.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledExcellent[i], shuffledExcellent[j]] = [shuffledExcellent[j], shuffledExcellent[i]];
        }
        
        // 打乱较差学生组
        for (let i = shuffledPoor.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPoor[i], shuffledPoor[j]] = [shuffledPoor[j], shuffledPoor[i]];
        }
        
        let positionIndex = 0;
        let excellentIndex = 0;
        let poorIndex = 0;
        
        // 交替安排：优、差、优、差...
        while (positionIndex < studentCount && (excellentIndex < shuffledExcellent.length || poorIndex < shuffledPoor.length)) {
            // 安排优秀学生
            if (excellentIndex < shuffledExcellent.length && positionIndex < studentCount) {
                const student = shuffledExcellent[excellentIndex];
                const studentIndex = this.students.findIndex(s => s.id === student.id);
                positions[positionIndex++] = studentIndex;
                excellentIndex++;
            }
            
            // 安排较差学生
            if (poorIndex < shuffledPoor.length && positionIndex < studentCount) {
                const student = shuffledPoor[poorIndex];
                const studentIndex = this.students.findIndex(s => s.id === student.id);
                positions[positionIndex++] = studentIndex;
                poorIndex++;
            }
        }
        
        return positions;
    }
    
    // 在指定位置放置学生
    placeStudentAt(position, student, method) {
        const seat = this.classroomGrid.children[position];
        const studentCard = this.createStudentCard(student, method);
        seat.replaceWith(studentCard);
    }
    
    // 创建学生卡片
    createStudentCard(student, method = 'random') {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.draggable = true;
        card.dataset.studentId = student.id;
        card.dataset.studentRank = student.rank || '';
        
        // 根据排座方式和显示设置添加分区样式
        if (method === 'grade' && student.rank && this.showColor) {
            // 获取所有有成绩的学生，按成绩等级分配颜色
            const studentsWithRank = this.students.filter(s => s.rank).sort((a, b) => a.rank - b.rank);
            const totalWithRank = studentsWithRank.length;
            
            // 按名次确定学生等级：前30%为优等生(绿色)，中50%为中等生(黄色)，后20%为差等生(红色)
            const excellentThreshold = Math.floor(totalWithRank * 0.3);
            const middleThreshold = Math.floor(totalWithRank * 0.8); // 30% + 50% = 80%
            
            const studentRankIndex = studentsWithRank.findIndex(s => s.id === student.id);
            
            if (studentRankIndex < excellentThreshold) {
                card.classList.add('front-zone'); // 绿色 - 优等生
            } else if (studentRankIndex < middleThreshold) {
                card.classList.add('middle-zone'); // 黄色 - 中等生
            } else {
                card.classList.add('back-zone'); // 红色 - 差等生
            }
            

        }
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'student-name';
        nameDiv.textContent = student.name;
        
        const rankDiv = document.createElement('div');
        rankDiv.className = 'student-rank';
        if (this.showRank && student.rank) {
            rankDiv.textContent = `名次: ${student.rank}`;
        } else {
            rankDiv.classList.add('hidden');
        }
        
        // 存储原始名次信息
        if (student.rank) {
            rankDiv.dataset.rankText = `名次: ${student.rank}`;
        }
        
        card.appendChild(nameDiv);
        card.appendChild(rankDiv);
        
        // 添加拖拽事件
        this.addDragEventListeners(card);
        
        return card;
    }
    
    // 添加拖拽事件监听器
    addDragEventListeners(element) {
        element.addEventListener('dragstart', (e) => this.handleDragStart(e));
        element.addEventListener('dragend', (e) => this.handleDragEnd(e));
        
        // 确保也为整个元素添加放置事件监听器
        this.addDropEventListeners(element);
    }
    
    // 添加放置事件监听器
    addDropEventListeners(element) {
        element.addEventListener('dragover', (e) => this.handleDragOver(e));
        element.addEventListener('drop', (e) => this.handleDrop(e));
        element.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        element.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        
        // 为子元素也添加事件监听器，确保点击卡片内部也能触发
        const childElements = element.querySelectorAll('*');
        childElements.forEach(child => {
            child.addEventListener('dragover', (e) => this.handleDragOver(e));
            child.addEventListener('drop', (e) => this.handleDrop(e));
            child.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            child.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        });
    }
    
    // 拖拽开始
    handleDragStart(e) {
        this.draggedElement = e.target;
        
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }
    
    // 拖拽结束
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.clearDropIndicators();
        this.draggedElement = null;
    }
    
    // 拖拽悬停
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';

    }
    
    // 拖拽进入
    handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        const target = this.getDropTarget(e.target);
        if (target && target !== this.draggedElement) {
            target.classList.add('drop-target');
        }
    }
    
    // 拖拽离开
    handleDragLeave(e) {
        const target = this.getDropTarget(e.target);
        if (target) {
            target.classList.remove('drop-target');
        }
    }
    
    // 放置
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const target = this.getDropTarget(e.target);
        if (target) {
            target.classList.remove('drop-target');
        }
        
        if (this.draggedElement && target && target !== this.draggedElement) {
            // 如果目标是空座位，直接替换
            if (target.classList.contains('empty-seat')) {
                const draggedParent = this.draggedElement.parentNode;
                target.replaceWith(this.draggedElement);
                const newEmptySeat = this.createEmptySeat();
                draggedParent.appendChild(newEmptySeat);
            }
            // 如果目标是学生卡片，交换位置
            else if (target.classList.contains('student-card')) {
                this.swapStudentCards(this.draggedElement, target);
            }
        }
    }
    
    // 获取正确的拖拽目标
    getDropTarget(element) {
        // 如果点击的是学生卡片内的子元素，找到父级卡片
        if (element.classList.contains('student-card') || element.classList.contains('empty-seat')) {
            return element;
        }
        
        // 如果点击的是卡片内的子元素（如姓名或名次），向上查找卡片
        let parent = element.parentElement;
        while (parent && parent !== this.classroomGrid) {
            if (parent.classList.contains('student-card') || parent.classList.contains('empty-seat')) {
                return parent;
            }
            parent = parent.parentElement;
        }
        
        return null;
    }
    
    // 交换学生卡片位置
    swapStudentCards(card1, card2) {
        // 在座位表网格中，每个位置都有固定的索引
        const allChildren = Array.from(this.classroomGrid.children);
        const index1 = allChildren.indexOf(card1);
        const index2 = allChildren.indexOf(card2);
        
        if (index1 !== -1 && index2 !== -1) {
            // 获取卡片信息用于重建
            const card1StudentId = card1.dataset.studentId;
            const card2StudentId = card2.dataset.studentId;
            
            const student1 = this.students.find(s => s.id == card1StudentId);
            const student2 = this.students.find(s => s.id == card2StudentId);
            

            
            if (student1 && student2) {
                // 保存原有的分区样式类
                const card1ZoneClass = this.getZoneClass(card1);
                const card2ZoneClass = this.getZoneClass(card2);
                

                
                // 重新创建卡片，但不应用排座方式的颜色
                const newCard1 = this.createStudentCardWithoutZone(student1);
                const newCard2 = this.createStudentCardWithoutZone(student2);
                
                // 应用保存的分区样式（保持学生原有的成绩等级颜色）
                if (card1ZoneClass) newCard1.classList.add(card1ZoneClass);
                if (card2ZoneClass) newCard2.classList.add(card2ZoneClass);
                
                // 替换卡片
                card1.replaceWith(newCard2);
                card2.replaceWith(newCard1);
            }
        }
    }
    
    // 获取卡片的分区样式类
    getZoneClass(card) {
        if (card.classList.contains('front-zone')) return 'front-zone';
        if (card.classList.contains('middle-zone')) return 'middle-zone';
        if (card.classList.contains('back-zone')) return 'back-zone';
        return null;
    }
    
    // 创建不带分区样式的学生卡片
    createStudentCardWithoutZone(student) {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.draggable = true;
        card.dataset.studentId = student.id;
        card.dataset.studentRank = student.rank || '';
        
        // 如果当前是成绩分区模式且开启颜色显示，则添加对应的颜色样式
        if (this.currentArrangement === 'grade' && student.rank && this.showColor) {
            const studentsWithRank = this.students.filter(s => s.rank).sort((a, b) => a.rank - b.rank);
            const totalWithRank = studentsWithRank.length;
            
            const excellentThreshold = Math.floor(totalWithRank * 0.3);
            const middleThreshold = Math.floor(totalWithRank * 0.8);
            
            const studentRankIndex = studentsWithRank.findIndex(s => s.id === student.id);
            
            if (studentRankIndex < excellentThreshold) {
                card.classList.add('front-zone');
            } else if (studentRankIndex < middleThreshold) {
                card.classList.add('middle-zone');
            } else {
                card.classList.add('back-zone');
            }
        }
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'student-name';
        nameDiv.textContent = student.name;
        
        const rankDiv = document.createElement('div');
        rankDiv.className = 'student-rank';
        if (this.showRank && student.rank) {
            rankDiv.textContent = `名次: ${student.rank}`;
        } else {
            rankDiv.classList.add('hidden');
        }
        
        // 存储原始名次信息
        if (student.rank) {
            rankDiv.dataset.rankText = `名次: ${student.rank}`;
        }
        
        card.appendChild(nameDiv);
        card.appendChild(rankDiv);
        
        // 添加拖拽事件
        this.addDragEventListeners(card);
        
        return card;
    }
    
    // 创建空座位
    createEmptySeat() {
        const seat = document.createElement('div');
        seat.className = 'empty-seat';
        seat.textContent = '空座位';
        this.addDropEventListeners(seat);
        return seat;
    }
    
    // 清除放置指示器
    clearDropIndicators() {
        document.querySelectorAll('.drop-target').forEach(el => {
            el.classList.remove('drop-target');
        });
    }
    
    // 切换颜色显示
    toggleColorDisplay() {
        this.showColor = this.showColorCheckbox.checked;
        
        // 只更新现有卡片的颜色样式，不重新排座
        document.querySelectorAll('.student-card').forEach(card => {
            const studentId = parseInt(card.dataset.studentId);
            const student = this.students.find(s => s.id === studentId);
            
            if (student && student.rank && this.currentArrangement === 'grade') {
                // 移除所有颜色样式
                card.classList.remove('front-zone', 'middle-zone', 'back-zone');
                
                if (this.showColor) {
                    // 重新添加颜色样式
                    const studentsWithRank = this.students.filter(s => s.rank).sort((a, b) => a.rank - b.rank);
                    const totalWithRank = studentsWithRank.length;
                    
                    const excellentThreshold = Math.floor(totalWithRank * 0.3);
                    const middleThreshold = Math.floor(totalWithRank * 0.8);
                    
                    const studentRankIndex = studentsWithRank.findIndex(s => s.id === student.id);
                    
                    if (studentRankIndex < excellentThreshold) {
                        card.classList.add('front-zone');
                    } else if (studentRankIndex < middleThreshold) {
                        card.classList.add('middle-zone');
                    } else {
                        card.classList.add('back-zone');
                    }
                }
            }
        });
    }
    
    // 切换名次显示
    toggleRankDisplay() {
        this.showRank = this.showRankCheckbox.checked;
        document.querySelectorAll('.student-rank').forEach(rankEl => {
            if (this.showRank) {
                // 从数据属性恢复名次文本
                if (rankEl.dataset.rankText) {
                    rankEl.textContent = rankEl.dataset.rankText;
                    rankEl.classList.remove('hidden');
                } else {
                    // 尝试从学生ID获取名次信息
                    const card = rankEl.parentElement;
                    const studentId = parseInt(card.dataset.studentId);
                    const student = this.students.find(s => s.id === studentId);
                    if (student && student.rank) {
                        rankEl.textContent = `名次: ${student.rank}`;
                        rankEl.dataset.rankText = `名次: ${student.rank}`;
                        rankEl.classList.remove('hidden');
                    } else {
                        rankEl.classList.add('hidden');
                    }
                }
            } else {
                rankEl.classList.add('hidden');
            }
        });
    }
    
    // 更新排座按钮状态
    updateArrangeButtons(activeMethod) {
        [this.randomArrangeBtn, this.gradeArrangeBtn, this.balanceArrangeBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        
        switch (activeMethod) {
            case 'random':
                this.randomArrangeBtn.classList.add('active');
                break;
            case 'grade':
                this.gradeArrangeBtn.classList.add('active');
                break;
            case 'balance':
                this.balanceArrangeBtn.classList.add('active');
                break;
        }
    }
    
    // 获取方法名称
    getMethodName(method) {
        const names = {
            'random': '随机排座',
            'grade': '成绩分区',
            'balance': '优差搭配'
        };
        return names[method] || '未知方式';
    }
    
    // 导出座位图
    exportSeatingChart() {
        // 创建画布
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布尺寸
        const cardWidth = 120;
        const cardHeight = 80;
        const gap = 10;
        const padding = 30;
        
        canvas.width = this.cols * cardWidth + (this.cols - 1) * gap + 2 * padding;
        canvas.height = this.rows * cardHeight + (this.rows - 1) * gap + 2 * padding + 60; // 额外空间给标题
        
        // 设置背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制标题
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('班级座次表', canvas.width / 2, 40);
        
        // 绘制开发者信息
        ctx.font = '14px Arial';
        ctx.fillStyle = '#666666';
        ctx.fillText('开发者：WG科技', canvas.width / 2, canvas.height - 10);
        
        // 绘制座位
        const cards = this.classroomGrid.querySelectorAll('.student-card, .empty-seat');
        cards.forEach((card, index) => {
            const row = Math.floor(index / this.cols);
            const col = index % this.cols;
            const x = padding + col * (cardWidth + gap);
            const y = padding + 60 + row * (cardHeight + gap);
            
            // 绘制卡片背景
            if (card.classList.contains('student-card')) {
                // 根据分区设置背景色
                if (card.classList.contains('front-zone')) {
                    ctx.fillStyle = '#a7f3d0';
                } else if (card.classList.contains('middle-zone')) {
                    ctx.fillStyle = '#fde68a';
                } else if (card.classList.contains('back-zone')) {
                    ctx.fillStyle = '#fecaca';
                } else {
                    ctx.fillStyle = '#ffeaa7';
                }
            } else {
                ctx.fillStyle = '#f7fafc';
            }
            
            ctx.fillRect(x, y, cardWidth, cardHeight);
            
            // 绘制边框
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, cardWidth, cardHeight);
            
            // 绘制文字
            ctx.fillStyle = '#2d3748';
            ctx.textAlign = 'center';
            
            if (card.classList.contains('student-card')) {
                const nameEl = card.querySelector('.student-name');
                const rankEl = card.querySelector('.student-rank');
                
                // 绘制姓名
                ctx.font = 'bold 16px Arial';
                ctx.fillText(nameEl.textContent, x + cardWidth / 2, y + cardHeight / 2 - 5);
                
                // 绘制名次（如果显示）
                if (this.showRank && rankEl && !rankEl.classList.contains('hidden')) {
                    ctx.font = '12px Arial';
                    ctx.fillStyle = '#4a5568';
                    ctx.fillText(rankEl.textContent, x + cardWidth / 2, y + cardHeight / 2 + 15);
                }
            } else {
                ctx.font = '12px Arial';
                ctx.fillStyle = '#a0aec0';
                ctx.fillText('空座位', x + cardWidth / 2, y + cardHeight / 2);
            }
        });
        
        // 下载图片
        const link = document.createElement('a');
        link.download = '班级座次表.png';
        link.href = canvas.toDataURL();
        link.click();
        
        this.updateInfoMessage('座位图已导出下载');
    }
    
    // 更新信息提示
    updateInfoMessage(message) {
        this.infoMessage.textContent = message;
    }
    
    // 显示错误信息
    showError(message) {
        this.infoMessage.textContent = '错误：' + message;
        this.infoMessage.style.borderLeftColor = '#e53e3e';
        setTimeout(() => {
            this.infoMessage.style.borderLeftColor = '#667eea';
        }, 3000);
    }
    
    // 下载班级名单示例
    downloadNameSample() {
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
汪嘉欣`;
        
        this.downloadFile(sampleData, '班级名单示例.txt', 'text/plain');
        this.updateInfoMessage('班级名单示例文件已下载');
    }
    
    // 下载成绩名次示例
    downloadGradeSample() {
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
汪嘉欣 30`;
        
        this.downloadFile(sampleData, '成绩名次示例.txt', 'text/plain');
        this.updateInfoMessage('成绩名次示例文件已下载');
    }
    
    // 通用文件下载方法
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new SeatingChart();
});
