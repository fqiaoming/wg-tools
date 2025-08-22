<template>
  <div class="linux-commands">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Monitor /></el-icon>
        </div>
        <h1 class="hero-title">Linux 常用命令</h1>
        <p class="hero-description">Linux系统管理和运维必备命令，涵盖文件操作、系统监控、网络管理等</p>
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
          <h5><el-icon><Lightning /></el-icon>系统运维</h5>
          <div class="nav-item" @click="scrollToScenario('disk-cleanup')">
            <el-icon><FolderDelete /></el-icon>
            <span>磁盘清理</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('performance-monitoring')">
            <el-icon><Monitor /></el-icon>
            <span>性能监控</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('troubleshooting')">
            <el-icon><Warning /></el-icon>
            <span>故障排查</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('log-management')">
            <el-icon><Document /></el-icon>
            <span>日志管理</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('user-management')">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </div>
          <div class="nav-item" @click="scrollToScenario('network-diagnostics')">
            <el-icon><Connection /></el-icon>
            <span>网络诊断</span>
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
<!--        <el-icon class="icon"><Monitor /></el-icon>-->
<!--        <div>-->
<!--          <h2 class="title">Linux 常用命令</h2>-->
<!--          <p class="description">Linux 系统管理和操作常用命令参考手册</p>-->
<!--        </div>-->
<!--      </div>-->

      <div class="card-body">
        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索命令或描述..."
            size="large"
            clearable
          >
            <template #prepend>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 分类标签 -->
        <div class="category-tabs">
          <el-tag
            v-for="category in categories"
            :key="category.key"
            :type="activeCategory === category.key ? 'primary' : undefined"
            @click="activeCategory = category.key"
            style="cursor: pointer; margin-right: 8px; margin-bottom: 8px;"
          >
            {{ category.name }}
          </el-tag>
        </div>

        <!-- 场景快捷按钮 -->
        <div class="scenario-shortcuts">
          <h4><el-icon><Lightning /></el-icon>系统运维快速入口</h4>
          <div class="shortcuts-grid">
            <div class="shortcut-item" @click="scrollToScenario('disk-cleanup')">
              <el-icon><FolderDelete /></el-icon>
              <span>磁盘清理</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('performance-monitoring')">
              <el-icon><Monitor /></el-icon>
              <span>性能监控</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('troubleshooting')">
              <el-icon><Warning /></el-icon>
              <span>故障排查</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('log-management')">
              <el-icon><Document /></el-icon>
              <span>日志管理</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('user-management')">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </div>
            <div class="shortcut-item" @click="scrollToScenario('network-diagnosis')">
              <el-icon><Connection /></el-icon>
              <span>网络诊断</span>
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

        <!-- 系统运维场景 -->
        <div class="scenarios-section">
          <h4><el-icon><TrendCharts /></el-icon>系统运维场景</h4>
          
          <div id="disk-cleanup" class="scenario-group">
            <h5 class="scenario-title">💾 服务器磁盘满了处理流程</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>df -h</code>
                  <span>查看各分区磁盘使用情况</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>du -sh /* | sort -hr</code>
                  <span>查看根目录下各文件夹大小并排序</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <code>find /var/log -name "*.log" -size +100M</code>
                  <span>查找大于100M的日志文件</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <code>find /tmp -type f -mtime +7 -delete</code>
                  <span>删除7天前的临时文件</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <code>journalctl --vacuum-time=7d</code>
                  <span>清理7天前的系统日志</span>
                </div>
              </div>
            </div>
          </div>

          <div id="performance-monitoring" class="scenario-group">
            <h5 class="scenario-title">🔍 系统性能监控</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>CPU使用率监控</h6>
                <code>top -p $(pgrep java)</code>
                <span>监控Java进程CPU使用情况</span>
              </div>
              <div class="scenario-item">
                <h6>内存使用分析</h6>
                <code>free -h && cat /proc/meminfo</code>
                <span>查看内存详细使用情况</span>
              </div>
              <div class="scenario-item">
                <h6>磁盘IO监控</h6>
                <code>iostat -x 1</code>
                <span>实时监控磁盘IO性能</span>
              </div>
              <div class="scenario-item">
                <h6>网络连接查看</h6>
                <code>netstat -tunlp | grep :80</code>
                <span>查看80端口监听情况</span>
              </div>
            </div>
          </div>

          <div id="troubleshooting" class="scenario-group">
            <h5 class="scenario-title">🚨 故障排查常用命令</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>查看系统负载</h6>
                <code>uptime && w</code>
                <span>查看系统负载和登录用户</span>
              </div>
              <div class="scenario-item">
                <h6>查看错误日志</h6>
                <code>tail -f /var/log/messages | grep -i error</code>
                <span>实时监控系统错误日志</span>
              </div>
              <div class="scenario-item">
                <h6>查看进程资源占用</h6>
                <code>ps aux --sort=-%cpu | head -10</code>
                <span>查看CPU占用最高的10个进程</span>
              </div>
              <div class="scenario-item">
                <h6>查看端口占用</h6>
                <code>lsof -i :8080</code>
                <span>查看8080端口被哪个进程占用</span>
              </div>
            </div>
          </div>

          <div id="log-management" class="scenario-group">
            <h5 class="scenario-title">📁 日志文件管理</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>find /var/log -name "*.log" -size +50M -exec ls -lh {} \;</code>
                  <span>查找大于50M的日志文件</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>gzip /var/log/app.log.$(date +%Y%m%d)</code>
                  <span>压缩旧日志文件</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <code>echo "" > /var/log/large.log</code>
                  <span>清空大日志文件（保持文件句柄）</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <code>logrotate -f /etc/logrotate.conf</code>
                  <span>强制执行日志轮转</span>
                </div>
              </div>
            </div>
          </div>

          <div id="user-management" class="scenario-group">
            <h5 class="scenario-title">👤 用户和权限管理</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>创建新用户</h6>
                <code>useradd -m -s /bin/bash newuser</code>
                <span>创建有home目录的新用户</span>
              </div>
              <div class="scenario-item">
                <h6>修改用户密码</h6>
                <code>passwd newuser</code>
                <span>为指定用户设置密码</span>
              </div>
              <div class="scenario-item">
                <h6>添加用户到sudo组</h6>
                <code>usermod -aG sudo newuser</code>
                <span>给用户sudo权限</span>
              </div>
              <div class="scenario-item">
                <h6>查看用户登录历史</h6>
                <code>last -n 10</code>
                <span>查看最近10次登录记录</span>
              </div>
            </div>
          </div>

          <div id="network-diagnostics" class="scenario-group">
            <h5 class="scenario-title">🌐 网络诊断</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>测试网络连通性</h6>
                <code>ping -c 4 8.8.8.8</code>
                <span>测试到Google DNS的连通性</span>
              </div>
              <div class="scenario-item">
                <h6>查看路由表</h6>
                <code>ip route show</code>
                <span>显示系统路由表</span>
              </div>
              <div class="scenario-item">
                <h6>查看网络接口</h6>
                <code>ip addr show</code>
                <span>显示所有网络接口信息</span>
              </div>
              <div class="scenario-item">
                <h6>查看DNS解析</h6>
                <code>nslookup google.com</code>
                <span>查看域名DNS解析结果</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速参考 -->
        <div id="quick-reference" class="quick-reference">
          <h4><el-icon><Star /></el-icon>快速参考</h4>
          <div class="reference-grid">
            <div class="reference-item">
              <h5>查看目录</h5>
              <code>ls -la</code>
            </div>
            <div class="reference-item">
              <h5>切换目录</h5>
              <code>cd /path/to/dir</code>
            </div>
            <div class="reference-item">
              <h5>查看文件</h5>
              <code>cat filename</code>
            </div>
            <div class="reference-item">
              <h5>复制文件</h5>
              <code>cp source dest</code>
            </div>
            <div class="reference-item">
              <h5>移动文件</h5>
              <code>mv old new</code>
            </div>
            <div class="reference-item">
              <h5>删除文件</h5>
              <code>rm filename</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Monitor,
  Search,
  CopyDocument,
  Star,
  TrendCharts,
  Lightning,
  FolderDelete,
  Warning,
  Document,
  User,
  Connection,
  ArrowLeft,
  ArrowRight,
  List,
  CaretTop
} from '@element-plus/icons-vue'

const searchQuery = ref('')
const activeCategory = ref('all')
const navCollapsed = ref(false)

const categories = [
  { key: 'all', name: '全部' },
  { key: 'file', name: '文件操作' },
  { key: 'system', name: '系统信息' },
  { key: 'process', name: '进程管理' },
  { key: 'network', name: '网络工具' },
  { key: 'text', name: '文本处理' },
  { key: 'permission', name: '权限管理' }
]

const commands = [
  {
    command: 'ls',
    category: 'file',
    description: '列出目录内容',
    examples: [
      { command: 'ls', description: '列出当前目录内容' },
      { command: 'ls -la', description: '详细列出所有文件（包括隐藏文件）' },
      { command: 'ls -lh', description: '以人类可读格式显示文件大小' }
    ],
    options: [
      { flag: '-l', description: '详细格式' },
      { flag: '-a', description: '显示隐藏文件' },
      { flag: '-h', description: '人类可读的文件大小' },
      { flag: '-t', description: '按修改时间排序' }
    ]
  },
  {
    command: 'cd',
    category: 'file',
    description: '切换工作目录',
    examples: [
      { command: 'cd /home/user', description: '切换到指定目录' },
      { command: 'cd ..', description: '返回上级目录' },
      { command: 'cd ~', description: '返回用户主目录' },
      { command: 'cd -', description: '返回上一个工作目录' }
    ]
  },
  {
    command: 'pwd',
    category: 'file',
    description: '显示当前工作目录路径',
    examples: [
      { command: 'pwd', description: '显示当前目录的完整路径' }
    ]
  },
  {
    command: 'mkdir',
    category: 'file',
    description: '创建目录',
    examples: [
      { command: 'mkdir newdir', description: '创建新目录' },
      { command: 'mkdir -p path/to/dir', description: '递归创建目录' }
    ],
    options: [
      { flag: '-p', description: '递归创建父目录' },
      { flag: '-m', description: '设置目录权限' }
    ]
  },
  {
    command: 'rmdir',
    category: 'file',
    description: '删除空目录',
    examples: [
      { command: 'rmdir dirname', description: '删除空目录' },
      { command: 'rmdir -p path/to/dir', description: '递归删除空目录' }
    ]
  },
  {
    command: 'rm',
    category: 'file',
    description: '删除文件和目录',
    examples: [
      { command: 'rm filename', description: '删除文件' },
      { command: 'rm -rf dirname', description: '强制递归删除目录' },
      { command: 'rm *.txt', description: '删除所有txt文件' }
    ],
    options: [
      { flag: '-r', description: '递归删除目录' },
      { flag: '-f', description: '强制删除，不提示' },
      { flag: '-i', description: '交互式删除，确认每个文件' }
    ]
  },
  {
    command: 'cp',
    category: 'file',
    description: '复制文件或目录',
    examples: [
      { command: 'cp source dest', description: '复制文件' },
      { command: 'cp -r sourcedir destdir', description: '递归复制目录' },
      { command: 'cp *.txt backup/', description: '复制所有txt文件到backup目录' }
    ],
    options: [
      { flag: '-r', description: '递归复制目录' },
      { flag: '-p', description: '保持文件属性' },
      { flag: '-i', description: '交互式复制，覆盖前确认' }
    ]
  },
  {
    command: 'mv',
    category: 'file',
    description: '移动或重命名文件',
    examples: [
      { command: 'mv oldname newname', description: '重命名文件' },
      { command: 'mv file /path/to/dest', description: '移动文件' },
      { command: 'mv *.log logs/', description: '移动所有log文件' }
    ]
  },
  {
    command: 'cat',
    category: 'text',
    description: '显示文件内容',
    examples: [
      { command: 'cat filename', description: '显示文件内容' },
      { command: 'cat file1 file2', description: '连接显示多个文件' },
      { command: 'cat > newfile', description: '创建新文件并输入内容' }
    ]
  },
  {
    command: 'less',
    category: 'text',
    description: '分页查看文件内容',
    examples: [
      { command: 'less filename', description: '分页查看文件' },
      { command: 'less +G filename', description: '从文件末尾开始查看' }
    ]
  },
  {
    command: 'head',
    category: 'text',
    description: '显示文件开头部分',
    examples: [
      { command: 'head filename', description: '显示前10行' },
      { command: 'head -n 20 filename', description: '显示前20行' }
    ]
  },
  {
    command: 'tail',
    category: 'text',
    description: '显示文件结尾部分',
    examples: [
      { command: 'tail filename', description: '显示后10行' },
      { command: 'tail -f logfile', description: '实时监控文件变化' },
      { command: 'tail -n 50 filename', description: '显示后50行' }
    ]
  },
  {
    command: 'grep',
    category: 'text',
    description: '在文件中搜索文本',
    examples: [
      { command: 'grep "pattern" filename', description: '在文件中搜索模式' },
      { command: 'grep -r "pattern" directory', description: '递归搜索目录' },
      { command: 'grep -i "pattern" filename', description: '忽略大小写搜索' }
    ],
    options: [
      { flag: '-i', description: '忽略大小写' },
      { flag: '-r', description: '递归搜索' },
      { flag: '-n', description: '显示行号' },
      { flag: '-v', description: '反向匹配' }
    ]
  },
  {
    command: 'find',
    category: 'text',
    description: '查找文件和目录',
    examples: [
      { command: 'find . -name "*.txt"', description: '查找txt文件' },
      { command: 'find /path -type f -size +100M', description: '查找大于100M的文件' },
      { command: 'find . -mtime -7', description: '查找7天内修改的文件' }
    ]
  },
  {
    command: 'ps',
    category: 'process',
    description: '显示运行中的进程',
    examples: [
      { command: 'ps aux', description: '显示所有进程详细信息' },
      { command: 'ps -ef', description: '显示所有进程' },
      { command: 'ps aux | grep nginx', description: '查找nginx进程' }
    ]
  },
  {
    command: 'top',
    category: 'process',
    description: '实时显示系统进程信息',
    examples: [
      { command: 'top', description: '实时监控系统进程' },
      { command: 'top -p 1234', description: '监控指定进程' }
    ]
  },
  {
    command: 'kill',
    category: 'process',
    description: '终止进程',
    examples: [
      { command: 'kill 1234', description: '终止PID为1234的进程' },
      { command: 'kill -9 1234', description: '强制终止进程' },
      { command: 'killall nginx', description: '终止所有nginx进程' }
    ]
  },
  {
    command: 'chmod',
    category: 'permission',
    description: '修改文件权限',
    examples: [
      { command: 'chmod 755 filename', description: '设置文件权限为755' },
      { command: 'chmod +x script.sh', description: '添加执行权限' },
      { command: 'chmod -R 644 directory', description: '递归设置目录权限' }
    ]
  },
  {
    command: 'chown',
    category: 'permission',
    description: '修改文件所有者',
    examples: [
      { command: 'chown user:group filename', description: '修改文件所有者和组' },
      { command: 'chown -R user directory', description: '递归修改目录所有者' }
    ]
  },
  {
    command: 'df',
    category: 'system',
    description: '显示磁盘空间使用情况',
    examples: [
      { command: 'df -h', description: '以人类可读格式显示磁盘使用' },
      { command: 'df -i', description: '显示inode使用情况' }
    ]
  },
  {
    command: 'du',
    category: 'system',
    description: '显示目录空间使用情况',
    examples: [
      { command: 'du -h', description: '显示当前目录使用情况' },
      { command: 'du -sh *', description: '显示当前目录下各文件/目录大小' }
    ]
  },
  {
    command: 'free',
    category: 'system',
    description: '显示内存使用情况',
    examples: [
      { command: 'free -h', description: '以人类可读格式显示内存' },
      { command: 'free -m', description: '以MB为单位显示内存' }
    ]
  },
  {
    command: 'uname',
    category: 'system',
    description: '显示系统信息',
    examples: [
      { command: 'uname -a', description: '显示所有系统信息' },
      { command: 'uname -r', description: '显示内核版本' }
    ]
  },
  {
    command: 'ping',
    category: 'network',
    description: '测试网络连接',
    examples: [
      { command: 'ping google.com', description: '测试到google的连接' },
      { command: 'ping -c 4 8.8.8.8', description: 'ping 4次后停止' }
    ]
  },
  {
    command: 'wget',
    category: 'network',
    description: '下载文件',
    examples: [
      { command: 'wget http://example.com/file.zip', description: '下载文件' },
      { command: 'wget -O newname.zip http://example.com/file.zip', description: '下载并重命名' }
    ]
  },
  {
    command: 'curl',
    category: 'network',
    description: 'HTTP客户端工具',
    examples: [
      { command: 'curl http://example.com', description: '获取网页内容' },
      { command: 'curl -o file.html http://example.com', description: '下载并保存' },
      { command: 'curl -X POST -d "data" http://api.example.com', description: '发送POST请求' }
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

const getCategoryType = (category: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined => {
  const types: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    file: 'primary',
    system: 'success',
    process: 'warning',
    network: 'info',
    text: 'danger',
    permission: 'primary'
  }
  return types[category] || undefined
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
</script>

<style scoped>
@import '@/styles/modern-tool.css';

.linux-commands {
  --tool-color: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
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
  color: #34d399;
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
  border-left: 3px solid #10b981;
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
  background: #dcfce7;
  color: #166534;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
}

.quick-reference {
  background: #f0fdf4;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #10b981;
}

.quick-reference h4 {
  margin: 0 0 16px 0;
  color: #166534;
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
  border: 1px solid #bbf7d0;
}

.reference-item h5 {
  margin: 0 0 6px 0;
  color: #166534;
  font-size: 12px;
}

.reference-item code {
  background: #166534;
  color: #bbf7d0;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  display: block;
}

/* 场景解决方案样式 */
.scenarios-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 40px;
  border: 1px solid rgba(5, 150, 105, 0.2);
  box-shadow: 0 8px 25px rgba(5, 150, 105, 0.1);
  position: relative;
  overflow: hidden;
}

