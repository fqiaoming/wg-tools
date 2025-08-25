<template>
  <div class="home">
    <!-- 页面标题 -->
    <div class="hero-section">
      <h1 class="page-title">WG-Tools 开发者工具箱</h1>
      <p class="page-subtitle">
        为开发者提供便捷、高效的在线工具服务<br>
        支持文本处理、编码转换、开发调试等常用功能
      </p>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索工具..."
        size="large"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 工具分类 -->
    <div class="categories-section">
      <el-tabs v-model="activeCategory" class="tool-tabs">
        <el-tab-pane label="全部工具" name="all">
          <div class="tools-grid">
            <div
              v-for="tool in filteredTools"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#667eea' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="文本处理" name="text">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('text')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#22c55e' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="编码转换" name="encoding">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('encoding')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#3b82f6' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="开发工具" name="dev">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('dev')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#10b981' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="时间工具" name="time">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('time')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#0ea5e9' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="文档" name="docs">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('docs')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#a855f7' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="安全工具" name="security">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('security')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#ef4444' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="娱乐工具" name="entertainment">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('entertainment')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#ec4899' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="🛠️ 实用工具" name="utility">
          <div class="tools-grid">
            <div
              v-for="tool in getToolsByCategory('utility')"
              :key="tool.path"
              class="tool-item"
              :style="{ '--tool-color': tool.color || '#06b6d4' }"
              @click="navigateToTool(tool.path)"
            >
              <div class="item-icon">
                <el-icon :size="32">
                  <component :is="tool.icon" />
                </el-icon>
              </div>
              <h3 class="item-title">{{ tool.name }}</h3>
              <p class="item-description">{{ tool.description }}</p>
              <div class="item-tags">
                <el-tag
                  v-for="tag in tool.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search
} from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')
const activeCategory = ref('all')

