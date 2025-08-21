# WG-Tools Frontend

## 📖 项目简介

WG-Tools 前端应用，基于 Vue 3 + TypeScript + Element Plus 开发的现代化在线工具网站。

## 🛠️ 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - JavaScript的超集
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 组件库
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue 状态管理
- **Axios** - HTTP 客户端

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 7+ 或 yarn

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── api/                    # API 接口
├── assets/                 # 静态资源
├── components/             # 公共组件
├── router/                 # 路由配置
├── stores/                 # 状态管理
├── utils/                  # 工具函数
├── views/                  # 页面组件
│   ├── text/              # 文本处理工具页面
│   ├── encoding/          # 编码转换工具页面
│   ├── HomeView.vue       # 首页
│   └── AboutView.vue      # 关于页面
├── App.vue                # 根组件
└── main.ts                # 入口文件
```

## 🎨 功能特性

### 主要功能

1. **文本处理工具**
   - JSON 格式化/压缩
   - XML 格式化
   - 文本对比
   - 文本加密 (MD5、SHA1、SHA256)

2. **编码转换工具**
   - Base64 编码/解码
   - URL 编码/解码
   - Unicode 编码/解码
   - HTML 实体编码/解码

3. **用户体验**
   - 响应式设计
   - 实时处理
   - 复制到剪贴板
   - 处理时间统计
   - 错误提示

### 设计特色

- 🎯 简洁直观的用户界面
- 📱 完全响应式设计
- ⚡ 快速的数据处理
- 🔒 本地处理，保护隐私
- 🛠️ 丰富的开发者工具

## 🔧 开发指南

### 添加新工具

1. 在 `src/views/` 下创建对应的 Vue 组件
2. 在 `src/api/tool.ts` 中添加 API 接口
3. 在 `src/router/index.ts` 中添加路由
4. 在首页工具列表中添加入口

### 组件开发规范

- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API
- 使用 Element Plus 组件库
- 保持组件的单一职责

### 样式规范

- 使用 scoped 样式
- 遵循 BEM 命名规范
- 响应式设计优先
- 保持设计一致性

## 📱 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 🔗 相关链接

- [Vue 3 文档](https://vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## 📝 更新日志

### v1.0.0
- 🎉 项目初始化
- ✨ 实现核心工具功能
- 🎨 完成 UI 界面设计
- 📱 适配移动端

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 发起 Pull Request

## 📞 技术支持

如有问题，请提交 Issue 或联系开发团队。