.scenarios-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #059669, #047857);
}

.scenarios-section h4 {
  margin: 0 0 24px 0;
  color: #065f46;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  position: relative;
  z-index: 2;
}

.scenario-group {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(5, 150, 105, 0.15);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.08);
  transition: all 0.3s ease;
}

.scenario-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(5, 150, 105, 0.15);
}

.scenario-title {
  margin: 0 0 20px 0;
  color: #065f46;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.scenario-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #059669;
}

.step-number {
  background: #059669;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-content code {
  background: #1f2937;
  color: #10b981;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 8px;
  word-break: break-all;
}

.step-content span {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.5;
}

.scenario-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.scenario-item {
  background: #f9fafb;
  padding: 20px;
  border-radius: 8px;
  border-left: 3px solid #059669;
  transition: all 0.3s ease;
}

.scenario-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.scenario-item h6 {
  margin: 0 0 12px 0;
  color: #065f46;
  font-size: 16px;
  font-weight: 600;
}

.scenario-item code {
  background: #1f2937;
  color: #10b981;
  padding: 6px 10px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  display: block;
  margin: 12px 0;
  word-break: break-all;
}

.scenario-item span {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
}

/* 场景快捷按钮样式 */
.scenario-shortcuts {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
  border: 1px solid rgba(5, 150, 105, 0.2);
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
  border-bottom: 1px solid rgba(5, 150, 105, 0.1);
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
  color: #059669;
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
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  transform: translateX(4px);
}

.nav-item .el-icon {
  font-size: 16px;
}

.nav-item:last-child {
  margin-bottom: 0;
}

/* 高亮动画 */
@keyframes highlight {
  0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7); }
  50% { box-shadow: 0 0 0 20px rgba(5, 150, 105, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .linux-commands {
    padding: 16px;
  }
  
  .card-header {
    padding: 20px 16px;
  }
  
  .card-body {
    padding: 20px 16px;
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
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-to-top:hover {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
  transform: translateY(-2px);
}

.back-to-top .el-icon {
  font-size: 20px;
}

.hero-section {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}
</style>