// 工具列表数据
const tools = ref([
  {
    name: 'JSON工具',
    description: 'JSON格式化、压缩、验证，让JSON数据更易读',
    icon: 'Document',
    path: '/text/json',
    category: 'text',
    tags: ['JSON', '格式化', '验证'],
    color: '#22c55e'
  },
  {
    name: 'XML工具',
    description: 'XML格式化、美化，提升XML可读性',
    icon: 'Document',
    path: '/text/xml',
    category: 'text',
    tags: ['XML', '格式化'],
    color: '#3b82f6'
  },
  {
    name: '文本对比',
    description: '比较两段文本的差异，支持逐行对比',
    icon: 'Edit',
    path: '/text/compare',
    category: 'text',
    tags: ['文本', '对比', '差异'],
    color: '#f59e0b'
  },
  {
    name: '文本加密',
    description: '支持MD5、SHA1、SHA256等多种加密算法',
    icon: 'Lock',
    path: '/text/encrypt',
    category: 'text',
    tags: ['加密', 'MD5', 'SHA'],
    color: '#ef4444'
  },
  {
    name: 'Base64编码',
    description: 'Base64编码解码，支持文本和文件转换',
    icon: 'Key',
    path: '/encoding/base64',
    category: 'encoding',
    tags: ['Base64', '编码', '解码'],
    color: '#8b5cf6'
  },
  {
    name: 'URL编码',
    description: 'URL编码解码，处理特殊字符转换',
    icon: 'Link',
    path: '/encoding/url',
    category: 'encoding',
    tags: ['URL', '编码', '转换'],
    color: '#06b6d4'
  },
  {
    name: 'Unicode编码',
    description: 'Unicode编码解码，处理多语言字符',
    icon: 'Switch',
    path: '/encoding/unicode',
    category: 'encoding',
    tags: ['Unicode', '字符', '编码'],
    color: '#f97316'
  },
  {
    name: 'HTML实体编码',
    description: 'HTML实体字符编码解码',
    icon: 'Connection',
    path: '/encoding/html',
    category: 'encoding',
    tags: ['HTML', '实体', '编码'],
    color: '#ec4899'
  },
  {
    name: '进制转换',
    description: '2、8、10、16进制之间的相互转换',
    icon: 'Operation',
    path: '/encoding/base',
    category: 'encoding',
    tags: ['进制', '转换', '二进制', '十六进制'],
    color: '#84cc16'
  },
  {
    name: '正则表达式',
    description: '正则表达式测试、替换，支持多种模式',
    icon: 'MagicStick',
    path: '/text/regex',
    category: 'text',
    tags: ['正则', '匹配', '替换'],
    color: '#a855f7'
  },
  {
    name: '颜色工具',
    description: 'HEX、RGB、HSL颜色格式转换',
    icon: 'Brush',
    path: '/dev/color',
    category: 'dev',
    tags: ['颜色', 'HEX', 'RGB', 'HSL'],
    color: '#f59e0b'
  },
  {
    name: 'UUID生成器',
    description: '生成标准UUID，支持单个和批量生成',
    icon: 'Key',
    path: '/dev/uuid',
    category: 'dev',
    tags: ['UUID', '生成', '唯一标识'],
    color: '#10b981'
  },
  {
    name: '时间戳工具',
    description: '时间戳与日期格式相互转换',
    icon: 'Clock',
    path: '/time/timestamp',
    category: 'time',
    tags: ['时间戳', '日期', '转换'],
    color: '#0ea5e9'
  },
  {
    name: '时间计算器',
    description: '时间加减运算、工作日计算、年龄计算',
    icon: 'Timer',
    path: '/time/calculator',
    category: 'time',
    tags: ['时间计算', '工作日', '年龄'],
    color: '#8b5cf6'
  },
  {
    name: '世界时钟',
    description: '全球时区时间显示和转换',
    icon: 'Monitor',
    path: '/time/worldclock',
    category: 'time',
    tags: ['世界时钟', '时区', '全球时间'],
    color: '#10b981'
  },
  {
    name: '密码生成器',
    description: '生成安全可靠的随机密码',
    icon: 'Lock',
    path: '/security/password',
    category: 'security',
    tags: ['密码', '安全', '随机', '生成'],
    color: '#dc2626'
  },
  {
    name: '哈希计算',
    description: '计算文本的哈希值，支持多种算法',
    icon: 'Key',
    path: '/security/hash',
    category: 'security',
    tags: ['哈希', '计算', 'MD5', 'SHA'],
    color: '#b91c1c'
  },
  {
    name: '文本统计',
    description: '分析文本的字符、单词、行数等统计信息',
    icon: 'DataAnalysis',
    path: '/text/stats',
    category: 'text',
    tags: ['文本', '统计', '分析', '词频'],
    color: '#7c3aed'
  },
  {
    name: '单位转换',
    description: '长度、重量、温度等多种单位转换',
    icon: 'Switch',
    path: '/converter/unit',
    category: 'time',
    tags: ['单位', '转换', '长度', '重量', '温度']
  },
  {
    name: '二维码生成器',
    description: '生成各种内容的二维码，支持文本、网址、WiFi等',
    icon: 'QrCode',
    path: '/dev/qr-generator',
    category: 'dev',
    tags: ['二维码', 'QR码', '生成', '分享']
  },
  {
    name: '图片Base64转换',
    description: '图片与Base64编码的相互转换',
    icon: 'Picture',
    path: '/converter/image-base64',
    category: 'encoding',
    tags: ['图片', 'Base64', '编码', '转换']
  },

  {
    name: '随机数据生成器',
    description: '生成测试用的姓名、邮箱、电话等数据',
    icon: 'MagicStick',
    path: '/dev/random-data',
    category: 'dev',
    tags: ['随机', '测试数据', '姓名', '邮箱']
  },
  {
    name: '代码格式化工具',
    description: '美化CSS、SQL、JSON等代码格式',
    icon: 'DocumentCopy',
    path: '/dev/code-formatter',
    category: 'dev',
    tags: ['代码', '格式化', 'CSS', 'SQL']
  },
  {
    name: 'Markdown编辑器',
    description: '实时预览Markdown文档，支持语法高亮',
    icon: 'Files',
    path: '/text/markdown-editor',
    category: 'text',
    tags: ['Markdown', '编辑器', '预览', '文档']
  },
  {
    name: '文件对比工具',
    description: '对比两个文件的差异，逐行分析统计',
    icon: 'Operation',
    path: '/dev/file-diff',
    category: 'dev',
    tags: ['文件', '对比', '差异', '分析']
  },
  {
    name: '高级颜色选择器',
    description: '颜色分析、调色板生成和颜色转换',
    icon: 'Brush',
    path: '/dev/color-picker',
    category: 'dev',
    tags: ['颜色', '调色板', '分析', '转换']
  },
  {
    name: '图标生成器',
    description: 'SVG图标生成和Favicon制作工具',
    icon: 'Camera',
    path: '/dev/icon-generator',
    category: 'dev',
    tags: ['图标', 'SVG', 'Favicon', '生成']
  },

        {
          name: 'Cron表达式工具',
          description: '定时任务表达式生成、解析和执行时间预测',
          icon: 'Clock',
          path: '/dev/cron',
          category: 'dev',
          tags: ['Cron', '定时任务', '表达式', '调度']
        },
        {
          name: '变量生成助手',
          description: '中文转英文变量名，支持多种编程命名格式',
          icon: 'Document',
          path: '/dev/variable-generator',
          category: 'dev',
          tags: ['变量', '命名', '翻译', '编程'],
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },

        // 文档工具
        { name: 'Git 常用命令', description: 'Git版本控制常用命令参考手册', icon: 'Document', path: '/docs/git', category: 'docs', tags: ['Git', '版本控制', '命令', '文档'] },
        { name: 'Linux 常用命令', description: 'Linux系统管理和操作常用命令参考', icon: 'Monitor', path: '/docs/linux', category: 'docs', tags: ['Linux', '系统管理', '命令', '运维'] },
        { name: 'Docker 常用命令', description: 'Docker容器和镜像管理常用命令参考', icon: 'Box', path: '/docs/docker', category: 'docs', tags: ['Docker', '容器', '镜像', '部署'] },
        { name: 'MySQL 常用语法', description: 'MySQL数据库操作常用SQL语法参考', icon: 'DataAnalysis', path: '/docs/mysql', category: 'docs', tags: ['MySQL', 'SQL', '数据库', '查询'] },
        { name: 'Java 常用语法', description: 'Java编程语言核心语法和Stream API操作', icon: 'Files', path: '/docs/java', category: 'docs', tags: ['Java', 'Stream', '编程', '语法'], color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
        
        // 娱乐工具
        { name: '虚拟钢琴', description: '在线钢琴演奏，内置经典曲目教学，键盘按键支持', icon: 'VideoPlay', path: '/entertainment/piano', category: 'entertainment', tags: ['钢琴', '音乐', '演奏', '娱乐'], color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        { name: '贪吃蛇游戏', description: '经典街机游戏，支持多种难度和主题，考验反应速度', icon: 'Trophy', path: '/entertainment/snake', category: 'entertainment', tags: ['游戏', '贪吃蛇', '休闲', '娱乐'], color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { name: '励志语录生成器', description: '随机生成励志、搞笑、哲理语录，支持分类和收藏', icon: 'ChatLineRound', path: '/entertainment/quotes', category: 'entertainment', tags: ['语录', '励志', '哲理', '摸鱼'], color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { name: '数字华容道', description: '经典数字拼图游戏，锻炼逻辑思维和空间想象力', icon: 'Grid', path: '/entertainment/number-puzzle', category: 'entertainment', tags: ['益智', '拼图', '华容道', '思维'], color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
                  { name: '打地鼠游戏', description: '经典反应训练游戏，考验手速和专注力，多种难度挑战', icon: 'Pointer', path: '/entertainment/whack-mole', category: 'entertainment', tags: ['反应', '手速', '训练', '挑战'], color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
          { name: '2048数字合成', description: '经典数字合成游戏，通过滑动合并相同数字，挑战2048', icon: 'Grid', path: '/entertainment/2048', category: 'entertainment', tags: ['数字', '合成', '策略', '益智'], color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { name: '俄罗斯方块', description: '经典俄罗斯方块游戏，消除满行获得高分，挑战反应速度', icon: 'Grid', path: '/entertainment/tetris', category: 'entertainment', tags: ['方块', '消除', '经典', '反应'], color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { name: 'Flappy Bird', description: '经典飞行躲避游戏，控制小鸟穿越管道，考验反应和节奏感', icon: 'Promotion', path: '/entertainment/flappy-bird', category: 'entertainment', tags: ['飞行', '躲避', '节奏', '反应'], color: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)' },
        { name: '宝石消除', description: '经典三消游戏，交换相邻宝石形成消除，策略与运气的完美结合', icon: 'Guide', path: '/entertainment/gem-crush', category: 'entertainment', tags: ['三消', '消除', '策略', '宝石'], color: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
        
        // 实用工具
        { name: 'BMI计算器', description: '计算身体质量指数，评估体重健康状况，提供健康建议', icon: 'DataAnalysis', path: '/utility/bmi-calculator', category: 'utility', tags: ['健康', 'BMI', '体重', '计算'], color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { name: '房贷计算器', description: '房贷月供计算，支持等额本息、等额本金两种还款方式', icon: 'Money', path: '/utility/mortgage-calculator', category: 'utility', tags: ['房贷', '计算器', '月供', '利率'], color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { name: '年龄计算器', description: '精确计算年龄、生肖、星座，支持生日提醒和倒计时', icon: 'Calendar', path: '/utility/age-calculator', category: 'utility', tags: ['年龄', '生肖', '星座', '生日'], color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
        
        // 教师工具
        { name: '班级座次表', description: '智能座位安排系统，支持随机排座、成绩分区、优差搭配等多种方式', icon: 'School', path: '/utility/classroom-seating', category: 'utility', tags: ['教学', '座位', '班级', '管理'], color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
        { name: '学生点名器', description: '智能随机点名工具，支持批量导入名单、统计分析、音效动画', icon: 'Bell', path: '/utility/student-rollcall', category: 'utility', tags: ['教学', '点名', '随机', '课堂'], color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
      ])

// 搜索过滤
const filteredTools = computed(() => {
  if (!searchKeyword.value) {
    return tools.value
  }
  
  const keyword = searchKeyword.value.toLowerCase()
  return tools.value.filter(tool => 
    tool.name.toLowerCase().includes(keyword) ||
    tool.description.toLowerCase().includes(keyword) ||
    tool.tags.some(tag => tag.toLowerCase().includes(keyword))
  )
})

// 根据分类获取工具
const getToolsByCategory = (category: string) => {
  return tools.value.filter(tool => tool.category === category)
}

// 导航到工具页面
const navigateToTool = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section {
  text-align: center;
  padding: 80px 0 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: -30px -30px 50px -30px;
  border-radius: 0 0 40px 40px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.page-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.search-section {
  max-width: 600px;
  margin: 0 auto 40px;
}

.search-input {
  font-size: 16px;
}

.categories-section {
  margin-bottom: 40px;
}

.tool-tabs {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.tool-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid transparent;
  background-clip: padding-box;
  text-align: center;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.tool-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  padding: 2px;
  background: linear-gradient(135deg, var(--tool-color, #667eea) 0%, transparent 50%, var(--tool-color, #667eea) 100%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.tool-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.tool-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  background: var(--tool-color, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
  color: white;
}

.tool-item:hover::before {
  left: 100%;
}

.tool-item:hover::after {
  opacity: 1;
}

.tool-item:hover .item-title,
.tool-item:hover .item-description {
  color: white;
}

.tool-item:hover .item-tags .el-tag {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.tool-item:hover .item-icon {
  color: white;
}

.item-icon {
  color: var(--tool-color, #667eea);
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.tool-item:hover .item-icon {
  color: var(--tool-color, #764ba2);
  transform: scale(1.1);
  filter: brightness(1.2);
}

.item-title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}

.tool-item:hover .item-title {
  color: #667eea;
}

.item-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.item-tags {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__active-bar) {
  background-color: #409EFF;
}

:deep(.el-tabs__item.is-active) {
  color: #409EFF;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 20px 0;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .home {
    padding: 0 10px;
  }
}
</style>
