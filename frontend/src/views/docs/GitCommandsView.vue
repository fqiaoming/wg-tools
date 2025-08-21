<template>
  <div class="git-commands">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Files /></el-icon>
        </div>
        <h1 class="hero-title">Git 常用命令</h1>
        <p class="hero-description">Git版本控制系统的常用命令和使用场景，帮助您高效管理代码版本</p>
      </div>
    </div>

    <!-- 返回顶部按钮 -->
    <el-backtop :right="80" :bottom="80" :visibility-height="200">
      <div class="back-to-top">
        <el-icon><CaretTop /></el-icon>
      </div>
    </el-backtop>
    
    <!-- 侧边浮动导航 -->
    <div class="floating-nav" :class="{ 'collapsed': navCollapsed }">
      <div class="nav-header">
        <h4>快速导航</h4>
        <el-button @click="navCollapsed = !navCollapsed" type="text" size="small">
          <el-icon><ArrowLeft v-if="!navCollapsed" /><ArrowRight v-else /></el-icon>
        </el-button>
      </div>
      
      <div class="nav-content" v-show="!navCollapsed">
        <div class="nav-section">
          <h5><el-icon><Lightning /></el-icon>常见场景</h5>
          <div class="nav-item" @click="scrollToScenario('conflict-resolution')">
            <el-icon><WarningFilled /></el-icon>
            <span>代码冲突</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('undo-operations')">
            <el-icon><RefreshLeft /></el-icon>
            <span>撤销操作</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('branch-management')">
            <el-icon><Share /></el-icon>
            <span>分支管理</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('history-viewing')">
            <el-icon><View /></el-icon>
            <span>历史查看</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('hotfix-flow')">
            <el-icon><Timer /></el-icon>
            <span>紧急修复</span>
          </div>
        </div>
        
        <div class="nav-section">
          <h5><el-icon><List /></el-icon>基础命令</h5>
          <div class="nav-item" @click="scrollToElement('commands-list')">
            <el-icon><Document /></el-icon>
            <span>命令列表</span>
          </div>
          <div class="nav-item" @click="scrollToElement('quick-reference')">
            <el-icon><Star /></el-icon>
            <span>快速参考</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tool-card">
