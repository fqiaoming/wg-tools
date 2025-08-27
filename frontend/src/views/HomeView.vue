<template>
  <div class="home">
    <!-- 页面标题 -->
    <div class="hero-section">
      <h1 class="page-title">{{ t('home.title') }}</h1>
      <p class="page-subtitle" v-html="t('home.subtitle').replace('\n', '<br>')"></p>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        :placeholder="t('home.searchPlaceholder')"
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
        <el-tab-pane name="all">
          <template #label>
            <span style="margin-right: 6px;">📱</span>
            {{ t('home.categories.all') }}
          </template>
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
        
        <el-tab-pane name="text">
          <template #label>
            <span style="margin-right: 6px;">📝</span>
            {{ t('home.categories.text') }}
          </template>
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
        
        <el-tab-pane name="encoding">
          <template #label>
            <span style="margin-right: 6px;">🔄</span>
            {{ t('home.categories.encoding') }}
          </template>
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
        
        <el-tab-pane name="dev">
          <template #label>
            <span style="margin-right: 6px;">🛠️</span>
            {{ t('home.categories.dev') }}
          </template>
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
        
        <el-tab-pane name="time">
          <template #label>
            <span style="margin-right: 6px;">⏰</span>
            {{ t('home.categories.time') }}
          </template>
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

        <el-tab-pane name="docs">
          <template #label>
            {{ t('nav.docs') }}
          </template>
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
        
        <el-tab-pane name="security">
          <template #label>
            <span style="margin-right: 6px;">🔒</span>
            {{ t('home.categories.security') }}
          </template>
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
        
        <el-tab-pane name="entertainment">
          <template #label>
            <span style="margin-right: 6px;">🎮</span>
            {{ t('home.categories.entertainment') }}
          </template>
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
        
        <el-tab-pane name="utility">
          <template #label>
            <span style="margin-right: 6px;">🔧</span>
            {{ t('home.categories.utility') }}
          </template>
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
import { useI18n } from 'vue-i18n'
import {
  Search
} from '@element-plus/icons-vue'

const router = useRouter()
const { t, locale } = useI18n()
const searchKeyword = ref('')
const activeCategory = ref('all')

