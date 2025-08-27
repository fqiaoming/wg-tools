<template>
  <div class="docker-commands">
    <!-- 页面标题区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <el-icon><Box /></el-icon>
        </div>
        <h1 class="hero-title">{{ t('menu.dockerCommands') }}</h1>
        <p class="hero-description">{{ t('pages.dockerCommands.description') }}</p>
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
          <h5><el-icon><Lightning /></el-icon>故障场景</h5>
          <div class="nav-item" @click="scrollToElement('memory-issue')">
            <el-icon><Warning /></el-icon>
            <span>内存不足</span>
          </div>
          <div class="nav-item" @click="scrollToElement('performance-monitoring')">
            <el-icon><Monitor /></el-icon>
            <span>资源监控</span>
          </div>
          <div class="nav-item" @click="scrollToElement('container-troubleshooting')">
            <el-icon><Document /></el-icon>
            <span>容器诊断</span>
          </div>
        </div>
        
        <div class="nav-section">
          <h5><el-icon><List /></el-icon>基础命令</h5>
          <div class="nav-item" @click="scrollToElement('docker-basics')">
            <el-icon><Star /></el-icon>
            <span>基础操作</span>
          </div>
          <div class="nav-item" @click="scrollToElement('quick-reference')">
            <el-icon><Files /></el-icon>
            <span>快速参考</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tool-card">