<!--      <div class="card-header">-->
<!--        <el-icon class="icon"><Document /></el-icon>-->
<!--        <div>-->
<!--          <h2 class="title">Git 常用命令</h2>-->
<!--          <p class="description">Git 版本控制常用命令参考手册</p>-->
<!--        </div>-->
<!--      </div>-->

      <div class="card-body">
        <!-- 移动端快速导航 -->
        <div class="mobile-nav">
          <h5>🚀 快速跳转</h5>
          <div class="mobile-nav-items">
            <div class="mobile-nav-item" @click="scrollToScenario('conflict-resolution')">代码冲突</div>
            <div class="mobile-nav-item" @click="scrollToScenario('undo-operations')">撤销操作</div>
            <div class="mobile-nav-item" @click="scrollToScenario('branch-management')">分支管理</div>
            <div class="mobile-nav-item" @click="scrollToElement('commands-list')">命令列表</div>
            <div class="mobile-nav-item" @click="scrollToElement('quick-reference')">快速参考</div>
          </div>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="🔍 搜索命令、描述、场景... (试试搜索'冲突'、'分支'、'撤销')"
            size="large"
            clearable
          >
            <template #prepend>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <!-- 搜索建议标签 -->
          <div v-if="!searchQuery" class="search-suggestions">
            <span class="suggestion-label">💡 热门搜索：</span>
            <el-tag 
              v-for="suggestion in searchSuggestions" 
              :key="suggestion"
              @click="searchQuery = suggestion"
              class="suggestion-tag"
              type="info"
              effect="plain"
            >
              {{ suggestion }}
            </el-tag>
          </div>
          
          <!-- 快捷键提示 -->
          <div v-if="!searchQuery" class="keyboard-shortcuts">
            <span class="shortcut-label">⌨️ 快捷键：</span>
            <span class="shortcut-item">Ctrl+K 搜索</span>
            <span class="shortcut-item">F1 冲突解决</span>
            <span class="shortcut-item">F2 命令列表</span>
            <span class="shortcut-item">ESC 清空</span>
          </div>
          
          <!-- 搜索结果统计 -->
          <div v-if="searchQuery && filteredCommands.length > 0" class="search-stats">
            <el-icon><Star /></el-icon>
            找到 <strong>{{ filteredCommands.length }}</strong> 个相关结果
          </div>
          <div v-else-if="searchQuery && filteredCommands.length === 0" class="search-stats no-results">
            <el-icon><WarningFilled /></el-icon>
            没有找到相关结果，试试其他关键词
          </div>
        </div>

        <!-- 分类标签 -->
        <div class="category-tabs">
          <el-tag
            v-for="category in categories"
            :key="category.key"
            :type="activeCategory === category.key ? 'primary' : ''"
            @click="activeCategory = category.key"
            style="cursor: pointer; margin-right: 8px; margin-bottom: 8px;"
          >
            {{ category.name }}
          </el-tag>
        </div>

        <!-- 场景快捷按钮 -->
        <div class="scenario-shortcuts">
          <h4><el-icon><Lightning /></el-icon>常见场景快速入口</h4>
          <div class="shortcuts-grid">
            <div class="shortcut-item" @click="scrollToScenario('conflict-resolution')">
              <el-icon><WarningFilled /></el-icon>
              <span>代码冲突解决</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('undo-operations')">
              <el-icon><RefreshLeft /></el-icon>
              <span>撤销操作</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('branch-management')">
              <el-icon><Share /></el-icon>
              <span>分支管理</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('history-viewing')">
              <el-icon><View /></el-icon>
              <span>历史查看</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('hotfix-flow')">
              <el-icon><Timer /></el-icon>
              <span>紧急修复</span>
            </div>
          </div>
        </div>

        <!-- 命令列表 -->
        <div id="commands-list" class="commands-list">
          <div
            v-for="command in filteredCommands"
            :key="command.command"
            class="command-item"
          >
            <div class="command-header">
              <div class="command-name">
                <code>{{ command.command }}</code>
                <el-tag size="small" :type="getCategoryType(command.category)">
                  {{ getCategoryName(command.category) }}
                </el-tag>
              </div>
              <el-button @click="copyCommand(command.command)" size="small" type="primary" plain>
                <el-icon><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
            <div class="command-description">{{ command.description }}</div>
            <div v-if="command.examples" class="command-examples">
              <h5>示例：</h5>
              <div
                v-for="(example, index) in command.examples"
                :key="index"
                class="example-item"
              >
                <code>{{ example.command }}</code>
                <span class="example-desc">{{ example.description }}</span>
              </div>
            </div>
            <div v-if="command.options" class="command-options">
              <h5>常用选项：</h5>
              <div class="options-grid">
                <div
                  v-for="option in command.options"
                  :key="option.flag"
                  class="option-item"
                >
                  <code>{{ option.flag }}</code>
                  <span>{{ option.description }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常见场景解决方案 -->
        <div class="scenarios-section">
          <h4><el-icon><TrendCharts /></el-icon>常见场景解决方案</h4>
          
          <div id="conflict-resolution" class="scenario-group">
            <h5 class="scenario-title">🔥 代码冲突解决</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>git status</code>
                  <span>查看冲突文件</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>git diff</code>
                  <span>查看具体冲突内容</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <span class="step-desc">手动编辑冲突文件，保留需要的代码，删除冲突标记（&lt;&lt;&lt;&lt;&lt;&lt;&lt;, =======, &gt;&gt;&gt;&gt;&gt;&gt;&gt;）</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <code>git add conflicted-file.js</code>
                  <span>标记冲突已解决</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <code>git commit -m "解决代码冲突"</code>
                  <span>提交合并结果</span>
                </div>
              </div>
            </div>
          </div>

          <div id="undo-operations" class="scenario-group">
            <h5 class="scenario-title">↩️ 撤销操作</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>撤销工作区修改</h6>
                <code>git checkout -- filename</code>
                <span>恢复文件到最后提交状态</span>
              </div>
              <div class="scenario-item">
                <h6>撤销暂存区文件</h6>
                <code>git reset HEAD filename</code>
                <span>将文件从暂存区移除</span>
              </div>
              <div class="scenario-item">
                <h6>撤销最后一次提交</h6>
                <code>git reset --soft HEAD~1</code>
                <span>保留更改，仅撤销提交</span>
              </div>
              <div class="scenario-item">
                <h6>强制撤销提交</h6>
                <code>git reset --hard HEAD~1</code>
                <span>⚠️ 完全删除最后一次提交</span>
              </div>
            </div>
          </div>

          <div id="branch-management" class="scenario-group">
            <h5 class="scenario-title">🌿 分支管理常见操作</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>创建并切换分支</h6>
                <code>git checkout -b feature/new-feature</code>
                <span>从当前分支创建新分支</span>
              </div>
              <div class="scenario-item">
                <h6>合并分支</h6>
                <code>git checkout main && git merge feature/new-feature</code>
                <span>将功能分支合并到主分支</span>
              </div>
              <div class="scenario-item">
                <h6>删除远程分支</h6>
                <code>git push origin --delete feature/old-feature</code>
                <span>删除远程仓库的分支</span>
              </div>
              <div class="scenario-item">
                <h6>查看分支历史</h6>
                <code>git log --oneline --graph --all</code>
                <span>图形化查看所有分支历史</span>
              </div>
            </div>
          </div>

          <div id="history-viewing" class="scenario-group">
            <h5 class="scenario-title">🔍 历史查看与比较</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>查看某个文件的修改历史</h6>
                <code>git log -p filename</code>
                <span>查看文件的详细修改记录</span>
              </div>
              <div class="scenario-item">
                <h6>查看两个提交之间的差异</h6>
                <code>git diff commit1..commit2</code>
                <span>比较两个提交的差异</span>
              </div>
              <div class="scenario-item">
                <h6>查看谁修改了某行代码</h6>
                <code>git blame filename</code>
                <span>查看每行代码的最后修改者</span>
              </div>
              <div class="scenario-item">
                <h6>搜索提交信息</h6>
                <code>git log --grep="bug fix"</code>
                <span>搜索包含特定关键词的提交</span>
              </div>
            </div>
          </div>

          <div id="hotfix-flow" class="scenario-group">
            <h5 class="scenario-title">🚑 紧急修复流程</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>git stash</code>
                  <span>保存当前工作进度</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>git checkout main</code>
                  <span>切换到主分支</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <code>git checkout -b hotfix/urgent-bug</code>
                  <span>创建紧急修复分支</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <span class="step-desc">修复bug并提交</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <code>git checkout main && git merge hotfix/urgent-bug</code>
                  <span>合并修复到主分支</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">6</div>
                <div class="step-content">
                  <code>git stash pop</code>
                  <span>恢复之前的工作进度</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速参考 -->
        <div id="quick-reference" class="quick-reference">
          <h4><el-icon><Star /></el-icon>快速参考</h4>
          <div class="reference-grid">
            <div class="reference-item">
              <h5>初始化仓库</h5>
              <code>git init</code>
            </div>
            <div class="reference-item">
              <h5>克隆仓库</h5>
              <code>git clone [url]</code>
            </div>
            <div class="reference-item">
              <h5>查看状态</h5>
              <code>git status</code>
            </div>
            <div class="reference-item">
              <h5>添加文件</h5>
              <code>git add .</code>
            </div>
            <div class="reference-item">
              <h5>提交更改</h5>
              <code>git commit -m "message"</code>
            </div>
            <div class="reference-item">
              <h5>推送到远程</h5>
              <code>git push origin main</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Search,
  CopyDocument,
  Star,
  TrendCharts,
  Lightning,
  WarningFilled,
  RefreshLeft,
  Share,
  View,
  Timer,
  ArrowLeft,
  ArrowRight,
  List,
  CaretTop
} from '@element-plus/icons-vue'