// 获取标签数组的辅助函数
const getTagsArray = (key: string) => {
  const tags = t(key)
  // 如果翻译失败，使用默认标签
  if (!Array.isArray(tags) || tags.length === 0) {
    // 根据当前语言提供默认标签
    const isEnglish = locale.value === 'en'
    const defaultTags: Record<string, string[]> = isEnglish ? {
      // Text Tools
      'home.tools.jsonTool.tags': ['JSON', 'Format', 'Validate'],
      'home.tools.xmlTool.tags': ['XML', 'Format', 'Beautify'],
      'home.tools.textCompare.tags': ['Text', 'Compare', 'Diff'],
      'home.tools.textEncrypt.tags': ['Encrypt', 'Text', 'Security'],
      'home.tools.regexTool.tags': ['Regex', 'Match', 'Replace'],
      'home.tools.textStats.tags': ['Text', 'Statistics', 'Analysis'],
      // Encoding Tools
      'home.tools.base64Tool.tags': ['Base64', 'Encode', 'Decode'],
      'home.tools.urlTool.tags': ['URL', 'Encode', 'Decode'],
      'home.tools.unicodeTool.tags': ['Unicode', 'Character', 'Encode'],
      'home.tools.htmlTool.tags': ['HTML', 'Escape', 'Entity'],
      'home.tools.baseTool.tags': ['Base', 'Convert', 'Math'],
      // Development Tools
      'home.tools.colorTool.tags': ['Color', 'Palette', 'Design'],
      'home.tools.uuidTool.tags': ['UUID', 'Generate', 'Unique'],
      'home.tools.timestampTool.tags': ['Timestamp', 'Convert', 'Time'],
      'home.tools.timeCalculator.tags': ['Time', 'Calculate', 'Date'],
      'home.tools.worldClock.tags': ['Clock', 'Timezone', 'World'],
      'home.tools.passwordGenerator.tags': ['Password', 'Generate', 'Security'],
      'home.tools.hashTool.tags': ['Hash', 'Encrypt', 'Checksum'],
      'home.tools.unitConverter.tags': ['Unit', 'Convert', 'Measure'],
      'home.tools.qrGenerator.tags': ['QR Code', 'Generate', 'Scan'],
      'home.tools.imageBase64.tags': ['Image', 'Base64', 'Convert'],
      'home.tools.randomData.tags': ['Random', 'Data', 'Generate'],
      'home.tools.codeFormatter.tags': ['Code', 'Format', 'Beautify'],
      'home.tools.markdownEditor.tags': ['Markdown', 'Editor', 'Preview'],
      'home.tools.fileDiff.tags': ['File', 'Compare', 'Diff'],
      'home.tools.colorPicker.tags': ['Color', 'Picker', 'Eyedropper'],
      'home.tools.iconGenerator.tags': ['Icon', 'Generate', 'Design'],
      'home.tools.cronTool.tags': ['Cron', 'Schedule', 'Expression'],
      'home.tools.variableGenerator.tags': ['Variable', 'Generate', 'Naming'],
      // Documentation Tools
      'home.tools.gitCommands.tags': ['Git', 'Commands', 'Version'],
      'home.tools.linuxCommands.tags': ['Linux', 'Commands', 'System'],
      'home.tools.dockerCommands.tags': ['Docker', 'Container', 'Commands'],
      'home.tools.mysqlSyntax.tags': ['MySQL', 'Database', 'Syntax'],
      'home.tools.javaSyntax.tags': ['Java', 'Syntax', 'Programming'],
      // Entertainment Tools
      'home.tools.piano.tags': ['Piano', 'Music', 'Play'],
      'home.tools.snakeGame.tags': ['Snake', 'Game', 'Classic'],
      'home.tools.quoteGenerator.tags': ['Quote', 'Generate', 'Inspiration'],
      'home.tools.numberPuzzle.tags': ['Number', 'Puzzle', 'Brain'],
      'home.tools.whackMole.tags': ['Whack', 'Mole', 'Reaction'],
      'home.tools.game2048.tags': ['Number', 'Merge', 'Strategy', 'Puzzle'],
      'home.tools.tetris.tags': ['Block', 'Clear', 'Classic', 'Reaction'],
      'home.tools.flappyBird.tags': ['Fly', 'Avoid', 'Rhythm', 'Reaction'],
      'home.tools.gemCrush.tags': ['Match3', 'Crush', 'Strategy', 'Gem'],
      // Utility Tools
      'home.tools.bmiCalculator.tags': ['Health', 'BMI', 'Weight', 'Calculate'],
      'home.tools.mortgageCalculator.tags': ['Mortgage', 'Calculator', 'Loan', 'Interest'],
      'home.tools.ageCalculator.tags': ['Age', 'Zodiac', 'Birthday', 'Calculate'],
      'home.tools.classroomSeating.tags': ['Education', 'Seating', 'Classroom', 'Manage'],
      'home.tools.studentRollCall.tags': ['Education', 'Roll Call', 'Random', 'Class'],
    } : {
      // 文本工具
      'home.tools.jsonTool.tags': ['JSON', '格式化', '验证'],
      'home.tools.xmlTool.tags': ['XML', '格式化', '美化'],
      'home.tools.textCompare.tags': ['文本', '对比', '差异'],
      'home.tools.textEncrypt.tags': ['加密', '文本', '安全'],
      'home.tools.regexTool.tags': ['正则', '匹配', '替换'],
      'home.tools.textStats.tags': ['文本', '统计', '分析'],
      // 编码工具
      'home.tools.base64Tool.tags': ['Base64', '编码', '解码'],
      'home.tools.urlTool.tags': ['URL', '编码', '解码'],
      'home.tools.unicodeTool.tags': ['Unicode', '字符', '编码'],
      'home.tools.htmlTool.tags': ['HTML', '转义', '实体'],
      'home.tools.baseTool.tags': ['进制', '转换', '数学'],
      // 开发工具
      'home.tools.colorTool.tags': ['颜色', '调色板', '设计'],
      'home.tools.uuidTool.tags': ['UUID', '生成', '唯一标识'],
      'home.tools.timestampTool.tags': ['时间戳', '转换', '时间'],
      'home.tools.timeCalculator.tags': ['时间', '计算', '日期'],
      'home.tools.worldClock.tags': ['时钟', '时区', '世界时间'],
      'home.tools.passwordGenerator.tags': ['密码', '生成', '安全'],
      'home.tools.hashTool.tags': ['哈希', '加密', '校验'],
      'home.tools.unitConverter.tags': ['单位', '转换', '度量'],
      'home.tools.qrGenerator.tags': ['二维码', '生成', '扫码'],
      'home.tools.imageBase64.tags': ['图片', 'Base64', '转换'],
      'home.tools.randomData.tags': ['随机', '数据', '生成'],
      'home.tools.codeFormatter.tags': ['代码', '格式化', '美化'],
      'home.tools.markdownEditor.tags': ['Markdown', '编辑器', '预览'],
      'home.tools.fileDiff.tags': ['文件', '对比', '差异'],
      'home.tools.colorPicker.tags': ['颜色', '选择器', '取色'],
      'home.tools.iconGenerator.tags': ['图标', '生成', '设计'],
      'home.tools.cronTool.tags': ['Cron', '定时任务', '表达式'],
      'home.tools.variableGenerator.tags': ['变量', '生成', '命名'],
      // 文档工具
      'home.tools.gitCommands.tags': ['Git', '命令', '版本控制'],
      'home.tools.linuxCommands.tags': ['Linux', '命令', '系统'],
      'home.tools.dockerCommands.tags': ['Docker', '容器', '命令'],
      'home.tools.mysqlSyntax.tags': ['MySQL', '数据库', '语法'],
      'home.tools.javaSyntax.tags': ['Java', '语法', '编程'],
      // 娱乐工具
      'home.tools.piano.tags': ['钢琴', '音乐', '演奏'],
      'home.tools.snakeGame.tags': ['贪吃蛇', '游戏', '经典'],
      'home.tools.quoteGenerator.tags': ['名言', '生成', '励志'],
      'home.tools.numberPuzzle.tags': ['数字', '拼图', '益智'],
      'home.tools.whackMole.tags': ['打地鼠', '反应', '游戏'],
      'home.tools.game2048.tags': ['数字', '合成', '策略', '益智'],
      'home.tools.tetris.tags': ['方块', '消除', '经典', '反应'],
      'home.tools.flappyBird.tags': ['飞行', '躲避', '节奏', '反应'],
      'home.tools.gemCrush.tags': ['三消', '消除', '策略', '宝石'],
      // 实用工具
      'home.tools.bmiCalculator.tags': ['健康', 'BMI', '体重', '计算'],
      'home.tools.mortgageCalculator.tags': ['房贷', '计算器', '月供', '利率'],
      'home.tools.ageCalculator.tags': ['年龄', '生肖', '星座', '生日'],
      'home.tools.classroomSeating.tags': ['教学', '座位', '排座', '管理'],
      'home.tools.studentRollCall.tags': ['教学', '点名', '随机', '课堂'],
    }
    return defaultTags[key] || (isEnglish ? ['Tool'] : ['工具'])
  }
  return tags
}