<!--      <div class="card-header">-->
<!--        <el-icon class="icon"><Box /></el-icon>-->
<!--        <div>-->
<!--          <h2 class="title">Docker 常用命令</h2>-->
<!--          <p class="description">Docker 容器和镜像管理常用命令参考手册</p>-->
<!--        </div>-->
<!--      </div>-->

      <div class="card-body">
        <!-- 移动端快速导航 -->
        <div class="mobile-nav">
          <h5>🚀 快速跳转</h5>
          <div class="mobile-nav-items">
            <div class="mobile-nav-item" @click="scrollToElement('docker-oom')">内存不足</div>
            <div class="mobile-nav-item" @click="scrollToElement('docker-monitoring')">资源监控</div>
            <div class="mobile-nav-item" @click="scrollToElement('container-diagnosis')">容器诊断</div>
            <div class="mobile-nav-item" @click="scrollToElement('docker-basics')">基础操作</div>
            <div class="mobile-nav-item" @click="scrollToElement('quick-reference')">快速参考</div>
          </div>
        </div>
        
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

        <!-- 命令列表 -->
        <div id="docker-basics" class="commands-list">
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

        <!-- Docker故障排查场景 -->
        <div class="scenarios-section">
          <h4><el-icon><TrendCharts /></el-icon>Docker故障排查场景</h4>
          
          <div class="scenario-group" id="memory-issue">
            <h5 class="scenario-title">🚫 Docker内存不足，服务挂了处理流程</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>docker stats --no-stream</code>
                  <span>查看所有容器的资源使用情况</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>docker ps -a | grep Exited</code>
                  <span>查看已退出的容器</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <code>docker logs --tail 50 container_name</code>
                  <span>查看容器最后50行日志</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <code>docker system prune -a</code>
                  <span>清理未使用的镜像、容器、网络等</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <code>docker run --memory=512m --restart=always app:latest</code>
                  <span>重启容器并设置内存限制</span>
                </div>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="performance-monitoring">
            <h5 class="scenario-title">📊 Docker资源监控与性能分析</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>实时监控容器资源</h6>
                <code>docker stats</code>
                <span>实时显示容器CPU、内存、网络IO使用情况</span>
              </div>
              <div class="scenario-item">
                <h6>查看容器进程</h6>
                <code>docker top container_name</code>
                <span>查看容器内运行的进程</span>
              </div>
              <div class="scenario-item">
                <h6>检查容器配置</h6>
                <code>docker inspect container_name</code>
                <span>查看容器详细配置信息</span>
              </div>
              <div class="scenario-item">
                <h6>查看系统资源使用</h6>
                <code>docker system df</code>
                <span>显示Docker磁盘使用情况</span>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="container-troubleshooting">
            <h5 class="scenario-title">🔧 容器故障诊断</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>进入运行中的容器</h6>
                <code>docker exec -it container_name /bin/bash</code>
                <span>进入容器进行调试</span>
              </div>
              <div class="scenario-item">
                <h6>查看容器端口映射</h6>
                <code>docker port container_name</code>
                <span>检查端口映射是否正确</span>
              </div>
              <div class="scenario-item">
                <h6>查看容器启动命令</h6>
                <code>docker inspect container_name | grep Cmd</code>
                <span>查看容器启动命令</span>
              </div>
              <div class="scenario-item">
                <h6>检查容器网络</h6>
                <code>docker network ls && docker network inspect bridge</code>
                <span>查看Docker网络配置</span>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="docker-cleanup">
            <h5 class="scenario-title">🧹 Docker清理与维护</h5>
            <div class="scenario-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <code>docker images --filter "dangling=true" -q</code>
                  <span>查找悬空镜像</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <code>docker rmi $(docker images --filter "dangling=true" -q)</code>
                  <span>删除悬空镜像</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <code>docker volume ls -f dangling=true</code>
                  <span>查找未使用的数据卷</span>
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <code>docker system prune -a --volumes</code>
                  <span>⚠️ 全面清理（包括数据卷）</span>
                </div>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="restart-strategies">
            <h5 class="scenario-title">🔄 容器重启策略</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>自动重启</h6>
                <code>docker run --restart=always nginx</code>
                <span>容器退出时总是重启</span>
              </div>
              <div class="scenario-item">
                <h6>失败时重启</h6>
                <code>docker run --restart=on-failure:3 nginx</code>
                <span>失败时最多重启3次</span>
              </div>
              <div class="scenario-item">
                <h6>修改重启策略</h6>
                <code>docker update --restart=unless-stopped container_name</code>
                <span>修改已存在容器的重启策略</span>
              </div>
              <div class="scenario-item">
                <h6>查看重启次数</h6>
                <code>docker inspect container_name | grep RestartCount</code>
                <span>查看容器重启次数</span>
              </div>
            </div>
          </div>

          <div class="scenario-group" id="common-issues">
            <h5 class="scenario-title">🐛 常见问题解决</h5>
            <div class="scenario-grid">
              <div class="scenario-item">
                <h6>端口被占用</h6>
                <code>netstat -tulpn | grep :8080</code>
                <span>检查端口占用情况</span>
              </div>
              <div class="scenario-item">
                <h6>镜像拉取失败</h6>
                <code>docker pull --platform linux/amd64 image_name</code>
                <span>指定平台拉取镜像</span>
              </div>
              <div class="scenario-item">
                <h6>容器无法删除</h6>
                <code>docker rm -f container_name</code>
                <span>强制删除容器</span>
              </div>
              <div class="scenario-item">
                <h6>查看Docker版本</h6>
                <code>docker version && docker-compose version</code>
                <span>检查Docker和Compose版本</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速参考 -->
        <div id="quick-reference" class="quick-reference">
          <h4><el-icon><Star /></el-icon>快速参考</h4>
          <div class="reference-grid">
            <div class="reference-item">
              <h5>拉取镜像</h5>
              <code>docker pull nginx</code>
            </div>
            <div class="reference-item">
              <h5>运行容器</h5>
              <code>docker run -d nginx</code>
            </div>
            <div class="reference-item">
              <h5>查看容器</h5>
              <code>docker ps</code>
            </div>
            <div class="reference-item">
              <h5>停止容器</h5>
              <code>docker stop container_id</code>
            </div>
            <div class="reference-item">
              <h5>查看镜像</h5>
              <code>docker images</code>
            </div>
            <div class="reference-item">
              <h5>删除容器</h5>
              <code>docker rm container_id</code>
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
import { useI18n } from 'vue-i18n'
import {
  Box,
  Search,
  CopyDocument,
  Star,
  TrendCharts,
  Lightning,
  Warning,
  Monitor,
  Document,
  List,
  ArrowLeft,
  ArrowRight,
  CaretTop,
  Files
} from '@element-plus/icons-vue'

const { t } = useI18n()
const searchQuery = ref('')
const activeCategory = ref('all')
const navCollapsed = ref(false)

const categories = [
  { key: 'all', name: '全部' },
  { key: 'image', name: '镜像管理' },
  { key: 'container', name: '容器管理' },
  { key: 'network', name: '网络管理' },
  { key: 'volume', name: '数据卷' },
  { key: 'compose', name: 'Docker Compose' },
  { key: 'system', name: '系统管理' }
]