const searchQuery = ref('')
const activeCategory = ref('all')
const navCollapsed = ref(false)

// 搜索建议
const searchSuggestions = ref(['冲突', '分支', '撤销', '合并', '提交', '推送'])

const categories = [
  { key: 'all', name: '全部' },
  { key: 'basic', name: '基础操作' },
  { key: 'branch', name: '分支管理' },
  { key: 'remote', name: '远程仓库' },
  { key: 'history', name: '历史查看' },
  { key: 'config', name: '配置管理' }
]

const commands = [
  {
    command: 'git init',
    category: 'basic',
    description: '在当前目录初始化一个新的Git仓库',
    examples: [
      { command: 'git init', description: '初始化当前目录' },
      { command: 'git init my-project', description: '创建并初始化新目录' }
    ]
  },
  {
    command: 'git clone',
    category: 'basic',
    description: '从远程仓库克隆代码到本地',
    examples: [
      { command: 'git clone https://github.com/user/repo.git', description: '克隆远程仓库' },
      { command: 'git clone https://github.com/user/repo.git my-folder', description: '克隆到指定文件夹' }
    ]
  },
  {
    command: 'git add',
    category: 'basic',
    description: '将文件添加到暂存区',
    examples: [
      { command: 'git add .', description: '添加所有文件' },
      { command: 'git add filename.txt', description: '添加指定文件' },
      { command: 'git add *.js', description: '添加所有JS文件' }
    ]
  },
  {
    command: 'git commit',
    category: 'basic',
    description: '提交暂存区的更改到本地仓库',
    examples: [
      { command: 'git commit -m "提交信息"', description: '提交并添加信息' },
      { command: 'git commit -am "提交信息"', description: '添加并提交所有已跟踪文件' }
    ],
    options: [
      { flag: '-m', description: '添加提交信息' },
      { flag: '-a', description: '自动添加已跟踪的文件' },
      { flag: '--amend', description: '修改最后一次提交' }
    ]
  },
  {
    command: 'git status',
    category: 'basic',
    description: '查看工作区和暂存区的状态',
    examples: [
      { command: 'git status', description: '查看详细状态' },
      { command: 'git status -s', description: '查看简洁状态' }
    ]
  },
  {
    command: 'git branch',
    category: 'branch',
    description: '分支管理命令',
    examples: [
      { command: 'git branch', description: '查看本地分支' },
      { command: 'git branch new-feature', description: '创建新分支' },
      { command: 'git branch -d feature-name', description: '删除分支' }
    ],
    options: [
      { flag: '-a', description: '查看所有分支（包括远程）' },
      { flag: '-d', description: '删除分支' },
      { flag: '-D', description: '强制删除分支' }
    ]
  },
  {
    command: 'git checkout',
    category: 'branch',
    description: '切换分支或恢复文件',
    examples: [
      { command: 'git checkout main', description: '切换到main分支' },
      { command: 'git checkout -b new-feature', description: '创建并切换到新分支' },
      { command: 'git checkout -- filename.txt', description: '恢复文件到最后提交状态' }
    ]
  },
  {
    command: 'git merge',
    category: 'branch',
    description: '合并分支',
    examples: [
      { command: 'git merge feature-branch', description: '合并feature-branch到当前分支' },
      { command: 'git merge --no-ff feature-branch', description: '禁用快进合并' }
    ]
  },
  {
    command: 'git push',
    category: 'remote',
    description: '推送本地更改到远程仓库',
    examples: [
      { command: 'git push origin main', description: '推送main分支到origin' },
      { command: 'git push -u origin main', description: '首次推送并设置上游' },
      { command: 'git push --all origin', description: '推送所有分支' }
    ]
  },
  {
    command: 'git pull',
    category: 'remote',
    description: '从远程仓库拉取并合并更改',
    examples: [
      { command: 'git pull', description: '拉取当前分支的远程更改' },
      { command: 'git pull origin main', description: '拉取origin的main分支' }
    ]
  },
  {
    command: 'git fetch',
    category: 'remote',
    description: '从远程仓库获取最新信息',
    examples: [
      { command: 'git fetch', description: '获取所有远程分支信息' },
      { command: 'git fetch origin', description: '获取origin远程仓库信息' }
    ]
  },
  {
    command: 'git log',
    category: 'history',
    description: '查看提交历史',
    examples: [
      { command: 'git log', description: '查看详细提交历史' },
      { command: 'git log --oneline', description: '查看简洁提交历史' },
      { command: 'git log --graph', description: '图形化显示分支历史' }
    ]
  },
  {
    command: 'git diff',
    category: 'history',
    description: '查看文件差异',
    examples: [
      { command: 'git diff', description: '查看工作区与暂存区差异' },
      { command: 'git diff --cached', description: '查看暂存区与最后提交差异' },
      { command: 'git diff HEAD~1', description: '与上一次提交比较' }
    ]
  },
  {
    command: 'git config',
    category: 'config',
    description: '配置Git设置',
    examples: [
      { command: 'git config --global user.name "Your Name"', description: '设置全局用户名' },
      { command: 'git config --global user.email "your@email.com"', description: '设置全局邮箱' },
      { command: 'git config --list', description: '查看所有配置' }
    ]
  }
]

