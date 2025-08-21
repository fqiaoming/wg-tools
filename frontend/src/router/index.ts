import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页 - WG-Tools'
      }
    },
    {
      path: '/text',
      name: 'text',
      redirect: '/text/json'
    },
    {
      path: '/text/json',
      name: 'json-tool',
      component: () => import('../views/text/JsonToolView.vue'),
      meta: {
        title: 'JSON工具 - WG-Tools'
      }
    },
    {
      path: '/text/xml',
      name: 'xml-tool',
      component: () => import('../views/text/XmlToolView.vue'),
      meta: {
        title: 'XML工具 - WG-Tools'
      }
    },
    {
      path: '/text/compare',
      name: 'text-compare',
      component: () => import('../views/text/TextCompareView.vue'),
      meta: {
        title: '文本对比 - WG-Tools'
      }
    },
    {
      path: '/text/encrypt',
      name: 'text-encrypt',
      component: () => import('../views/text/TextEncryptView.vue'),
      meta: {
        title: '文本加密 - WG-Tools'
      }
    },
    {
      path: '/text/regex',
      name: 'regex-tool',
      component: () => import('../views/text/RegexToolView.vue'),
      meta: {
        title: '正则表达式 - WG-Tools'
      }
    },
    {
      path: '/encoding',
      name: 'encoding',
      redirect: '/encoding/base64'
    },
    {
      path: '/encoding/base64',
      name: 'base64-tool',
      component: () => import('../views/encoding/Base64ToolView.vue'),
      meta: {
        title: 'Base64编码 - WG-Tools'
      }
    },
    {
      path: '/encoding/url',
      name: 'url-tool',
      component: () => import('../views/encoding/UrlToolView.vue'),
      meta: {
        title: 'URL编码 - WG-Tools'
      }
    },
    {
      path: '/encoding/unicode',
      name: 'unicode-tool',
      component: () => import('../views/encoding/UnicodeToolView.vue'),
      meta: {
        title: 'Unicode编码 - WG-Tools'
      }
    },
    {
      path: '/encoding/html',
      name: 'html-tool',
      component: () => import('../views/encoding/HtmlToolView.vue'),
      meta: {
        title: 'HTML实体编码 - WG-Tools'
      }
    },
    {
      path: '/encoding/base',
      name: 'base-tool',
      component: () => import('../views/encoding/BaseToolView.vue'),
      meta: {
        title: '进制转换 - WG-Tools'
      }
    },
    {
      path: '/dev',
      name: 'dev',
      redirect: '/dev/color'
    },
    {
      path: '/dev/color',
      name: 'color-tool',
      component: () => import('../views/dev/ColorToolView.vue'),
      meta: {
        title: '颜色工具 - WG-Tools'
      }
    },
    {
      path: '/dev/uuid',
      name: 'uuid-tool',
      component: () => import('../views/dev/UuidToolView.vue'),
      meta: {
        title: 'UUID生成器 - WG-Tools'
      }
    },

    {
      path: '/time',
      name: 'time',
      redirect: '/time/timestamp'
    },
    {
      path: '/time/timestamp',
      name: 'timestamp-tool',
      component: () => import('../views/time/TimestampToolView.vue'),
      meta: {
        title: '时间戳工具 - WG-Tools'
      }
    },
    {
      path: '/time/calculator',
      name: 'time-calculator',
      component: () => import('../views/time/TimeCalculatorView.vue'),
      meta: {
        title: '时间计算器 - WG-Tools'
      }
    },
    {
      path: '/time/worldclock',
      name: 'world-clock',
      component: () => import('../views/time/WorldClockView.vue'),
      meta: {
        title: '世界时钟 - WG-Tools'
      }
    },
    {
      path: '/security',
      name: 'security',
      redirect: '/security/password'
    },
    {
      path: '/security/password',
      name: 'password-generator',
      component: () => import('../views/security/PasswordGeneratorView.vue'),
      meta: {
        title: '密码生成器 - WG-Tools'
      }
    },
    {
      path: '/security/hash',
      name: 'hash-tool',
      component: () => import('../views/security/HashToolView.vue'),
      meta: {
        title: '哈希计算 - WG-Tools'
      }
    },
    {
      path: '/text/stats',
      name: 'text-stats',
      component: () => import('../views/text/TextStatsView.vue'),
      meta: {
        title: '文本统计 - WG-Tools'
      }
    },
    {
      path: '/converter',
      name: 'converter',
      redirect: '/converter/unit'
    },
    {
      path: '/converter/unit',
      name: 'unit-converter',
      component: () => import('../views/converter/UnitConverterView.vue'),
      meta: {
        title: '单位转换 - WG-Tools'
      }
    },
    {
      path: '/dev/qr-generator',
      name: 'qr-generator',
      component: () => import('../views/dev/QrGeneratorView.vue'),
      meta: {
        title: '二维码生成器 - WG-Tools'
      }
    },
    {
      path: '/converter/image-base64',
      name: 'image-base64',
      component: () => import('../views/converter/ImageBase64View.vue'),
      meta: {
        title: '图片Base64转换 - WG-Tools'
      }
    },
    
    {
      path: '/dev/random-data',
      name: 'random-data',
      component: () => import('../views/dev/RandomDataView.vue'),
      meta: {
        title: '随机数据生成器 - WG-Tools'
      }
    },
    {
      path: '/dev/code-formatter',
      name: 'code-formatter',
      component: () => import('../views/dev/CodeFormatterView.vue'),
      meta: {
        title: '代码格式化工具 - WG-Tools'
      }
    },
    {
      path: '/text/markdown-editor',
      name: 'markdown-editor',
      component: () => import('../views/text/MarkdownEditorView.vue'),
      meta: {
        title: 'Markdown编辑器 - WG-Tools'
      }
    },
    {
      path: '/dev/file-diff',
      name: 'file-diff',
      component: () => import('../views/dev/FileDiffView.vue'),
      meta: {
        title: '文件对比工具 - WG-Tools'
      }
    },
    {
      path: '/dev/color-picker',
      name: 'color-picker',
      component: () => import('../views/dev/ColorPickerView.vue'),
      meta: {
        title: '高级颜色选择器 - WG-Tools'
      }
    },
    {
      path: '/dev/icon-generator',
      name: 'icon-generator',
      component: () => import('../views/dev/IconGeneratorView.vue'),
      meta: {
        title: '图标生成器 - WG-Tools'
      }
    },
    
            {
          path: '/dev/cron',
          name: 'cron',
          component: () => import('../views/dev/CronToolView.vue'),
          meta: {
            title: 'Cron表达式工具 - WG-Tools'
          }
        },

        // 文档工具
        {
          path: '/docs',
          redirect: '/docs/git'
        },
        {
          path: '/docs/git',
          name: 'git-commands',
          component: () => import('../views/docs/GitCommandsView.vue'),
          meta: {
            title: 'Git常用命令 - WG-Tools'
          }
        },
        {
          path: '/docs/linux',
          name: 'linux-commands',
          component: () => import('../views/docs/LinuxCommandsView.vue'),
          meta: {
            title: 'Linux常用命令 - WG-Tools'
          }
        },
        {
          path: '/docs/docker',
          name: 'docker-commands',
          component: () => import('../views/docs/DockerCommandsView.vue'),
          meta: {
            title: 'Docker常用命令 - WG-Tools'
          }
        },
        {
          path: '/docs/mysql',
          name: 'mysql-syntax',
          component: () => import('../views/docs/MySQLSyntaxView.vue'),
          meta: {
            title: 'MySQL常用语法 - WG-Tools'
          }
        },
        {
          path: '/docs/java',
          name: 'java-syntax',
          component: () => import('../views/docs/JavaSyntaxView.vue'),
          meta: {
            title: 'Java常用语法 - WG-Tools'
          }
        },
    // 娱乐工具
    {
      path: '/entertainment',
      name: 'entertainment',
      redirect: '/entertainment/piano'
    },
    {
      path: '/entertainment/piano',
      name: 'piano-tool',
      component: () => import('../views/entertainment/SimplePianoView.vue'),
      meta: {
        title: '虚拟钢琴 - WG-Tools'
      }
    },
    {
      path: '/entertainment/snake',
      name: 'snake-game',
      component: () => import('../views/entertainment/SnakeGameView.vue'),
      meta: {
        title: '贪吃蛇游戏 - WG-Tools'
      }
    },
    {
      path: '/entertainment/quotes',
      name: 'quote-generator',
      component: () => import('../views/entertainment/QuoteGeneratorView.vue'),
      meta: {
        title: '励志语录生成器 - WG-Tools'
      }
    },
    
    // 生活工具
    {
      path: '/life',
      name: 'life',
      redirect: '/life/bmi-calculator'
    },
    {
      path: '/life/bmi-calculator',
      name: 'bmi-calculator',
      component: () => import('../views/life/BmiCalculatorView.vue'),
      meta: {
        title: 'BMI计算器 - WG-Tools'
      }
    },
    {
      path: '/life/mortgage-calculator',
      name: 'mortgage-calculator',
      component: () => import('../views/life/MortgageCalculatorView.vue'),
      meta: {
        title: '房贷计算器 - WG-Tools'
      }
    },
    {
      path: '/life/age-calculator',
      name: 'age-calculator',
      component: () => import('../views/life/AgeCalculatorView.vue'),
      meta: {
        title: '年龄计算器 - WG-Tools'
      }
    },

    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: '关于我们 - WG-Tools'
      }
    }
  ]
})

// 路由守卫，设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'WG-Tools - 在线开发者工具箱'
  next()
})

export default router