const commands = [
  {
    command: 'docker pull',
    category: 'image',
    description: '从Docker Hub或其他镜像仓库拉取镜像',
    examples: [
      { command: 'docker pull nginx', description: '拉取nginx最新镜像' },
      { command: 'docker pull nginx:1.20', description: '拉取指定版本的nginx镜像' },
      { command: 'docker pull ubuntu:20.04', description: '拉取Ubuntu 20.04镜像' }
    ]
  },
  {
    command: 'docker images',
    category: 'image',
    description: '列出本地所有镜像',
    examples: [
      { command: 'docker images', description: '查看所有本地镜像' },
      { command: 'docker images nginx', description: '查看nginx相关镜像' },
      { command: 'docker images -q', description: '只显示镜像ID' }
    ],
    options: [
      { flag: '-a', description: '显示所有镜像（包括中间层）' },
      { flag: '-q', description: '只显示镜像ID' },
      { flag: '--no-trunc', description: '显示完整的镜像ID' }
    ]
  },
  {
    command: 'docker build',
    category: 'image',
    description: '从Dockerfile构建镜像',
    examples: [
      { command: 'docker build -t myapp .', description: '构建当前目录的镜像' },
      { command: 'docker build -t myapp:v1.0 .', description: '构建并指定标签' },
      { command: 'docker build --no-cache -t myapp .', description: '不使用缓存构建' }
    ],
    options: [
      { flag: '-t', description: '指定镜像名称和标签' },
      { flag: '--no-cache', description: '不使用缓存' },
      { flag: '-f', description: '指定Dockerfile路径' }
    ]
  },
  {
    command: 'docker run',
    category: 'container',
    description: '创建并运行新容器',
    examples: [
      { command: 'docker run nginx', description: '运行nginx容器' },
      { command: 'docker run -d -p 80:80 nginx', description: '后台运行并映射端口' },
      { command: 'docker run -it ubuntu bash', description: '交互式运行Ubuntu' },
      { command: 'docker run -v /host:/container nginx', description: '挂载数据卷' }
    ],
    options: [
      { flag: '-d', description: '后台运行' },
      { flag: '-p', description: '端口映射' },
      { flag: '-v', description: '挂载数据卷' },
      { flag: '-it', description: '交互式终端' },
      { flag: '--name', description: '指定容器名称' },
      { flag: '--rm', description: '容器停止后自动删除' }
    ]
  },
  {
    command: 'docker ps',
    category: 'container',
    description: '列出容器',
    examples: [
      { command: 'docker ps', description: '查看运行中的容器' },
      { command: 'docker ps -a', description: '查看所有容器（包括停止的）' },
      { command: 'docker ps -q', description: '只显示容器ID' }
    ],
    options: [
      { flag: '-a', description: '显示所有容器' },
      { flag: '-q', description: '只显示容器ID' },
      { flag: '-l', description: '显示最近创建的容器' }
    ]
  },
  {
    command: 'docker stop',
    category: 'container',
    description: '停止运行中的容器',
    examples: [
      { command: 'docker stop container_id', description: '停止指定容器' },
      { command: 'docker stop $(docker ps -q)', description: '停止所有运行中的容器' }
    ]
  },
  {
    command: 'docker start',
    category: 'container',
    description: '启动已停止的容器',
    examples: [
      { command: 'docker start container_id', description: '启动指定容器' },
      { command: 'docker start container_name', description: '通过名称启动容器' }
    ]
  },
  {
    command: 'docker restart',
    category: 'container',
    description: '重启容器',
    examples: [
      { command: 'docker restart container_id', description: '重启指定容器' }
    ]
  },
  {
    command: 'docker rm',
    category: 'container',
    description: '删除容器',
    examples: [
      { command: 'docker rm container_id', description: '删除指定容器' },
      { command: 'docker rm $(docker ps -aq)', description: '删除所有容器' },
      { command: 'docker rm -f container_id', description: '强制删除容器' }
    ],
    options: [
      { flag: '-f', description: '强制删除运行中的容器' },
      { flag: '-v', description: '同时删除相关数据卷' }
    ]
  },
  {
    command: 'docker exec',
    category: 'container',
    description: '在运行中的容器内执行命令',
    examples: [
      { command: 'docker exec -it container_id bash', description: '进入容器终端' },
      { command: 'docker exec container_id ls /app', description: '在容器内执行命令' }
    ]
  },
  {
    command: 'docker logs',
    category: 'container',
    description: '查看容器日志',
    examples: [
      { command: 'docker logs container_id', description: '查看容器日志' },
      { command: 'docker logs -f container_id', description: '实时跟踪日志' },
      { command: 'docker logs --tail 100 container_id', description: '查看最后100行日志' }
    ],
    options: [
      { flag: '-f', description: '实时跟踪日志' },
      { flag: '--tail', description: '显示指定行数的日志' },
      { flag: '-t', description: '显示时间戳' }
    ]
  },
  {
    command: 'docker rmi',
    category: 'image',
    description: '删除镜像',
    examples: [
      { command: 'docker rmi image_id', description: '删除指定镜像' },
      { command: 'docker rmi $(docker images -q)', description: '删除所有镜像' },
      { command: 'docker rmi -f image_id', description: '强制删除镜像' }
    ]
  },
  {
    command: 'docker network',
    category: 'network',
    description: '网络管理命令',
    examples: [
      { command: 'docker network ls', description: '列出所有网络' },
      { command: 'docker network create mynet', description: '创建自定义网络' },
      { command: 'docker network inspect bridge', description: '查看网络详情' }
    ]
  },
  {
    command: 'docker volume',
    category: 'volume',
    description: '数据卷管理命令',
    examples: [
      { command: 'docker volume ls', description: '列出所有数据卷' },
      { command: 'docker volume create myvolume', description: '创建数据卷' },
      { command: 'docker volume rm myvolume', description: '删除数据卷' }
    ]
  },
  {
    command: 'docker-compose up',
    category: 'compose',
    description: '启动docker-compose服务',
    examples: [
      { command: 'docker-compose up', description: '启动服务' },
      { command: 'docker-compose up -d', description: '后台启动服务' },
      { command: 'docker-compose up --build', description: '重新构建并启动' }
    ]
  },
  {
    command: 'docker-compose down',
    category: 'compose',
    description: '停止并删除docker-compose服务',
    examples: [
      { command: 'docker-compose down', description: '停止服务' },
      { command: 'docker-compose down -v', description: '停止服务并删除数据卷' }
    ]
  },
  {
    command: 'docker system',
    category: 'system',
    description: '系统管理命令',
    examples: [
      { command: 'docker system df', description: '查看Docker磁盘使用情况' },
      { command: 'docker system prune', description: '清理未使用的资源' },
      { command: 'docker system prune -a', description: '清理所有未使用的资源' }
    ]
  },
  {
    command: 'docker info',
    category: 'system',
    description: '显示Docker系统信息',
    examples: [
      { command: 'docker info', description: '查看Docker系统详细信息' }
    ]
  },
  {
    command: 'docker version',
    category: 'system',
    description: '显示Docker版本信息',
    examples: [
      { command: 'docker version', description: '查看Docker版本' }
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
    image: 'primary',
    container: 'success',
    network: 'warning',
    volume: 'info',
    compose: 'danger',
    system: 'primary'
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

.docker-commands {
  --tool-color: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
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
  border: 1px solid rgba(37, 99, 235, 0.2);
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
  border-bottom: 1px solid rgba(37, 99, 235, 0.1);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
  color: #2563eb;
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
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.mobile-nav h5 {
  margin: 0 0 16px 0;
  color: #2563eb;
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
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.mobile-nav-item:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
}

/* 高亮动画 */
@keyframes highlight {
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
  50% { box-shadow: 0 0 0 20px rgba(37, 99, 235, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
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
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
  color: #60a5fa;
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
  border-left: 3px solid #2563eb;
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
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
}

.quick-reference {
  background: #eff6ff;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #2563eb;
}

.quick-reference h4 {
  margin: 0 0 16px 0;
  color: #1e40af;
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
  border: 1px solid #bfdbfe;
}

.reference-item h5 {
  margin: 0 0 6px 0;
  color: #1e40af;
  font-size: 12px;
}

.reference-item code {
  background: #1e40af;
  color: #bfdbfe;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .docker-commands {
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
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-to-top:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

.back-to-top .el-icon {
  font-size: 20px;
}

.hero-section {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}
</style>