const filteredCommands = computed(() => {
  let filtered = commands
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(cmd => cmd.category === activeCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(cmd => 
      cmd.command.toLowerCase().includes(query) ||
      cmd.description.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const getCategoryName = (category: string) => {
  return categories.find(c => c.key === category)?.name || category
}

const getCategoryType = (category: string) => {
  const types: Record<string, string> = {
    basic: 'primary',
    branch: 'success',
    remote: 'warning',
    history: 'info',
    config: 'danger'
  }
  return types[category] || ''
}

const copyCommand = async (command: string) => {
  try {
    await navigator.clipboard.writeText(command)
    ElMessage.success('命令已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

const scrollToScenario = (scenarioId: string) => {
  const element = document.getElementById(scenarioId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    // 添加高亮效果
    element.style.animation = 'highlight 2s ease-in-out'
    setTimeout(() => {
      element.style.animation = ''
    }, 2000)
  }
}

const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
    // 添加高亮效果
    element.style.animation = 'highlight 2s ease-in-out'
    setTimeout(() => {
      element.style.animation = ''
    }, 2000)
  }
}

// 键盘快捷键处理
const handleKeyboardShortcuts = (event: KeyboardEvent) => {
  // Ctrl/Cmd + K 快速搜索
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    const searchInput = document.querySelector('.search-section input') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
    }
  }
  
  // ESC 清空搜索
  if (event.key === 'Escape') {
    searchQuery.value = ''
  }
  
  // F1 快速跳转到冲突解决
  if (event.key === 'F1') {
    event.preventDefault()
    scrollToScenario('conflict-resolution')
  }
  
  // F2 快速跳转到命令列表
  if (event.key === 'F2') {
    event.preventDefault()
    scrollToElement('commands-list')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyboardShortcuts)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.git-commands {
  --tool-color: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tool-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.icon {
  font-size: 32px;
  margin-right: 16px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.description {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.card-body {
  padding: 24px;
}

.search-section {
  margin-bottom: 24px;
}

.search-suggestions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-label {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  margin-right: 8px;
}

.suggestion-tag {
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-tag:hover {
  background: #667eea !important;
  color: white !important;
  border-color: #667eea !important;
  transform: scale(1.05);
}

.search-stats {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f0f9ff;
  border-radius: 8px;
  color: #0369a1;
  font-size: 14px;
}

.search-stats.no-results {
  background: #fef2f2;
  color: #dc2626;
}

.search-stats strong {
  font-weight: 600;
}

.keyboard-shortcuts {
  margin-top: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.shortcut-label {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.shortcut-item {
  font-size: 12px;
  color: #475569;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
}

.category-tabs {
  margin-bottom: 24px;
}

.commands-list {
  margin-bottom: 32px;
}

.command-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.command-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.command-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.command-name code {
  background: #1f2937;
  color: #10b981;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
}

.command-description {
  color: #4b5563;
  margin-bottom: 16px;
  line-height: 1.5;
}

.command-examples,
.command-options {
  margin-top: 16px;
}

.command-examples h5,
.command-options h5 {
  margin: 0 0 8px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #3b82f6;
}

.example-item code {
  background: #f1f5f9;
  color: #1e293b;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.example-desc {
  color: #6b7280;
  font-size: 12px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: white;
  border-radius: 4px;
}

.option-item code {
  background: #ddd6fe;
  color: #5b21b6;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
}

.quick-reference {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #0ea5e9;
}

.quick-reference h4 {
  margin: 0 0 16px 0;
  color: #0c4a6e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reference-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.reference-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #bae6fd;
}

.reference-item h5 {
  margin: 0 0 6px 0;
  color: #0c4a6e;
  font-size: 12px;
}

.reference-item code {
  background: #0c4a6e;
  color: #bae6fd;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  display: block;
}

/* 场景解决方案样式 */
.scenarios-section {
  background: #f0f9ff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
  border-left: 4px solid #0ea5e9;
}

.scenarios-section h4 {
  margin: 0 0 24px 0;
  color: #0c4a6e;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}

.scenario-group {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #bae6fd;
}

.scenario-title {
  margin: 0 0 16px 0;
  color: #0c4a6e;
  font-size: 16px;
  font-weight: 600;
}

.scenario-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-number {
  background: #0ea5e9;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-content code {
  background: #1f2937;
  color: #10b981;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  display: inline-block;
  margin-bottom: 4px;
}

.step-content span {
  color: #4b5563;
  font-size: 13px;
}

.step-desc {
  color: #374151 !important;
  font-style: italic;
  padding: 8px 12px;
  background: #f9fafb;
  border-left: 3px solid #0ea5e9;
  border-radius: 4px;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.scenario-item {
  background: #f8fafc;
  padding: 16px;
  border-radius: 6px;
  border-left: 3px solid #0ea5e9;
}

.scenario-item h6 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
}

.scenario-item code {
  background: #1f2937;
  color: #10b981;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  display: block;
  margin: 8px 0;
  word-break: break-all;
}

.scenario-item span {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

/* 场景快捷按钮样式 */
.scenario-shortcuts {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  color: white;
  position: relative;
  overflow: hidden;
}

.scenario-shortcuts::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.scenario-shortcuts h4 {
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  position: relative;
  z-index: 2;
}

.shortcut-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.shortcut-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.shortcut-item .el-icon {
  font-size: 24px;
  color: #ffffff;
}

.shortcut-item span {
  font-weight: 500;
  color: #ffffff;
}

/* 浮动导航样式 */
.floating-nav {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.2);
  z-index: 999;
  width: 280px;
  max-height: 70vh;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.floating-nav.collapsed {
  width: 60px;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.nav-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.nav-header .el-button {
  color: white !important;
  padding: 4px;
}

.nav-content {
  padding: 20px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section h5 {
  margin: 0 0 16px 0;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4b5563;
  font-size: 14px;
}

.nav-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(4px);
}

.nav-item .el-icon {
  font-size: 16px;
}

.nav-item:last-child {
  margin-bottom: 0;
}

/* 移动端快速导航样式 */
.mobile-nav {
  display: none;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.mobile-nav h5 {
  margin: 0 0 16px 0;
  color: #667eea;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-nav-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mobile-nav-item {
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.mobile-nav-item:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 高亮动画 */
@keyframes highlight {
  0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
  50% { box-shadow: 0 0 0 20px rgba(102, 126, 234, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .git-commands {
    padding: 16px;
  }
  
  .card-header {
    padding: 20px 16px;
  }
  
  .card-body {
    padding: 20px 16px;
  }
  
  /* 移动端显示快速导航，隐藏浮动导航 */
  .mobile-nav {
    display: block;
  }
  
  .floating-nav {
    display: none;
  }
  
  .command-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .example-item {
    flex-direction: column;
  }
  
  .reference-grid,
  .options-grid {
    grid-template-columns: 1fr;
  }
}

/* 返回顶部按钮样式 */
.back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-to-top:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.back-to-top .el-icon {
  font-size: 20px;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