// 工具列表数据
const tools = computed(() => [
  {
    name: t('home.tools.jsonTool.name'),
    description: t('home.tools.jsonTool.description'),
    icon: 'Document',
    path: '/text/json',
    category: 'text',
    tags: getTagsArray('home.tools.jsonTool.tags'),
    color: '#22c55e'
  },
  {
    name: t('home.tools.xmlTool.name'),
    description: t('home.tools.xmlTool.description'),
    icon: 'Document',
    path: '/text/xml',
    category: 'text',
    tags: getTagsArray('home.tools.xmlTool.tags'),
    color: '#3b82f6'
  },
  {
    name: t('home.tools.textCompare.name'),
    description: t('home.tools.textCompare.description'),
    icon: 'Edit',
    path: '/text/compare',
    category: 'text',
    tags: getTagsArray('home.tools.textCompare.tags'),
    color: '#f59e0b'
  },
  {
    name: t('home.tools.textEncrypt.name'),
    description: t('home.tools.textEncrypt.description'),
    icon: 'Lock',
    path: '/text/encrypt',
    category: 'text',
    tags: getTagsArray('home.tools.textEncrypt.tags'),
    color: '#ef4444'
  },
  {
    name: t('home.tools.base64Tool.name'),
    description: t('home.tools.base64Tool.description'),
    icon: 'Key',
    path: '/encoding/base64',
    category: 'encoding',
    tags: getTagsArray('home.tools.base64Tool.tags'),
    color: '#8b5cf6'
  },
  {
    name: t('home.tools.urlTool.name'),
    description: t('home.tools.urlTool.description'),
    icon: 'Link',
    path: '/encoding/url',
    category: 'encoding',
    tags: getTagsArray('home.tools.urlTool.tags'),
    color: '#06b6d4'
  },
  {
    name: t('home.tools.unicodeTool.name'),
    description: t('home.tools.unicodeTool.description'),
    icon: 'Switch',
    path: '/encoding/unicode',
    category: 'encoding',
    tags: getTagsArray('home.tools.unicodeTool.tags'),
    color: '#f97316'
  },
  {
    name: t('home.tools.htmlTool.name'),
    description: t('home.tools.htmlTool.description'),
    icon: 'Connection',
    path: '/encoding/html',
    category: 'encoding',
    tags: getTagsArray('home.tools.htmlTool.tags'),
    color: '#ec4899'
  },
  {
    name: t('home.tools.baseTool.name'),
    description: t('home.tools.baseTool.description'),
    icon: 'Operation',
    path: '/encoding/base',
    category: 'encoding',
    tags: getTagsArray('home.tools.baseTool.tags'),
    color: '#84cc16'
  },
  {
    name: t('home.tools.regexTool.name'),
    description: t('home.tools.regexTool.description'),
    icon: 'MagicStick',
    path: '/text/regex',
    category: 'text',
    tags: getTagsArray('home.tools.regexTool.tags'),
    color: '#a855f7'
  },
  {
    name: t('home.tools.colorTool.name'),
    description: t('home.tools.colorTool.description'),
    icon: 'Brush',
    path: '/dev/color',
    category: 'dev',
    tags: getTagsArray('home.tools.colorTool.tags'),
    color: '#f59e0b'
  },
  {
    name: t('home.tools.uuidTool.name'),
    description: t('home.tools.uuidTool.description'),
    icon: 'Key',
    path: '/dev/uuid',
    category: 'dev',
    tags: getTagsArray('home.tools.uuidTool.tags'),
    color: '#10b981'
  },
  {
    name: t('home.tools.timestampTool.name'),
    description: t('home.tools.timestampTool.description'),
    icon: 'Clock',
    path: '/time/timestamp',
    category: 'time',
    tags: getTagsArray('home.tools.timestampTool.tags'),
    color: '#0ea5e9'
  },
  {
    name: t('home.tools.timeCalculator.name'),
    description: t('home.tools.timeCalculator.description'),
    icon: 'Timer',
    path: '/time/calculator',
    category: 'time',
    tags: getTagsArray('home.tools.timeCalculator.tags'),
    color: '#8b5cf6'
  },
  {
    name: t('home.tools.worldClock.name'),
    description: t('home.tools.worldClock.description'),
    icon: 'Monitor',
    path: '/time/worldclock',
    category: 'time',
    tags: getTagsArray('home.tools.worldClock.tags'),
    color: '#10b981'
  },
  {
    name: t('home.tools.passwordGenerator.name'),
    description: t('home.tools.passwordGenerator.description'),
    icon: 'Lock',
    path: '/security/password',
    category: 'security',
    tags: getTagsArray('home.tools.passwordGenerator.tags'),
    color: '#dc2626'
  },
  {
    name: t('home.tools.hashTool.name'),
    description: t('home.tools.hashTool.description'),
    icon: 'Key',
    path: '/security/hash',
    category: 'security',
    tags: getTagsArray('home.tools.hashTool.tags'),
    color: '#b91c1c'
  },
  {
    name: t('home.tools.textStats.name'),
    description: t('home.tools.textStats.description'),
    icon: 'DataAnalysis',
    path: '/text/stats',
    category: 'text',
    tags: getTagsArray('home.tools.textStats.tags'),
    color: '#7c3aed'
  },
  {
    name: t('home.tools.unitConverter.name'),
    description: t('home.tools.unitConverter.description'),
    icon: 'Switch',
    path: '/converter/unit',
    category: 'time',
    tags: getTagsArray('home.tools.unitConverter.tags')
  },
  {
    name: t('home.tools.qrGenerator.name'),
    description: t('home.tools.qrGenerator.description'),
    icon: 'QrCode',
    path: '/dev/qr-generator',
    category: 'dev',
    tags: getTagsArray('home.tools.qrGenerator.tags')
  },
  {
    name: t('home.tools.imageBase64.name'),
    description: t('home.tools.imageBase64.description'),
    icon: 'Picture',
    path: '/converter/image-base64',
    category: 'encoding',
    tags: getTagsArray('home.tools.imageBase64.tags')
  },

  {
    name: t('home.tools.randomData.name'),
    description: t('home.tools.randomData.description'),
    icon: 'MagicStick',
    path: '/dev/random-data',
    category: 'dev',
    tags: getTagsArray('home.tools.randomData.tags')
  },
  {
    name: t('home.tools.codeFormatter.name'),
    description: t('home.tools.codeFormatter.description'),
    icon: 'DocumentCopy',
    path: '/dev/code-formatter',
    category: 'dev',
    tags: getTagsArray('home.tools.codeFormatter.tags')
  },
  {
    name: t('home.tools.markdownEditor.name'),
    description: t('home.tools.markdownEditor.description'),
    icon: 'Files',
    path: '/text/markdown-editor',
    category: 'text',
    tags: getTagsArray('home.tools.markdownEditor.tags')
  },
  {
    name: t('home.tools.fileDiff.name'),
    description: t('home.tools.fileDiff.description'),
    icon: 'Operation',
    path: '/dev/file-diff',
    category: 'dev',
    tags: getTagsArray('home.tools.fileDiff.tags')
  },
  {
    name: t('home.tools.colorPicker.name'),
    description: t('home.tools.colorPicker.description'),
    icon: 'Brush',
    path: '/dev/color-picker',
    category: 'dev',
    tags: getTagsArray('home.tools.colorPicker.tags')
  },
  {
    name: t('home.tools.iconGenerator.name'),
    description: t('home.tools.iconGenerator.description'),
    icon: 'Camera',
    path: '/dev/icon-generator',
    category: 'dev',
    tags: getTagsArray('home.tools.iconGenerator.tags')
  },

        {
          name: t('home.tools.cronTool.name'),
          description: t('home.tools.cronTool.description'),
          icon: 'Clock',
          path: '/dev/cron',
          category: 'dev',
          tags: getTagsArray('home.tools.cronTool.tags')
        },
        {
          name: t('home.tools.variableGenerator.name'),
          description: t('home.tools.variableGenerator.description'),
          icon: 'Document',
          path: '/dev/variable-generator',
          category: 'dev',
          tags: getTagsArray('home.tools.variableGenerator.tags'),
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },

        // 文档工具
        { name: t('home.tools.gitCommands.name'), description: t('home.tools.gitCommands.description'), icon: 'Document', path: '/docs/git', category: 'docs', tags: getTagsArray('home.tools.gitCommands.tags') },
        { name: t('home.tools.linuxCommands.name'), description: t('home.tools.linuxCommands.description'), icon: 'Monitor', path: '/docs/linux', category: 'docs', tags: getTagsArray('home.tools.linuxCommands.tags') },
        { name: t('home.tools.dockerCommands.name'), description: t('home.tools.dockerCommands.description'), icon: 'Box', path: '/docs/docker', category: 'docs', tags: getTagsArray('home.tools.dockerCommands.tags') },
        { name: t('home.tools.mysqlSyntax.name'), description: t('home.tools.mysqlSyntax.description'), icon: 'DataAnalysis', path: '/docs/mysql', category: 'docs', tags: getTagsArray('home.tools.mysqlSyntax.tags') },
        { name: t('home.tools.javaSyntax.name'), description: t('home.tools.javaSyntax.description'), icon: 'Files', path: '/docs/java', category: 'docs', tags: getTagsArray('home.tools.javaSyntax.tags'), color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
        
        // 娱乐工具
        { name: t('home.tools.piano.name'), description: t('home.tools.piano.description'), icon: 'VideoPlay', path: '/entertainment/piano', category: 'entertainment', tags: getTagsArray('home.tools.piano.tags'), color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
        { name: t('home.tools.snakeGame.name'), description: t('home.tools.snakeGame.description'), icon: 'Trophy', path: '/entertainment/snake', category: 'entertainment', tags: getTagsArray('home.tools.snakeGame.tags'), color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { name: t('home.tools.quoteGenerator.name'), description: t('home.tools.quoteGenerator.description'), icon: 'ChatLineRound', path: '/entertainment/quotes', category: 'entertainment', tags: getTagsArray('home.tools.quoteGenerator.tags'), color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { name: t('home.tools.numberPuzzle.name'), description: t('home.tools.numberPuzzle.description'), icon: 'Grid', path: '/entertainment/number-puzzle', category: 'entertainment', tags: getTagsArray('home.tools.numberPuzzle.tags'), color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
                  { name: t('home.tools.whackMole.name'), description: t('home.tools.whackMole.description'), icon: 'Pointer', path: '/entertainment/whack-mole', category: 'entertainment', tags: getTagsArray('home.tools.whackMole.tags'), color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
          { name: t('home.tools.game2048.name'), description: t('home.tools.game2048.description'), icon: 'Grid', path: '/entertainment/2048', category: 'entertainment', tags: getTagsArray('home.tools.game2048.tags'), color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { name: t('home.tools.tetris.name'), description: t('home.tools.tetris.description'), icon: 'Grid', path: '/entertainment/tetris', category: 'entertainment', tags: getTagsArray('home.tools.tetris.tags'), color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { name: t('home.tools.flappyBird.name'), description: t('home.tools.flappyBird.description'), icon: 'Promotion', path: '/entertainment/flappy-bird', category: 'entertainment', tags: getTagsArray('home.tools.flappyBird.tags'), color: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)' },
        { name: t('home.tools.gemCrush.name'), description: t('home.tools.gemCrush.description'), icon: 'Guide', path: '/entertainment/gem-crush', category: 'entertainment', tags: getTagsArray('home.tools.gemCrush.tags'), color: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' },
        
        // 实用工具
        { name: t('home.tools.bmiCalculator.name'), description: t('home.tools.bmiCalculator.description'), icon: 'DataAnalysis', path: '/utility/bmi-calculator', category: 'utility', tags: getTagsArray('home.tools.bmiCalculator.tags'), color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
        { name: t('home.tools.mortgageCalculator.name'), description: t('home.tools.mortgageCalculator.description'), icon: 'Money', path: '/utility/mortgage-calculator', category: 'utility', tags: getTagsArray('home.tools.mortgageCalculator.tags'), color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { name: t('home.tools.ageCalculator.name'), description: t('home.tools.ageCalculator.description'), icon: 'Calendar', path: '/utility/age-calculator', category: 'utility', tags: getTagsArray('home.tools.ageCalculator.tags'), color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' },
        
        // 教师工具
        { name: t('home.tools.classroomSeating.name'), description: t('home.tools.classroomSeating.description'), icon: 'School', path: '/utility/classroom-seating', category: 'utility', tags: getTagsArray('home.tools.classroomSeating.tags'), color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
        { name: t('home.tools.studentRollCall.name'), description: t('home.tools.studentRollCall.description'), icon: 'Bell', path: '/utility/student-rollcall', category: 'utility', tags: getTagsArray('home.tools.studentRollCall.tags'), color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }
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
